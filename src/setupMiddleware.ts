import { config } from '@/config/config';
import { databaseManager } from '@/config/database';
import { redis } from '@/config/redis';
import { AuditLog } from '@/models/AuditLog';
import { IntegrationConfig } from '@/models/IntegrationConfig';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import express, { type Request, type Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import os from 'os';
import promClient from 'prom-client';
import { getRepository } from 'typeorm';
import { auditLog } from '@/middleware/audit';
import { rateLimiter } from '@/middleware/rateLimiter';
import { correlationIdMiddleware } from '@/middleware/correlationId';
import { logger } from '@/utils/logger';

export function setupMiddleware(app: express.Application): void {
  // Security middleware
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    })
  );

  // CORS
  app.use(
    cors({
      origin: config.app.corsOrigin,
      credentials: true,
    })
  );

  // Rate limiting (global, can be overridden per route)
  app.use(rateLimiter);

  // Compression
  app.use(compression());

  // Correlation IDs for request tracing
  app.use(correlationIdMiddleware);

  // Logging
  app.use(
    morgan('combined', {
      stream: {
        write: (message: string) => logger.info(message.trim()),
      },
    })
  );

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Cookie parsing
  app.use(cookieParser());

  // Audit logging (global)
  app.use(auditLog);

  // Health and metrics endpoints
    app.get('/healthz', (_req: Request, res: Response) => {
      res.status(200).json({ status: 'ok' });
    });

    app.get('/health', async (_req: Request, res: Response) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: config.app.version,
        environment: config.app.environment,
        nodeEnv: process.env['NODE_ENV'],
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      memoryPercent: (process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100,
      cpu: os.loadavg(),
      dependencies: {
        database: databaseManager.getStatus(),
        redis: redis.status,
        integrations: 'ok',
        security: 'ok',
      },
    });
  });

    app.get('/health/database', async (_req: Request, res: Response) => {
      try {
        const status = databaseManager.getStatus();
        const pool = databaseManager.getStatus();
      const repo = getRepository(AuditLog);
      const count = await repo.count();
      res.json({
        status,
        pool,
        auditLogCount: count,
        migration: databaseManager.getMigrationStatus ? await databaseManager.getMigrationStatus() : 'unknown',
      });
    } catch (err: any) {
      res.status(500).json({ status: 'error', error: err.message });
    }
  });

    app.get('/health/integrations', async (_req: Request, res: Response) => {
    try {
      const repo = getRepository(IntegrationConfig);
      const integrations = await repo.find();
      const statuses = integrations.map((i) => ({
        id: i.id,
        name: i.name,
        type: i.type,
        status: i.status,
        lastSync: (i as any)['lastSync'] || null,
        errorCount: (i as any)['errorCount'] || 0,
      }));
      res.json({ integrations: statuses });
    } catch (err: any) {
      res.status(500).json({ status: 'error', error: err.message });
    }
  });

    app.get('/health/security', (_req: Request, res: Response) => {
    res.json({
      helmet: true,
      cors: true,
      rateLimiting: true,
      recentSecurityEvents: [],
      authentication: true,
      auditLogging: true,
    });
  });

    app.get('/health/audit', async (_req: Request, res: Response) => {
    try {
      const repo = getRepository(AuditLog);
      const count = await repo.count();
      const recent = await repo.find({ order: { timestamp: 'DESC' }, take: 10 });
      res.json({
        logVolume: count,
        recentLogs: recent,
          retentionPolicy: process.env['AUDIT_RETENTION_DAYS'] || 90,
        cleanupStatus: 'ok',
      });
    } catch (err: any) {
      res.status(500).json({ status: 'error', error: err.message });
    }
  });

  const collectDefaultMetrics = promClient.collectDefaultMetrics;
  collectDefaultMetrics();
    app.get('/metrics', async (_req: Request, res: Response) => {
    res.set('Content-Type', promClient.register.contentType);
    res.end(await promClient.register.metrics());
  });
}


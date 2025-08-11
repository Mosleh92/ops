/**
 * MallOS Enterprise - Main Application Entry Point
 * IoT & AI Integration Hub for Mall Management System
 */

import { config } from '@/config/config';
import { databaseManager } from '@/config/database';
import { redis } from '@/config/redis';
import { aiAnalyticsService } from '@/services/AIAnalyticsService';
import { iotService } from '@/services/IoTService';
import { logger } from '@/utils/logger';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { loadPlugins } from '@/plugins';
import { setupMiddleware } from './setupMiddleware';
import { registerRoutes } from './registerRoutes';
import { configureWebSocket } from './configureWebSocket';
import { setupGracefulShutdown } from './gracefulShutdown';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: config.app.corsOrigin,
    methods: ['GET', 'POST'],
  },
});

function setupErrorHandling(app: express.Application): void {
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err.name === 'UnauthorizedError') {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    if (err.status === 403) {
      return res.status(403).json({ success: false, error: err.message || 'Forbidden' });
    }
    logger.error('❌ Global Error:', err);
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  });
}

async function start(): Promise<void> {
  try {
    logger.info('🚀 Initializing MallOS Enterprise Application...');

    await databaseManager.initialize();
    logger.info('✅ Database initialized');

    await redis.connect();
    logger.info('✅ Redis connected');

    await iotService.initialize();
    logger.info('✅ IoT Service initialized');

    await aiAnalyticsService.initialize();
    logger.info('✅ AI Analytics Service initialized');

    setupMiddleware(app);
    registerRoutes(app);
    await loadPlugins(app, io);
    configureWebSocket(io);
    setupErrorHandling(app);
    setupGracefulShutdown(server, io);

    const port = config.app.port;
    server.listen(port, '0.0.0.0', () => {
      logger.info(`🚀 MallOS Enterprise Server running on port ${port}`);
      logger.info(`📊 Environment: ${config.app.environment}`);
      logger.info(`🔗 API Documentation: http://localhost:${port}/api`);
      logger.info(`🏥 Health Check: http://localhost:${port}/healthz`);
    });
  } catch (error) {
    logger.error('❌ Failed to start application:', error);
    process.exit(1);
  }
}

process.on('uncaughtException', (error) => {
  logger.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

start().catch((error) => {
  logger.error('❌ Failed to start MallOS Enterprise:', error);
  process.exit(1);
});

export default app;


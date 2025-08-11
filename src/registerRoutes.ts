import express from 'express';
import { authMiddleware } from '@/middleware/auth';
import aiRoutes from '@/routes/ai';
import auditLogRouter from '@/routes/audit-logs';
import authRoutes from '@/routes/auth';
import cleaningRoutes from '@/routes/cleaning';
import dashboardRoutes from '@/routes/dashboard';
import integrationsRouter from '@/routes/integrations';
import iotRoutes from '@/routes/iot';
import mallsRoutes from '@/routes/malls';
import tasksRoutes from '@/routes/tasks';
import tenantsRoutes from '@/routes/tenants';
import usersRoutes from '@/routes/users';
import workPermitsRoutes from '@/routes/work-permits';
import { config } from '@/config/config';

export function registerRoutes(app: express.Application): void {
  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/dashboard', authMiddleware, dashboardRoutes);
  app.use('/api/users', authMiddleware, usersRoutes);
  app.use('/api/malls', authMiddleware, mallsRoutes);
  app.use('/api/tenants', authMiddleware, tenantsRoutes);
  app.use('/api/work-permits', authMiddleware, workPermitsRoutes);
  app.use('/api/tasks', tasksRoutes);

  // IoT & AI routes
  app.use('/api/iot', iotRoutes);
  app.use('/api/ai', aiRoutes);

  app.use('/api/integrations', integrationsRouter);
  app.use('/api/audit-logs', auditLogRouter);
  app.use('/api/cleaning', cleaningRoutes);

  // API documentation
  app.get('/api', (req, res) => {
    res.json({
      name: 'MallOS Enterprise API',
      version: config.app.version,
      description: 'IoT & AI Integration Hub for Mall Management',
      endpoints: {
        auth: '/api/auth',
        dashboard: '/api/dashboard',
        users: '/api/users',
        malls: '/api/malls',
        tenants: '/api/tenants',
        workPermits: '/api/work-permits',
        tasks: '/api/tasks',
        iot: '/api/iot',
        ai: '/api/ai',
        integrations: '/api/integrations',
        auditLogs: '/api/audit-logs',
        cleaning: '/api/cleaning',
      },
    });
  });

  app.use('*', (req, res) => {
    res.status(404).json({
      error: 'Endpoint not found',
      path: req.originalUrl,
    });
  });
}


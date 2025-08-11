/**
 * MallOS Enterprise - Dashboard Routes
 * Basic dashboard data endpoints for overview and metrics
 */

import { database } from '@/config/database';
import { authenticate, authorize } from '@/middleware/auth';
import { Analytics } from '@/models/Analytics';
import { Financial } from '@/models/Financial';
import { Mall, MallStatus } from '@/models/Mall';
import { Security } from '@/models/Security';
import { Tenant, TenantStatus } from '@/models/Tenant';
import { User, UserRole, UserStatus } from '@/models/User';
import { WorkPermit, WorkPermitStatus } from '@/models/WorkPermit';
import { logger } from '@/utils/logger';
import express, { Request, Response } from 'express';
import os from 'os';

const router = express.Router();

// Get main dashboard overview
router.get('/overview', authenticate, async (req: Request, res: Response) => {
  try {
    const userRepo = database.getRepository(User);
    const tenantRepo = database.getRepository(Tenant);
    const mallRepo = database.getRepository(Mall);
    const workPermitRepo = database.getRepository(WorkPermit);
    const securityRepo = database.getRepository(Security);
    const financialRepo = database.getRepository(Financial);

    // Get basic counts
    const [totalUsers, totalTenants, totalMalls, totalWorkPermits] = await Promise.all([
      userRepo.count(),
      tenantRepo.count(),
      mallRepo.count(),
      workPermitRepo.count()
    ]);

    // Get active counts
    const [activeUsers, activeTenants, activeMalls, activeWorkPermits] = await Promise.all([
      userRepo.count({ where: { status: UserStatus.ACTIVE } }),
      tenantRepo.count({ where: { status: TenantStatus.ACTIVE } }),
      mallRepo.count({ where: { status: MallStatus.ACTIVE } }),
        workPermitRepo.count({ where: { status: WorkPermitStatus.IN_PROGRESS } })
    ]);

    // Get pending counts
    const [pendingUsers, pendingTenants, pendingWorkPermits] = await Promise.all([
      userRepo.count({ where: { status: UserStatus.PENDING_VERIFICATION } }),
      tenantRepo.count({ where: { status: TenantStatus.PENDING_APPROVAL } }),
        workPermitRepo.count({ where: { status: WorkPermitStatus.PENDING } })
    ]);

    // Get recent activities
    const recentWorkPermits = await workPermitRepo.find({
      order: { createdAt: 'DESC' },
      take: 5
    });

    const recentSecurityIncidents = await securityRepo.find({
      order: { incidentDate: 'DESC' },
      take: 5
    });

    return res.json({
      overview: {
        totalUsers,
        activeUsers,
        pendingUsers,
        totalTenants,
        activeTenants,
        pendingTenants,
        totalMalls,
        activeMalls,
        totalWorkPermits,
        activeWorkPermits,
        pendingWorkPermits
      },
      recentActivities: {
        workPermits: recentWorkPermits.map(permit => ({
          id: permit.id,
          permitNumber: permit.permitNumber,
          type: permit.type,
          status: permit.status,
          tenantId: permit.tenantId,
          startDate: permit.startDate,
          createdAt: permit.createdAt
        })),
        securityIncidents: recentSecurityIncidents.map(incident => ({
          id: incident.id,
          incidentNumber: incident.incidentNumber,
          type: incident.type,
          status: incident.status,
          severity: incident.severity,
          incidentDate: incident.incidentDate
        }))
      }
    });
  } catch (err) {
    logger.error('Error fetching dashboard overview:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard overview' });
  }
});

// Get system stats for Super Admin
router.get('/system-stats/:timeRange', authenticate, authorize([UserRole.SUPER_ADMIN]), async (req: Request, res: Response) => {
  try {
    const { timeRange } = req.params;
    const userRepo = database.getRepository(User);
    const tenantRepo = database.getRepository(Tenant);
    const mallRepo = database.getRepository(Mall);

    // Calculate time range
    const now = new Date();
    let startDate = new Date();

    switch (timeRange) {
      case '1h':
        startDate.setHours(now.getHours() - 1);
        break;
      case '24h':
        startDate.setDate(now.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      default:
        startDate.setDate(now.getDate() - 1);
    }

    // Get system statistics
    const [totalUsers, activeUsers, totalTenants, activeTenants, totalMalls, activeMalls] = await Promise.all([
      userRepo.count(),
      userRepo.count({ where: { status: UserStatus.ACTIVE } }),
      tenantRepo.count(),
      tenantRepo.count({ where: { status: TenantStatus.ACTIVE } }),
      mallRepo.count(),
      mallRepo.count({ where: { status: MallStatus.ACTIVE } })
    ]);

    // Calculate system uptime (mock data for now)
    const systemUptime = 99.9;
    const apiRequests = Math.floor(Math.random() * 1000) + 500;
    const databaseConnections = Math.floor(Math.random() * 50) + 10;
    const activeSessions = Math.floor(Math.random() * 100) + 20;

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        totalTenants,
        activeTenants,
        totalMalls,
        activeMalls,
        systemUptime,
        apiRequests,
        databaseConnections,
        activeSessions
      }
    });
  } catch (error) {
    logger.error('Error fetching system stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch system statistics'
    });
  }
});

// Get security metrics for Super Admin
router.get('/security-metrics/:timeRange', authenticate, authorize([UserRole.SUPER_ADMIN]), async (req: Request, res: Response) => {
  try {
    const { timeRange } = req.params;

    // Mock security metrics (in real implementation, fetch from security logs)
    const failedLogins = Math.floor(Math.random() * 50) + 5;
    const suspiciousActivities = Math.floor(Math.random() * 20) + 2;
    const blockedIPs = Math.floor(Math.random() * 10) + 1;
    const securityAlerts = Math.floor(Math.random() * 15) + 3;
    const lastSecurityScan = new Date().toISOString();
    const vulnerabilities = Math.floor(Math.random() * 5);

    res.json({
      success: true,
      data: {
        failedLogins,
        suspiciousActivities,
        blockedIPs,
        securityAlerts,
        lastSecurityScan,
        vulnerabilities
      }
    });
  } catch (error) {
    logger.error('Error fetching security metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch security metrics'
    });
  }
});

// Get performance metrics for Super Admin
router.get('/performance-metrics/:timeRange', authenticate, authorize([UserRole.SUPER_ADMIN]), async (req: Request, res: Response) => {
  try {
    // Get system performance metrics
    const cpuUsage = Math.floor(Math.random() * 30) + 20; // 20-50%
    const memoryUsage = Math.floor(Math.random() * 40) + 30; // 30-70%
    const diskUsage = Math.floor(Math.random() * 20) + 40; // 40-60%
    const networkTraffic = Math.floor(Math.random() * 100) + 50; // MB/s
    const responseTime = Math.floor(Math.random() * 50) + 10; // ms
    const errorRate = Math.random() * 2; // 0-2%

    res.json({
      success: true,
      data: {
        cpuUsage,
        memoryUsage,
        diskUsage,
        networkTraffic,
        responseTime,
        errorRate
      }
    });
  } catch (error) {
    logger.error('Error fetching performance metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch performance metrics'
    });
  }
});

// Get system health for Super Admin
router.get('/system-health', authenticate, authorize([UserRole.SUPER_ADMIN]), async (req: Request, res: Response) => {
  try {
    // Mock system health status (in real implementation, check actual service health)
    const systemHealth = {
      database: 'healthy' as const,
      redis: 'healthy' as const,
      elasticsearch: 'healthy' as const,
      iot: 'healthy' as const,
      ai: 'healthy' as const,
      computerVision: 'healthy' as const
    };

    res.json({
      success: true,
      data: systemHealth
    });
  } catch (error) {
    logger.error('Error fetching system health:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch system health'
    });
  }
});

// Get recent activities for Super Admin
router.get('/recent-activities/:timeRange', authenticate, authorize([UserRole.SUPER_ADMIN]), async (req: Request, res: Response) => {
  try {
    const { timeRange } = req.params;

    // Mock recent activities (in real implementation, fetch from audit logs)
    const activities = [
      {
        id: '1',
        type: 'login',
        description: 'تسجيل دخول ناجح للمدير العام',
        user: 'admin@mallos.com',
        timestamp: new Date().toISOString(),
        status: 'success'
      },
      {
        id: '2',
        type: 'system',
        description: 'تحديث إعدادات النظام',
        user: 'admin@mallos.com',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        status: 'success'
      },
      {
        id: '3',
        type: 'security',
        description: 'محاولة دخول فاشلة من IP مشبوه',
        user: 'unknown@192.168.1.100',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        status: 'warning'
      }
    ];

    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    logger.error('Error fetching recent activities:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recent activities'
    });
  }
});

// Get OPS stats for Operations Manager
router.get('/ops-stats/:mallId/:timeRange', authenticate, authorize([UserRole.MALL_ADMIN, UserRole.SUPER_ADMIN]), async (req: Request, res: Response) => {
  try {
    const { mallId, timeRange } = req.params;
    const tenantRepo = database.getRepository(Tenant);
    const workPermitRepo = database.getRepository(WorkPermit);

    // Calculate time range
    const now = new Date();
    let startDate = new Date();

    switch (timeRange) {
      case '1h':
        startDate.setHours(now.getHours() - 1);
        break;
      case '24h':
        startDate.setDate(now.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      default:
        startDate.setDate(now.getDate() - 1);
    }

    // Get OPS statistics
    const [totalTenants, activeTenants, pendingWorkPermits, activeWorkPermits] = await Promise.all([
      tenantRepo.count({ where: { mallId } }),
      tenantRepo.count({ where: { mallId, status: TenantStatus.ACTIVE } }),
      workPermitRepo.count({ where: { mallId, status: WorkPermitStatus.PENDING } }),
      workPermitRepo.count({ where: { mallId, status: WorkPermitStatus.IN_PROGRESS } })
    ]);

    // Mock additional OPS metrics
    const pendingInspections = Math.floor(Math.random() * 20) + 5;
    const completedInspections = Math.floor(Math.random() * 50) + 30;
    const activeIncidents = Math.floor(Math.random() * 10) + 2;
    const resolvedIncidents = Math.floor(Math.random() * 30) + 15;
    const totalTasks = Math.floor(Math.random() * 100) + 50;
    const completedTasks = Math.floor(Math.random() * 80) + 40;
    const overdueTasks = Math.floor(Math.random() * 15) + 3;
    const systemAlerts = Math.floor(Math.random() * 8) + 2;

    res.json({
      success: true,
      data: {
        totalTenants,
        activeTenants,
        pendingWorkPermits,
        activeWorkPermits,
        pendingInspections,
        completedInspections,
        activeIncidents,
        resolvedIncidents,
        totalTasks,
        completedTasks,
        overdueTasks,
        systemAlerts
      }
    });
  } catch (error) {
    logger.error('Error fetching OPS stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch OPS statistics'
    });
  }
});

// Get OPS tasks
router.get('/ops-tasks/:mallId/:showCompleted', authenticate, authorize([UserRole.MALL_ADMIN, UserRole.SUPER_ADMIN]), async (req: Request, res: Response) => {
  try {
    const { mallId, showCompleted } = req.params;

    // Mock tasks data (in real implementation, fetch from task management system)
    const tasks = [
      {
        id: '1',
        title: 'فحص أمني للمركز التجاري',
        description: 'فحص شامل للأمن والسلامة',
        type: 'inspection',
        priority: 'high',
        status: 'pending',
        assignedTo: 'حارس الأمن أحمد',
        assignedBy: 'مدير العمليات',
        dueDate: new Date(Date.now() + 86400000).toISOString(),
        createdAt: new Date().toISOString(),
        mallId
      },
      {
        id: '2',
        title: 'صيانة نظام التكييف',
        description: 'صيانة دورية لنظام التكييف المركزي',
        type: 'maintenance',
        priority: 'medium',
        status: 'in_progress',
        assignedTo: 'فريق الصيانة',
        assignedBy: 'مدير العمليات',
        dueDate: new Date(Date.now() + 172800000).toISOString(),
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        mallId
      },
      {
        id: '3',
        title: 'تنظيف المنطقة العامة',
        description: 'تنظيف شامل للمنطقة العامة',
        type: 'cleaning',
        priority: 'low',
        status: 'completed',
        assignedTo: 'فريق التنظيف',
        assignedBy: 'مدير العمليات',
        dueDate: new Date().toISOString(),
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        mallId
      }
    ];

    const filteredTasks = showCompleted === 'true' ? tasks : tasks.filter(task => task.status !== 'completed');

    res.json({
      success: true,
      data: filteredTasks
    });
  } catch (error) {
    logger.error('Error fetching OPS tasks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch OPS tasks'
    });
  }
});

// Get OPS incidents
router.get('/ops-incidents/:mallId', authenticate, authorize([UserRole.MALL_ADMIN, UserRole.SUPER_ADMIN]), async (req: Request, res: Response) => {
  try {
    const { mallId } = req.params;

    // Mock incidents data (in real implementation, fetch from incident management system)
    const incidents = [
      {
        id: '1',
        title: 'تسرب مياه في الطابق الأول',
        description: 'تسرب مياه من أنبوب في الطابق الأول',
        type: 'maintenance',
        severity: 'high',
        status: 'investigating',
        reportedBy: 'حارس الأمن محمد',
        assignedTo: 'فريق الصيانة',
        reportedAt: new Date(Date.now() - 1800000).toISOString(),
        mallId
      },
      {
        id: '2',
        title: 'شكوى من مستأجر',
        description: 'شكوى بخصوص الضوضاء من المحل المجاور',
        type: 'complaint',
        severity: 'medium',
        status: 'resolving',
        reportedBy: 'مستأجر محل الأزياء',
        assignedTo: 'مدير العمليات',
        reportedAt: new Date(Date.now() - 3600000).toISOString(),
        mallId
      },
      {
        id: '3',
        title: 'مشكلة في نظام الإنذار',
        description: 'إنذار كاذب في نظام الحريق',
        type: 'safety',
        severity: 'low',
        status: 'resolved',
        reportedBy: 'حارس الأمن أحمد',
        assignedTo: 'فريق الصيانة',
        reportedAt: new Date(Date.now() - 7200000).toISOString(),
        resolvedAt: new Date(Date.now() - 3600000).toISOString(),
        mallId
      }
    ];

    res.json({
      success: true,
      data: incidents
    });
  } catch (error) {
    logger.error('Error fetching OPS incidents:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch OPS incidents'
    });
  }
});

// Get OPS work permits
router.get('/ops-work-permits/:mallId', authenticate, authorize([UserRole.MALL_ADMIN, UserRole.SUPER_ADMIN]), async (req: Request, res: Response) => {
  try {
    const { mallId } = req.params;
    const workPermitRepo = database.getRepository(WorkPermit);

    // Get work permits for the mall
    const workPermits = await workPermitRepo.find({
      where: { mallId },
      order: { createdAt: 'DESC' },
      take: 50
    });

    // Transform data to include tenant names
    const permitsWithTenantNames = workPermits.map(permit => ({
      id: permit.id,
      permitNumber: permit.permitNumber,
      title: permit.title,
      type: permit.type,
      status: permit.status,
      tenantId: permit.tenantId,
      tenantName: `مستأجر ${permit.tenantId}`, // In real implementation, join with tenant table
      startDate: permit.startDate,
      endDate: permit.endDate,
      submittedAt: permit.createdAt,
      approvedAt: permit.status === WorkPermitStatus.APPROVED ? permit.updatedAt : null,
      approvedBy: permit.status === WorkPermitStatus.APPROVED ? 'مدير العمليات' : null
    }));

    res.json({
      success: true,
      data: permitsWithTenantNames
    });
  } catch (error) {
    logger.error('Error fetching OPS work permits:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch OPS work permits'
    });
  }
});

// Get OPS notifications
router.get('/ops-notifications/:mallId', authenticate, authorize([UserRole.MALL_ADMIN, UserRole.SUPER_ADMIN]), async (req: Request, res: Response) => {
  try {
    const { mallId } = req.params;

    // Mock notifications data (in real implementation, fetch from notification system)
    const notifications = [
      {
        id: '1',
        title: 'تذكير بموعد الفحص الأمني',
        message: 'يرجى إجراء الفحص الأمني الدوري غداً',
        type: 'info',
        priority: 'medium',
        recipients: ['جميع المستأجرين'],
        sentAt: new Date(Date.now() - 3600000).toISOString(),
        readBy: ['مستأجر 1', 'مستأجر 2'],
        status: 'delivered'
      },
      {
        id: '2',
        title: 'إشعار صيانة',
        message: 'سيتم إجراء صيانة دورية لنظام التكييف يوم الخميس',
        type: 'warning',
        priority: 'high',
        recipients: ['جميع المستأجرين'],
        sentAt: new Date(Date.now() - 7200000).toISOString(),
        readBy: ['مستأجر 1'],
        status: 'sent'
      },
      {
        id: '3',
        title: 'تحديث ساعات العمل',
        message: 'تم تحديث ساعات العمل للمركز التجاري',
        type: 'success',
        priority: 'low',
        recipients: ['جميع المستأجرين'],
        sentAt: new Date(Date.now() - 10800000).toISOString(),
        readBy: [],
        status: 'read'
      }
    ];

    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    logger.error('Error fetching OPS notifications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch OPS notifications'
    });
  }
});

// Get financial data
router.get('/financial', authenticate, async (req: Request, res: Response) => {
  try {
    const financialRepo = database.getRepository(Financial);

    // Get financial data
    const financialData = await financialRepo.find({
      order: { date: 'DESC' },
      take: 12
    });

    // Transform to monthly revenue format
    const monthlyRevenue = financialData.map(item => ({
      month: item.date.toLocaleDateString('ar-SA', { month: 'short' }),
      revenue: item.amount,
      expenses: item.expenses || 0,
      profit: item.amount - (item.expenses || 0)
    }));

    res.json({
      monthlyRevenue,
      totalRevenue: financialData.reduce((sum, item) => sum + item.amount, 0),
      totalExpenses: financialData.reduce((sum, item) => sum + (item.expenses || 0), 0),
      netProfit: financialData.reduce((sum, item) => sum + item.amount - (item.expenses || 0), 0)
    });
  } catch (err) {
    logger.error('Error fetching financial data:', err);
    res.status(500).json({ error: 'Failed to fetch financial data' });
  }
});

// Get user activity data
router.get('/user-activity', authenticate, async (req: Request, res: Response) => {
  try {
    const userRepo = database.getRepository(User);

    // Get user activity by role
    const roleStats = await userRepo
      .createQueryBuilder('user')
      .select('user.role', 'role')
      .addSelect('COUNT(*)', 'count')
      .groupBy('user.role')
      .getRawMany();

    // Get recent user logins
    const recentLogins = await userRepo.find({
      order: { lastLoginAt: 'DESC' },
      take: 10
    });

    res.json({
      roleStats: roleStats.map(stat => ({
        role: stat.role,
        count: parseInt(stat.count)
      })),
      recentLogins: recentLogins.map(user => ({
        id: user.id,
        email: user.email,
        role: user.role,
        lastLoginAt: user.lastLoginAt
      }))
    });
  } catch (err) {
    logger.error('Error fetching user activity:', err);
    res.status(500).json({ error: 'Failed to fetch user activity' });
  }
});

// Get analytics data
router.get('/analytics', authenticate, async (req: Request, res: Response) => {
  try {
    const analyticsRepo = database.getRepository(Analytics);

    // Get analytics data
    const analyticsData = await analyticsRepo.find({
      order: { date: 'DESC' },
      take: 30
    });

    res.json({
      footTraffic: analyticsData.map(item => ({
        date: item.date.toISOString().split('T')[0],
        count: item.footTraffic || 0
      })),
      occupancy: analyticsData.map(item => ({
        date: item.date.toISOString().split('T')[0],
        percentage: item.occupancyRate || 0
      })),
      revenue: analyticsData.map(item => ({
        date: item.date.toISOString().split('T')[0],
        amount: item.revenue || 0
      }))
    });
  } catch (err) {
    logger.error('Error fetching analytics data:', err);
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
});

// Get system health check
router.get('/health', authenticate, async (req: Request, res: Response) => {
  try {
    // Check database connection
    const dbConnection = await database.query('SELECT 1');

    // Get system info
    const systemInfo = {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: os.cpus(),
      platform: os.platform(),
      version: process.version,
      database: dbConnection ? 'connected' : 'disconnected'
    };

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      system: systemInfo
    });
  } catch (err) {
    logger.error('Health check failed:', err);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: err.message
    });
  }
});

export default router;

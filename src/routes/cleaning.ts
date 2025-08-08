/**
 * MallOS Enterprise - Cleaning Management Routes
 * Comprehensive cleaning and housekeeping API endpoints
 */

import { Request, Response, Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { rbacMiddleware } from '../middleware/rbac';
import { validateRequest } from '../middleware/validation';
import { CleaningService } from '../services/CleaningService';
import { logger } from '../utils/logger';

const router = Router();
const cleaningService = new CleaningService();

// Apply authentication middleware to all routes
router.use(authMiddleware);

/**
 * @route   GET /api/cleaning/tasks
 * @desc    Get all cleaning tasks with filters
 * @access  Private (OPS, Cleaning Manager, Security)
 */
router.get('/tasks',
  rbacMiddleware(['ops_manager', 'cleaning_manager', 'security_guard', 'supervisor']),
  async (req: Request, res: Response) => {
    try {
      const {
        mallId,
        status,
        type,
        assignedTo,
        startDate,
        endDate,
        page = 1,
        limit = 20
      } = req.query;

      const filters = {
        mallId: mallId as string,
        status: status as any,
        type: type as any,
        assignedTo: assignedTo as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined
      };

      const tasks = await cleaningService.getTasks(filters);

      // Pagination
      const startIndex = (Number(page) - 1) * Number(limit);
      const endIndex = startIndex + Number(limit);
      const paginatedTasks = tasks.slice(startIndex, endIndex);

      res.json({
        success: true,
        data: paginatedTasks,
        pagination: {
          current: Number(page),
          total: Math.ceil(tasks.length / Number(limit)),
          totalItems: tasks.length,
          hasNext: endIndex < tasks.length,
          hasPrev: Number(page) > 1
        }
      });
    } catch (error) {
      logger.error('Error fetching cleaning tasks:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch cleaning tasks',
        error: error.message
      });
    }
  }
);

/**
 * @route   POST /api/cleaning/tasks
 * @desc    Create a new cleaning task
 * @access  Private (OPS Manager, Cleaning Manager)
 */
router.post('/tasks',
  rbacMiddleware(['ops_manager', 'cleaning_manager']),
  validateRequest({
    body: {
      mallId: 'required|string',
      title: 'required|string|max:200',
      description: 'string',
      type: 'required|enum:daily,weekly,monthly,deep_cleaning,special_event,emergency,post_construction',
      priority: 'required|enum:low,medium,high,urgent',
      scheduledDate: 'required|date',
      location: 'required|object',
      assignedTo: 'string'
    }
  }),
  async (req: Request, res: Response) => {
    try {
      const taskData = {
        ...req.body,
        createdBy: req.user.id,
        createdDate: new Date()
      };

      const task = await cleaningService.createTask(taskData);

      res.status(201).json({
        success: true,
        message: 'Cleaning task created successfully',
        data: task
      });
    } catch (error) {
      logger.error('Error creating cleaning task:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create cleaning task',
        error: error.message
      });
    }
  }
);

/**
 * @route   GET /api/cleaning/tasks/:id
 * @desc    Get cleaning task by ID
 * @access  Private (OPS, Cleaning Manager, Security)
 */
router.get('/tasks/:id',
  rbacMiddleware(['ops_manager', 'cleaning_manager', 'security_guard', 'supervisor']),
  async (req: Request, res: Response) => {
    try {
      const task = await cleaningService.getTaskById(req.params.id);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Cleaning task not found'
        });
      }

      res.json({
        success: true,
        data: task
      });
    } catch (error) {
      logger.error('Error fetching cleaning task:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch cleaning task',
        error: error.message
      });
    }
  }
);

/**
 * @route   PUT /api/cleaning/tasks/:id
 * @desc    Update cleaning task
 * @access  Private (OPS Manager, Cleaning Manager)
 */
router.put('/tasks/:id',
  rbacMiddleware(['ops_manager', 'cleaning_manager']),
  async (req: Request, res: Response) => {
    try {
      const task = await cleaningService.updateTask(req.params.id, req.body);

      res.json({
        success: true,
        message: 'Cleaning task updated successfully',
        data: task
      });
    } catch (error) {
      logger.error('Error updating cleaning task:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update cleaning task',
        error: error.message
      });
    }
  }
);

/**
 * @route   POST /api/cleaning/tasks/:id/start
 * @desc    Start cleaning task
 * @access  Private (Cleaning Staff, Security Guard)
 */
router.post('/tasks/:id/start',
  rbacMiddleware(['cleaning_staff', 'security_guard']),
  async (req: Request, res: Response) => {
    try {
      const task = await cleaningService.startTask(req.params.id, req.user.id);

      res.json({
        success: true,
        message: 'Cleaning task started successfully',
        data: task
      });
    } catch (error) {
      logger.error('Error starting cleaning task:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to start cleaning task',
        error: error.message
      });
    }
  }
);

/**
 * @route   POST /api/cleaning/tasks/:id/complete
 * @desc    Complete cleaning task
 * @access  Private (Cleaning Staff, Security Guard)
 */
router.post('/tasks/:id/complete',
  rbacMiddleware(['cleaning_staff', 'security_guard']),
  validateRequest({
    body: {
      actualDuration: 'integer',
      checklist: 'object',
      qualityInspection: 'object',
      notes: 'string'
    }
  }),
  async (req: Request, res: Response) => {
    try {
      const task = await cleaningService.completeTask(req.params.id, req.body);

      res.json({
        success: true,
        message: 'Cleaning task completed successfully',
        data: task
      });
    } catch (error) {
      logger.error('Error completing cleaning task:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to complete cleaning task',
        error: error.message
      });
    }
  }
);

/**
 * @route   GET /api/cleaning/schedules
 * @desc    Get cleaning schedules
 * @access  Private (OPS Manager, Cleaning Manager)
 */
router.get('/schedules',
  rbacMiddleware(['ops_manager', 'cleaning_manager']),
  async (req: Request, res: Response) => {
    try {
      const { mallId, isActive, type } = req.query;

      const schedules = await cleaningService.getSchedules({
        mallId: mallId as string,
        isActive: isActive === 'true',
        type: type as any
      });

      res.json({
        success: true,
        data: schedules
      });
    } catch (error) {
      logger.error('Error fetching cleaning schedules:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch cleaning schedules',
        error: error.message
      });
    }
  }
);

/**
 * @route   POST /api/cleaning/schedules
 * @desc    Create cleaning schedule
 * @access  Private (OPS Manager, Cleaning Manager)
 */
router.post('/schedules',
  rbacMiddleware(['ops_manager', 'cleaning_manager']),
  validateRequest({
    body: {
      mallId: 'required|string',
      title: 'required|string|max:200',
      description: 'string',
      type: 'required|enum:daily,weekly,monthly,deep_cleaning,special_event,emergency,post_construction',
      schedule: 'required|object',
      locations: 'required|object'
    }
  }),
  async (req: Request, res: Response) => {
    try {
      const scheduleData = {
        ...req.body,
        metadata: {
          createdBy: req.user.id,
          approvedBy: req.user.id,
          approvedAt: new Date()
        }
      };

      const schedule = await cleaningService.createSchedule(scheduleData);

      res.status(201).json({
        success: true,
        message: 'Cleaning schedule created successfully',
        data: schedule
      });
    } catch (error) {
      logger.error('Error creating cleaning schedule:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create cleaning schedule',
        error: error.message
      });
    }
  }
);

/**
 * @route   POST /api/cleaning/schedules/:id/generate-tasks
 * @desc    Generate tasks from schedule
 * @access  Private (OPS Manager, Cleaning Manager)
 */
router.post('/schedules/:id/generate-tasks',
  rbacMiddleware(['ops_manager', 'cleaning_manager']),
  validateRequest({
    body: {
      startDate: 'required|date',
      endDate: 'required|date'
    }
  }),
  async (req: Request, res: Response) => {
    try {
      const { startDate, endDate } = req.body;

      const tasks = await cleaningService.generateTasksFromSchedule(
        req.params.id,
        new Date(startDate),
        new Date(endDate)
      );

      res.json({
        success: true,
        message: `${tasks.length} tasks generated successfully`,
        data: tasks
      });
    } catch (error) {
      logger.error('Error generating tasks from schedule:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate tasks from schedule',
        error: error.message
      });
    }
  }
);

/**
 * @route   GET /api/cleaning/equipment
 * @desc    Get cleaning equipment
 * @access  Private (OPS Manager, Cleaning Manager, Cleaning Staff)
 */
router.get('/equipment',
  rbacMiddleware(['ops_manager', 'cleaning_manager', 'cleaning_staff']),
  async (req: Request, res: Response) => {
    try {
      const { mallId, status, category } = req.query;

      const equipment = await cleaningService.getEquipment({
        mallId: mallId as string,
        status: status as string,
        category: category as string
      });

      res.json({
        success: true,
        data: equipment
      });
    } catch (error) {
      logger.error('Error fetching cleaning equipment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch cleaning equipment',
        error: error.message
      });
    }
  }
);

/**
 * @route   PUT /api/cleaning/equipment/:id/status
 * @desc    Update equipment status
 * @access  Private (Cleaning Manager, Cleaning Staff)
 */
router.put('/equipment/:id/status',
  rbacMiddleware(['cleaning_manager', 'cleaning_staff']),
  validateRequest({
    body: {
      status: 'required|enum:available,in_use,maintenance,out_of_service',
      notes: 'string'
    }
  }),
  async (req: Request, res: Response) => {
    try {
      const { status, notes } = req.body;

      const equipment = await cleaningService.updateEquipmentStatus(
        req.params.id,
        status,
        notes
      );

      res.json({
        success: true,
        message: 'Equipment status updated successfully',
        data: equipment
      });
    } catch (error) {
      logger.error('Error updating equipment status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update equipment status',
        error: error.message
      });
    }
  }
);

/**
 * @route   GET /api/cleaning/materials
 * @desc    Get cleaning materials
 * @access  Private (OPS Manager, Cleaning Manager, Cleaning Staff)
 */
router.get('/materials',
  rbacMiddleware(['ops_manager', 'cleaning_manager', 'cleaning_staff']),
  async (req: Request, res: Response) => {
    try {
      const { mallId, category, lowStock } = req.query;

      const materials = await cleaningService.getMaterials({
        mallId: mallId as string,
        category: category as string,
        lowStock: lowStock === 'true'
      });

      res.json({
        success: true,
        data: materials
      });
    } catch (error) {
      logger.error('Error fetching cleaning materials:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch cleaning materials',
        error: error.message
      });
    }
  }
);

/**
 * @route   PUT /api/cleaning/materials/:id/stock
 * @desc    Update material stock
 * @access  Private (Cleaning Manager, Cleaning Staff)
 */
router.put('/materials/:id/stock',
  rbacMiddleware(['cleaning_manager', 'cleaning_staff']),
  validateRequest({
    body: {
      quantity: 'required|integer|min:1',
      type: 'required|enum:add,remove',
      notes: 'string'
    }
  }),
  async (req: Request, res: Response) => {
    try {
      const { quantity, type, notes } = req.body;

      const material = await cleaningService.updateMaterialStock(
        req.params.id,
        quantity,
        type,
        notes
      );

      res.json({
        success: true,
        message: 'Material stock updated successfully',
        data: material
      });
    } catch (error) {
      logger.error('Error updating material stock:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update material stock',
        error: error.message
      });
    }
  }
);

/**
 * @route   GET /api/cleaning/analytics
 * @desc    Get cleaning analytics
 * @access  Private (OPS Manager, Cleaning Manager)
 */
router.get('/analytics',
  rbacMiddleware(['ops_manager', 'cleaning_manager']),
  validateRequest({
    query: {
      mallId: 'required|string',
      startDate: 'required|date',
      endDate: 'required|date'
    }
  }),
  async (req: Request, res: Response) => {
    try {
      const { mallId, startDate, endDate } = req.query;

      const analytics = await cleaningService.getAnalytics(
        mallId as string,
        new Date(startDate as string),
        new Date(endDate as string)
      );

      res.json({
        success: true,
        data: analytics
      });
    } catch (error) {
      logger.error('Error generating cleaning analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate cleaning analytics',
        error: error.message
      });
    }
  }
);

/**
 * @route   GET /api/cleaning/alerts/low-stock
 * @desc    Get low stock alerts
 * @access  Private (OPS Manager, Cleaning Manager)
 */
router.get('/alerts/low-stock',
  rbacMiddleware(['ops_manager', 'cleaning_manager']),
  async (req: Request, res: Response) => {
    try {
      const { mallId } = req.query;

      const alerts = await cleaningService.getLowStockAlerts(mallId as string);

      res.json({
        success: true,
        data: alerts
      });
    } catch (error) {
      logger.error('Error fetching low stock alerts:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch low stock alerts',
        error: error.message
      });
    }
  }
);

/**
 * @route   GET /api/cleaning/alerts/overdue
 * @desc    Get overdue tasks
 * @access  Private (OPS Manager, Cleaning Manager, Security Guard)
 */
router.get('/alerts/overdue',
  rbacMiddleware(['ops_manager', 'cleaning_manager', 'security_guard']),
  async (req: Request, res: Response) => {
    try {
      const { mallId } = req.query;

      const overdueTasks = await cleaningService.getOverdueTasks(mallId as string);

      res.json({
        success: true,
        data: overdueTasks
      });
    } catch (error) {
      logger.error('Error fetching overdue tasks:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch overdue tasks',
        error: error.message
      });
    }
  }
);

/**
 * @route   GET /api/cleaning/dashboard
 * @desc    Get cleaning dashboard data
 * @access  Private (OPS Manager, Cleaning Manager, Security Guard)
 */
router.get('/dashboard',
  rbacMiddleware(['ops_manager', 'cleaning_manager', 'security_guard']),
  async (req: Request, res: Response) => {
    try {
      const { mallId } = req.query;
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - 7);

      // Get various dashboard data
      const [todayTasks, weekTasks, overdueTasks, lowStockAlerts] = await Promise.all([
        cleaningService.getTasks({
          mallId: mallId as string,
          startDate: today,
          endDate: today
        }),
        cleaningService.getTasks({
          mallId: mallId as string,
          startDate: startOfWeek,
          endDate: today
        }),
        cleaningService.getOverdueTasks(mallId as string),
        cleaningService.getLowStockAlerts(mallId as string)
      ]);

      const dashboardData = {
        today: {
          total: todayTasks.length,
          completed: todayTasks.filter(t => t.status === 'completed').length,
          inProgress: todayTasks.filter(t => t.status === 'in_progress').length,
          pending: todayTasks.filter(t => t.status === 'scheduled').length
        },
        week: {
          total: weekTasks.length,
          completed: weekTasks.filter(t => t.status === 'completed').length,
          efficiency: weekTasks.length > 0 ?
            (weekTasks.filter(t => t.status === 'completed').length / weekTasks.length) * 100 : 0
        },
        alerts: {
          overdue: overdueTasks.length,
          lowStock: lowStockAlerts.length
        },
        recentTasks: todayTasks.slice(0, 5)
      };

      res.json({
        success: true,
        data: dashboardData
      });
    } catch (error) {
      logger.error('Error fetching cleaning dashboard:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch cleaning dashboard',
        error: error.message
      });
    }
  }
);

export default router;

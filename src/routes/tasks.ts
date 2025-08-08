/**
 * MallOS Enterprise - Task Management API Routes
 * Task assignment, tracking, and management for operations
 */

import { authMiddleware } from '@/middleware/auth';
import { rbacMiddleware } from '@/middleware/rbac';
import { validateRequest } from '@/middleware/validation';
import { Task, TaskAssignment } from '@/models/TaskManagement';
import { User } from '@/models/User';
import { logger } from '@/utils/logger';
import { Request, Response, Router } from 'express';
import { param, query, validationResult } from 'express-validator';
import { getRepository } from 'typeorm';

const router = Router();

// Apply authentication to all routes
router.use(authMiddleware);

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks with filtering and pagination
 * @access  Private (OPS Manager, Security Guard, Cleaning Manager)
 */
router.get('/',
  rbacMiddleware(['ops_manager', 'security_guard', 'cleaning_manager', 'super_admin']),
  [
    query('mallId').optional().isUUID(),
    query('type').optional().isIn(['inspection', 'maintenance', 'security', 'cleaning', 'emergency']),
    query('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
    query('status').optional().isIn(['pending', 'assigned', 'in_progress', 'completed', 'overdue']),
    query('assignedTo').optional().isString(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        mallId,
        type,
        priority,
        status,
        assignedTo,
        page = 1,
        limit = 20
      } = req.query;

      const taskRepo = getRepository(Task);
      const where: any = {};

      if (mallId) where.mallId = mallId;
      if (type) where.type = type;
      if (priority) where.priority = priority;
      if (status) where.status = status;
      if (assignedTo) where.assignedTo = assignedTo;

      const [tasks, total] = await taskRepo.findAndCount({
        where,
        order: { createdAt: 'DESC' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        relations: ['assignments', 'workItems']
      });

      res.json({
        success: true,
        data: tasks,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      logger.error('Error fetching tasks:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch tasks',
        error: error.message
      });
    }
  }
);

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Private (OPS Manager, Super Admin)
 */
router.post('/',
  rbacMiddleware(['ops_manager', 'super_admin']),
  validateRequest({
    body: {
      title: 'required|string|max:200',
      description: 'required|string|max:1000',
      type: 'required|enum:inspection,maintenance,security,cleaning,emergency',
      priority: 'required|enum:low,medium,high,urgent',
      mallId: 'required|uuid',
      assignedTo: 'string',
      dueDate: 'required|date',
      tenantId: 'uuid'
    }
  }),
  async (req: Request, res: Response) => {
    try {
      const taskRepo = getRepository(Task);
      const userRepo = getRepository(User);

      // Verify assigned user exists if provided
      if (req.body.assignedTo) {
        const assignedUser = await userRepo.findOne({ where: { id: req.body.assignedTo } });
        if (!assignedUser) {
          return res.status(400).json({
            success: false,
            message: 'Assigned user not found'
          });
        }
      }

      const task = taskRepo.create({
        ...req.body,
        status: 'pending',
        assignedBy: req.user.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const savedTask = await taskRepo.save(task);

      logger.info(`Task created: ${savedTask.id} by user ${req.user.id}`);

      res.status(201).json({
        success: true,
        data: savedTask,
        message: 'Task created successfully'
      });
    } catch (error) {
      logger.error('Error creating task:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create task',
        error: error.message
      });
    }
  }
);

/**
 * @route   GET /api/tasks/:id
 * @desc    Get task by ID
 * @access  Private (OPS Manager, Security Guard, Cleaning Manager)
 */
router.get('/:id',
  rbacMiddleware(['ops_manager', 'security_guard', 'cleaning_manager', 'super_admin']),
  [
    param('id').isUUID()
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const taskRepo = getRepository(Task);
      const task = await taskRepo.findOne({
        where: { id: req.params.id },
        relations: ['assignments', 'workItems', 'actionRequests']
      });

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      res.json({
        success: true,
        data: task
      });
    } catch (error) {
      logger.error('Error fetching task:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch task',
        error: error.message
      });
    }
  }
);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update task
 * @access  Private (OPS Manager, Super Admin)
 */
router.put('/:id',
  rbacMiddleware(['ops_manager', 'super_admin']),
  [
    param('id').isUUID()
  ],
  validateRequest({
    body: {
      title: 'string|max:200',
      description: 'string|max:1000',
      type: 'enum:inspection,maintenance,security,cleaning,emergency',
      priority: 'enum:low,medium,high,urgent',
      status: 'enum:pending,assigned,in_progress,completed,overdue',
      assignedTo: 'string',
      dueDate: 'date'
    }
  }),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const taskRepo = getRepository(Task);
      const task = await taskRepo.findOne({ where: { id: req.params.id } });

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      // Update task
      Object.assign(task, {
        ...req.body,
        updatedAt: new Date()
      });

      const updatedTask = await taskRepo.save(task);

      logger.info(`Task updated: ${updatedTask.id} by user ${req.user.id}`);

      res.json({
        success: true,
        data: updatedTask,
        message: 'Task updated successfully'
      });
    } catch (error) {
      logger.error('Error updating task:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update task',
        error: error.message
      });
    }
  }
);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete task
 * @access  Private (OPS Manager, Super Admin)
 */
router.delete('/:id',
  rbacMiddleware(['ops_manager', 'super_admin']),
  [
    param('id').isUUID()
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const taskRepo = getRepository(Task);
      const task = await taskRepo.findOne({ where: { id: req.params.id } });

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      await taskRepo.remove(task);

      logger.info(`Task deleted: ${req.params.id} by user ${req.user.id}`);

      res.json({
        success: true,
        message: 'Task deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting task:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete task',
        error: error.message
      });
    }
  }
);

/**
 * @route   POST /api/tasks/:id/assign
 * @desc    Assign task to user
 * @access  Private (OPS Manager, Super Admin)
 */
router.post('/:id/assign',
  rbacMiddleware(['ops_manager', 'super_admin']),
  [
    param('id').isUUID()
  ],
  validateRequest({
    body: {
      assignedTo: 'required|string',
      notes: 'string|max:500'
    }
  }),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const taskRepo = getRepository(Task);
      const userRepo = getRepository(User);
      const assignmentRepo = getRepository(TaskAssignment);

      const task = await taskRepo.findOne({ where: { id: req.params.id } });
      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      const assignedUser = await userRepo.findOne({ where: { id: req.body.assignedTo } });
      if (!assignedUser) {
        return res.status(400).json({
          success: false,
          message: 'Assigned user not found'
        });
      }

      // Create assignment record
      const assignment = assignmentRepo.create({
        taskId: task.id,
        assignedTo: req.body.assignedTo,
        assignedBy: req.user.id,
        assignedAt: new Date(),
        notes: req.body.notes
      });

      await assignmentRepo.save(assignment);

      // Update task status
      task.status = 'assigned';
      task.assignedTo = req.body.assignedTo;
      task.updatedAt = new Date();
      await taskRepo.save(task);

      logger.info(`Task assigned: ${task.id} to ${req.body.assignedTo} by ${req.user.id}`);

      res.json({
        success: true,
        data: { task, assignment },
        message: 'Task assigned successfully'
      });
    } catch (error) {
      logger.error('Error assigning task:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to assign task',
        error: error.message
      });
    }
  }
);

/**
 * @route   POST /api/tasks/:id/start
 * @desc    Start working on task
 * @access  Private (Assigned User, OPS Manager)
 */
router.post('/:id/start',
  rbacMiddleware(['ops_manager', 'security_guard', 'cleaning_manager', 'super_admin']),
  [
    param('id').isUUID()
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const taskRepo = getRepository(Task);
      const task = await taskRepo.findOne({ where: { id: req.params.id } });

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      // Check if user is assigned to this task or is OPS manager
      if (task.assignedTo !== req.user.id && !['ops_manager', 'super_admin'].includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to start this task'
        });
      }

      task.status = 'in_progress';
      task.startedAt = new Date();
      task.updatedAt = new Date();
      await taskRepo.save(task);

      logger.info(`Task started: ${task.id} by user ${req.user.id}`);

      res.json({
        success: true,
        data: task,
        message: 'Task started successfully'
      });
    } catch (error) {
      logger.error('Error starting task:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to start task',
        error: error.message
      });
    }
  }
);

/**
 * @route   POST /api/tasks/:id/complete
 * @desc    Complete task
 * @access  Private (Assigned User, OPS Manager)
 */
router.post('/:id/complete',
  rbacMiddleware(['ops_manager', 'security_guard', 'cleaning_manager', 'super_admin']),
  [
    param('id').isUUID()
  ],
  validateRequest({
    body: {
      completionNotes: 'string|max:1000',
      completionTime: 'integer|min:1',
      checklist: 'object'
    }
  }),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const taskRepo = getRepository(Task);
      const task = await taskRepo.findOne({ where: { id: req.params.id } });

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      // Check if user is assigned to this task or is OPS manager
      if (task.assignedTo !== req.user.id && !['ops_manager', 'super_admin'].includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to complete this task'
        });
      }

      task.status = 'completed';
      task.completedAt = new Date();
      task.completionNotes = req.body.completionNotes;
      task.completionTime = req.body.completionTime;
      task.checklist = req.body.checklist;
      task.updatedAt = new Date();
      await taskRepo.save(task);

      logger.info(`Task completed: ${task.id} by user ${req.user.id}`);

      res.json({
        success: true,
        data: task,
        message: 'Task completed successfully'
      });
    } catch (error) {
      logger.error('Error completing task:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to complete task',
        error: error.message
      });
    }
  }
);

/**
 * @route   GET /api/tasks/dashboard/:mallId
 * @desc    Get task dashboard data
 * @access  Private (OPS Manager, Security Guard, Cleaning Manager)
 */
router.get('/dashboard/:mallId',
  rbacMiddleware(['ops_manager', 'security_guard', 'cleaning_manager', 'super_admin']),
  [
    param('mallId').isUUID()
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const taskRepo = getRepository(Task);
      const { mallId } = req.params;

      // Get task statistics
      const [totalTasks, pendingTasks, inProgressTasks, completedTasks, overdueTasks] = await Promise.all([
        taskRepo.count({ where: { mallId } }),
        taskRepo.count({ where: { mallId, status: 'pending' } }),
        taskRepo.count({ where: { mallId, status: 'in_progress' } }),
        taskRepo.count({ where: { mallId, status: 'completed' } }),
        taskRepo.count({ where: { mallId, status: 'overdue' } })
      ]);

      // Get tasks by type
      const tasksByType = await taskRepo
        .createQueryBuilder('task')
        .select('task.type', 'type')
        .addSelect('COUNT(*)', 'count')
        .where('task.mallId = :mallId', { mallId })
        .groupBy('task.type')
        .getRawMany();

      // Get recent tasks
      const recentTasks = await taskRepo.find({
        where: { mallId },
        order: { createdAt: 'DESC' },
        take: 10
      });

      res.json({
        success: true,
        data: {
          statistics: {
            total: totalTasks,
            pending: pendingTasks,
            inProgress: inProgressTasks,
            completed: completedTasks,
            overdue: overdueTasks
          },
          byType: tasksByType.map(item => ({
            type: item.type,
            count: parseInt(item.count)
          })),
          recentTasks
        }
      });
    } catch (error) {
      logger.error('Error fetching task dashboard:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch task dashboard',
        error: error.message
      });
    }
  }
);

export default router;

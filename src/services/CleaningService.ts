/**
 * MallOS Enterprise - Cleaning Management Service
 * Comprehensive cleaning and housekeeping service
 */

import { getRepository } from 'typeorm';
import { CleaningEquipment, CleaningMaterial, CleaningSchedule, CleaningStatus, CleaningTask, CleaningType, QualityRating } from '../models/Cleaning';
import { logger } from '../utils/logger';

export class CleaningService {
  private taskRepository = getRepository(CleaningTask);
  private scheduleRepository = getRepository(CleaningSchedule);
  private equipmentRepository = getRepository(CleaningEquipment);
  private materialRepository = getRepository(CleaningMaterial);

  /**
   * Create a new cleaning task
   */
  async createTask(taskData: Partial<CleaningTask>): Promise<CleaningTask> {
    try {
      const task = this.taskRepository.create({
        ...taskData,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const savedTask = await this.taskRepository.save(task);
      logger.info(`Cleaning task created: ${savedTask.taskNumber}`);
      return savedTask;
    } catch (error) {
      logger.error('Error creating cleaning task:', error);
      throw new Error('Failed to create cleaning task');
    }
  }

  /**
   * Get all cleaning tasks with filters
   */
  async getTasks(filters: {
    mallId?: string;
    status?: CleaningStatus;
    type?: CleaningType;
    assignedTo?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<CleaningTask[]> {
    try {
      const queryBuilder = this.taskRepository.createQueryBuilder('task');

      if (filters.mallId) {
        queryBuilder.andWhere('task.mallId = :mallId', { mallId: filters.mallId });
      }

      if (filters.status) {
        queryBuilder.andWhere('task.status = :status', { status: filters.status });
      }

      if (filters.type) {
        queryBuilder.andWhere('task.type = :type', { type: filters.type });
      }

      if (filters.assignedTo) {
        queryBuilder.andWhere('task.assignedTo = :assignedTo', { assignedTo: filters.assignedTo });
      }

      if (filters.startDate && filters.endDate) {
        queryBuilder.andWhere('task.scheduledDate BETWEEN :startDate AND :endDate', {
          startDate: filters.startDate,
          endDate: filters.endDate
        });
      }

      queryBuilder.orderBy('task.scheduledDate', 'ASC');

      return await queryBuilder.getMany();
    } catch (error) {
      logger.error('Error fetching cleaning tasks:', error);
      throw new Error('Failed to fetch cleaning tasks');
    }
  }

  /**
   * Get task by ID
   */
  async getTaskById(taskId: string): Promise<CleaningTask | null> {
    try {
      return await this.taskRepository.findOne({ where: { id: taskId } });
    } catch (error) {
      logger.error('Error fetching cleaning task:', error);
      throw new Error('Failed to fetch cleaning task');
    }
  }

  /**
   * Update cleaning task
   */
  async updateTask(taskId: string, updateData: Partial<CleaningTask>): Promise<CleaningTask> {
    try {
      const task = await this.taskRepository.findOne({ where: { id: taskId } });
      if (!task) {
        throw new Error('Cleaning task not found');
      }

      Object.assign(task, updateData, { updatedAt: new Date() });
      const updatedTask = await this.taskRepository.save(task);

      logger.info(`Cleaning task updated: ${updatedTask.taskNumber}`);
      return updatedTask;
    } catch (error) {
      logger.error('Error updating cleaning task:', error);
      throw new Error('Failed to update cleaning task');
    }
  }

  /**
   * Start cleaning task
   */
  async startTask(taskId: string, staffId: string): Promise<CleaningTask> {
    try {
      const task = await this.taskRepository.findOne({ where: { id: taskId } });
      if (!task) {
        throw new Error('Cleaning task not found');
      }

      if (task.status !== CleaningStatus.SCHEDULED) {
        throw new Error('Task cannot be started - invalid status');
      }

      task.status = CleaningStatus.IN_PROGRESS;
      task.startDate = new Date();
      task.assignedTo = staffId;

      const updatedTask = await this.taskRepository.save(task);
      logger.info(`Cleaning task started: ${updatedTask.taskNumber}`);
      return updatedTask;
    } catch (error) {
      logger.error('Error starting cleaning task:', error);
      throw new Error('Failed to start cleaning task');
    }
  }

  /**
   * Complete cleaning task
   */
  async completeTask(taskId: string, completionData: {
    actualDuration?: number;
    checklist?: any;
    qualityInspection?: any;
    notes?: string;
  }): Promise<CleaningTask> {
    try {
      const task = await this.taskRepository.findOne({ where: { id: taskId } });
      if (!task) {
        throw new Error('Cleaning task not found');
      }

      if (task.status !== CleaningStatus.IN_PROGRESS) {
        throw new Error('Task cannot be completed - invalid status');
      }

      task.status = CleaningStatus.COMPLETED;
      task.completedDate = new Date();
      task.actualDuration = completionData.actualDuration;

      if (completionData.checklist) {
        task.checklist = completionData.checklist;
      }

      if (completionData.qualityInspection) {
        task.qualityInspection = completionData.qualityInspection;
      }

      const updatedTask = await this.taskRepository.save(task);
      logger.info(`Cleaning task completed: ${updatedTask.taskNumber}`);
      return updatedTask;
    } catch (error) {
      logger.error('Error completing cleaning task:', error);
      throw new Error('Failed to complete cleaning task');
    }
  }

  /**
   * Create cleaning schedule
   */
  async createSchedule(scheduleData: Partial<CleaningSchedule>): Promise<CleaningSchedule> {
    try {
      const schedule = this.scheduleRepository.create({
        ...scheduleData,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const savedSchedule = await this.scheduleRepository.save(schedule);
      logger.info(`Cleaning schedule created: ${savedSchedule.scheduleNumber}`);
      return savedSchedule;
    } catch (error) {
      logger.error('Error creating cleaning schedule:', error);
      throw new Error('Failed to create cleaning schedule');
    }
  }

  /**
   * Get cleaning schedules
   */
  async getSchedules(filters: {
    mallId?: string;
    isActive?: boolean;
    type?: CleaningType;
  }): Promise<CleaningSchedule[]> {
    try {
      const queryBuilder = this.scheduleRepository.createQueryBuilder('schedule');

      if (filters.mallId) {
        queryBuilder.andWhere('schedule.mallId = :mallId', { mallId: filters.mallId });
      }

      if (filters.isActive !== undefined) {
        queryBuilder.andWhere('schedule.isActive = :isActive', { isActive: filters.isActive });
      }

      if (filters.type) {
        queryBuilder.andWhere('schedule.type = :type', { type: filters.type });
      }

      queryBuilder.orderBy('schedule.createdAt', 'DESC');

      return await queryBuilder.getMany();
    } catch (error) {
      logger.error('Error fetching cleaning schedules:', error);
      throw new Error('Failed to fetch cleaning schedules');
    }
  }

  /**
   * Generate tasks from schedule
   */
  async generateTasksFromSchedule(scheduleId: string, startDate: Date, endDate: Date): Promise<CleaningTask[]> {
    try {
      const schedule = await this.scheduleRepository.findOne({ where: { id: scheduleId } });
      if (!schedule) {
        throw new Error('Cleaning schedule not found');
      }

      const generatedTasks: CleaningTask[] = [];
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();

        if (schedule.schedule.daysOfWeek?.includes(dayOfWeek)) {
          for (const timeSlot of schedule.schedule.timeSlots || []) {
            const taskDate = new Date(currentDate);
            const [hours, minutes] = timeSlot.startTime.split(':').map(Number);
            taskDate.setHours(hours, minutes, 0, 0);

            const task = this.taskRepository.create({
              mallId: schedule.mallId,
              type: schedule.type,
              title: `${schedule.title} - ${timeSlot.startTime}`,
              description: schedule.description,
              scheduledDate: taskDate,
              priority: timeSlot.priority,
              location: schedule.locations,
              assignedStaff: schedule.staffAssignment?.assignedStaff?.[0],
              equipment: schedule.equipment,
              metadata: {
                createdBy: 'system',
                source: 'schedule',
                relatedTasks: []
              }
            });

            generatedTasks.push(task);
          }
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      const savedTasks = await this.taskRepository.save(generatedTasks);
      logger.info(`Generated ${savedTasks.length} tasks from schedule: ${schedule.scheduleNumber}`);
      return savedTasks;
    } catch (error) {
      logger.error('Error generating tasks from schedule:', error);
      throw new Error('Failed to generate tasks from schedule');
    }
  }

  /**
   * Get cleaning equipment
   */
  async getEquipment(filters: {
    mallId?: string;
    status?: string;
    category?: string;
  }): Promise<CleaningEquipment[]> {
    try {
      const queryBuilder = this.equipmentRepository.createQueryBuilder('equipment');

      if (filters.mallId) {
        queryBuilder.andWhere('equipment.mallId = :mallId', { mallId: filters.mallId });
      }

      if (filters.status) {
        queryBuilder.andWhere('equipment.status = :status', { status: filters.status });
      }

      if (filters.category) {
        queryBuilder.andWhere('equipment.category = :category', { category: filters.category });
      }

      queryBuilder.orderBy('equipment.name', 'ASC');

      return await queryBuilder.getMany();
    } catch (error) {
      logger.error('Error fetching cleaning equipment:', error);
      throw new Error('Failed to fetch cleaning equipment');
    }
  }

  /**
   * Update equipment status
   */
  async updateEquipmentStatus(equipmentId: string, status: string, notes?: string): Promise<CleaningEquipment> {
    try {
      const equipment = await this.equipmentRepository.findOne({ where: { id: equipmentId } });
      if (!equipment) {
        throw new Error('Cleaning equipment not found');
      }

      equipment.status = status as any;
      equipment.updatedAt = new Date();

      if (notes) {
        equipment.maintenance = {
          ...equipment.maintenance,
          maintenanceHistory: [
            ...(equipment.maintenance?.maintenanceHistory || []),
            {
              date: new Date(),
              type: 'status_update',
              description: notes,
              performedBy: 'system'
            }
          ]
        };
      }

      const updatedEquipment = await this.equipmentRepository.save(equipment);
      logger.info(`Equipment status updated: ${updatedEquipment.equipmentNumber}`);
      return updatedEquipment;
    } catch (error) {
      logger.error('Error updating equipment status:', error);
      throw new Error('Failed to update equipment status');
    }
  }

  /**
   * Get cleaning materials
   */
  async getMaterials(filters: {
    mallId?: string;
    category?: string;
    lowStock?: boolean;
  }): Promise<CleaningMaterial[]> {
    try {
      const queryBuilder = this.materialRepository.createQueryBuilder('material');

      if (filters.mallId) {
        queryBuilder.andWhere('material.mallId = :mallId', { mallId: filters.mallId });
      }

      if (filters.category) {
        queryBuilder.andWhere('material.category = :category', { category: filters.category });
      }

      if (filters.lowStock) {
        queryBuilder.andWhere('material.currentStock <= material.minimumStock');
      }

      queryBuilder.orderBy('material.name', 'ASC');

      return await queryBuilder.getMany();
    } catch (error) {
      logger.error('Error fetching cleaning materials:', error);
      throw new Error('Failed to fetch cleaning materials');
    }
  }

  /**
   * Update material stock
   */
  async updateMaterialStock(materialId: string, quantity: number, type: 'add' | 'remove', notes?: string): Promise<CleaningMaterial> {
    try {
      const material = await this.materialRepository.findOne({ where: { id: materialId } });
      if (!material) {
        throw new Error('Cleaning material not found');
      }

      if (type === 'add') {
        material.currentStock += quantity;
      } else {
        if (material.currentStock < quantity) {
          throw new Error('Insufficient stock');
        }
        material.currentStock -= quantity;
      }

      material.updatedAt = new Date();

      // Update usage history
      material.usage = {
        ...material.usage,
        usageHistory: [
          ...(material.usage?.usageHistory || []),
          {
            date: new Date(),
            quantity: type === 'add' ? quantity : -quantity,
            type: type === 'add' ? 'in' : 'out',
            reason: notes || 'Manual adjustment'
          }
        ]
      };

      const updatedMaterial = await this.materialRepository.save(material);
      logger.info(`Material stock updated: ${updatedMaterial.materialNumber}`);
      return updatedMaterial;
    } catch (error) {
      logger.error('Error updating material stock:', error);
      throw new Error('Failed to update material stock');
    }
  }

  /**
   * Get cleaning analytics
   */
  async getAnalytics(mallId: string, startDate: Date, endDate: Date): Promise<any> {
    try {
      const tasks = await this.taskRepository.find({
        where: {
          mallId,
          scheduledDate: {
            $gte: startDate,
            $lte: endDate
          }
        }
      });

      const analytics = {
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.status === CleaningStatus.COMPLETED).length,
        inProgressTasks: tasks.filter(t => t.status === CleaningStatus.IN_PROGRESS).length,
        overdueTasks: tasks.filter(t => t.status === CleaningStatus.OVERDUE).length,
        averageCompletionTime: 0,
        qualityScores: {
          excellent: 0,
          good: 0,
          fair: 0,
          poor: 0
        },
        tasksByType: {} as Record<string, number>,
        tasksByPriority: {} as Record<string, number>,
        efficiencyScore: 0
      };

      let totalCompletionTime = 0;
      let completedTaskCount = 0;

      tasks.forEach(task => {
        // Count by type
        analytics.tasksByType[task.type] = (analytics.tasksByType[task.type] || 0) + 1;

        // Count by priority
        analytics.tasksByPriority[task.priority] = (analytics.tasksByPriority[task.priority] || 0) + 1;

        // Calculate completion time
        if (task.status === CleaningStatus.COMPLETED && task.startDate && task.completedDate) {
          const completionTime = task.completedDate.getTime() - task.startDate.getTime();
          totalCompletionTime += completionTime;
          completedTaskCount++;
        }

        // Count quality ratings
        if (task.qualityInspection?.rating) {
          switch (task.qualityInspection.rating) {
            case QualityRating.OUTSTANDING:
            case QualityRating.EXCELLENT:
              analytics.qualityScores.excellent++;
              break;
            case QualityRating.GOOD:
              analytics.qualityScores.good++;
              break;
            case QualityRating.FAIR:
              analytics.qualityScores.fair++;
              break;
            case QualityRating.POOR:
              analytics.qualityScores.poor++;
              break;
          }
        }
      });

      if (completedTaskCount > 0) {
        analytics.averageCompletionTime = totalCompletionTime / completedTaskCount;
      }

      analytics.efficiencyScore = (analytics.completedTasks / analytics.totalTasks) * 100;

      return analytics;
    } catch (error) {
      logger.error('Error generating cleaning analytics:', error);
      throw new Error('Failed to generate cleaning analytics');
    }
  }

  /**
   * Get low stock alerts
   */
  async getLowStockAlerts(mallId: string): Promise<CleaningMaterial[]> {
    try {
      return await this.materialRepository.find({
        where: {
          mallId,
          currentStock: {
            $lte: () => 'minimumStock'
          }
        }
      });
    } catch (error) {
      logger.error('Error fetching low stock alerts:', error);
      throw new Error('Failed to fetch low stock alerts');
    }
  }

  /**
   * Get overdue tasks
   */
  async getOverdueTasks(mallId: string): Promise<CleaningTask[]> {
    try {
      const now = new Date();
      return await this.taskRepository.find({
        where: {
          mallId,
          scheduledDate: {
            $lt: now
          },
          status: {
            $in: [CleaningStatus.SCHEDULED, CleaningStatus.IN_PROGRESS]
          }
        }
      });
    } catch (error) {
      logger.error('Error fetching overdue tasks:', error);
      throw new Error('Failed to fetch overdue tasks');
    }
  }
}

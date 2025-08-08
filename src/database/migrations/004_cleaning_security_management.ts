/**
 * MallOS Enterprise - Migration 004
 * Cleaning and Security Management Tables
 */

import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CleaningSecurityManagement004 implements MigrationInterface {
  name = 'CleaningSecurityManagement004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create cleaning_tasks table
    await queryRunner.createTable(
      new Table({
        name: 'cleaning_tasks',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'taskNumber',
            type: 'varchar',
            length: '50',
            isUnique: true
          },
          {
            name: 'mallId',
            type: 'uuid'
          },
          {
            name: 'tenantId',
            type: 'uuid',
            isNullable: true
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['daily', 'weekly', 'monthly', 'deep_cleaning', 'special_event', 'emergency', 'post_construction'],
            default: "'daily'"
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['scheduled', 'in_progress', 'completed', 'verified', 'failed', 'cancelled'],
            default: "'scheduled'"
          },
          {
            name: 'priority',
            type: 'enum',
            enum: ['low', 'medium', 'high', 'urgent'],
            default: "'medium'"
          },
          {
            name: 'title',
            type: 'varchar',
            length: '200'
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true
          },
          {
            name: 'location',
            type: 'jsonb'
          },
          {
            name: 'scheduledDate',
            type: 'timestamp'
          },
          {
            name: 'startDate',
            type: 'timestamp',
            isNullable: true
          },
          {
            name: 'completedDate',
            type: 'timestamp',
            isNullable: true
          },
          {
            name: 'estimatedDuration',
            type: 'int',
            isNullable: true
          },
          {
            name: 'actualDuration',
            type: 'int',
            isNullable: true
          },
          {
            name: 'assignedTo',
            type: 'uuid',
            isNullable: true
          },
          {
            name: 'assignedStaff',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'equipment',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'materials',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'checklist',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'qualityInspection',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'safety',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'costs',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'compliance',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'feedback',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'attachments',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'metadata',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true
          }
        ]
      })
    );

    // Create cleaning_schedules table
    await queryRunner.createTable(
      new Table({
        name: 'cleaning_schedules',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'scheduleNumber',
            type: 'varchar',
            length: '50',
            isUnique: true
          },
          {
            name: 'mallId',
            type: 'uuid'
          },
          {
            name: 'title',
            type: 'varchar',
            length: '200'
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['daily', 'weekly', 'monthly', 'deep_cleaning', 'special_event', 'emergency', 'post_construction'],
            default: "'daily'"
          },
          {
            name: 'schedule',
            type: 'jsonb'
          },
          {
            name: 'locations',
            type: 'jsonb'
          },
          {
            name: 'staffAssignment',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'equipment',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'qualityStandards',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true
          },
          {
            name: 'metadata',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          }
        ]
      })
    );

    // Create cleaning_equipment table
    await queryRunner.createTable(
      new Table({
        name: 'cleaning_equipment',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'equipmentNumber',
            type: 'varchar',
            length: '50',
            isUnique: true
          },
          {
            name: 'mallId',
            type: 'uuid'
          },
          {
            name: 'name',
            type: 'varchar',
            length: '200'
          },
          {
            name: 'category',
            type: 'varchar',
            length: '100',
            isNullable: true
          },
          {
            name: 'brand',
            type: 'varchar',
            length: '100',
            isNullable: true
          },
          {
            name: 'model',
            type: 'varchar',
            length: '100',
            isNullable: true
          },
          {
            name: 'serialNumber',
            type: 'varchar',
            length: '50',
            isNullable: true
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['available', 'in_use', 'maintenance', 'out_of_service'],
            default: "'available'"
          },
          {
            name: 'specifications',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'maintenance',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'location',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'costs',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'usage',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'safety',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          }
        ]
      })
    );

    // Create cleaning_materials table
    await queryRunner.createTable(
      new Table({
        name: 'cleaning_materials',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'materialNumber',
            type: 'varchar',
            length: '50',
            isUnique: true
          },
          {
            name: 'mallId',
            type: 'uuid'
          },
          {
            name: 'name',
            type: 'varchar',
            length: '200'
          },
          {
            name: 'category',
            type: 'varchar',
            length: '100',
            isNullable: true
          },
          {
            name: 'brand',
            type: 'varchar',
            length: '100',
            isNullable: true
          },
          {
            name: 'supplier',
            type: 'varchar',
            length: '100',
            isNullable: true
          },
          {
            name: 'unitPrice',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true
          },
          {
            name: 'unit',
            type: 'varchar',
            length: '20',
            isNullable: true
          },
          {
            name: 'currentStock',
            type: 'int',
            default: 0
          },
          {
            name: 'minimumStock',
            type: 'int',
            isNullable: true
          },
          {
            name: 'maximumStock',
            type: 'int',
            isNullable: true
          },
          {
            name: 'specifications',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'usage',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'inventory',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'costs',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'compliance',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          }
        ]
      })
    );

    // Create patrol_routes table
    await queryRunner.createTable(
      new Table({
        name: 'patrol_routes',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'routeNumber',
            type: 'varchar',
            length: '50',
            isUnique: true
          },
          {
            name: 'mallId',
            type: 'uuid'
          },
          {
            name: 'name',
            type: 'varchar',
            length: '200'
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true
          },
          {
            name: 'route',
            type: 'jsonb'
          },
          {
            name: 'schedule',
            type: 'jsonb'
          },
          {
            name: 'assignedStaff',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'requirements',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'safety',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true
          },
          {
            name: 'performance',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'metadata',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          }
        ]
      })
    );

    // Create patrol_sessions table
    await queryRunner.createTable(
      new Table({
        name: 'patrol_sessions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'sessionNumber',
            type: 'varchar',
            length: '50',
            isUnique: true
          },
          {
            name: 'routeId',
            type: 'uuid'
          },
          {
            name: 'guardId',
            type: 'uuid'
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['scheduled', 'in_progress', 'completed', 'cancelled', 'overdue'],
            default: "'scheduled'"
          },
          {
            name: 'scheduledStartTime',
            type: 'timestamp'
          },
          {
            name: 'actualStartTime',
            type: 'timestamp',
            isNullable: true
          },
          {
            name: 'completedTime',
            type: 'timestamp',
            isNullable: true
          },
          {
            name: 'checkpoints',
            type: 'jsonb'
          },
          {
            name: 'incidents',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'observations',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'performance',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'weather',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'equipment',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'notes',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          }
        ]
      })
    );

    // Create access_control table
    await queryRunner.createTable(
      new Table({
        name: 'access_control',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'accessNumber',
            type: 'varchar',
            length: '50',
            isUnique: true
          },
          {
            name: 'mallId',
            type: 'uuid'
          },
          {
            name: 'location',
            type: 'varchar',
            length: '200'
          },
          {
            name: 'deviceType',
            type: 'varchar',
            length: '100',
            isNullable: true
          },
          {
            name: 'deviceId',
            type: 'varchar',
            length: '100',
            isNullable: true
          },
          {
            name: 'accessLevel',
            type: 'enum',
            enum: ['public', 'restricted', 'authorized_only', 'security_only', 'admin_only'],
            default: "'restricted'"
          },
          {
            name: 'schedule',
            type: 'jsonb'
          },
          {
            name: 'authorizedUsers',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'accessLog',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'security',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'maintenance',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          }
        ]
      })
    );

    // Create visitor_management table
    await queryRunner.createTable(
      new Table({
        name: 'visitor_management',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'visitorNumber',
            type: 'varchar',
            length: '50',
            isUnique: true
          },
          {
            name: 'mallId',
            type: 'uuid'
          },
          {
            name: 'hostId',
            type: 'uuid'
          },
          {
            name: 'visitorName',
            type: 'varchar',
            length: '200'
          },
          {
            name: 'company',
            type: 'varchar',
            length: '100',
            isNullable: true
          },
          {
            name: 'phoneNumber',
            type: 'varchar',
            length: '20',
            isNullable: true
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isNullable: true
          },
          {
            name: 'idNumber',
            type: 'varchar',
            length: '50',
            isNullable: true
          },
          {
            name: 'idType',
            type: 'varchar',
            length: '100',
            isNullable: true
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['pending', 'approved', 'denied', 'expired', 'completed'],
            default: "'pending'"
          },
          {
            name: 'requestedEntryTime',
            type: 'timestamp'
          },
          {
            name: 'approvedEntryTime',
            type: 'timestamp',
            isNullable: true
          },
          {
            name: 'actualEntryTime',
            type: 'timestamp',
            isNullable: true
          },
          {
            name: 'exitTime',
            type: 'timestamp',
            isNullable: true
          },
          {
            name: 'duration',
            type: 'int',
            isNullable: true
          },
          {
            name: 'purpose',
            type: 'jsonb'
          },
          {
            name: 'access',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'badge',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'vehicle',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'security',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'host',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'notes',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'compliance',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          }
        ]
      })
    );

    // Create security_reports table
    await queryRunner.createTable(
      new Table({
        name: 'security_reports',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'reportNumber',
            type: 'varchar',
            length: '50',
            isUnique: true
          },
          {
            name: 'mallId',
            type: 'uuid'
          },
          {
            name: 'reportedBy',
            type: 'uuid'
          },
          {
            name: 'title',
            type: 'varchar',
            length: '200'
          },
          {
            name: 'description',
            type: 'text'
          },
          {
            name: 'type',
            type: 'varchar',
            length: '100'
          },
          {
            name: 'severity',
            type: 'enum',
            enum: ['low', 'medium', 'high', 'critical'],
            default: "'medium'"
          },
          {
            name: 'incidentDate',
            type: 'timestamp'
          },
          {
            name: 'location',
            type: 'jsonb'
          },
          {
            name: 'involved',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'response',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'investigation',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'resolution',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'attachments',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'metadata',
            type: 'jsonb',
            isNullable: true
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          }
        ]
      })
    );

    // Create indexes
    await queryRunner.createIndex('cleaning_tasks', {
      name: 'IDX_cleaning_tasks_mall_status',
      columnNames: ['mallId', 'status']
    });

    await queryRunner.createIndex('cleaning_tasks', {
      name: 'IDX_cleaning_tasks_assigned_status',
      columnNames: ['assignedTo', 'status']
    });

    await queryRunner.createIndex('cleaning_tasks', {
      name: 'IDX_cleaning_tasks_scheduled_status',
      columnNames: ['scheduledDate', 'status']
    });

    await queryRunner.createIndex('cleaning_schedules', {
      name: 'IDX_cleaning_schedules_mall_active',
      columnNames: ['mallId', 'isActive']
    });

    await queryRunner.createIndex('cleaning_equipment', {
      name: 'IDX_cleaning_equipment_mall_status',
      columnNames: ['mallId', 'status']
    });

    await queryRunner.createIndex('cleaning_materials', {
      name: 'IDX_cleaning_materials_mall_category',
      columnNames: ['mallId', 'category']
    });

    await queryRunner.createIndex('patrol_routes', {
      name: 'IDX_patrol_routes_mall_active',
      columnNames: ['mallId', 'isActive']
    });

    await queryRunner.createIndex('patrol_sessions', {
      name: 'IDX_patrol_sessions_route_status',
      columnNames: ['routeId', 'status']
    });

    await queryRunner.createIndex('patrol_sessions', {
      name: 'IDX_patrol_sessions_guard_status',
      columnNames: ['guardId', 'status']
    });

    await queryRunner.createIndex('access_control', {
      name: 'IDX_access_control_mall_location',
      columnNames: ['mallId', 'location']
    });

    await queryRunner.createIndex('visitor_management', {
      name: 'IDX_visitor_management_mall_status',
      columnNames: ['mallId', 'status']
    });

    await queryRunner.createIndex('visitor_management', {
      name: 'IDX_visitor_management_host_status',
      columnNames: ['hostId', 'status']
    });

    await queryRunner.createIndex('security_reports', {
      name: 'IDX_security_reports_mall_type',
      columnNames: ['mallId', 'type']
    });

    await queryRunner.createIndex('security_reports', {
      name: 'IDX_security_reports_reported_status',
      columnNames: ['reportedBy', 'status']
    });

    // Create foreign key constraints
    await queryRunner.createForeignKey('cleaning_tasks', {
      columnNames: ['mallId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'malls',
      onDelete: 'CASCADE'
    });

    await queryRunner.createForeignKey('cleaning_tasks', {
      columnNames: ['tenantId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'tenants',
      onDelete: 'SET NULL'
    });

    await queryRunner.createForeignKey('cleaning_schedules', {
      columnNames: ['mallId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'malls',
      onDelete: 'CASCADE'
    });

    await queryRunner.createForeignKey('cleaning_equipment', {
      columnNames: ['mallId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'malls',
      onDelete: 'CASCADE'
    });

    await queryRunner.createForeignKey('cleaning_materials', {
      columnNames: ['mallId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'malls',
      onDelete: 'CASCADE'
    });

    await queryRunner.createForeignKey('patrol_routes', {
      columnNames: ['mallId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'malls',
      onDelete: 'CASCADE'
    });

    await queryRunner.createForeignKey('patrol_sessions', {
      columnNames: ['routeId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'patrol_routes',
      onDelete: 'CASCADE'
    });

    await queryRunner.createForeignKey('patrol_sessions', {
      columnNames: ['guardId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'users',
      onDelete: 'CASCADE'
    });

    await queryRunner.createForeignKey('access_control', {
      columnNames: ['mallId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'malls',
      onDelete: 'CASCADE'
    });

    await queryRunner.createForeignKey('visitor_management', {
      columnNames: ['mallId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'malls',
      onDelete: 'CASCADE'
    });

    await queryRunner.createForeignKey('visitor_management', {
      columnNames: ['hostId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'users',
      onDelete: 'CASCADE'
    });

    await queryRunner.createForeignKey('security_reports', {
      columnNames: ['mallId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'malls',
      onDelete: 'CASCADE'
    });

    await queryRunner.createForeignKey('security_reports', {
      columnNames: ['reportedBy'],
      referencedColumnNames: ['id'],
      referencedTableName: 'users',
      onDelete: 'CASCADE'
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraints
    await queryRunner.dropForeignKey('security_reports', 'FK_security_reports_reportedBy');
    await queryRunner.dropForeignKey('security_reports', 'FK_security_reports_mallId');
    await queryRunner.dropForeignKey('visitor_management', 'FK_visitor_management_hostId');
    await queryRunner.dropForeignKey('visitor_management', 'FK_visitor_management_mallId');
    await queryRunner.dropForeignKey('access_control', 'FK_access_control_mallId');
    await queryRunner.dropForeignKey('patrol_sessions', 'FK_patrol_sessions_guardId');
    await queryRunner.dropForeignKey('patrol_sessions', 'FK_patrol_sessions_routeId');
    await queryRunner.dropForeignKey('patrol_routes', 'FK_patrol_routes_mallId');
    await queryRunner.dropForeignKey('cleaning_materials', 'FK_cleaning_materials_mallId');
    await queryRunner.dropForeignKey('cleaning_equipment', 'FK_cleaning_equipment_mallId');
    await queryRunner.dropForeignKey('cleaning_schedules', 'FK_cleaning_schedules_mallId');
    await queryRunner.dropForeignKey('cleaning_tasks', 'FK_cleaning_tasks_tenantId');
    await queryRunner.dropForeignKey('cleaning_tasks', 'FK_cleaning_tasks_mallId');

    // Drop indexes
    await queryRunner.dropIndex('security_reports', 'IDX_security_reports_reported_status');
    await queryRunner.dropIndex('security_reports', 'IDX_security_reports_mall_type');
    await queryRunner.dropIndex('visitor_management', 'IDX_visitor_management_host_status');
    await queryRunner.dropIndex('visitor_management', 'IDX_visitor_management_mall_status');
    await queryRunner.dropIndex('access_control', 'IDX_access_control_mall_location');
    await queryRunner.dropIndex('patrol_sessions', 'IDX_patrol_sessions_guard_status');
    await queryRunner.dropIndex('patrol_sessions', 'IDX_patrol_sessions_route_status');
    await queryRunner.dropIndex('patrol_routes', 'IDX_patrol_routes_mall_active');
    await queryRunner.dropIndex('cleaning_materials', 'IDX_cleaning_materials_mall_category');
    await queryRunner.dropIndex('cleaning_equipment', 'IDX_cleaning_equipment_mall_status');
    await queryRunner.dropIndex('cleaning_schedules', 'IDX_cleaning_schedules_mall_active');
    await queryRunner.dropIndex('cleaning_tasks', 'IDX_cleaning_tasks_scheduled_status');
    await queryRunner.dropIndex('cleaning_tasks', 'IDX_cleaning_tasks_assigned_status');
    await queryRunner.dropIndex('cleaning_tasks', 'IDX_cleaning_tasks_mall_status');

    // Drop tables
    await queryRunner.dropTable('security_reports');
    await queryRunner.dropTable('visitor_management');
    await queryRunner.dropTable('access_control');
    await queryRunner.dropTable('patrol_sessions');
    await queryRunner.dropTable('patrol_routes');
    await queryRunner.dropTable('cleaning_materials');
    await queryRunner.dropTable('cleaning_equipment');
    await queryRunner.dropTable('cleaning_schedules');
    await queryRunner.dropTable('cleaning_tasks');
  }
}

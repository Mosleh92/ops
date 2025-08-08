/**
 * MallOS Enterprise - Notification Entity
 * Notification management for mall operations
 */

import { IsArray, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export enum NotificationType {
  WORK_PERMIT = 'work_permit',
  ANNOUNCEMENT = 'announcement',
  WARNING = 'warning',
  FINE = 'fine',
  DOCUMENT_REQUEST = 'document_request',
  INSPECTION = 'inspection',
  MAINTENANCE = 'maintenance',
  EMERGENCY = 'emergency',
  GENERAL = 'general'
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum NotificationStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed'
}

export enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  IN_APP = 'in_app',
  WHATSAPP = 'whatsapp'
}

export enum RecipientType {
  ALL_TENANTS = 'all_tenants',
  SPECIFIC_TENANTS = 'specific_tenants',
  ALL_CONTRACTORS = 'all_contractors',
  SPECIFIC_CONTRACTORS = 'specific_contractors',
  SECURITY_GUARDS = 'security_guards',
  OPERATIONS_TEAM = 'operations_team',
  MANAGEMENT = 'management',
  CUSTOM = 'custom'
}

@Entity('notifications')
@Index(['type', 'status'])
@Index(['mallId', 'status'])
@Index(['recipientType', 'status'])
@Index(['createdAt'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 50, unique: true })
  @IsNotEmpty()
  notificationNumber!: string;

  @Column({ type: 'uuid' })
  mallId!: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.GENERAL
  })
  @IsEnum(NotificationType)
  type: NotificationType = NotificationType.GENERAL;

  @Column({
    type: 'enum',
    enum: NotificationPriority,
    default: NotificationPriority.MEDIUM
  })
  @IsEnum(NotificationPriority)
  priority: NotificationPriority = NotificationPriority.MEDIUM;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.DRAFT
  })
  @IsEnum(NotificationStatus)
  status: NotificationStatus = NotificationStatus.DRAFT;

  @Column({ length: 200 })
  @IsNotEmpty()
  title!: string;

  @Column({ type: 'text' })
  @IsNotEmpty()
  message!: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  detailedMessage?: string;

  // Recipient Information
  @Column({
    type: 'enum',
    enum: RecipientType,
    default: RecipientType.ALL_TENANTS
  })
  @IsEnum(RecipientType)
  recipientType: RecipientType = RecipientType.ALL_TENANTS;

  @Column({ type: 'jsonb', nullable: true })
  @IsOptional()
  @IsArray()
  specificRecipients?: string[]; // Array of tenant/contractor IDs

  @Column({ type: 'jsonb', nullable: true })
  @IsOptional()
  @IsArray()
  recipientFilters?: {
    tenantTypes?: string[];
    businessCategories?: string[];
    mallAreas?: string[];
    complianceStatus?: string[];
  };

  // Delivery Information
  @Column({ type: 'jsonb' })
  @IsArray()
  channels: NotificationChannel[] = [NotificationChannel.IN_APP];

  @Column({ type: 'jsonb', nullable: true })
  @IsOptional()
  deliverySchedule?: {
    sendImmediately: boolean;
    scheduledAt?: Date;
    timezone?: string;
    repeat?: {
      frequency: 'once' | 'daily' | 'weekly' | 'monthly';
      interval?: number;
      endDate?: Date;
    };
  };

  // Content and Attachments
  @Column({ type: 'jsonb', nullable: true })
  @IsOptional()
  attachments?: {
    name: string;
    url: string;
    type: string;
    size: number;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  @IsOptional()
  richContent?: {
    images?: string[];
    videos?: string[];
    links?: {
      text: string;
      url: string;
    }[];
    buttons?: {
      text: string;
      action: string;
      url?: string;
    }[];
  };

  // Document Request (for document_request type)
  @Column({ type: 'jsonb', nullable: true })
  @IsOptional()
  documentRequest?: {
    requiredDocuments: string[];
    deadline: Date;
    format: 'pdf' | 'image' | 'any';
    maxFileSize?: number;
    instructions?: string;
    templateUrl?: string;
  };

  // Fine/Warning Information
  @Column({ type: 'jsonb', nullable: true })
  @IsOptional()
  fineWarning?: {
    amount?: number;
    currency?: string;
    dueDate?: Date;
    reason: string;
    violationType: string;
    appealDeadline?: Date;
    paymentInstructions?: string;
  };

  // Work Permit Related
  @Column({ type: 'uuid', nullable: true })
  @IsOptional()
  workPermitId?: string;

  @Column({ type: 'jsonb', nullable: true })
  @IsOptional()
  workPermitInfo?: {
    permitNumber: string;
    permitType: string;
    jobDescription: string;
    startDate: Date;
    endDate: Date;
  };

  // Delivery Tracking
  @Column({ type: 'jsonb', nullable: true })
  @IsOptional()
  deliveryTracking?: {
    totalRecipients: number;
    sentCount: number;
    deliveredCount: number;
    readCount: number;
    failedCount: number;
    deliveryDetails: {
      recipientId: string;
      recipientType: string;
      channel: NotificationChannel;
      status: NotificationStatus;
      sentAt?: Date;
      deliveredAt?: Date;
      readAt?: Date;
      failedAt?: Date;
      failureReason?: string;
    }[];
  } = {
    totalRecipients: 0,
    sentCount: 0,
    deliveredCount: 0,
    readCount: 0,
    failedCount: 0,
    deliveryDetails: []
  };

  // Response Tracking
  @Column({ type: 'jsonb', nullable: true })
  @IsOptional()
  responses?: {
    recipientId: string;
    recipientType: string;
    response: 'acknowledged' | 'accepted' | 'rejected' | 'requested_extension' | 'submitted_document';
    responseAt: Date;
    comments?: string;
    attachments?: string[];
  }[];

  // Analytics
  @Column({ type: 'jsonb', nullable: true })
  @IsOptional()
  analytics?: {
    openRate: number;
    clickRate: number;
    responseRate: number;
    engagementScore: number;
    timeToRead: number; // average time in minutes
    timeToRespond: number; // average time in minutes
  };

  // Settings
  @Column({ type: 'jsonb', nullable: true })
  @IsOptional()
  settings?: {
    allowReply: boolean;
    requireAcknowledgement: boolean;
    autoEscalate: boolean;
    escalationDelay?: number; // in hours
    reminderSettings?: {
      enabled: boolean;
      frequency: 'once' | 'daily' | 'weekly';
      maxReminders: number;
    };
  } = {
    allowReply: false,
    requireAcknowledgement: false,
    autoEscalate: false
  };

  // Audit Information
  @Column({ type: 'jsonb' })
  audit: {
    createdBy: string;
    lastModifiedBy?: string;
    sentBy?: string;
    sentAt?: Date;
    history: {
      action: string;
      performedBy: string;
      performedAt: Date;
      details?: any;
    }[];
  };

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  // Virtual properties
  get isDraft(): boolean {
    return this.status === NotificationStatus.DRAFT;
  }

  get isSent(): boolean {
    return this.status === NotificationStatus.SENT;
  }

  get isDelivered(): boolean {
    return this.status === NotificationStatus.DELIVERED;
  }

  get isRead(): boolean {
    return this.status === NotificationStatus.READ;
  }

  get isFailed(): boolean {
    return this.status === NotificationStatus.FAILED;
  }

  get isUrgent(): boolean {
    return this.priority === NotificationPriority.URGENT;
  }

  get isHighPriority(): boolean {
    return this.priority === NotificationPriority.HIGH || this.priority === NotificationPriority.URGENT;
  }

  get isDocumentRequest(): boolean {
    return this.type === NotificationType.DOCUMENT_REQUEST;
  }

  get isFine(): boolean {
    return this.type === NotificationType.FINE;
  }

  get isWarning(): boolean {
    return this.type === NotificationType.WARNING;
  }

  get isWorkPermitRelated(): boolean {
    return this.type === NotificationType.WORK_PERMIT;
  }

  get isScheduled(): boolean {
    return !!(this.deliverySchedule && !this.deliverySchedule.sendImmediately);
  }

  get isOverdue(): boolean {
    if (this.fineWarning?.dueDate) {
      return new Date() > this.fineWarning.dueDate;
    }
    if (this.documentRequest?.deadline) {
      return new Date() > this.documentRequest.deadline;
    }
    return false;
  }

  get deliveryRate(): number {
    if (this.deliveryTracking?.totalRecipients === 0) return 0;
    return (this.deliveryTracking?.deliveredCount || 0) / (this.deliveryTracking?.totalRecipients || 1) * 100;
  }

  get readRate(): number {
    if (this.deliveryTracking?.deliveredCount === 0) return 0;
    return (this.deliveryTracking?.readCount || 0) / (this.deliveryTracking?.deliveredCount || 1) * 100;
  }

  get responseRate(): number {
    if (this.deliveryTracking?.totalRecipients === 0) return 0;
    return (this.responses?.length || 0) / (this.deliveryTracking?.totalRecipients || 1) * 100;
  }

  // Lifecycle hooks
  @BeforeInsert()
  generateNotificationNumber(): void {
    if (!this.notificationNumber) {
      const prefix = this.type.toUpperCase().substring(0, 3);
      this.notificationNumber = `${prefix}-${uuidv4().substring(0, 8).toUpperCase()}`;
    }
  }

  // Methods
  send(sentBy: string): void {
    this.status = NotificationStatus.SENT;
    this.audit.sentBy = sentBy;
    this.audit.sentAt = new Date();
    this.audit.history.push({
      action: 'SENT',
      performedBy: sentBy,
      performedAt: new Date()
    });
  }

  markAsDelivered(recipientId: string, channel: NotificationChannel): void {
    const delivery = this.deliveryTracking?.deliveryDetails.find(d => d.recipientId === recipientId && d.channel === channel);
    if (delivery) {
      delivery.status = NotificationStatus.DELIVERED;
      delivery.deliveredAt = new Date();
      this.deliveryTracking!.deliveredCount++;
    }
  }

  markAsRead(recipientId: string, channel: NotificationChannel): void {
    const delivery = this.deliveryTracking?.deliveryDetails.find(d => d.recipientId === recipientId && d.channel === channel);
    if (delivery) {
      delivery.status = NotificationStatus.READ;
      delivery.readAt = new Date();
      this.deliveryTracking!.readCount++;
    }
  }

  markAsFailed(recipientId: string, channel: NotificationChannel, reason: string): void {
    const delivery = this.deliveryTracking?.deliveryDetails.find(d => d.recipientId === recipientId && d.channel === channel);
    if (delivery) {
      delivery.status = NotificationStatus.FAILED;
      delivery.failedAt = new Date();
      delivery.failureReason = reason;
      this.deliveryTracking!.failedCount++;
    }
  }

  addResponse(recipientId: string, recipientType: string, response: string, comments?: string, attachments?: string[]): void {
    if (!this.responses) {
      this.responses = [];
    }
    this.responses.push({
      recipientId,
      recipientType,
      response: response as any,
      responseAt: new Date(),
      comments,
      attachments
    });
  }

  updateDeliveryTracking(totalRecipients: number): void {
    this.deliveryTracking = {
      totalRecipients,
      sentCount: 0,
      deliveredCount: 0,
      readCount: 0,
      failedCount: 0,
      deliveryDetails: []
    };
  }

  addDeliveryDetail(recipientId: string, recipientType: string, channel: NotificationChannel): void {
    if (!this.deliveryTracking) {
      this.deliveryTracking = {
        totalRecipients: 0,
        sentCount: 0,
        deliveredCount: 0,
        readCount: 0,
        failedCount: 0,
        deliveryDetails: []
      };
    }
    this.deliveryTracking.deliveryDetails.push({
      recipientId,
      recipientType,
      channel,
      status: NotificationStatus.SENT,
      sentAt: new Date()
    });
    this.deliveryTracking.sentCount++;
  }

  setDocumentRequest(requiredDocuments: string[], deadline: Date, format: 'pdf' | 'image' | 'any', instructions?: string): void {
    this.documentRequest = {
      requiredDocuments,
      deadline,
      format,
      instructions
    };
  }

  setFineWarning(amount: number, currency: string, dueDate: Date, reason: string, violationType: string): void {
    this.fineWarning = {
      amount,
      currency,
      dueDate,
      reason,
      violationType
    };
  }

  addAttachment(name: string, url: string, type: string, size: number): void {
    if (!this.attachments) {
      this.attachments = [];
    }
    this.attachments.push({ name, url, type, size });
  }

  addRichContent(images?: string[], videos?: string[], links?: { text: string; url: string }[], buttons?: { text: string; action: string; url?: string }[]): void {
    this.richContent = { images, videos, links, buttons };
  }

  updateAnalytics(openRate: number, clickRate: number, responseRate: number, engagementScore: number, timeToRead: number, timeToRespond: number): void {
    this.analytics = {
      openRate,
      clickRate,
      responseRate,
      engagementScore,
      timeToRead,
      timeToRespond
    };
  }
}

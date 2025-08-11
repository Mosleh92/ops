/**
 * MallOS Enterprise - Work Permit Entity
 * Work permit management for mall operations
 */

import { IsDateString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
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

export enum WorkPermitType {
  HOT_WORK = 'hot_work',
  GENERAL = 'general',
  MAINTENANCE = 'maintenance',
  HEIGHT_WORKS = 'height_works',
  DEMOLITION = 'demolition',
  SERVICE_CLOSURE = 'service_closure',
  TRADING_HOURS = 'trading_hours',
  OTHER = 'other'
}

export enum WorkPermitStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum ApplicantType {
  TENANT = 'tenant',
  CONTRACTOR = 'contractor'
}

export enum JobType {
  MAINTENANCE = 'maintenance',
  REMEDIAL_WORKS = 'remedial_works',
  NEW_WORKS = 'new_works',
  HEIGHT_WORKS = 'height_works',
  SERVICE_CLOSURE = 'service_closure',
  TRADING_HOURS = 'trading_hours',
  DEMOLITION_WORKS = 'demolition_works',
  OTHER = 'other'
}

@Entity('work_permits')
@Index(['permitNumber'], { unique: true })
@Index(['tenantId', 'status'])
@Index(['mallId', 'status'])
export class WorkPermit {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 50, unique: true })
  @IsNotEmpty()
  permitNumber!: string;

  @Column({ type: 'uuid' })
  mallId!: string;

  @Column({ type: 'uuid', nullable: true })
  @IsOptional()
  tenantId?: string;

  @Column({
    type: 'enum',
    enum: WorkPermitType,
    default: WorkPermitType.GENERAL
  })
  @IsEnum(WorkPermitType)
  permitType: WorkPermitType = WorkPermitType.GENERAL;

  @Column({
    type: 'enum',
    enum: WorkPermitStatus,
    default: WorkPermitStatus.PENDING
  })
  @IsEnum(WorkPermitStatus)
  status: WorkPermitStatus = WorkPermitStatus.PENDING;

  @Column({
    type: 'enum',
    enum: ApplicantType,
    default: ApplicantType.TENANT
  })
  @IsEnum(ApplicantType)
  applicantType: ApplicantType = ApplicantType.TENANT;

  // Applicant Information
  @Column({ length: 200 })
  @IsNotEmpty()
  companyName!: string;

  @Column({ length: 200, nullable: true })
  @IsOptional()
  jobLocation?: string;

  @Column({ length: 100 })
  @IsNotEmpty()
  onSiteInCharge!: string;

  @Column({ length: 20 })
  @IsNotEmpty()
  contactNumber!: string;

  @Column({ length: 50, nullable: true })
  @IsOptional()
  refNumber?: string;

  // Job Details
  @Column({ type: 'date' })
  @IsDateString()
  jobDateFrom!: Date;

  @Column({ type: 'date' })
  @IsDateString()
  jobDateTo!: Date;

  @Column({ length: 10 })
  @IsNotEmpty()
  jobTimeFrom!: string;

  @Column({ length: 10 })
  @IsNotEmpty()
  jobTimeTo!: string;

  @Column({
    type: 'enum',
    enum: JobType,
    default: JobType.MAINTENANCE
  })
  @IsEnum(JobType)
  jobType: JobType = JobType.MAINTENANCE;

  @Column({ type: 'text' })
  @IsNotEmpty()
  jobDescription!: string;

  @Column({ length: 100, nullable: true })
  @IsOptional()
  otherJobType?: string;

  // Method Statement
  @Column({ type: 'jsonb', nullable: true })
  methodStatements: {
    submitted: boolean;
    date?: Date;
    documents?: string[];
  }[] = [];

  // Requestor Information
  @Column({ length: 100 })
  @IsNotEmpty()
  requestedByName!: string;

  @Column({ length: 100 })
  @IsNotEmpty()
  requestedByPosition!: string;

  @Column({ length: 255, nullable: true })
  @IsOptional()
  requestedBySignature?: string;

  // Approval Information
  @Column({ type: 'jsonb', nullable: true })
  approvals: {
    facilitiesManagement?: {
      approvedBy?: string;
      approvedAt?: Date;
      comments?: string;
    };
    retailDeliveryManager?: {
      approvedBy?: string;
      approvedAt?: Date;
      comments?: string;
    };
    retailLogisticsTeam?: {
      approvedBy?: string;
      approvedAt?: Date;
      comments?: string;
    };
    marketingSpecialtyLeasing?: {
      approvedBy?: string;
      approvedAt?: Date;
      comments?: string;
    };
    operations?: {
      approvedBy?: string;
      approvedAt?: Date;
      comments?: string;
    };
  } = {};

  // Security Guard Information
  @Column({ type: 'jsonb', nullable: true })
  securityChecks: {
    guardId?: string;
    guardName?: string;
    checkInTime?: Date;
    checkOutTime?: Date;
    inspectionNotes?: string;
    photos?: string[];
    status?: 'pending' | 'in_progress' | 'completed' | 'failed';
  }[] = [];

  // Incident records
  @Column({ type: 'jsonb', nullable: true })
  incidents: any[] = [];

  // Inspection records
  @Column({ type: 'jsonb', nullable: true })
  inspections: any[] = [];

  // Compliance Information
  @Column({ type: 'jsonb', nullable: true })
  compliance: {
    methodStatementSubmitted: boolean;
    riskAssessmentSubmitted: boolean;
    thirdPartyLiabilityInsurance: boolean;
    contractorAllRiskInsurance: boolean;
    safetyInductionCompleted: boolean;
    hseInspectionCompleted: boolean;
    documents: {
      methodStatement?: string;
      riskAssessment?: string;
      insuranceCertificate?: string;
      safetyInductionCertificate?: string;
    };
  } = {
    methodStatementSubmitted: false,
    riskAssessmentSubmitted: false,
    thirdPartyLiabilityInsurance: false,
    contractorAllRiskInsurance: false,
    safetyInductionCompleted: false,
    hseInspectionCompleted: false
  };

  // Work Progress
  @Column({ type: 'jsonb', nullable: true })
  workProgress: {
    startTime?: Date;
    endTime?: Date;
    actualDuration?: number; // in hours
    completionPercentage?: number;
    issues?: string[];
    photos?: string[];
    notes?: string;
  } = {};

  // Safety and Security
  @Column({ type: 'jsonb', nullable: true })
  safetyMeasures: {
    ppeRequired: boolean;
    ppeProvided: boolean;
    fireExtinguishersAvailable: boolean;
    emergencyExitsClear: boolean;
    noiseLevelAcceptable: boolean;
    dustControlMeasures: boolean;
    safetyBarriersInstalled: boolean;
    warningSignsPosted: boolean;
  } = {
    ppeRequired: true,
    ppeProvided: false,
    fireExtinguishersAvailable: false,
    emergencyExitsClear: true,
    noiseLevelAcceptable: true,
    dustControlMeasures: false,
    safetyBarriersInstalled: false,
    warningSignsPosted: false
  };

  // Notifications
  @Column({ type: 'jsonb', nullable: true })
  notifications: {
    sentToTenant: boolean;
    sentToContractor: boolean;
    sentToSecurity: boolean;
    sentToOperations: boolean;
    notificationHistory: {
      type: string;
      sentTo: string[];
      sentAt: Date;
      message: string;
    }[];
  } = {
    sentToTenant: false,
    sentToContractor: false,
    sentToSecurity: false,
    sentToOperations: false,
    notificationHistory: []
  };

  // Audit Information
  @Column({ type: 'jsonb', nullable: true })
  audit: {
    createdBy: string;
    lastModifiedBy?: string;
    approvalHistory: {
      action: string;
      performedBy: string;
      performedAt: Date;
      comments?: string;
    }[];
  };

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  // Virtual properties
  get isApproved(): boolean {
    return this.status === WorkPermitStatus.APPROVED;
  }

  get isPending(): boolean {
    return this.status === WorkPermitStatus.PENDING;
  }

  get isRejected(): boolean {
    return this.status === WorkPermitStatus.REJECTED;
  }

  get isInProgress(): boolean {
    return this.status === WorkPermitStatus.IN_PROGRESS;
  }

  get isCompleted(): boolean {
    return this.status === WorkPermitStatus.COMPLETED;
  }

  get isCompliant(): boolean {
    return (
      this.compliance.methodStatementSubmitted &&
      this.compliance.riskAssessmentSubmitted &&
      this.compliance.thirdPartyLiabilityInsurance &&
      this.compliance.contractorAllRiskInsurance &&
      this.compliance.safetyInductionCompleted &&
      this.compliance.hseInspectionCompleted
    );
  }

  get requiresHotWorkPermit(): boolean {
    return this.permitType === WorkPermitType.HOT_WORK;
  }

  get isExpired(): boolean {
    const now = new Date();
    return now > this.jobDateTo;
  }

  get isActive(): boolean {
    const now = new Date();
    return now >= this.jobDateFrom && now <= this.jobDateTo;
  }

  // Lifecycle hooks
  @BeforeInsert()
  generatePermitNumber(): void {
    if (!this.permitNumber) {
      const prefix = this.permitType === WorkPermitType.HOT_WORK ? 'HWP' : 'GWP';
      this.permitNumber = `${prefix}-${uuidv4().substring(0, 8).toUpperCase()}`;
    }
  }

  // Methods
  approve(approvedBy: string, department: string, comments?: string): void {
    this.status = WorkPermitStatus.APPROVED;
    if (!this.approvals[department as keyof typeof this.approvals]) {
      this.approvals[department as keyof typeof this.approvals] = {};
    }
    this.approvals[department as keyof typeof this.approvals] = {
      approvedBy,
      approvedAt: new Date(),
      comments
    };
  }

  reject(rejectedBy: string, reason: string): void {
    this.status = WorkPermitStatus.REJECTED;
    if (!this.audit) {
      this.audit = { createdBy: '', approvalHistory: [] };
    }
    this.audit.approvalHistory.push({
      action: 'REJECTED',
      performedBy: rejectedBy,
      performedAt: new Date(),
      comments: reason
    });
  }

  startWork(startedBy: string): void {
    this.status = WorkPermitStatus.IN_PROGRESS;
    this.workProgress.startTime = new Date();
    if (!this.audit) {
      this.audit = { createdBy: '', approvalHistory: [] };
    }
    this.audit.approvalHistory.push({
      action: 'WORK_STARTED',
      performedBy: startedBy,
      performedAt: new Date()
    });
  }

  completeWork(completedBy: string, notes?: string): void {
    this.status = WorkPermitStatus.COMPLETED;
    this.workProgress.endTime = new Date();
    this.workProgress.completionPercentage = 100;
    if (notes) {
      this.workProgress.notes = notes;
    }
    if (!this.audit) {
      this.audit = { createdBy: '', approvalHistory: [] };
    }
    this.audit.approvalHistory.push({
      action: 'WORK_COMPLETED',
      performedBy: completedBy,
      performedAt: new Date(),
      comments: notes
    });
  }

  addSecurityCheck(guardId: string, guardName: string, notes?: string, photos?: string[]): void {
    this.securityChecks.push({
      guardId,
      guardName,
      checkInTime: new Date(),
      inspectionNotes: notes,
      photos,
      status: 'completed'
    });
  }

  updateCompliance(type: keyof typeof this.compliance, value: any): void {
    this.compliance[type] = value;
  }

  addNotification(type: string, sentTo: string[], message: string): void {
    this.notifications.notificationHistory.push({
      type,
      sentTo,
      sentAt: new Date(),
      message
    });
  }
}

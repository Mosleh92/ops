export enum CleaningStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum CleaningType {
  REGULAR = 'regular',
  DEEP = 'deep'
}

export enum QualityRating {
  POOR = 'poor',
  AVERAGE = 'average',
  GOOD = 'good',
  EXCELLENT = 'excellent'
}

export class CleaningTask {
  id!: string
  taskNumber!: string
  mallId!: string
  status!: CleaningStatus
  type!: CleaningType
  assignedTo?: string
  scheduledDate?: Date
  completedDate?: Date
  actualDuration?: number
  checklist?: any
  qualityInspection?: any
  title?: string
  description?: string
  createdAt?: Date
  updatedAt?: Date
}

export class CleaningSchedule {
  id!: string
  scheduleNumber!: string
  mallId!: string
  type!: CleaningType
  title!: string
  description?: string
  schedule: any
  isActive!: boolean
  createdAt?: Date
  updatedAt?: Date
}

export class CleaningEquipment {
  id!: string
  name!: string
  mallId!: string
  status!: string
  notes?: string
  createdAt?: Date
  updatedAt?: Date
}

export class CleaningMaterial {
  id!: string
  name!: string
  quantity!: number
  unit!: string
  mallId!: string
  createdAt?: Date
  updatedAt?: Date
}

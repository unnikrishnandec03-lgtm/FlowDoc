export type UserRole = 'citizen' | 'officer' | 'admin';

export type LanguageCode = 'en' | 'ta' | 'hi';

export type ApplicationStatus = 
  | 'UPLOADED'
  | 'AI_PARSED'
  | 'OFFICER_REVIEW'
  | 'ISSUE_FLAGGED'
  | 'RESOLVED_APPROVED'
  | 'REDIRECTED';

export type SlUrgency = 'healthy' | 'warning' | 'breached';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  aadhaarMasked?: string;
  designation?: string;
  departmentId?: string;
  departmentName?: string;
  avatarText: string;
  employeeId?: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  iconName: string;
  headOfficial: string;
  activeOfficersCount: number;
  avgTurnaroundHours: number;
  slaTargetHours: number;
}

export interface ExtractedField {
  label: string;
  key: string;
  value: string;
  confidence: number;
  verified: boolean;
}

export interface ApplicationDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  previewUrl?: string;
  status: 'valid' | 'illegible' | 'verified' | 'pending';
  illegibleReason?: string;
}

export interface TimelineStep {
  id: string;
  titleKey: string;
  descriptionKey: string;
  status: 'completed' | 'current' | 'upcoming' | 'flagged';
  timestamp?: string;
  actor?: string;
}

export interface ApplicationHistoryEntry {
  id: string;
  timestamp: string;
  action: string;
  actorName: string;
  actorRole: UserRole | 'system';
  details: string;
}

export interface Application {
  id: string;
  applicationNumber: string;
  title: string;
  category: string;
  departmentId: string;
  departmentName: string;
  applicantId: string;
  applicantName: string;
  applicantPhone: string;
  applicantAadhaar: string;
  status: ApplicationStatus;
  urgency: SlUrgency;
  submittedAt: string;
  slaDeadline: string; // ISO string
  slaTotalHours: number;
  slaRemainingHours: number;
  assignedOfficerId: string;
  assignedOfficerName: string;
  extractedFields: ExtractedField[];
  documents: ApplicationDocument[];
  aiExplanation?: string;
  flagReason?: string;
  history: ApplicationHistoryEntry[];
}

export interface SlaExtensionRequest {
  id: string;
  applicationId: string;
  applicationNumber: string;
  applicationTitle: string;
  departmentId: string;
  departmentName: string;
  officerId: string;
  officerName: string;
  currentDeadline: string;
  requestedHours: number;
  reason: string;
  status: 'PENDING' | 'GRANTED' | 'DENIED';
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  eventType: 'STATUS_UPDATE' | 'DEPARTMENT_REDIRECT' | 'ISSUE_FLAGGED' | 'SLA_EXTENSION' | 'DOCUMENT_REUPLOAD' | 'APPROVAL';
  applicationId: string;
  applicationNumber: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole | 'system';
  action: string;
  details: string;
  triggerSource: 'PL_SQL_TRIGGER_EVENT' | 'OFFICER_DISCRETION' | 'ADMIN_OVERRIDE' | 'AI_OCR_ENGINE';
}

export interface CitizenNotification {
  id: string;
  userId: string;
  applicationId: string;
  applicationNumber: string;
  title: string;
  message: string;
  type: 'alert' | 'info' | 'success';
  createdAt: string;
  read: boolean;
  requiresAction: boolean;
}

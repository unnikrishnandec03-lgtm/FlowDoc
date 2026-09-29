import {
  User,
  Department,
  Application,
  SlaExtensionRequest,
  AuditLog,
  CitizenNotification
} from '../types/civic';

export const initialUsers: User[] = [
  {
    id: 'usr_cit_01',
    name: 'Priya Sharma',
    role: 'citizen',
    email: 'priya.sharma@civicmail.in',
    phone: '+91 98402 11984',
    aadhaarMasked: 'XXXX-XXXX-4589',
    avatarText: 'PS'
  },
  {
    id: 'usr_off_01',
    name: 'Rajesh Kumar',
    role: 'officer',
    email: 'rajesh.kumar@gov.civicflow.in',
    phone: '+91 94441 55210',
    designation: 'Senior Revenue Inspector & Scrutiny Officer',
    departmentId: 'dept_rev',
    departmentName: 'Revenue & Land Records',
    avatarText: 'RK'
  },
  {
    id: 'usr_off_02',
    name: 'Anita Deshmukh',
    role: 'officer',
    email: 'anita.deshmukh@gov.civicflow.in',
    phone: '+91 98230 44102',
    designation: 'Assistant Town Planner (Building Sanctions)',
    departmentId: 'dept_twn',
    departmentName: 'Building & Town Planning',
    avatarText: 'AD'
  },
  {
    id: 'usr_adm_01',
    name: 'Dr. Aruna Devi, IAS',
    role: 'admin',
    email: 'collector.hq@gov.civicflow.in',
    phone: '+91 94432 00001',
    designation: 'District Collector & Executive Magistrate',
    avatarText: 'AD'
  }
];

export const initialDepartments: Department[] = [
  {
    id: 'dept_rev',
    code: 'REV',
    name: 'Revenue & Land Records',
    iconName: 'Landmark',
    headOfficial: 'Thiru M. Sundaram, DRO',
    activeOfficersCount: 14,
    avgTurnaroundHours: 19.4,
    slaTargetHours: 48
  },
  {
    id: 'dept_twn',
    code: 'TWN',
    name: 'Building & Town Planning',
    iconName: 'Building2',
    headOfficial: 'Er. S. Radhakrishnan, CE',
    activeOfficersCount: 8,
    avgTurnaroundHours: 36.2,
    slaTargetHours: 72
  },
  {
    id: 'dept_wtr',
    code: 'WTR',
    name: 'Municipal Water & Sanitation',
    iconName: 'Droplets',
    headOfficial: 'Ms. G. Meenakshi, SE',
    activeOfficersCount: 11,
    avgTurnaroundHours: 14.8,
    slaTargetHours: 24
  },
  {
    id: 'dept_fcs',
    code: 'FCS',
    name: 'Civil Supplies & Food Welfare',
    iconName: 'ShieldCheck',
    headOfficial: 'K. Balaji, DSO',
    activeOfficersCount: 9,
    avgTurnaroundHours: 12.1,
    slaTargetHours: 24
  },
  {
    id: 'dept_pub',
    code: 'PUB',
    name: 'Public Health & Registrations',
    iconName: 'HeartPulse',
    headOfficial: 'Dr. V. Nithya, CHO',
    activeOfficersCount: 6,
    avgTurnaroundHours: 8.5,
    slaTargetHours: 18
  }
];

export const initialApplications: Application[] = [
  {
    id: 'app_01',
    applicationNumber: 'CF-2026-8941',
    title: 'Land Mutation & Commercial Power NOC',
    category: 'Land Mutation & Ownership Transfer',
    departmentId: 'dept_rev',
    departmentName: 'Revenue & Land Records',
    applicantId: 'usr_cit_01',
    applicantName: 'Priya Sharma',
    applicantPhone: '+91 98402 11984',
    applicantAadhaar: 'XXXX-XXXX-4589',
    status: 'ISSUE_FLAGGED',
    urgency: 'warning',
    submittedAt: '2026-09-23T14:30:00Z',
    slaDeadline: '2026-09-25T14:30:00Z',
    slaTotalHours: 48,
    slaRemainingHours: 9.5,
    assignedOfficerId: 'usr_off_01',
    assignedOfficerName: 'Rajesh Kumar (Senior Revenue Inspector)',
    aiExplanation: 'The uploaded electricity utility bill is illegible. The AI OCR recency detector identified bill billing date as October 14, 2021, breaching the mandatory 90-day validity rule. Consumer number confidence is low (41%). Please upload a current electricity or municipal property tax receipt.',
    flagReason: 'Document illegible and exceeds 90-day statutory recency rule',
    extractedFields: [
      { label: 'Applicant Legal Name', key: 'fullName', value: 'Priya Sharma', confidence: 0.99, verified: true },
      { label: 'Aadhaar Reference', key: 'idNumber', value: 'XXXX-XXXX-4589', confidence: 0.98, verified: true },
      { label: 'Survey / Plot Number', key: 'plotNumber', value: 'Survey No. 214/3B, Ward 12', confidence: 0.96, verified: true },
      { label: 'Document Intent', key: 'intent', value: 'Commercial Mutation & Clearance NOC', confidence: 0.94, verified: true },
      { label: 'Electricity Consumer ID', key: 'meterNo', value: '04-118-092-? (Low Clarity)', confidence: 0.41, verified: false },
      { label: 'Bill Issue Date', key: 'billDate', value: '14-Oct-2021 (Breaches 90-day rule)', confidence: 0.88, verified: false }
    ],
    documents: [
      {
        id: 'doc_01',
        name: 'Sale_Deed_Registered_Doc_2024.pdf',
        type: 'application/pdf',
        size: '3.4 MB',
        uploadedAt: '2026-09-23T14:30:00Z',
        status: 'verified'
      },
      {
        id: 'doc_02',
        name: 'EB_Consumer_Utility_Bill.pdf',
        type: 'application/pdf',
        size: '1.2 MB',
        uploadedAt: '2026-09-23T14:30:00Z',
        status: 'illegible',
        illegibleReason: 'Date stamp 2021 is non-compliant (over 90 days old); barcode smudged.'
      },
      {
        id: 'doc_03',
        name: 'Aadhaar_eKYC_Certificate.pdf',
        type: 'application/pdf',
        size: '840 KB',
        uploadedAt: '2026-09-23T14:30:00Z',
        status: 'verified'
      }
    ],
    history: [
      {
        id: 'hist_01',
        timestamp: '2026-09-23T14:30:00Z',
        action: 'Application Intake',
        actorName: 'Priya Sharma',
        actorRole: 'citizen',
        details: 'Submitted online via Citizen Portal with 3 documents.'
      },
      {
        id: 'hist_02',
        timestamp: '2026-09-23T14:31:12Z',
        action: 'AI Optical Parsing Completed',
        actorName: 'CivicFlow OCR Engine',
        actorRole: 'system',
        details: 'Extracted 6 metadata fields. Flagged doc_02 for low meter confidence (41%) & recency threshold breach.'
      },
      {
        id: 'hist_03',
        timestamp: '2026-09-24T09:15:00Z',
        action: 'Assigned to Desk',
        actorName: 'Routing Dispatcher',
        actorRole: 'system',
        details: 'Assigned to Rajesh Kumar (North Zone Revenue Inspectorate).'
      },
      {
        id: 'hist_04',
        timestamp: '2026-09-24T16:20:00Z',
        action: 'Issue Flagged & Timer Paused',
        actorName: 'Rajesh Kumar',
        actorRole: 'officer',
        details: 'Flagged invalid EB bill. Automated trigger TRG_APP_STATUS_CHANGE pushed alert to citizen.'
      }
    ]
  },
  {
    id: 'app_02',
    applicationNumber: 'CF-2026-8904',
    title: 'G+2 Residential Building Plan Sanction',
    category: 'Building Construction Permit',
    departmentId: 'dept_twn',
    departmentName: 'Building & Town Planning',
    applicantId: 'usr_cit_02',
    applicantName: 'Murugan Ramanathan',
    applicantPhone: '+91 94441 23091',
    applicantAadhaar: 'XXXX-XXXX-7721',
    status: 'OFFICER_REVIEW',
    urgency: 'breached',
    submittedAt: '2026-09-21T10:00:00Z',
    slaDeadline: '2026-09-24T10:00:00Z',
    slaTotalHours: 72,
    slaRemainingHours: -3.2,
    assignedOfficerId: 'usr_off_02',
    assignedOfficerName: 'Anita Deshmukh (Assistant Town Planner)',
    aiExplanation: 'Structural stability calculations verified by AI CAD parser. Front setback meets Master Plan requirements (3.05m measured vs 3.0m required). SLA timer has breached due to awaiting public stormwater drainage clearance.',
    extractedFields: [
      { label: 'Applicant Legal Name', key: 'fullName', value: 'Murugan Ramanathan', confidence: 0.99, verified: true },
      { label: 'Site Address', key: 'siteAddress', value: 'Plot 44, Thiruvalluvar Nagar, Zone 4', confidence: 0.97, verified: true },
      { label: 'Plot Extent', key: 'plotExtent', value: '2,400 sq.ft (Built-up: 4,120 sq.ft)', confidence: 0.95, verified: true },
      { label: 'Architect License No.', key: 'archLicense', value: 'COA/2018/98214', confidence: 0.99, verified: true }
    ],
    documents: [
      {
        id: 'doc_11',
        name: 'Architectural_Blueprint_Plan.dwg.pdf',
        type: 'application/pdf',
        size: '8.2 MB',
        uploadedAt: '2026-09-21T10:00:00Z',
        status: 'verified'
      },
      {
        id: 'doc_12',
        name: 'Structural_Stability_Certificate.pdf',
        type: 'application/pdf',
        size: '1.9 MB',
        uploadedAt: '2026-09-21T10:00:00Z',
        status: 'verified'
      }
    ],
    history: [
      {
        id: 'hist_11',
        timestamp: '2026-09-21T10:00:00Z',
        action: 'Application Intake',
        actorName: 'Murugan Ramanathan',
        actorRole: 'citizen',
        details: 'Submitted with structural calculations.'
      },
      {
        id: 'hist_12',
        timestamp: '2026-09-24T11:00:00Z',
        action: 'SLA Extension Requested',
        actorName: 'Anita Deshmukh',
        actorRole: 'officer',
        details: 'Requested +24 hours extension from District Collector due to storm drain site verification.'
      }
    ]
  },
  {
    id: 'app_03',
    applicationNumber: 'CF-2026-8977',
    title: 'Commercial Water Connection & Drainage NOC',
    category: 'Water Utility Sanction',
    departmentId: 'dept_wtr',
    departmentName: 'Municipal Water & Sanitation',
    applicantId: 'usr_cit_03',
    applicantName: 'Kavita Singhania',
    applicantPhone: '+91 97910 88201',
    applicantAadhaar: 'XXXX-XXXX-1102',
    status: 'OFFICER_REVIEW',
    urgency: 'warning',
    submittedAt: '2026-09-24T08:00:00Z',
    slaDeadline: '2026-09-25T08:00:00Z',
    slaTotalHours: 24,
    slaRemainingHours: 6.2,
    assignedOfficerId: 'usr_off_01',
    assignedOfficerName: 'Rajesh Kumar (Senior Revenue Inspector)',
    aiExplanation: 'Pipe diameter matches commercial load standards (25mm connection). Pipeline proximity verified within 12 meters of municipal feeder trunk.',
    extractedFields: [
      { label: 'Applicant Legal Name', key: 'fullName', value: 'Kavita Singhania', confidence: 0.98, verified: true },
      { label: 'Establishment Name', key: 'companyName', value: 'Singhania Textiles & Retail', confidence: 0.99, verified: true },
      { label: 'Requested Pipe Bore', key: 'pipeSize', value: '25mm Commercial Grade', confidence: 0.95, verified: true }
    ],
    documents: [
      {
        id: 'doc_21',
        name: 'Plumbing_Sanitary_Layout.pdf',
        type: 'application/pdf',
        size: '2.1 MB',
        uploadedAt: '2026-09-24T08:00:00Z',
        status: 'verified'
      }
    ],
    history: [
      {
        id: 'hist_21',
        timestamp: '2026-09-24T08:00:00Z',
        action: 'Application Intake',
        actorName: 'Kavita Singhania',
        actorRole: 'citizen',
        details: 'Commercial water connection applied.'
      }
    ]
  },
  {
    id: 'app_04',
    applicationNumber: 'CF-2026-8991',
    title: 'Ancestral Property Patta Transfer',
    category: 'Land Mutation & Ownership Transfer',
    departmentId: 'dept_rev',
    departmentName: 'Revenue & Land Records',
    applicantId: 'usr_cit_04',
    applicantName: 'Abdul Farooq',
    applicantPhone: '+91 98840 91022',
    applicantAadhaar: 'XXXX-XXXX-6612',
    status: 'AI_PARSED',
    urgency: 'healthy',
    submittedAt: '2026-09-24T18:15:00Z',
    slaDeadline: '2026-09-26T18:15:00Z',
    slaTotalHours: 48,
    slaRemainingHours: 34.0,
    assignedOfficerId: 'usr_off_01',
    assignedOfficerName: 'Rajesh Kumar (Senior Revenue Inspector)',
    aiExplanation: 'Legal heir certificate cross-matched with district registrar records. Zero encumbrance detected over past 30 years.',
    extractedFields: [
      { label: 'Applicant Legal Name', key: 'fullName', value: 'Abdul Farooq', confidence: 0.99, verified: true },
      { label: 'Inheritance Reference', key: 'legalHeirRef', value: 'LHC/2026/0942', confidence: 0.97, verified: true }
    ],
    documents: [
      {
        id: 'doc_31',
        name: 'Legal_Heir_Certificate_Official.pdf',
        type: 'application/pdf',
        size: '1.4 MB',
        uploadedAt: '2026-09-24T18:15:00Z',
        status: 'verified'
      }
    ],
    history: [
      {
        id: 'hist_31',
        timestamp: '2026-09-24T18:15:00Z',
        action: 'Application Intake',
        actorName: 'Abdul Farooq',
        actorRole: 'citizen',
        details: 'Submitted with Legal Heir cert.'
      }
    ]
  },
  {
    id: 'app_05',
    applicationNumber: 'CF-2026-8812',
    title: 'Family Ration Card Member Addition',
    category: 'Civil Welfare & Food Distribution',
    departmentId: 'dept_fcs',
    departmentName: 'Civil Supplies & Food Welfare',
    applicantId: 'usr_cit_01',
    applicantName: 'Priya Sharma',
    applicantPhone: '+91 98402 11984',
    applicantAadhaar: 'XXXX-XXXX-4589',
    status: 'RESOLVED_APPROVED',
    urgency: 'healthy',
    submittedAt: '2026-09-18T11:00:00Z',
    slaDeadline: '2026-09-19T11:00:00Z',
    slaTotalHours: 24,
    slaRemainingHours: 0,
    assignedOfficerId: 'usr_off_01',
    assignedOfficerName: 'Rajesh Kumar',
    aiExplanation: 'Child birth certificate validated with state vital statistics database. e-Ration card generated with QR verification code.',
    extractedFields: [
      { label: 'Applicant Legal Name', key: 'fullName', value: 'Priya Sharma', confidence: 0.99, verified: true },
      { label: 'New Member Name', key: 'newMember', value: 'Aarav Sharma (Son)', confidence: 0.99, verified: true },
      { label: 'Birth Certificate ID', key: 'birthCertNo', value: 'TN-CHE-2025-99824', confidence: 0.99, verified: true }
    ],
    documents: [
      {
        id: 'doc_41',
        name: 'Birth_Certificate_Digitized.pdf',
        type: 'application/pdf',
        size: '950 KB',
        uploadedAt: '2026-09-18T11:00:00Z',
        status: 'verified'
      }
    ],
    history: [
      {
        id: 'hist_41',
        timestamp: '2026-09-18T11:00:00Z',
        action: 'Application Intake',
        actorName: 'Priya Sharma',
        actorRole: 'citizen',
        details: 'Application submitted.'
      },
      {
        id: 'hist_42',
        timestamp: '2026-09-18T17:30:00Z',
        action: 'Approved & Sealed',
        actorName: 'K. Balaji (DSO)',
        actorRole: 'officer',
        details: 'Approved in 6.5 hours. Certificate dispatched via SMS.'
      }
    ]
  }
];

export const initialSlaExtensionRequests: SlaExtensionRequest[] = [
  {
    id: 'sla_req_01',
    applicationId: 'app_02',
    applicationNumber: 'CF-2026-8904',
    applicationTitle: 'G+2 Residential Building Plan Sanction',
    departmentId: 'dept_twn',
    departmentName: 'Building & Town Planning',
    officerId: 'usr_off_02',
    officerName: 'Anita Deshmukh (Assistant Town Planner)',
    currentDeadline: '2026-09-24T10:00:00Z',
    requestedHours: 24,
    reason: 'Heavy rain flooded storm drain alignment. Physical site visit rescheduled for morning to inspect 1.5m buffer.',
    status: 'PENDING',
    createdAt: '2026-09-24T11:00:00Z'
  },
  {
    id: 'sla_req_02',
    applicationId: 'app_03',
    applicationNumber: 'CF-2026-8977',
    applicationTitle: 'Commercial Water Connection & Drainage NOC',
    departmentId: 'dept_wtr',
    departmentName: 'Municipal Water & Sanitation',
    officerId: 'usr_off_01',
    officerName: 'Rajesh Kumar (Senior Inspector)',
    currentDeadline: '2026-09-25T08:00:00Z',
    requestedHours: 12,
    reason: 'Feeder trunk pressure inspection requires coordinating with central pumping station during off-peak night cycle.',
    status: 'PENDING',
    createdAt: '2026-09-24T17:20:00Z'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'audit_01',
    timestamp: '2026-09-24T16:20:00Z',
    eventType: 'ISSUE_FLAGGED',
    applicationId: 'app_01',
    applicationNumber: 'CF-2026-8941',
    actorId: 'usr_off_01',
    actorName: 'Rajesh Kumar',
    actorRole: 'officer',
    action: 'Flagged Utility Bill Discrepancy & Paused SLA',
    details: 'Utility bill dated 2021 violates 90-day validity rule. PL/SQL Trigger TRG_APP_STATUS_CHANGE executed: inserted audit record & queued SMS alert to Priya Sharma.',
    triggerSource: 'PL_SQL_TRIGGER_EVENT'
  },
  {
    id: 'audit_02',
    timestamp: '2026-09-24T11:00:00Z',
    eventType: 'SLA_EXTENSION',
    applicationId: 'app_02',
    applicationNumber: 'CF-2026-8904',
    actorId: 'usr_off_02',
    actorName: 'Anita Deshmukh',
    actorRole: 'officer',
    action: 'Requested SLA Deadline Extension (+24h)',
    details: 'Forwarded to District Collector dashboard for stormwater alignment on-site verification.',
    triggerSource: 'OFFICER_DISCRETION'
  },
  {
    id: 'audit_03',
    timestamp: '2026-09-24T09:15:00Z',
    eventType: 'STATUS_UPDATE',
    applicationId: 'app_01',
    applicationNumber: 'CF-2026-8941',
    actorId: 'system',
    actorName: 'Auto Dispatcher',
    actorRole: 'system',
    action: 'Dispatched to Officer Desk',
    details: 'Dispatched to Officer Desk (Rajesh Kumar, Zone North).',
    triggerSource: 'AI_OCR_ENGINE'
  },
  {
    id: 'audit_04',
    timestamp: '2026-09-23T14:31:12Z',
    eventType: 'STATUS_UPDATE',
    applicationId: 'app_01',
    applicationNumber: 'CF-2026-8941',
    actorId: 'system',
    actorName: 'CivicFlow OCR Engine',
    actorRole: 'system',
    action: 'AI Optical Parsing & Validation',
    details: 'AI parsed 6 parameters. High confidence on Aadhaar (98%) and Survey (96%). Low confidence on Meter (41%).',
    triggerSource: 'AI_OCR_ENGINE'
  },
  {
    id: 'audit_05',
    timestamp: '2026-09-18T17:30:00Z',
    eventType: 'APPROVAL',
    applicationId: 'app_05',
    applicationNumber: 'CF-2026-8812',
    actorId: 'usr_off_01',
    actorName: 'Rajesh Kumar',
    actorRole: 'officer',
    action: 'Final Approval & Digital Seal Generated',
    details: 'Ration card addition approved within 6.5 hours (SLA compliance 100%).',
    triggerSource: 'OFFICER_DISCRETION'
  }
];

export const initialNotifications: CitizenNotification[] = [
  {
    id: 'notif_01',
    userId: 'usr_cit_01',
    applicationId: 'app_01',
    applicationNumber: 'CF-2026-8941',
    title: 'Action Required: Re-upload Utility Bill',
    message: 'Your application CF-2026-8941 was flagged by Officer Rajesh Kumar: The uploaded electricity bill is from Oct 2021 (violates the 90-day recency rule). Please upload a recent bill to resume processing.',
    type: 'alert',
    createdAt: '2026-09-24T16:20:00Z',
    read: false,
    requiresAction: true
  },
  {
    id: 'notif_02',
    userId: 'usr_cit_01',
    applicationId: 'app_05',
    applicationNumber: 'CF-2026-8812',
    title: 'Application Approved: Ration Card Updated',
    message: 'Your family member addition request has been sanctioned with statutory digital seal. Certificate is ready to download.',
    type: 'success',
    createdAt: '2026-09-18T17:30:00Z',
    read: true,
    requiresAction: false
  }
];

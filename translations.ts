import { LanguageCode } from '../types/civic';

export interface Translations {
  appName: string;
  tagline: string;
  switchRole: string;
  persona: string;
  notifications: string;
  noNotifications: string;
  markAllRead: string;
  
  // Roles
  roleCitizen: string;
  roleOfficer: string;
  roleAdmin: string;
  
  // Navigation
  navCitizenPortal: string;
  navOfficerDesk: string;
  navCommandCenter: string;
  navAuditLogs: string;
  
  // Statuses
  statusUploaded: string;
  statusAiParsed: string;
  statusOfficerReview: string;
  statusIssueFlagged: string;
  statusResolvedApproved: string;
  statusRedirected: string;
  
  // SLA Urgency
  slaHealthy: string;
  slaWarning: string;
  slaBreached: string;
  hoursRemaining: string;
  overdueBy: string;
  slaDeadline: string;
  
  // Citizen Portal (Wizard)
  citizenPortalTitle: string;
  citizenPortalSubtitle: string;
  activeApplication: string;
  applicationHistory: string;
  dfdTitle: string;
  dfdSubtitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;
  aiDiagnosisTitle: string;
  actionRequiredTitle: string;
  uploadNewDoc: string;
  dragDropText: string;
  browseFiles: string;
  docSupported: string;
  reuploadDocument: string;
  reuploadSuccess: string;
  authBadgeTitle: string;
  authBadgeDesc: string;
  changePersonaNotice: string;
  
  // Officer Desk (Hub-and-Spoke)
  officerDeskTitle: string;
  officerDeskSubtitle: string;
  queueOverview: string;
  searchPlaceholder: string;
  filterDepartment: string;
  filterUrgency: string;
  allDepartments: string;
  allUrgencies: string;
  colAppNumber: string;
  colApplicant: string;
  colDepartment: string;
  colStatus: string;
  colSlaTime: string;
  colAction: string;
  viewDrawer: string;
  drawerTitle: string;
  docPreviewTab: string;
  extractedJsonTab: string;
  timelineTab: string;
  confidenceScore: string;
  btnUpdateProgress: string;
  btnRedirectDept: string;
  btnInformIssue: string;
  btnRequestExtension: string;
  
  // Action Modals
  approveConfirmTitle: string;
  approveConfirmDesc: string;
  redirectModalTitle: string;
  selectTargetDept: string;
  redirectReasonLabel: string;
  informIssueTitle: string;
  informIssueDesc: string;
  aiSuggestedNotice: string;
  requestExtensionTitle: string;
  additionalHours: string;
  extensionReason: string;
  submitAction: string;
  cancelAction: string;
  
  // Higher Official (Command Center)
  commandCenterTitle: string;
  commandCenterSubtitle: string;
  metricSlaCompliance: string;
  metricAvgResolution: string;
  metricTotalBreached: string;
  metricActiveQueue: string;
  slaExtensionsQueue: string;
  slaExtensionsDesc: string;
  colRequestedBy: string;
  colCurrentDeadline: string;
  colExtensionHours: string;
  colJustification: string;
  btnGrant: string;
  btnDeny: string;
  deptBottlenecks: string;
  auditTrailTitle: string;
  auditTrailDesc: string;
  filterTriggersOnly: string;
  allAudits: string;
  systemTriggerBadge: string;
}

export const translations: Record<LanguageCode, Translations> = {
  en: {
    appName: "FlowDoc",
    tagline: "Rapid Civic Resolution & SLA Intelligence",
    switchRole: "Switch Persona",
    persona: "Current Role",
    notifications: "Civic Alerts",
    noNotifications: "No new automated notifications",
    markAllRead: "Mark all as read",
    
    roleCitizen: "Citizen Portal",
    roleOfficer: "Officer Desk",
    roleAdmin: "District Command Center",
    
    navCitizenPortal: "Citizen Portal (Wizard)",
    navOfficerDesk: "Officer Desk (Queue)",
    navCommandCenter: "Admin Command Center",
    navAuditLogs: "Audit & Event Logs",
    
    statusUploaded: "Uploaded",
    statusAiParsed: "AI Parsed",
    statusOfficerReview: "Officer Desk",
    statusIssueFlagged: "Issue Flagged",
    statusResolvedApproved: "Approved & Issued",
    statusRedirected: "Redirected",
    
    slaHealthy: "Healthy",
    slaWarning: "Urgent (<12h)",
    slaBreached: "Breached",
    hoursRemaining: "hrs left",
    overdueBy: "hrs overdue",
    slaDeadline: "Statutory SLA Deadline",
    
    citizenPortalTitle: "Citizen Grievance & Application Wizard",
    citizenPortalSubtitle: "Real-time transparent document tracking with automated AI verification",
    activeApplication: "Active Application",
    applicationHistory: "Previous Records",
    dfdTitle: "Application DFD Progress Tracker",
    dfdSubtitle: "End-to-end data lifecycle from submission to administrative seal",
    step1Title: "1. Document Uploaded",
    step1Desc: "Application intake complete. Encrypted records stored.",
    step2Title: "2. AI Optical Parsing",
    step2Desc: "AI extracted fields, recency validation, and duplicate checks.",
    step3Title: "3. Officer Desk Assessment",
    step3Desc: "Senior municipal officer verification in progress.",
    step4Title: "4. Approval & Seal",
    step4Desc: "Statutory certificate generated with digital signature.",
    aiDiagnosisTitle: "AI Automated Diagnosis & Explanation",
    actionRequiredTitle: "Immediate Action Required",
    uploadNewDoc: "Upload Corrected Document",
    dragDropText: "Drag & drop your updated PDF, JPG or PNG here, or browse files",
    browseFiles: "Select Document",
    docSupported: "Supported: PDF, JPG, PNG (Max 15MB). Recency rule: within last 90 days.",
    reuploadDocument: "Verify & Submit Correction",
    reuploadSuccess: "New document uploaded and auto-validated by AI parser!",
    authBadgeTitle: "Aadhaar & e-KYC Verified",
    authBadgeDesc: "Citizen identity authenticated via Mobile OTP sandbox",
    changePersonaNotice: "Use the top right selector to test other administrative viewpoints.",
    
    officerDeskTitle: "Municipal Officer Desk",
    officerDeskSubtitle: "Urgency-indexed application triage, automated schema validation, and rapid actioning",
    queueOverview: "Pending Work Queue",
    searchPlaceholder: "Search by App ID, citizen name, or Aadhaar...",
    filterDepartment: "Department",
    filterUrgency: "SLA Urgency",
    allDepartments: "All Departments",
    allUrgencies: "All Urgency Levels",
    colAppNumber: "Application ID",
    colApplicant: "Citizen Name",
    colDepartment: "Department",
    colStatus: "Pipeline Stage",
    colSlaTime: "SLA Countdown",
    colAction: "Actions",
    viewDrawer: "Inspect Case",
    drawerTitle: "Application Action Drawer",
    docPreviewTab: "Document Preview",
    extractedJsonTab: "AI Extracted Fields",
    timelineTab: "Audit & History",
    confidenceScore: "AI Parsing Confidence",
    btnUpdateProgress: "Approve / Pass Stage",
    btnRedirectDept: "Redirect Department",
    btnInformIssue: "Inform Issue (Flag)",
    btnRequestExtension: "Request SLA Extension",
    
    approveConfirmTitle: "Approve and Seal Application",
    approveConfirmDesc: "This will officially grant the certificate or civic clearance. An automated SMS/WhatsApp trigger will dispatch credentials to the citizen.",
    redirectModalTitle: "Redirect Application to Another Department",
    selectTargetDept: "Select Destination Department",
    redirectReasonLabel: "Official reason for jurisdictional transfer",
    informIssueTitle: "Flag Discrepancy & Halt SLA Timer",
    informIssueDesc: "This triggers an automated PL/SQL database event: an Audit Log entry is created and the citizen receives an urgent alert with instructions.",
    aiSuggestedNotice: "AI Synthesized Citizen Explanation:",
    requestExtensionTitle: "Formal Request for SLA Extension",
    additionalHours: "Additional hours required",
    extensionReason: "Official justification for Higher Official review",
    submitAction: "Confirm & Execute",
    cancelAction: "Cancel",
    
    commandCenterTitle: "Administrative Command Center",
    commandCenterSubtitle: "District-level governance, SLA statutory compliance, and trigger monitoring",
    metricSlaCompliance: "SLA Compliance Rate",
    metricAvgResolution: "Avg Resolution Time",
    metricTotalBreached: "Breached SLA Cases",
    metricActiveQueue: "Total Active Queue",
    slaExtensionsQueue: "Pending SLA Extension Requests",
    slaExtensionsDesc: "Review and grant additional time for complex field verifications",
    colRequestedBy: "Requested By",
    colCurrentDeadline: "Current Deadline",
    colExtensionHours: "Extension",
    colJustification: "Officer Justification",
    btnGrant: "Grant Time",
    btnDeny: "Deny",
    deptBottlenecks: "Departmental Resolution Velocity",
    auditTrailTitle: "Real-time Event & Audit Log",
    auditTrailDesc: "Live telemetry of administrative actions and PL/SQL automated triggers",
    filterTriggersOnly: "Show Automated Triggers Only",
    allAudits: "All Audit Records",
    systemTriggerBadge: "PL/SQL TRIGGER"
  },
  ta: {
    appName: "ப்ளோடாக் (FlowDoc)",
    tagline: "விரைவான பொதுமக்கள் தீர்வு மற்றும் சேவைத்தரக் கண்காணிப்பு",
    switchRole: "பயனர் பங்கை மாற்றவும்",
    persona: "தற்போதைய பொறுப்பு",
    notifications: "அறிவிப்புகள்",
    noNotifications: "புதிய அறிவிப்புகள் இல்லை",
    markAllRead: "அனைத்தையும் படித்ததாகக் குறிக்கவும்",
    
    roleCitizen: "பொதுமக்கள் தளம்",
    roleOfficer: "அலுவலர் பணிமேசை",
    roleAdmin: "மாவட்ட கட்டளை மையம்",
    
    navCitizenPortal: "பொதுமக்கள் தளம் (வழிகாட்டி)",
    navOfficerDesk: "அலுவலர் பணிமேசை",
    navCommandCenter: "நிர்வாக கட்டளை மையம்",
    navAuditLogs: "தணிக்கை பதிவேடு",
    
    statusUploaded: "பதிவேற்றப்பட்டது",
    statusAiParsed: "AI பகுப்பாய்வு முடிந்தது",
    statusOfficerReview: "அலுவலர் பரிசீலனை",
    statusIssueFlagged: "பிழை சுட்டிக்காட்டப்பட்டது",
    statusResolvedApproved: "ஒப்புதல் அளிக்கப்பட்டது",
    statusRedirected: "வேறு துறைக்கு மாற்றப்பட்டது",
    
    slaHealthy: "இயல்பானது",
    slaWarning: "அவசரம் (<12 மணி)",
    slaBreached: "காலக்கெடு கடந்தது",
    hoursRemaining: "மணிநேரம் மீதம்",
    overdueBy: "மணிநேரம் தாமதம்",
    slaDeadline: "சட்டபூர்வ காலக்கெடு",
    
    citizenPortalTitle: "பொதுமக்கள் குறைதீர்ப்பு மற்றும் விண்ணப்ப வழிகாட்டி",
    citizenPortalSubtitle: "நேரலை வெளிப்படைத்தன்மையுடன் தானியங்கி AI ஆவண சரிபார்ப்பு",
    activeApplication: "தற்போதைய விண்ணப்பம்",
    applicationHistory: "முந்தைய பதிவுகள்",
    dfdTitle: "விண்ணப்ப முன்னேற்ற வரைபடம் (DFD)",
    dfdSubtitle: "சமர்ப்பிப்பு முதல் இறுதி அரசு ஒப்புதல் வரையிலான நேரலை கண்காணிப்பு",
    step1Title: "1. ஆவணம் பதிவேற்றப்பட்டது",
    step1Desc: "விண்ணப்பம் பெறப்பட்டு மறைகுறியாக்கப்பட்ட ஆவணங்கள் சேமிக்கப்பட்டன.",
    step2Title: "2. AI கணினி பகுப்பாய்வு",
    step2Desc: "AI ஆவண விவரங்கள், செல்லுபடியாகும் தேதி மற்றும் நகல் சோதனையை முடித்தது.",
    step3Title: "3. துறை அலுவலர் பரிசீலனை",
    step3Desc: "நகராட்சி மூத்த அலுவலர் சரிபார்த்துக் கொண்டிருக்கிறார்.",
    step4Title: "4. சான்றிதழ் ஒப்புதல்",
    step4Desc: "டிஜிட்டல் கையொப்பமிட்ட அதிகாரப்பூர்வ சான்றிதழ் உருவாக்கப்பட்டது.",
    aiDiagnosisTitle: "AI தானியங்கி பகுப்பாய்வு விளக்கம்",
    actionRequiredTitle: "உடனடி நடவடிக்கை தேவை",
    uploadNewDoc: "திருத்தப்பட்ட ஆவணத்தை பதிவேற்றவும்",
    dragDropText: "உங்கள் புதிய PDF அல்லது படத்தை இங்கே இழுத்துப் போடவும் அல்லது தேர்வு செய்யவும்",
    browseFiles: "கோப்பைத் தேர்ந்தெடுக்கவும்",
    docSupported: "ஆதரிக்கப்படும் வடிவங்கள்: PDF, JPG, PNG (அதிகபட்சம் 15MB). 90 நாட்களுக்குள் எடுக்கப்பட்டவை.",
    reuploadDocument: "சரிபார்த்து மீண்டும் சமர்ப்பிக்கவும்",
    reuploadSuccess: "புதிய ஆவணம் வெற்றிகரமாக பதிவேற்றப்பட்டு AI ஆல் சரிபார்க்கப்பட்டது!",
    authBadgeTitle: "ஆதார் மற்றும் e-KYC சரிபார்க்கப்பட்டது",
    authBadgeDesc: "மொபைல் OTP மூலம் பயனர் அடையாளம் உறுதிசெய்யப்பட்டது",
    changePersonaNotice: "அலுவலர் மற்றும் நிர்வாகி பார்வையை சோதிக்க மேல் வலது தேர்வைப் பயன்படுத்தவும்.",
    
    officerDeskTitle: "நகராட்சி அலுவலர் பணிமேசை",
    officerDeskSubtitle: "காலக்கெடு முன்னுரிமை வரிசைப்படுத்தல் மற்றும் விரைவான தீர்வு மேடை",
    queueOverview: "நிலுவையில் உள்ள விண்ணப்பங்கள்",
    searchPlaceholder: "விண்ணப்ப எண் அல்லது குடிமகன் பெயர் மூலம் தேடவும்...",
    filterDepartment: "துறை",
    filterUrgency: "அவசர நிலை",
    allDepartments: "அனைத்து துறைகளும்",
    allUrgencies: "அனைத்து நிலைகளும்",
    colAppNumber: "விண்ணப்ப எண்",
    colApplicant: "விண்ணப்பதாரர் பெயர்",
    colDepartment: "துறை",
    colStatus: "தற்போதைய நிலை",
    colSlaTime: "காலக்கெடு",
    colAction: "நடவடிக்கைகள்",
    viewDrawer: "வழக்கை ஆராய்க",
    drawerTitle: "விண்ணப்ப விவரங்கள் மற்றும் தீர்வுப் பலகை",
    docPreviewTab: "ஆவணப் பார்வை",
    extractedJsonTab: "AI பிரித்தெடுத்த தரவுகள்",
    timelineTab: "வரலாறு மற்றும் தணிக்கை",
    confidenceScore: "AI சரிபார்ப்பு துல்லியம்",
    btnUpdateProgress: "அங்கீகரித்து அடுத்த நிலைக்கு நகர்த்தவும்",
    btnRedirectDept: "வேறு துறைக்கு மாற்றுக",
    btnInformIssue: "குறைபாட்டைத் தெரிவிக்கவும்",
    btnRequestExtension: "காலநீட்டிப்பு கோருக",
    
    approveConfirmTitle: "விண்ணப்பத்தை அங்கீகரிக்கவும்",
    approveConfirmDesc: "இது அதிகாரப்பூர்வ ஒப்புதலை வழங்கும் மற்றும் குடிமகனுக்கு உடனடியாக எஸ்எம்எஸ் அனுப்பும்.",
    redirectModalTitle: "விண்ணப்பத்தை வேறு துறைக்கு மாற்றுதல்",
    selectTargetDept: "இலக்குத் துறையைத் தேர்ந்தெடுக்கவும்",
    redirectReasonLabel: "துறை மாற்றத்திற்கான அதிகாரப்பூர்வ காரணம்",
    informIssueTitle: "பிழையைச் சுட்டிக்காட்டி காலக்கெடுவை நிறுத்துக",
    informIssueDesc: "இது ஒரு தானியங்கி தூண்டுதலை இயக்கி தணிக்கைப் பதிவேட்டில் சேர்த்து குடிமகனுக்கு எச்சரிக்கை அனுப்பும்.",
    aiSuggestedNotice: "AI பரிந்துரைத்த குடிமகன் விளக்கம்:",
    requestExtensionTitle: "காலநீட்டிப்புக்கான முறையான கோரிக்கை",
    additionalHours: "தேவைப்படும் கூடுதல் மணிநேரம்",
    extensionReason: "மாவட்ட ஆட்சியரின் பரிசீலனைக்கான காரணம்",
    submitAction: "உறுதிசெய்து செயல்படுத்துக",
    cancelAction: "ரத்து செய்",
    
    commandCenterTitle: "மாவட்ட நிர்வாக கட்டளை மையம்",
    commandCenterSubtitle: "முழு மாவட்ட அளவிலான சேவைத்தரக் கண்காணிப்பு மற்றும் தானியங்கி கண்காணிப்பு மையம்",
    metricSlaCompliance: "SLA காலக்கெடு இணக்க விகிதம்",
    metricAvgResolution: "சராசரி தீர்வு நேரம்",
    metricTotalBreached: "காலக்கெடு மீறிய வழக்குகள்",
    metricActiveQueue: "மொத்த நிலுவை வழக்குகள்",
    slaExtensionsQueue: "காலநீட்டிப்புக் கோரிக்கைகள்",
    slaExtensionsDesc: "கள ஆய்வு தேவைப்படும் சிக்கலான வழக்குகளுக்கு கூடுதல் கால அவகாசம் வழங்கவும்",
    colRequestedBy: "கோரிய அலுவலர்",
    colCurrentDeadline: "தற்போதைய காலக்கெடு",
    colExtensionHours: "கூடுதல் நேரம்",
    colJustification: "அலுவலர் விளக்கம்",
    btnGrant: "அனுமதிக்க",
    btnDeny: "நிராகரி",
    deptBottlenecks: "துறைவாரியான தீர்வு வேகம்",
    auditTrailTitle: "நேரலை நிகழ்வு மற்றும் தணிக்கைப் பதிவு",
    auditTrailDesc: "நிர்வாக நடவடிக்கைகள் மற்றும் PL/SQL தானியங்கி தூண்டுதல்களின் நேரலை பதிவேடு",
    filterTriggersOnly: "தானியங்கி தூண்டுதல்களை மட்டும் காட்டு",
    allAudits: "அனைத்து பதிவுகளும்",
    systemTriggerBadge: "தானியங்கி தூண்டுதல்"
  },
  hi: {
    appName: "फ़्लोडॉक (FlowDoc)",
    tagline: "त्वरित नागरिक निवारण एवं एसएलए इंटेलिजेंस",
    switchRole: "भूमिका बदलें",
    persona: "वर्तमान भूमिका",
    notifications: "नागरिक अलर्ट",
    noNotifications: "कोई नई सूचना नहीं है",
    markAllRead: "सभी को पढ़ा हुआ चिन्हित करें",
    
    roleCitizen: "नागरिक पोर्टल",
    roleOfficer: "अधिकारी डेस्क",
    roleAdmin: "जिला कमांड सेंटर",
    
    navCitizenPortal: "नागरिक पोर्टल (विजार्ड)",
    navOfficerDesk: "अधिकारी डेस्क (कतार)",
    navCommandCenter: "प्रशासनिक कमांड सेंटर",
    navAuditLogs: "ऑडिट एवं इवेंट लॉग",
    
    statusUploaded: "अपलोड किया गया",
    statusAiParsed: "AI विश्लेषित",
    statusOfficerReview: "अधिकारी समीक्षा",
    statusIssueFlagged: "समस्या चिन्हित",
    statusResolvedApproved: "स्वीकृत एवं जारी",
    statusRedirected: "पुनर्निर्देशित",
    
    slaHealthy: "संतोषजनक",
    slaWarning: "अतिशीघ्र (<12 घंटे)",
    slaBreached: "समय-सीमा समाप्त",
    hoursRemaining: "घंटे शेष",
    overdueBy: "घंटे विलंब",
    slaDeadline: "वैधानिक समय सीमा",
    
    citizenPortalTitle: "नागरिक शिकायत एवं आवेदन विजार्ड",
    citizenPortalSubtitle: "स्वचालित AI दस्तावेज़ सत्यापन के साथ पारदर्शी रियल-टाइम ट्रैकिंग",
    activeApplication: "सक्रिय आवेदन",
    applicationHistory: "पूर्व आवेदन",
    dfdTitle: "आवेदन प्रगति डेटा फ्लो डायग्राम (DFD)",
    dfdSubtitle: "दस्तावेज़ जमा करने से लेकर आधिकारिक मुहर तक की सीधी ट्रैकिंग",
    step1Title: "1. दस्तावेज़ अपलोड",
    step1Desc: "आवेदन स्वीकार किया गया, एन्क्रिप्टेड रिकॉर्ड सुरक्षित।",
    step2Title: "2. AI ऑप्टिकल पार्सिंग",
    step2Desc: "AI द्वारा फ़ील्ड निष्कर्षण, वैधता जांच व डुप्लिकेट सत्यापन पूर्ण।",
    step3Title: "3. अधिकारी डेस्क समीक्षा",
    step3Desc: "संबंधित नगरपालिका अधिकारी द्वारा भौतिक/डिजिटल सत्यापन जारी।",
    step4Title: "4. स्वीकृति एवं डिजिटल मुहर",
    step4Desc: "डिजिटल हस्ताक्षरित वैधानिक प्रमाण पत्र उत्पन्न।",
    aiDiagnosisTitle: "AI स्वचालित विश्लेषण एवं कारण",
    actionRequiredTitle: "तत्काल कार्रवाई आवश्यक",
    uploadNewDoc: "संशोधित दस्तावेज़ अपलोड करें",
    dragDropText: "अपना संशोधित PDF या JPG यहाँ खींचें या फ़ाइल चुनें",
    browseFiles: "दस्तावेज़ चुनें",
    docSupported: "समर्थित: PDF, JPG, PNG (अधिकतम 15MB)। पिछले 90 दिनों का होना अनिवार्य।",
    reuploadDocument: "सत्यापित कर पुनः जमा करें",
    reuploadSuccess: "नया दस्तावेज़ सफलतापूर्वक अपलोड व AI द्वारा सत्यापित किया गया!",
    authBadgeTitle: "आधार एवं e-KYC सत्यापित",
    authBadgeDesc: "मोबाइल OTP द्वारा नागरिक पहचान प्रमाणित",
    changePersonaNotice: "अधिकारी एवं प्रशासनिक दृष्टिकोण जांचने हेतु ऊपर दाईं ओर चयनकर्ता का उपयोग करें।",
    
    officerDeskTitle: "नगरपालिका अधिकारी डेस्क",
    officerDeskSubtitle: "एसएलए तात्कालिकता अनुक्रमित कतार, त्वरित डेटा पार्सिंग एवं समाधान प्रणाली",
    queueOverview: "लंबित कार्य सूची",
    searchPlaceholder: "आवेदन संख्या, नागरिक का नाम या आधार से खोजें...",
    filterDepartment: "विभाग",
    filterUrgency: "एसएलए तत्परता",
    allDepartments: "सभी विभाग",
    allUrgencies: "सभी स्तर",
    colAppNumber: "आवेदन संख्या",
    colApplicant: "नागरिक का नाम",
    colDepartment: "विभाग",
    colStatus: "वर्तमान चरण",
    colSlaTime: "समय-सीमा उलटी गिनती",
    colAction: "कार्रवाई",
    viewDrawer: "केस का निरीक्षण करें",
    drawerTitle: "आवेदन कार्रवाई ड्रॉअर",
    docPreviewTab: "दस्तावेज़ पूर्वावलोकन",
    extractedJsonTab: "AI निष्कर्षित डेटा",
    timelineTab: "इतिहास एवं ऑडिट",
    confidenceScore: "AI सत्यापन विश्वसनीयता",
    btnUpdateProgress: "स्वीकृत कर अगले चरण में भेजें",
    btnRedirectDept: "विभाग पुनर्निर्देशित करें",
    btnInformIssue: "आपत्ति दर्ज करें (फ्लैग)",
    btnRequestExtension: "अतिरिक्त समय मांगें",
    
    approveConfirmTitle: "आवेदन स्वीकृत एवं अधिकृत करें",
    approveConfirmDesc: "यह आधिकारिक प्रमाण पत्र जारी करेगा एवं नागरिक को तुरंत SMS अलर्ट भेजेगा।",
    redirectModalTitle: "आवेदन को अन्य संबंधित विभाग में भेजें",
    selectTargetDept: "गंतव्य विभाग चुनें",
    redirectReasonLabel: "विभाग परिवर्तन का आधिकारिक कारण",
    informIssueTitle: "समस्या चिन्हित कर एसएलए टाइमर रोकें",
    informIssueDesc: "यह एक स्वचालित PL/SQL डेटाबेस ट्रिगर चलाएगा जिससे ऑडिट लॉग बनेगा और नागरिक को तत्काल सूचना मिलेगी।",
    aiSuggestedNotice: "AI द्वारा तैयार नागरिक स्पष्टीकरण:",
    requestExtensionTitle: "एसएलए समय सीमा विस्तार का अनुरोध",
    additionalHours: "आवश्यक अतिरिक्त घंटे",
    extensionReason: "जिलाधिकारी के अवलोकन हेतु कारण",
    submitAction: "पुष्टि कर लागू करें",
    cancelAction: "रद्द करें",
    
    commandCenterTitle: "प्रशासनिक कमांड सेंटर",
    commandCenterSubtitle: "जिला स्तरीय गवर्नेंस, एसएलए अनुपालन और स्वचालित ट्रिगर नियंत्रण प्रणाली",
    metricSlaCompliance: "समय-सीमा अनुपालन दर",
    metricAvgResolution: "औसत समाधान समय",
    metricTotalBreached: "समय-सीमा समाप्त मामले",
    metricActiveQueue: "कुल सक्रिय कतार",
    slaExtensionsQueue: "लंबित समय विस्तार अनुरोध",
    slaExtensionsDesc: "जटिल मामलों के लिए अधिकारियों द्वारा मांगे गए अतिरिक्त समय की समीक्षा करें",
    colRequestedBy: "अनुरोधकर्ता अधिकारी",
    colCurrentDeadline: "मौजूदा समय-सीमा",
    colExtensionHours: "अतिरिक्त समय",
    colJustification: "अधिकारी का तर्क",
    btnGrant: "स्वीकार करें",
    btnDeny: "अस्वीकार करें",
    deptBottlenecks: "विभागीय समाधान गति",
    auditTrailTitle: "लाइव इवेंट एवं ऑडिट लॉग",
    auditTrailDesc: "प्रशासनिक क्रियाकलापों एवं PL/SQL स्वचालित ट्रिगर्स की लाइव टेलीमेट्री",
    filterTriggersOnly: "केवल स्वचालित ट्रिगर्स दिखाएं",
    allAudits: "सभी ऑडिट रिकॉर्ड्स",
    systemTriggerBadge: "स्वचालित ट्रिगर"
  }
};

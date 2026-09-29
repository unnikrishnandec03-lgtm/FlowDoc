import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Department,
  Application,
  ApplicationDocument,
  SlaExtensionRequest,
  AuditLog,
  CitizenNotification,
  LanguageCode
} from '../types/civic';
import {
  initialUsers,
  initialDepartments,
  initialApplications,
  initialSlaExtensionRequests,
  initialAuditLogs,
  initialNotifications
} from '../data/mockData';
import { auth, googleProvider } from '../lib/firebase';
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import {
  seedFirestoreIfEmpty,
  subscribeApplications,
  subscribeAuditLogs,
  subscribeSlaExtensions,
  subscribeNotifications,
  saveUserToFirestore,
  updateApplicationInFirestore,
  addAuditLogInFirestore,
  addNotificationInFirestore,
  addSlaExtensionInFirestore
} from '../services/firestoreService';

interface CivicContextType {
  currentUser: User;
  users: User[];
  departments: Department[];
  applications: Application[];
  slaExtensions: SlaExtensionRequest[];
  auditLogs: AuditLog[];
  notifications: CitizenNotification[];
  currentLanguage: LanguageCode;
  selectedAppId: string;
  triggerFlash: string | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  authError: string | null;
  showLoginModal: boolean;
  loginModalRole: UserRole;
  
  // UI & Auth Modals
  openLoginModal: (role?: UserRole) => void;
  closeLoginModal: () => void;
  loginWithGoogle: (role: UserRole) => Promise<void>;
  loginAsRoleWithCredentials: (role: UserRole, details?: Record<string, string>) => void;
  signOutUser: () => Promise<void>;

  // Theme State & Actions
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Actions
  setCurrentLanguage: (lang: LanguageCode) => void;
  switchUserRole: (role: UserRole) => void;
  switchUserById: (userId: string) => void;
  setSelectedAppId: (appId: string) => void;
  
  // Officer Actions
  approveApplication: (appId: string, officerNotes?: string) => void;
  redirectDepartment: (appId: string, targetDeptId: string, reason: string) => void;
  flagApplicationIssue: (appId: string, reason: string, aiExplanation: string) => void;
  requestSlaExtension: (appId: string, hours: number, reason: string) => void;
  verifyDocument: (appId: string, docId: string) => void;
  
  // Admin Actions
  reviewSlaExtension: (requestId: string, decision: 'GRANTED' | 'DENIED') => void;
  
  // Citizen Actions
  reuploadDocument: (
    appId: string,
    fileName: string,
    simulatedParsedFields?: Record<string, string>,
    previewUrl?: string,
    fileSize?: string,
    fileType?: string
  ) => void;
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: () => void;
}

const CivicContext = createContext<CivicContextType | undefined>(undefined);

export const CivicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [currentUser, setCurrentUser] = useState<User>(initialUsers[0]); // default citizen
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [departments] = useState<Department[]>(initialDepartments);
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [slaExtensions, setSlaExtensions] = useState<SlaExtensionRequest[]>(initialSlaExtensionRequests);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [notifications, setNotifications] = useState<CitizenNotification[]>(initialNotifications);
  const [selectedAppId, setSelectedAppId] = useState<string>('app_01');
  const [triggerFlash, setTriggerFlash] = useState<string | null>(null);

  // Auth States
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [loginModalRole, setLoginModalRole] = useState<UserRole>('citizen');

  // Theme State (Dark Mode default with full Light Mode support)
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('civicflow_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return 'dark';
    } catch {
      return 'dark';
    }
  });

  const applyThemeToDOM = (t: 'light' | 'dark') => {
    if (typeof document !== 'undefined') {
      if (t === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    }
  };

  const setTheme = (t: 'light' | 'dark') => {
    setThemeState(t);
    try {
      localStorage.setItem('civicflow_theme', t);
    } catch {
      // ignore
    }
    applyThemeToDOM(t);
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  // Trigger flash helper to show simulated database trigger in action
  const fireTriggerFeedback = (triggerName: string) => {
    setTriggerFlash(`PL/SQL Trigger Executed: ${triggerName}`);
    setTimeout(() => {
      setTriggerFlash(null);
    }, 4500);
  };

  // Seed Firestore on mount and setup real-time subscriptions
  useEffect(() => {
    seedFirestoreIfEmpty();

    const unsubApps = subscribeApplications((updatedApps) => {
      if (updatedApps && updatedApps.length > 0) {
        setApplications(updatedApps);
      }
    });

    const unsubAudits = subscribeAuditLogs((updatedAudits) => {
      if (updatedAudits && updatedAudits.length > 0) {
        setAuditLogs(updatedAudits);
      }
    });

    const unsubExt = subscribeSlaExtensions((updatedExt) => {
      if (updatedExt && updatedExt.length > 0) {
        setSlaExtensions(updatedExt);
      }
    });

    const unsubNotifs = subscribeNotifications((updatedNotifs) => {
      if (updatedNotifs && updatedNotifs.length > 0) {
        setNotifications(updatedNotifs);
      }
    });

    // Listen to Firebase Auth state
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseUser(user);
        setIsAuthenticated(true);
        // Create or update current user object
        const initials = user.displayName
          ? user.displayName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
          : 'U';
        
        setCurrentUser((prev) => {
          const updatedUser: User = {
            ...prev,
            id: user.uid,
            name: user.displayName || prev.name,
            email: user.email || prev.email,
            avatarText: initials || prev.avatarText
          };
          saveUserToFirestore(updatedUser);
          return updatedUser;
        });
      } else {
        setFirebaseUser(null);
      }
    });

    return () => {
      unsubApps();
      unsubAudits();
      unsubExt();
      unsubNotifs();
      unsubAuth();
    };
  }, []);

  const openLoginModal = (role?: UserRole) => {
    if (role) setLoginModalRole(role);
    setAuthError(null);
    setShowLoginModal(true);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
    setAuthError(null);
  };

  // Google Sign In via Firebase Auth
  const loginWithGoogle = async (role: UserRole) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const gUser = res.user;
      setFirebaseUser(gUser);
      setIsAuthenticated(true);

      const initials = gUser.displayName
        ? gUser.displayName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
        : 'US';

      const newUser: User = {
        id: gUser.uid,
        name: gUser.displayName || 'Authorized User',
        role: role,
        email: gUser.email || 'user@flowdoc.gov.in',
        phone: gUser.phoneNumber || '+91 98402 11984',
        aadhaarMasked: role === 'citizen' ? 'XXXX-XXXX-4589' : undefined,
        designation:
          role === 'admin'
            ? 'District Collector & Executive Magistrate'
            : role === 'officer'
            ? 'Senior Scrutiny Officer'
            : undefined,
        departmentId: role === 'officer' ? 'dept_rev' : undefined,
        departmentName: role === 'officer' ? 'Revenue & Land Records' : undefined,
        avatarText: initials
      };

      setCurrentUser(newUser);
      saveUserToFirestore(newUser);
      setShowLoginModal(false);
    } catch (err: any) {
      console.warn('Google sign-in popup error (falling back to role demo session):', err);
      // If popup fails or user cancels, provide friendly fallback
      setAuthError(err.message || 'Google Sign-in failed. You can sign in using role credentials.');
      // Switch user to predefined demo role so UI is not broken
      switchUserRole(role);
    } finally {
      setAuthLoading(false);
    }
  };

  // Role-specific credential login
  const loginAsRoleWithCredentials = (role: UserRole, details?: Record<string, string>) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      // Find or build user profile for role
      const template = users.find((u) => u.role === role) || initialUsers[0];
      const updatedUser: User = {
        ...template,
        role
      };

      if (role === 'citizen') {
        if (details?.aadhaarOrMobile) {
          updatedUser.phone = details.aadhaarOrMobile;
        }
        if (details?.name && details.name.trim()) {
          updatedUser.name = details.name.trim();
          const parts = details.name.trim().split(' ').filter(Boolean);
          updatedUser.avatarText = parts.length > 1
            ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
            : details.name.trim().substring(0, 2).toUpperCase();
        }
        if (details?.email && details.email.trim()) {
          updatedUser.email = details.email.trim();
        }
      }
      if (role === 'officer') {
        if (details?.name && details.name.trim()) {
          updatedUser.name = details.name.trim();
          const parts = details.name.trim().split(' ').filter(Boolean);
          updatedUser.avatarText = parts.length > 1
            ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
            : details.name.trim().substring(0, 2).toUpperCase();
        }
        if (details?.govId && details.govId.trim()) {
          updatedUser.employeeId = details.govId.trim();
        }
        if (details?.departmentId) {
          const d = departments.find((dept) => dept.id === details.departmentId);
          if (d) {
            updatedUser.departmentId = d.id;
            updatedUser.departmentName = d.name;
          }
        }
      }
      if (role === 'admin' && details?.name && details.name.trim()) {
        updatedUser.name = details.name.trim();
        const parts = details.name.trim().split(' ').filter(Boolean);
        updatedUser.avatarText = parts.length > 1
          ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
          : details.name.trim().substring(0, 2).toUpperCase();
      }

      setCurrentUser(updatedUser);
      setIsAuthenticated(true);
      saveUserToFirestore(updatedUser);
      setShowLoginModal(false);
    } catch (e: any) {
      setAuthError('Authentication failed: ' + e.message);
    } finally {
      setAuthLoading(false);
    }
  };

  // Sign out
  const signOutUser = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('Signout error:', e);
    }
    setFirebaseUser(null);
    setIsAuthenticated(false);
    setShowLoginModal(false);
  };

  const switchUserRole = (role: UserRole) => {
    const userForRole = users.find((u) => u.role === role);
    if (userForRole) {
      setCurrentUser(userForRole);
      setIsAuthenticated(true);
    }
  };

  const switchUserById = (userId: string) => {
    const targetUser = users.find((u) => u.id === userId);
    if (targetUser) {
      setCurrentUser(targetUser);
      setIsAuthenticated(true);
    }
  };

  // OFFICER ACTION: Approve application
  const approveApplication = (appId: string, officerNotes?: string) => {
    const now = new Date().toISOString();
    let updatedTargetApp: Application | null = null;

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        const modified: Application = {
          ...app,
          status: 'RESOLVED_APPROVED',
          urgency: 'healthy',
          history: [
            ...app.history,
            {
              id: `hist_${Date.now()}`,
              timestamp: now,
              action: 'Approved & Sealed with Digital Signature',
              actorName: currentUser.name,
              actorRole: currentUser.role,
              details: officerNotes || 'Application sanctioned and approved by competent authority.'
            }
          ]
        };
        updatedTargetApp = modified;
        return modified;
      })
    );

    const targetApp = applications.find((a) => a.id === appId);
    if (targetApp) {
      if (updatedTargetApp) {
        updateApplicationInFirestore(updatedTargetApp);
      }

      // Create Audit Log
      const newAudit: AuditLog = {
        id: `audit_${Date.now()}`,
        timestamp: now,
        eventType: 'APPROVAL',
        applicationId: targetApp.id,
        applicationNumber: targetApp.applicationNumber,
        actorId: currentUser.id,
        actorName: currentUser.name,
        actorRole: currentUser.role,
        action: 'Application Approved & Statutory Certificate Dispatched',
        details: `Approved by ${currentUser.name}. Statutory digital clearance certificate issued.`,
        triggerSource: 'OFFICER_DISCRETION'
      };
      setAuditLogs((prev) => [newAudit, ...prev]);
      addAuditLogInFirestore(newAudit);

      // Push notification to citizen
      const newNotif: CitizenNotification = {
        id: `notif_${Date.now()}`,
        userId: targetApp.applicantId,
        applicationId: targetApp.id,
        applicationNumber: targetApp.applicationNumber,
        title: `Approved: ${targetApp.title}`,
        message: `Your application ${targetApp.applicationNumber} has been approved and issued with an authorized digital seal.`,
        type: 'success',
        createdAt: now,
        read: false,
        requiresAction: false
      };
      setNotifications((prev) => [newNotif, ...prev]);
      addNotificationInFirestore(newNotif);
    }
  };

  // OFFICER ACTION: Redirect Department
  const redirectDepartment = (appId: string, targetDeptId: string, reason: string) => {
    const targetDept = departments.find((d) => d.id === targetDeptId);
    if (!targetDept) return;
    const now = new Date().toISOString();
    let updatedTargetApp: Application | null = null;

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        const modified: Application = {
          ...app,
          departmentId: targetDept.id,
          departmentName: targetDept.name,
          status: 'REDIRECTED',
          history: [
            ...app.history,
            {
              id: `hist_${Date.now()}`,
              timestamp: now,
              action: `Redirected to ${targetDept.name}`,
              actorName: currentUser.name,
              actorRole: currentUser.role,
              details: reason
            }
          ]
        };
        updatedTargetApp = modified;
        return modified;
      })
    );

    const targetApp = applications.find((a) => a.id === appId);
    if (targetApp) {
      if (updatedTargetApp) {
        updateApplicationInFirestore(updatedTargetApp);
      }

      // Database Trigger simulation: TRG_DEPT_REDIRECT
      fireTriggerFeedback('TRG_DEPT_REDIRECT');

      const newAudit: AuditLog = {
        id: `audit_${Date.now()}`,
        timestamp: now,
        eventType: 'DEPARTMENT_REDIRECT',
        applicationId: targetApp.id,
        applicationNumber: targetApp.applicationNumber,
        actorId: currentUser.id,
        actorName: currentUser.name,
        actorRole: currentUser.role,
        action: `Jurisdiction Transferred to ${targetDept.name}`,
        details: `Reason: ${reason}. Automated trigger updated routing table and recomputed statutory SLA: ${targetDept.slaTargetHours}h.`,
        triggerSource: 'PL_SQL_TRIGGER_EVENT'
      };
      setAuditLogs((prev) => [newAudit, ...prev]);
      addAuditLogInFirestore(newAudit);

      const newNotif: CitizenNotification = {
        id: `notif_${Date.now()}`,
        userId: targetApp.applicantId,
        applicationId: targetApp.id,
        applicationNumber: targetApp.applicationNumber,
        title: `Transferred: ${targetApp.applicationNumber}`,
        message: `Your application has been redirected to ${targetDept.name} for specialized clearance: "${reason}"`,
        type: 'info',
        createdAt: now,
        read: false,
        requiresAction: false
      };
      setNotifications((prev) => [newNotif, ...prev]);
      addNotificationInFirestore(newNotif);
    }
  };

  // OFFICER ACTION: Flag Application Issue
  const flagApplicationIssue = (appId: string, reason: string, aiExplanation: string) => {
    const now = new Date().toISOString();
    let updatedTargetApp: Application | null = null;

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        const modified: Application = {
          ...app,
          status: 'ISSUE_FLAGGED',
          urgency: 'warning',
          flagReason: reason,
          aiExplanation: aiExplanation,
          history: [
            ...app.history,
            {
              id: `hist_${Date.now()}`,
              timestamp: now,
              action: 'Discrepancy Flagged & SLA Paused',
              actorName: currentUser.name,
              actorRole: currentUser.role,
              details: reason
            }
          ]
        };
        updatedTargetApp = modified;
        return modified;
      })
    );

    const targetApp = applications.find((a) => a.id === appId);
    if (targetApp) {
      if (updatedTargetApp) {
        updateApplicationInFirestore(updatedTargetApp);
      }

      // FIRE PL/SQL TRIGGER: TRG_APP_STATUS_CHANGE
      fireTriggerFeedback('TRG_APP_STATUS_CHANGE [ON UPDATE OF STATUS]');

      const newAudit: AuditLog = {
        id: `audit_${Date.now()}`,
        timestamp: now,
        eventType: 'ISSUE_FLAGGED',
        applicationId: targetApp.id,
        applicationNumber: targetApp.applicationNumber,
        actorId: currentUser.id,
        actorName: currentUser.name,
        actorRole: currentUser.role,
        action: 'PL/SQL Trigger: Status Flagged & Citizen Alert Pushed',
        details: `Reason: ${reason}. AI diagnosis: ${aiExplanation}. SLA timer paused pending citizen document re-upload.`,
        triggerSource: 'PL_SQL_TRIGGER_EVENT'
      };
      setAuditLogs((prev) => [newAudit, ...prev]);
      addAuditLogInFirestore(newAudit);

      // Push real-time alert to citizen
      const newNotif: CitizenNotification = {
        id: `notif_${Date.now()}`,
        userId: targetApp.applicantId,
        applicationId: targetApp.id,
        applicationNumber: targetApp.applicationNumber,
        title: `Action Required: Discrepancy on ${targetApp.applicationNumber}`,
        message: `Officer ${currentUser.name} flagged an issue: ${reason}. Please view the AI explanation and re-upload document.`,
        type: 'alert',
        createdAt: now,
        read: false,
        requiresAction: true
      };
      setNotifications((prev) => [newNotif, ...prev]);
      addNotificationInFirestore(newNotif);
    }
  };

  // OFFICER ACTION: Request SLA Extension
  const requestSlaExtension = (appId: string, hours: number, reason: string) => {
    const targetApp = applications.find((a) => a.id === appId);
    if (!targetApp) return;

    const now = new Date().toISOString();
    const newReq: SlaExtensionRequest = {
      id: `sla_req_${Date.now()}`,
      applicationId: targetApp.id,
      applicationNumber: targetApp.applicationNumber,
      applicationTitle: targetApp.title,
      departmentId: targetApp.departmentId,
      departmentName: targetApp.departmentName,
      officerId: currentUser.id,
      officerName: currentUser.name,
      currentDeadline: targetApp.slaDeadline,
      requestedHours: hours,
      reason: reason,
      status: 'PENDING',
      createdAt: now
    };

    setSlaExtensions((prev) => [newReq, ...prev]);
    addSlaExtensionInFirestore(newReq);

    const newAudit: AuditLog = {
      id: `audit_${Date.now()}`,
      timestamp: now,
      eventType: 'SLA_EXTENSION',
      applicationId: targetApp.id,
      applicationNumber: targetApp.applicationNumber,
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: `Requested SLA Extension (+${hours}h)`,
      details: `Justification: ${reason}. Forwarded to District Collector for approval.`,
      triggerSource: 'OFFICER_DISCRETION'
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
    addAuditLogInFirestore(newAudit);
  };

  // ADMIN ACTION: Review SLA Extension
  const reviewSlaExtension = (requestId: string, decision: 'GRANTED' | 'DENIED') => {
    const targetReq = slaExtensions.find((r) => r.id === requestId);
    if (!targetReq) return;

    const now = new Date().toISOString();
    let updatedReqObj: SlaExtensionRequest | null = null;

    setSlaExtensions((prev) =>
      prev.map((r) => {
        if (r.id !== requestId) return r;
        const modified: SlaExtensionRequest = {
          ...r,
          status: decision,
          reviewedAt: now,
          reviewedBy: currentUser.name
        };
        updatedReqObj = modified;
        return modified;
      })
    );

    if (updatedReqObj) {
      addSlaExtensionInFirestore(updatedReqObj);
    }

    if (decision === 'GRANTED') {
      let updatedAppObj: Application | null = null;
      // Extend deadline in application
      setApplications((prev) =>
        prev.map((app) => {
          if (app.id !== targetReq.applicationId) return app;
          const currentDeadlineDate = new Date(app.slaDeadline);
          currentDeadlineDate.setHours(currentDeadlineDate.getHours() + targetReq.requestedHours);
          const newDeadlineStr = currentDeadlineDate.toISOString();
          const newRemaining = Math.round(
            (currentDeadlineDate.getTime() - new Date().getTime()) / (1000 * 60 * 60)
          );

          const modified: Application = {
            ...app,
            slaDeadline: newDeadlineStr,
            slaRemainingHours: newRemaining,
            slaTotalHours: app.slaTotalHours + targetReq.requestedHours,
            urgency: newRemaining <= 0 ? 'breached' : newRemaining <= 12 ? 'warning' : 'healthy',
            history: [
              ...app.history,
              {
                id: `hist_${Date.now()}`,
                timestamp: now,
                action: `SLA Extension Granted (+${targetReq.requestedHours}h)`,
                actorName: currentUser.name,
                actorRole: currentUser.role,
                details: `Approved by Higher Official. New statutory deadline: ${new Date(
                  newDeadlineStr
                ).toLocaleDateString()}`
              }
            ]
          };
          updatedAppObj = modified;
          return modified;
        })
      );

      if (updatedAppObj) {
        updateApplicationInFirestore(updatedAppObj);
      }

      fireTriggerFeedback('TRG_SLA_RECALC [DEADLINE EXTENDED]');
    }

    // Audit Log entry
    const newAudit: AuditLog = {
      id: `audit_${Date.now()}`,
      timestamp: now,
      eventType: 'SLA_EXTENSION',
      applicationId: targetReq.applicationId,
      applicationNumber: targetReq.applicationNumber,
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: `Higher Official Decision: SLA Extension ${decision}`,
      details:
        decision === 'GRANTED'
          ? `Granted +${targetReq.requestedHours} hours extension. Application deadline rescheduled.`
          : `Denied SLA extension request. Officer instructed to complete within existing SLA window.`,
      triggerSource: 'ADMIN_OVERRIDE'
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
    addAuditLogInFirestore(newAudit);
  };

  // OFFICER ACTION: Verify a document
  const verifyDocument = (appId: string, docId: string) => {
    const now = new Date().toISOString();
    let updatedAppObj: Application | null = null;
    let docName = '';

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;

        const updatedDocs = app.documents.map((d) => {
          if (d.id === docId) {
            docName = d.name;
            return { ...d, status: 'verified' as const, illegibleReason: undefined };
          }
          return d;
        });

        const modified: Application = {
          ...app,
          documents: updatedDocs
        };
        updatedAppObj = modified;
        return modified;
      })
    );

    if (updatedAppObj) {
      updateApplicationInFirestore(updatedAppObj);
    }

    const appNumber = (updatedAppObj as Application | null)?.applicationNumber || appId;

    const newAudit: AuditLog = {
      id: `audit_${Date.now()}`,
      timestamp: now,
      eventType: 'DOCUMENT_REUPLOAD',
      applicationId: appId,
      applicationNumber: appNumber,
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: `Officer Inspected & Verified Document (${docName || docId})`,
      details: `Officer ${currentUser.name} reviewed statutory proof document and marked it verified & compliant.`,
      triggerSource: 'OFFICER_DISCRETION'
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
    addAuditLogInFirestore(newAudit);
    fireTriggerFeedback(`DOC_VERIFIED [${docName || docId}]`);
  };

  // CITIZEN ACTION: Re-upload document
  const reuploadDocument = (
    appId: string,
    fileName: string,
    simulatedParsedFields?: Record<string, string>,
    previewUrl?: string,
    fileSize?: string,
    fileType?: string
  ) => {
    const now = new Date().toISOString();
    let updatedAppObj: Application | null = null;

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;

        // Create the newly uploaded document record
        const newDoc: ApplicationDocument = {
          id: `doc_${Date.now()}`,
          name: fileName,
          type: fileType || 'application/pdf',
          size: fileSize || '1.4 MB',
          uploadedAt: now,
          previewUrl: previewUrl,
          status: 'verified'
        };

        // Prepend new document so it is immediately visible as activeApp.documents[0]
        const updatedDocs: ApplicationDocument[] = [
          newDoc,
          ...app.documents.map((doc) =>
            doc.status === 'illegible'
              ? { ...doc, illegibleReason: `Superseded by re-uploaded certified document (${fileName})` }
              : doc
          )
        ];

        // Update extracted fields with high confidence
        const updatedFields = app.extractedFields.map((field) => {
          if (!field.verified) {
            if (field.key === 'meterNo') {
              return {
                ...field,
                value: simulatedParsedFields?.meterNo || '04-118-092-4112 (Verified)',
                confidence: 0.99,
                verified: true
              };
            }
            if (field.key === 'billDate') {
              return {
                ...field,
                value: simulatedParsedFields?.billDate || '18-Aug-2026 (Valid - 37 days ago)',
                confidence: 0.99,
                verified: true
              };
            }
          }
          return field;
        });

        const modified: Application = {
          ...app,
          status: 'OFFICER_REVIEW',
          urgency: 'healthy',
          documents: updatedDocs,
          extractedFields: updatedFields,
          aiExplanation: 'New document validated. Recency check passed (bill within 90 days). OCR extracted consumer meter number with 99.2% accuracy. Transferred back to Officer Rajesh Kumar for final clearance.',
          flagReason: undefined,
          history: [
            ...app.history,
            {
              id: `hist_${Date.now()}`,
              timestamp: now,
              action: 'Corrected Document Uploaded',
              actorName: currentUser.name,
              actorRole: currentUser.role,
              details: `Uploaded ${fileName}. AI parser auto-verified compliance and resumed review.`
            }
          ]
        };
        updatedAppObj = modified;
        return modified;
      })
    );

    const targetApp = applications.find((a) => a.id === appId);
    if (targetApp) {
      if (updatedAppObj) {
        updateApplicationInFirestore(updatedAppObj);
      }

      fireTriggerFeedback('TRG_DOC_REUPLOAD_VALIDATE [AI OCR PASS]');

      const newAudit: AuditLog = {
        id: `audit_${Date.now()}`,
        timestamp: now,
        eventType: 'DOCUMENT_REUPLOAD',
        applicationId: targetApp.id,
        applicationNumber: targetApp.applicationNumber,
        actorId: currentUser.id,
        actorName: currentUser.name,
        actorRole: currentUser.role,
        action: 'Corrected Document Uploaded & AI Verified',
        details: `Citizen ${currentUser.name} uploaded ${fileName}. AI OCR verified consumer ID and 90-day recency. Application resumed under Officer Review.`,
        triggerSource: 'AI_OCR_ENGINE'
      };
      setAuditLogs((prev) => [newAudit, ...prev]);
      addAuditLogInFirestore(newAudit);

      const newNotif: CitizenNotification = {
        id: `notif_${Date.now()}`,
        userId: targetApp.applicantId,
        applicationId: targetApp.id,
        applicationNumber: targetApp.applicationNumber,
        title: 'Document Verified by AI Engine',
        message: 'Your updated document has been verified. The application is now at Officer Desk for final sanction.',
        type: 'success',
        createdAt: now,
        read: false,
        requiresAction: false
      };
      setNotifications((prev) => [newNotif, ...prev]);
      addNotificationInFirestore(newNotif);
    }
  };

  const markNotificationRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.id === notifId) {
          const updated = { ...n, read: true };
          addNotificationInFirestore(updated);
          return updated;
        }
        return n;
      })
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => {
        const updated = { ...n, read: true };
        addNotificationInFirestore(updated);
        return updated;
      })
    );
  };

  return (
    <CivicContext.Provider
      value={{
        currentUser,
        users,
        departments,
        applications,
        slaExtensions,
        auditLogs,
        notifications,
        currentLanguage,
        selectedAppId,
        triggerFlash,
        firebaseUser,
        isAuthenticated,
        authLoading,
        authError,
        showLoginModal,
        loginModalRole,
        openLoginModal,
        closeLoginModal,
        loginWithGoogle,
        loginAsRoleWithCredentials,
        signOutUser,
        theme,
        setTheme,
        toggleTheme,
        setCurrentLanguage,
        switchUserRole,
        switchUserById,
        setSelectedAppId,
        approveApplication,
        redirectDepartment,
        flagApplicationIssue,
        requestSlaExtension,
        verifyDocument,
        reviewSlaExtension,
        reuploadDocument,
        markNotificationRead,
        markAllNotificationsRead
      }}
    >
      {children}
    </CivicContext.Provider>
  );
};

export const useCivic = () => {
  const context = useContext(CivicContext);
  if (!context) {
    throw new Error('useCivic must be used within a CivicProvider');
  }
  return context;
};

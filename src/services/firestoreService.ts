import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  User,
  Application,
  SlaExtensionRequest,
  AuditLog,
  CitizenNotification,
  Department
} from '../types/civic';
import {
  initialUsers,
  initialDepartments,
  initialApplications,
  initialSlaExtensionRequests,
  initialAuditLogs,
  initialNotifications
} from '../data/mockData';

// Collection references
const USERS_COL = 'users';
const APPS_COL = 'applications';
const EXTENSIONS_COL = 'sla_extensions';
const AUDITS_COL = 'audit_logs';
const NOTIFS_COL = 'notifications';
const DEPTS_COL = 'departments';

/**
 * Initializes Firestore with seed data if collections are empty.
 */
export async function seedFirestoreIfEmpty() {
  try {
    const appsSnap = await getDocs(collection(db, APPS_COL));
    if (appsSnap.empty) {
      console.log('Seeding initial data into Firestore...');
      
      // Seed Users
      for (const u of initialUsers) {
        await setDoc(doc(db, USERS_COL, u.id), u);
      }
      // Seed Departments
      for (const d of initialDepartments) {
        await setDoc(doc(db, DEPTS_COL, d.id), d);
      }
      // Seed Applications
      for (const a of initialApplications) {
        await setDoc(doc(db, APPS_COL, a.id), a);
      }
      // Seed SLA Extensions
      for (const e of initialSlaExtensionRequests) {
        await setDoc(doc(db, EXTENSIONS_COL, e.id), e);
      }
      // Seed Audit Logs
      for (const log of initialAuditLogs) {
        await setDoc(doc(db, AUDITS_COL, log.id), log);
      }
      // Seed Notifications
      for (const n of initialNotifications) {
        await setDoc(doc(db, NOTIFS_COL, n.id), n);
      }
      console.log('Firestore seed completed.');
    }
  } catch (error) {
    console.warn('Firestore seeding skipped or failed (will use fallback/cached):', error);
  }
}

/**
 * Subscribes to Applications in real-time
 */
export function subscribeApplications(callback: (apps: Application[]) => void) {
  try {
    const q = query(collection(db, APPS_COL));
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const apps: Application[] = [];
          snapshot.forEach((docSnap) => {
            apps.push({ ...docSnap.data(), id: docSnap.id } as Application);
          });
          callback(apps);
        }
      },
      (err) => {
        console.warn('Real-time applications subscription error:', err);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe to applications:', err);
    return () => {};
  }
}

/**
 * Subscribes to Audit Logs in real-time
 */
export function subscribeAuditLogs(callback: (logs: AuditLog[]) => void) {
  try {
    const q = query(collection(db, AUDITS_COL));
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const logs: AuditLog[] = [];
          snapshot.forEach((docSnap) => {
            logs.push({ ...docSnap.data(), id: docSnap.id } as AuditLog);
          });
          logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          callback(logs);
        }
      },
      (err) => {
        console.warn('Real-time audit subscription error:', err);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe to audits:', err);
    return () => {};
  }
}

/**
 * Subscribes to SLA Extensions
 */
export function subscribeSlaExtensions(callback: (extensions: SlaExtensionRequest[]) => void) {
  try {
    const q = query(collection(db, EXTENSIONS_COL));
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: SlaExtensionRequest[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ ...docSnap.data(), id: docSnap.id } as SlaExtensionRequest);
          });
          callback(list);
        }
      },
      (err) => {
        console.warn('Real-time SLA extensions subscription error:', err);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe to extensions:', err);
    return () => {};
  }
}

/**
 * Subscribes to Notifications
 */
export function subscribeNotifications(callback: (notifs: CitizenNotification[]) => void) {
  try {
    const q = query(collection(db, NOTIFS_COL));
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: CitizenNotification[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ ...docSnap.data(), id: docSnap.id } as CitizenNotification);
          });
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          callback(list);
        }
      },
      (err) => {
        console.warn('Real-time notifications subscription error:', err);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe to notifications:', err);
    return () => {};
  }
}

/**
 * Save or update user profile in Firestore
 */
export async function saveUserToFirestore(user: User) {
  try {
    await setDoc(doc(db, USERS_COL, user.id), user, { merge: true });
  } catch (e) {
    console.warn('Error saving user profile to Firestore:', e);
  }
}

/**
 * Update application in Firestore
 */
export async function updateApplicationInFirestore(app: Application) {
  try {
    await setDoc(doc(db, APPS_COL, app.id), app, { merge: true });
  } catch (e) {
    console.warn('Error updating application in Firestore:', e);
  }
}

/**
 * Add audit log in Firestore
 */
export async function addAuditLogInFirestore(log: AuditLog) {
  try {
    await setDoc(doc(db, AUDITS_COL, log.id), log);
  } catch (e) {
    console.warn('Error adding audit log to Firestore:', e);
  }
}

/**
 * Add or update notification
 */
export async function addNotificationInFirestore(notif: CitizenNotification) {
  try {
    await setDoc(doc(db, NOTIFS_COL, notif.id), notif);
  } catch (e) {
    console.warn('Error adding notification to Firestore:', e);
  }
}

/**
 * Add SLA extension
 */
export async function addSlaExtensionInFirestore(req: SlaExtensionRequest) {
  try {
    await setDoc(doc(db, EXTENSIONS_COL, req.id), req);
  } catch (e) {
    console.warn('Error adding SLA extension to Firestore:', e);
  }
}

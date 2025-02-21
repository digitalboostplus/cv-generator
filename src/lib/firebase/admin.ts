import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import * as admin from 'firebase-admin';

export function initAdmin() {
  try {
    // Only initialize if no apps exist
    if (getApps().length === 0) {
      initializeApp({
        projectId: 'cv-generator-57cd1',
        storageBucket: 'cv-generator-57cd1.appspot.com',
        credential: admin.credential.applicationDefault()
      });
      console.log('Firebase Admin SDK initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    throw error;
  }
}

export { getAuth }; 
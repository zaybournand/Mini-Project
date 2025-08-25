/* global __app_id, __firebase_config, __initial_auth_token */
// src/FirebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const LOCAL_APP_ID_FALLBACK = process.env.REACT_APP_FIREBASE_APP_ID || 'your-mini-project-app-id';

const LOCAL_FIREBASE_CONFIG_FALLBACK = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "YOUR_API_KEY_PLACEHOLDER",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: process.env.REACT_APP_FIREBASE_CLIENT_APP_ID || "YOUR_FIREBASE_APP_ID_FROM_SETTINGS",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "YOUR_MEASUREMENT_ID",
};

const LOCAL_INITIAL_AUTH_TOKEN_FALLBACK = null;

const resolvedAppId = typeof __app_id !== 'undefined' ? __app_id : LOCAL_APP_ID_FALLBACK;

const resolvedFirebaseConfig = typeof __firebase_config !== 'undefined'
  ? JSON.parse(__firebase_config)
  : LOCAL_FIREBASE_CONFIG_FALLBACK;

const resolvedInitialAuthToken = typeof __initial_auth_token !== 'undefined'
  ? __initial_auth_token
  : LOCAL_INITIAL_AUTH_TOKEN_FALLBACK;

const app = initializeApp(resolvedFirebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, resolvedAppId as appId, resolvedInitialAuthToken as initialAuthToken };
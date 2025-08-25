// src/utils/firestore.js
import { doc, setDoc, increment, onSnapshot } from 'firebase/firestore';

// Helper function for exponential backoff to handle API throttling
export const exponentialBackoff = async (func, retries = 5, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await func();
    } catch (error) {
      if (error.code === 'resource-exhausted' && i < retries - 1) {
        console.warn(`Retry attempt ${i + 1} due to resource exhaustion.`);
        await new Promise(res => setTimeout(res, delay * Math.pow(2, i)));
      } else {
        throw error;
      }
    }
  }
};

// Function to get a user's click count and listen for changes
export const setupClickCountListener = (db, appId, userId, setClickCount, setDbError) => {
  const userDocRef = doc(db, `artifacts/${appId}/users/${userId}/user_data`, 'click_count');

  const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
    if (docSnap.exists()) {
      setClickCount(docSnap.data().count);
    } else {
      setClickCount(0);
    }
    setDbError('');
  }, (error) => {
    console.error("Firestore snapshot error:", error);
    setDbError(`Failed to load click count: ${error.message}`);
  });

  return unsubscribe;
};

// Function to increment a user's click count
export const incrementUserClickCount = async (db, appId, userId) => {
  const userDocRef = doc(db, `artifacts/${appId}/users/${userId}/user_data`, 'click_count');
  return exponentialBackoff(() => setDoc(userDocRef, { count: increment(1) }, { merge: true }));
};
// src/App.js
import React, { useState, useEffect } from 'react';
import {
  signInAnonymously,
  signInWithCustomToken,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

import { auth, db, appId, initialAuthToken } from './FirebaseConfig';
import AuthForm from './AuthForm';
import AuthStatus from './AuthStatus';
import MessageDisplay from './components/MessageDisplay';
import LoadingSpinner from './components/LoadingSpinner';

import { exponentialBackoff, setupClickCountListener, incrementUserClickCount } from './utils/firestore';


function App() {
  const [user, setUser] = useState(null);
  const [clickCount, setClickCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState('');
  const [backendResponse, setBackendResponse] = useState(null);
  const [backendError, setBackendError] = useState('');

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        try {
          if (initialAuthToken) {
            try {
              await exponentialBackoff(() => signInWithCustomToken(auth, initialAuthToken));
            } catch (tokenError) {
              if (tokenError.code === 'auth/admin-restricted-operation') {
                console.warn("Canvas-provided token rejected. Falling back to anonymous sign-in.");
                await exponentialBackoff(() => signInAnonymously(auth));
              } else {
                console.error("Authentication error with custom token:", tokenError);
              }
            }
          } else {
            await exponentialBackoff(() => signInAnonymously(auth));
          }
        } catch (error) {
          console.error("Authentication error during initial setup:", error);
        }
      }
      setUser(auth.currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [initialAuthToken, auth]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (user && user.uid && !user.isAnonymous) {
      const unsubscribe = setupClickCountListener(db, appId, user.uid, setClickCount, setDbError);
      return () => unsubscribe();
    } else if (user && user.isAnonymous) {
      setClickCount(0);
      setDbError('');
    }
  }, [user]);

  const handleSignUp = async (email, password) => {
    try {
      await exponentialBackoff(() => createUserWithEmailAndPassword(auth, email, password));
    } catch (error) {
      console.error("Sign up error:", error);
    }
  };

  const handleSignIn = async (email, password) => {
    try {
      await exponentialBackoff(() => signInWithEmailAndPassword(auth, email, password));
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  const handleSignOut = async () => {
    setDbError('');
    setBackendResponse(null);
    setBackendError('');
    try {
      await exponentialBackoff(() => signOut(auth));
    } catch (error) {
      console.error("Sign out error:", error);
      if (error.code === 'auth/admin-restricted-operation') {
        console.warn("Attempted to sign out an admin-restricted session. Resetting local user state quietly.");
        setUser(null);
        setClickCount(0);
      }
    }
  };

  const handleButtonClick = async () => {
    setDbError('');
    if (!user || user.isAnonymous) {
      setDbError('Please sign in with an email/password account to track your clicks.');
      return;
    }

    try {
      await incrementUserClickCount(db, appId, user.uid);
    } catch (error) {
      console.error("Error updating click count:", error);
      setDbError(`Failed to update click count: ${error.message}`);
    }
  };

  const handleCallBackend = async () => {
    setBackendResponse(null);
    setBackendError('');

    if (!user || user.isAnonymous) {
      setBackendError('Please sign in to call the protected backend endpoint.');
      return;
    }

    try {
      const idToken = await user.getIdToken();

      const response = await fetch(`${BACKEND_URL}/echo-user-info`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setBackendResponse(data);
    } catch (error) {
      console.error("Error calling backend:", error);
      setBackendError(`Backend call failed: ${error.message}`);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex flex-col items-center justify-center p-4 font-inter">
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-8 max-w-lg w-full text-center space-y-6 transform transition-all duration-300 ease-in-out hover:scale-[1.01]">
        <h1 className="text-4xl font-extrabold text-indigo-700 dark:text-indigo-400 mb-2">
          🚀 Click Counter & API Echo
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
          Track your clicks and test a protected backend endpoint!
        </p>

        <MessageDisplay authError={null} dbError={dbError} message={backendError || ''} />

        {user ? (
          <AuthStatus
            user={user}
            clickCount={clickCount}
            handleSignOut={handleSignOut}
            handleButtonClick={handleButtonClick}
            handleCallBackend={handleCallBackend}
            backendResponse={backendResponse}
          />
        ) : (
          <AuthForm
            handleSignIn={handleSignIn}
            handleSignUp={handleSignUp}
          />
        )}
      </div>
    </div>
  );
}

export default App;
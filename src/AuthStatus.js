// src/AuthStatus.js
import React from 'react';
import ClickCounter from './ClickCounter';

function AuthStatus({ user, clickCount, handleSignOut, handleButtonClick, handleCallBackend, backendResponse }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Welcome, <span className="text-indigo-600 dark:text-indigo-400 font-bold">{user.email || 'Guest'}</span>!
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-base break-words">
        Your User ID: <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-md shadow-inner">{user.uid}</span>
      </p>

      {/* Click Counter section */}
      <ClickCounter
        clickCount={clickCount}
        handleButtonClick={handleButtonClick}
        isAnonymous={user.isAnonymous}
      />

      {/* New Backend Call Button */}
      {!user.isAnonymous && (
        <div className="flex flex-col items-center justify-center space-y-4">
          <button
            onClick={handleCallBackend}
            className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 active:scale-95"
          >
            Call Protected Backend
          </button>

          {/* Display Backend Response */}
          {backendResponse && (
            <div className="w-full bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-inner text-left text-gray-800 dark:text-gray-200 text-sm overflow-x-auto">
              <p className="font-semibold mb-2">Backend Response:</p>
              <pre className="whitespace-pre-wrap break-all text-gray-700 dark:text-gray-300">
                {JSON.stringify(backendResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}


      {/* Sign Out Button */}
      <button
        onClick={handleSignOut}
        className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 shadow-md"
      >
        Sign Out
      </button>
    </div>
  );
}

export default AuthStatus;
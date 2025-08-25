// src/ClickCounter.js
import React from 'react';

function ClickCounter({ clickCount, handleButtonClick, isAnonymous }) {
  return (
    <>
      {!isAnonymous ? (
        <>
          <div className="flex flex-col items-center justify-center space-y-4">
            <button
              onClick={handleButtonClick}
              className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-extrabold py-4 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-95"
            >
              Click Me!
            </button>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              Clicks: <span className="text-teal-600 dark:text-teal-400 font-extrabold text-5xl">{clickCount}</span>
            </p>
          </div>
        </>
      ) : (
        <p className="text-orange-600 dark:text-orange-300 italic text-md">
          You are currently signed in anonymously. Please sign up or log in to track your personal click count.
        </p>
      )}
    </>
  );
}

export default ClickCounter;
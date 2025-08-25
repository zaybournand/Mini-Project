// src/components/MessageDisplay.js
import React from 'react';

function MessageDisplay({ authError, dbError, message }) {
  if (!authError && !dbError && !message) return null;

  const type = authError || dbError ? 'error' : 'success';
  const text = authError || dbError || message;

  const bgColorClass = type === 'error'
    ? 'bg-red-100 border border-red-300 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-300'
    : 'bg-green-100 border border-green-300 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-300';

  return (
    <div className={`p-4 rounded-lg text-sm transition-all duration-300 ease-in-out ${bgColorClass}`}>
      {text}
    </div>
  );
}

export default MessageDisplay;
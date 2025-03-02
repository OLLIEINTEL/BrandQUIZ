import React from 'react';

const ProgressBar = ({ currentQuestion, totalQuestions }) => {
  const progress = Math.round((currentQuestion / totalQuestions) * 100);
  
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-primary-700">
          Question {currentQuestion} of {totalQuestions}
        </span>
        <span className="text-sm font-medium text-primary-700">
          {progress}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-primary-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar; 
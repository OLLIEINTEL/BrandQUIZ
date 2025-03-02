import React from 'react';

const Question = ({ question, selectedOption, onOptionSelect }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">{question.text}</h2>
      <div className="space-y-4">
        {question.options.map((option) => (
          <div
            key={option.id}
            className={`quiz-option ${selectedOption === option.id ? 'quiz-option-selected' : ''}`}
            onClick={() => onOptionSelect(option.id)}
          >
            <div className="flex items-center">
              <div className="mr-3 flex h-5 items-center">
                <input
                  id={`option-${option.id}`}
                  name={`question-${question.id}`}
                  type="radio"
                  className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={selectedOption === option.id}
                  onChange={() => onOptionSelect(option.id)}
                />
              </div>
              <div className="min-w-0 flex-1 text-sm">
                <label htmlFor={`option-${option.id}`} className="font-medium text-gray-700">
                  {option.text}
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Question; 
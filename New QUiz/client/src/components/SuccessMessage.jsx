import React from 'react';

const SuccessMessage = ({ userData }) => {
  return (
    <div className="bg-white shadow rounded-lg p-8 max-w-2xl mx-auto text-center">
      <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Your Brand Report is on the Way!
      </h2>
      
      <p className="text-lg text-gray-600 mb-6">
        Thank you, {userData?.name || 'valued customer'}! We're generating your personalized brand archetype report and will send it to {userData?.email || 'your email'} shortly.
      </p>
      
      <div className="bg-gray-50 p-6 rounded-md mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">What happens next?</h3>
        <p className="text-gray-600 mb-4">
          Our AI is analyzing your website and comparing it with your quiz results to create a customized report with actionable insights for your brand.
        </p>
        <ul className="text-left text-sm text-gray-600 space-y-2">
          <li className="flex items-start">
            <span className="flex-shrink-0 h-5 w-5 text-primary-600 mr-2">✓</span>
            <span>Discover your brand's primary and secondary archetypes</span>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 h-5 w-5 text-primary-600 mr-2">✓</span>
            <span>Compare your desired brand identity with your current online presence</span>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 h-5 w-5 text-primary-600 mr-2">✓</span>
            <span>Get tailored recommendations for messaging, visuals, and content</span>
          </li>
        </ul>
      </div>
      
      <p className="text-sm text-gray-500">
        Please check your inbox in the next 15-30 minutes. If you don't see the email, please check your spam folder.
      </p>
    </div>
  );
};

export default SuccessMessage; 
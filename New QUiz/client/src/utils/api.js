// API utility for making requests to the backend

// Determine the base URL based on environment
const API_BASE_URL = import.meta.env.PROD 
  ? '' // Empty string for production (relative to the domain)
  : 'http://localhost:3001'; // Development server URL

/**
 * Submit quiz results to the API
 * @param {Object} metadata User metadata
 * @param {Object} quizResults Quiz answers and results
 * @returns {Promise} API response
 */
export const submitQuiz = async (metadata, quizResults) => {
  const response = await fetch(`${API_BASE_URL}/api/quiz/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      metadata,
      answers: quizResults, // Make sure this matches your backend expectation
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to submit quiz results');
  }
  
  return response.json();
};

/**
 * Check the status of a report
 * @param {string} reportId The ID of the report to check
 * @returns {Promise} API response
 */
export const checkReportStatus = async (reportId) => {
  const response = await fetch(`${API_BASE_URL}/api/quiz/status/${reportId}`);
  
  if (!response.ok) {
    throw new Error('Failed to check report status');
  }
  
  return response.json();
};

export default {
  submitQuiz,
  checkReportStatus
}; 
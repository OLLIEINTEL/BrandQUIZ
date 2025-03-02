// API utility for making requests to the backend

// Determine the base URL based on environment
const API_BASE_URL = import.meta.env.PROD 
  ? '/.netlify/functions' // Netlify Functions path in production
  : 'http://localhost:3001/api'; // Development server URL

/**
 * Submit quiz results to the API
 * @param {Object} metadata User metadata
 * @param {Object} quizResults Quiz answers and results
 * @returns {Promise} API response
 */
export const submitQuiz = async (metadata, quizResults) => {
  try {
    const response = await fetch(`${API_BASE_URL}/submit-quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        metadata,
        answers: quizResults,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to submit quiz results: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Quiz submission error:', error);
    throw new Error('Failed to submit quiz. Please try again.');
  }
};

/**
 * Check the status of a report
 * @param {string} reportId The ID of the report to check
 * @returns {Promise} API response
 */
export const checkReportStatus = async (reportId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/check-status?reportId=${reportId}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to check report status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Status check error:', error);
    throw new Error('Failed to check report status. Please try again.');
  }
};

export default {
  submitQuiz,
  checkReportStatus
}; 
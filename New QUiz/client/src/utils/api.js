// API utility for making requests to the backend

// Determine the base URL based on environment
const API_BASE_URL = import.meta.env.PROD 
  ? '/.netlify/functions' // Netlify Functions path in production
  : 'http://localhost:3001/api'; // Development server URL

/**
 * Submit quiz results to the API
 * @param {Object} quizData Object containing metadata and answers
 * @returns {Promise} API response
 */
export const submitQuiz = async (quizData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/submit-quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quizData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Server error:', errorData);
      throw new Error(errorData.message || `Failed to submit quiz results: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Quiz submission error:', error);
    throw error; // Propagate the error with its original message
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
      console.error('Server error:', errorData);
      throw new Error(errorData.message || `Failed to check report status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Status check error:', error);
    throw error; // Propagate the error with its original message
  }
};

export default {
  submitQuiz,
  checkReportStatus
}; 
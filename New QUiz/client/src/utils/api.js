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
    // Validate quiz data before sending
    if (!quizData || typeof quizData !== 'object') {
      throw new Error('Invalid quiz data format');
    }

    if (!quizData.metadata || !quizData.answers) {
      throw new Error('Missing required fields: metadata or answers');
    }

    if (!Array.isArray(quizData.answers) || quizData.answers.length === 0) {
      throw new Error('Quiz answers must be a non-empty array');
    }

    const response = await fetch(`${API_BASE_URL}/submit-quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quizData),
    });
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Server returned non-JSON response: ${response.status}`);
    }

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Server error response:', data);
      throw new Error(data.message || `Server error: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('Quiz submission error:', error);
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('Network error: Could not connect to the server. Please check your internet connection.');
    }
    throw error;
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
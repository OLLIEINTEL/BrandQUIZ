// API utility for making requests to the backend

// Determine the base URL based on environment
const API_BASE_URL = import.meta.env.PROD 
  ? '/.netlify/functions' // Netlify Functions path in production
  : 'http://localhost:3001/api'; // Development server URL

/**
 * Submit quiz results to the API
 * @param {Object} quizData Object containing metadata and answers
 * @returns {Promise} API response with success status and result
 * @throws {Error} If the request fails or returns an error
 */
export const submitQuiz = async (quizData) => {
  try {
    // Validate quiz data structure
    if (!quizData || typeof quizData !== 'object') {
      throw new Error('Invalid quiz data format');
    }

    const { metadata, answers } = quizData;

    // Validate metadata
    if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
      throw new Error('Invalid metadata format');
    }

    const requiredMetadataFields = ['name', 'email', 'companyName', 'websiteUrl'];
    const missingFields = requiredMetadataFields.filter(field => !metadata[field] || typeof metadata[field] !== 'string');
    
    if (missingFields.length > 0) {
      throw new Error(`Missing or invalid metadata fields: ${missingFields.join(', ')}`);
    }

    // Validate answers
    if (!Array.isArray(answers) || answers.length === 0) {
      throw new Error('Invalid answers format: must be a non-empty array');
    }

    // Validate each answer has required fields and correct types
    const requiredAnswerFields = ['id', 'question', 'answer', 'answerText'];
    const invalidAnswers = answers.filter(answer => 
      !answer || typeof answer !== 'object' ||
      requiredAnswerFields.some(field => !answer[field] || typeof answer[field] !== 'string')
    );

    if (invalidAnswers.length > 0) {
      throw new Error('One or more answers are missing required fields or have invalid format');
    }

    // Create a clean copy of the data, removing any undefined values
    const cleanData = {
      metadata: {
        name: metadata.name.trim(),
        email: metadata.email.trim(),
        companyName: metadata.companyName.trim(),
        websiteUrl: metadata.websiteUrl.trim()
      },
      answers: answers.map(answer => ({
        id: answer.id,
        question: answer.question,
        answer: answer.answer,
        answerText: answer.answerText,
        description: answer.description || ''
      }))
    };

    console.log('Debug - Sending quiz data:', JSON.stringify(cleanData, null, 2));

    const response = await fetch(`${API_BASE_URL}/submit-quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(cleanData)
    });

    // Check for network errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Server error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });

      // Handle specific HTTP status codes
      switch (response.status) {
        case 400:
          throw new Error(errorData.message || 'Invalid quiz data');
        case 401:
          throw new Error('Authentication required');
        case 403:
          throw new Error('Access denied');
        case 429:
          throw new Error('Too many requests. Please try again later.');
        case 502:
          throw new Error('Server is temporarily unavailable. Please try again later.');
        default:
          throw new Error(errorData.message || `Server error: ${response.status}`);
      }
    }

    // Validate response format
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server returned invalid response format');
    }

    const data = await response.json();

    // Validate response data structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response data format');
    }

    if (!data.success) {
      throw new Error(data.message || 'Failed to process quiz results');
    }

    return data;
  } catch (error) {
    console.error('Quiz submission error:', error);

    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('Network error: Could not connect to the server. Please check your internet connection.');
    }

    // Re-throw the error with the original message
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
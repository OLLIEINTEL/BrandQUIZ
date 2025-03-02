exports.handler = async (event, context) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  try {
    // Get the reportId from query parameters
    const { reportId } = event.queryStringParameters || {};

    if (!reportId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Report ID is required' }),
      };
    }

    // For now, we'll return a mock response since we don't have persistent storage
    // In a real application, you would check a database here
    const response = {
      status: 'completed',
      reportId,
      timestamp: new Date().toISOString(),
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(response),
    };

  } catch (error) {
    console.error('Error checking report status:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error checking report status',
        error: error.message,
      }),
    };
  }
}; 
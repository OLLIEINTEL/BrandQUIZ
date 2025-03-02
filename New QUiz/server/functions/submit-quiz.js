const OpenAI = require('openai');

// Initialize OpenAI with the latest SDK
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to analyze quiz answers and generate archetype
async function analyzeQuizResults(answers) {
  try {
    // Format answers for the prompt
    const formattedAnswers = answers.map(a => ({
      question: a.question,
      answer: a.answerText,
      description: a.description
    }));

    const prompt = `Based on these quiz answers about a brand, determine their primary brand archetype and provide recommendations:
${JSON.stringify(formattedAnswers, null, 2)}

Please provide the analysis in the following JSON format:
{
  "archetype": "Primary archetype name",
  "description": "Brief description of the archetype",
  "strengths": ["3-4 key strengths"],
  "recommendations": ["3-4 actionable recommendations"],
  "traits": ["3-4 key personality traits"]
}`;

    console.log('Debug - OpenAI prompt:', prompt);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are a brand strategy expert specializing in brand archetypes. Analyze the answers and provide insights in the requested JSON format." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      presence_penalty: 0.3,
      frequency_penalty: 0.3
    });

    const content = completion.choices[0].message.content;
    console.log('Debug - OpenAI response:', content);

    try {
      const result = JSON.parse(content);
      
      // Validate the response structure
      const requiredFields = ['archetype', 'description', 'strengths', 'recommendations', 'traits'];
      const missingFields = requiredFields.filter(field => !result[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`OpenAI response missing required fields: ${missingFields.join(', ')}`);
      }

      return result;
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      throw new Error('Failed to parse analysis results. Please try again.');
    }
  } catch (error) {
    console.error('Error analyzing quiz results:', error);
    
    if (error.response?.status === 429) {
      throw new Error('Service is currently busy. Please try again in a few minutes.');
    }
    
    throw new Error(`Failed to analyze quiz results: ${error.message}`);
  }
}

exports.handler = async (event, context) => {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS request (preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ 
        success: false, 
        message: 'Method not allowed' 
      }),
    };
  }

  try {
    // Validate OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not configured');
      throw new Error('Server configuration error');
    }

    console.log('Debug - Received event body:', event.body);

    // Parse and validate the incoming request body
    let data;
    try {
      data = JSON.parse(event.body);
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'Invalid request body format' 
        }),
      };
    }

    console.log('Debug - Parsed data:', JSON.stringify(data, null, 2));

    const { metadata, answers } = data;

    // Validate metadata structure
    if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
      console.error('Invalid metadata structure:', metadata);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'Invalid metadata format' 
        }),
      };
    }

    // Validate required metadata fields
    const requiredMetadataFields = ['name', 'email', 'companyName', 'websiteUrl'];
    const missingFields = requiredMetadataFields.filter(field => 
      !metadata[field] || 
      typeof metadata[field] !== 'string' || 
      !metadata[field].trim()
    );
    
    if (missingFields.length > 0) {
      console.error('Missing or invalid metadata fields:', missingFields);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: `Missing or invalid metadata fields: ${missingFields.join(', ')}` 
        }),
      };
    }

    // Validate email format
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(metadata.email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'Invalid email format' 
        }),
      };
    }

    // Validate website URL format
    const urlRegex = /^https?:\/\/.+\..+/;
    if (!urlRegex.test(metadata.websiteUrl)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'Invalid website URL format' 
        }),
      };
    }

    // Validate answers array
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      console.error('Invalid answers array:', answers);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'Invalid answers format or empty answers array' 
        }),
      };
    }

    // Validate each answer object
    const requiredAnswerFields = ['id', 'question', 'answer', 'answerText'];
    const invalidAnswers = answers.filter(answer => 
      !answer || 
      typeof answer !== 'object' ||
      requiredAnswerFields.some(field => !answer[field] || typeof answer[field] !== 'string')
    );

    if (invalidAnswers.length > 0) {
      console.error('Invalid answer objects found:', invalidAnswers);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'One or more answers are missing required fields or have invalid format' 
        }),
      };
    }

    // Analyze the quiz results with validated data
    const analysis = await analyzeQuizResults(answers);
    console.log('Debug - Analysis result:', JSON.stringify(analysis, null, 2));

    // Prepare the response
    const response = {
      success: true,
      metadata: {
        name: metadata.name.trim(),
        email: metadata.email.trim(),
        companyName: metadata.companyName.trim(),
        websiteUrl: metadata.websiteUrl.trim()
      },
      result: analysis,
      timestamp: new Date().toISOString()
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    };

  } catch (error) {
    console.error('Error processing quiz submission:', error);

    // Handle specific error types
    if (error.message.includes('Server configuration error')) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Server configuration error. Please contact support.'
        }),
      };
    }

    if (error.message.includes('Service is currently busy')) {
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({
          success: false,
          message: error.message
        }),
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Error processing quiz submission',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
    };
  }
}; 
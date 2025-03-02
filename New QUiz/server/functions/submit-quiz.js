const OpenAI = require('openai');

// Initialize OpenAI with the latest SDK
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to analyze quiz answers and generate archetype
async function analyzeQuizResults(answers) {
  try {
    const prompt = `Based on these quiz answers about a brand, determine their primary brand archetype and provide recommendations:
${JSON.stringify(answers, null, 2)}

Please provide the analysis in the following JSON format:
{
  "archetype": "Primary archetype name",
  "description": "Brief description of the archetype",
  "strengths": ["3-4 key strengths"],
  "recommendations": ["3-4 actionable recommendations"]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Using GPT-3.5 Turbo instead of GPT-4 for better availability
      messages: [
        { role: "system", content: "You are a brand strategy expert specializing in brand archetypes." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;
    console.log('OpenAI response:', content); // Debug log

    return JSON.parse(content);
  } catch (error) {
    console.error('Error analyzing quiz results:', error);
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
      body: JSON.stringify({ success: false, message: 'Method not allowed' }),
    };
  }

  try {
    console.log('Debug - Received event body:', event.body); // Debug log

    // Parse the incoming request body
    const data = JSON.parse(event.body);
    console.log('Debug - Parsed data:', JSON.stringify(data, null, 2));

    const { metadata, answers } = data;

    // Enhanced validation
    if (!metadata || typeof metadata !== 'object') {
      console.error('Invalid metadata:', metadata);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'Invalid metadata format' 
        }),
      };
    }

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      console.error('Invalid answers:', answers);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'Invalid answers format or empty answers array' 
        }),
      };
    }

    // Validate required metadata fields
    const requiredMetadataFields = ['name', 'email', 'companyName', 'websiteUrl'];
    const missingFields = requiredMetadataFields.filter(field => !metadata[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing metadata fields:', missingFields);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: `Missing required metadata fields: ${missingFields.join(', ')}` 
        }),
      };
    }

    // Analyze the quiz results
    const analysis = await analyzeQuizResults(answers);
    console.log('Debug - Analysis result:', JSON.stringify(analysis, null, 2));

    // Prepare the response
    const response = {
      success: true,
      metadata,
      result: analysis,
      timestamp: new Date().toISOString(),
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    };

  } catch (error) {
    console.error('Error processing quiz submission:', error);

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
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
    console.log('Received event body:', event.body); // Debug log

    // Parse the incoming request body
    const data = JSON.parse(event.body);
    const { metadata, answers } = data;

    // Validate required fields
    if (!metadata || !answers || !Array.isArray(answers)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'Missing or invalid required fields' 
        }),
      };
    }

    // Analyze the quiz results
    const analysis = await analyzeQuizResults(answers);

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
        error: error.message
      }),
    };
  }
}; 
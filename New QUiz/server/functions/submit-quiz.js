const { Configuration, OpenAIApi } = require('openai');

// Initialize OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a brand strategy expert specializing in brand archetypes." },
        { role: "user", content: prompt }
      ],
    });

    return JSON.parse(completion.data.choices[0].message.content);
  } catch (error) {
    console.error('Error analyzing quiz results:', error);
    throw new Error('Failed to analyze quiz results');
  }
}

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  try {
    // Parse the incoming request body
    const data = JSON.parse(event.body);
    const { metadata, answers } = data;

    // Validate required fields
    if (!metadata || !answers) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing required fields' }),
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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(response),
    };

  } catch (error) {
    console.error('Error processing quiz submission:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error processing quiz submission',
        error: error.message,
      }),
    };
  }
}; 
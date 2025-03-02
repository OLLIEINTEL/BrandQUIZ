const { OpenAI } = require('openai');
const archetypes = require('../data/archetypes');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Analyze website content to determine current brand archetypes
 * @param {Object} websiteContent - Scraped website content
 * @returns {Promise<Object>} - Current brand archetypes
 */
exports.analyzeWebsite = async (websiteContent) => {
  try {
    // Create a prompt for the OpenAI API
    const archetypeDescriptions = archetypes.map(a => 
      `${a.name}: ${a.description} (Keywords: ${a.keywords.join(', ')})`
    ).join('\n\n');
    
    const prompt = `
      Analyze the following website content and determine which brand archetypes it most closely aligns with.
      
      WEBSITE CONTENT:
      Title: ${websiteContent.title}
      Description: ${websiteContent.description}
      H1 Tags: ${websiteContent.h1Tags.join(', ')}
      H2 Tags: ${websiteContent.h2Tags.slice(0, 5).join(', ')}
      Key Paragraphs: ${websiteContent.paragraphs.slice(0, 5).join(' ')}
      Button Text: ${websiteContent.buttonText.join(', ')}
      Navigation Items: ${websiteContent.navItems.join(', ')}
      Colors: ${websiteContent.colors ? websiteContent.colors.join(', ') : 'N/A'}
      Fonts: ${websiteContent.fonts ? websiteContent.fonts.join(', ') : 'N/A'}
      
      BRAND ARCHETYPES:
      ${archetypeDescriptions}
      
      Based on the website content, identify the primary and secondary brand archetypes that best match the brand's current positioning.
      Provide a confidence score (0-100) for each and explain your reasoning with specific examples from the content.
      
      Format your response as JSON with the following structure:
      {
        "primary": {
          "id": "archetype_id",
          "name": "Archetype Name",
          "confidence": 85,
          "reasoning": "Explanation with specific examples from the content"
        },
        "secondary": {
          "id": "archetype_id",
          "name": "Archetype Name",
          "confidence": 65,
          "reasoning": "Explanation with specific examples from the content"
        }
      }
    `;
    
    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are an expert brand strategist specializing in brand archetypes and positioning analysis.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 1000,
      response_format: { type: 'json_object' }
    });
    
    // Parse the response
    const result = JSON.parse(response.choices[0].message.content);
    
    // Add full archetype data
    result.primary = {
      ...archetypes.find(a => a.id === result.primary.id),
      confidence: result.primary.confidence,
      reasoning: result.primary.reasoning
    };
    
    result.secondary = {
      ...archetypes.find(a => a.id === result.secondary.id),
      confidence: result.secondary.confidence,
      reasoning: result.secondary.reasoning
    };
    
    return result;
    
  } catch (error) {
    console.error('Error analyzing website with OpenAI:', error);
    
    // Return default analysis if OpenAI fails
    return {
      primary: {
        ...archetypes[0],
        confidence: 30,
        reasoning: 'Default analysis due to API error. Please try again later.'
      },
      secondary: {
        ...archetypes[1],
        confidence: 20,
        reasoning: 'Default analysis due to API error. Please try again later.'
      }
    };
  }
};

/**
 * Generate a comprehensive brand archetype report
 * @param {Object} data - Data for report generation
 * @returns {Promise<string>} - HTML report
 */
exports.generateReport = async (data) => {
  try {
    const { metadata, desiredArchetypes, currentArchetypes, websiteContent } = data;
    
    // Create a prompt for the OpenAI API
    const prompt = `
      Generate a comprehensive HTML report comparing a brand's desired archetypes (based on quiz results) with their current archetypes (based on website analysis).
      
      BRAND INFORMATION:
      Company Name: ${metadata.companyName}
      Website: ${metadata.website}
      
      DESIRED ARCHETYPES (from quiz):
      Primary: ${desiredArchetypes.primary.name} (${desiredArchetypes.primary.score} points)
      Description: ${desiredArchetypes.primary.description}
      Keywords: ${desiredArchetypes.primary.keywords.join(', ')}
      
      Secondary: ${desiredArchetypes.secondary.name} (${desiredArchetypes.secondary.score} points)
      Description: ${desiredArchetypes.secondary.description}
      Keywords: ${desiredArchetypes.secondary.keywords.join(', ')}
      
      CURRENT ARCHETYPES (from website analysis):
      Primary: ${currentArchetypes.primary.name} (${currentArchetypes.primary.confidence}% confidence)
      Reasoning: ${currentArchetypes.primary.reasoning}
      
      Secondary: ${currentArchetypes.secondary.name} (${currentArchetypes.secondary.confidence}% confidence)
      Reasoning: ${currentArchetypes.secondary.reasoning}
      
      Create a beautiful, well-structured HTML report with the following sections:
      1. Executive Summary - Overview of findings and key insights
      2. Desired Brand Archetypes - Detailed explanation of quiz results
      3. Current Brand Positioning - Analysis of website and current archetypes
      4. Gap Analysis - Comparison between desired and current positioning
      5. Strategic Recommendations - Actionable steps to align brand with desired archetypes
      6. Visual Identity Suggestions - Color, typography, and imagery recommendations
      7. Messaging Framework - Tone, voice, and key messaging suggestions
      
      Use professional, insightful language. Include specific examples from the website content where relevant.
      Make the report visually appealing with appropriate HTML formatting, but keep it simple and email-friendly.
      Use inline CSS for styling (no external stylesheets).
      
      The HTML should be complete and ready to send as an email, with all necessary styling included.
    `;
    
    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are an expert brand strategist who creates insightful, actionable brand archetype reports.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });
    
    return response.choices[0].message.content;
    
  } catch (error) {
    console.error('Error generating report with OpenAI:', error);
    
    // Return a basic HTML report if OpenAI fails
    return `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2a4b8d;">Brand Archetype Report for ${data.metadata.companyName}</h1>
          <p>Thank you for taking our brand archetype quiz. We apologize, but we encountered an error generating your detailed report.</p>
          <p>Here's a summary of your results:</p>
          <h2>Your Desired Brand Archetypes:</h2>
          <ul>
            <li><strong>Primary:</strong> ${data.desiredArchetypes.primary.name}</li>
            <li><strong>Secondary:</strong> ${data.desiredArchetypes.secondary.name}</li>
          </ul>
          <p>Please contact our support team for assistance with your complete report.</p>
        </body>
      </html>
    `;
  }
};

// In your API utility file
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.com/api' 
  : 'http://localhost:3000/api'; 
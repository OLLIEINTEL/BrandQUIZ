const axios = require('axios');
const { AppError } = require('../utils/errorHandler');

// GoHighLevel API base URL
const API_BASE_URL = 'https://rest.gohighlevel.com/v1';

// GoHighLevel API key from environment variables
const API_KEY = process.env.GOHIGHLEVEL_API_KEY;

// GoHighLevel Location ID from environment variables
const LOCATION_ID = process.env.GOHIGHLEVEL_LOCATION_ID;

// Email sender details
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@brandarchetypequiz.com';
const APP_NAME = process.env.APP_NAME || 'Brand Archetype Quiz';

/**
 * Creates or updates a contact in GoHighLevel
 * @param {Object} contactData - Contact information
 * @returns {Object} - Created/updated contact data
 */
const createOrUpdateContact = async (contactData) => {
  try {
    if (!API_KEY || !LOCATION_ID) {
      throw new AppError('GoHighLevel API credentials not configured', 500);
    }
    
    // Prepare contact data for GoHighLevel API
    const contact = {
      email: contactData.email,
      firstName: contactData.name.split(' ')[0],
      lastName: contactData.name.split(' ').slice(1).join(' ') || '',
      name: contactData.name,
      companyName: contactData.companyName,
      website: contactData.websiteUrl,
      // Add custom fields for brand archetypes
      customField: {
        'desiredPrimaryArchetype': contactData.desiredPrimary,
        'desiredSecondaryArchetype': contactData.desiredSecondary,
        'currentPrimaryArchetype': contactData.currentPrimary,
        'currentSecondaryArchetype': contactData.currentSecondary,
      }
    };
    
    // First check if contact exists by email
    const searchResponse = await axios.get(
      `${API_BASE_URL}/contacts/lookup?email=${encodeURIComponent(contactData.email)}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          Version: '2021-07-28',
        },
      }
    );
    
    let contactId;
    
    if (searchResponse.data && searchResponse.data.contacts && searchResponse.data.contacts.length > 0) {
      // Contact exists, update it
      contactId = searchResponse.data.contacts[0].id;
      
      await axios.put(
        `${API_BASE_URL}/contacts/${contactId}`,
        contact,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
            Version: '2021-07-28',
          },
        }
      );
    } else {
      // Contact doesn't exist, create new one
      const createResponse = await axios.post(
        `${API_BASE_URL}/contacts`,
        contact,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
            Version: '2021-07-28',
            Location: LOCATION_ID,
          },
        }
      );
      
      contactId = createResponse.data.contact.id;
    }
    
    return { id: contactId, ...contact };
  } catch (error) {
    console.error('GoHighLevel API error:', error);
    // Return null instead of throwing to avoid breaking the main flow
    // The report should still be generated even if CRM integration fails
    return null;
  }
};

/**
 * Sends an email with the brand archetype report
 * @param {Object} emailData - Email content and recipient information
 * @returns {Object} - Email sending response
 */
const sendReportEmail = async (emailData) => {
  try {
    if (!API_KEY || !LOCATION_ID) {
      throw new AppError('GoHighLevel API credentials not configured', 500);
    }
    
    const { name, email, companyName, desiredPrimary, desiredSecondary, htmlReport } = emailData;
    
    // Prepare email data for GoHighLevel API
    const emailPayload = {
      to: [email],
      from: {
        email: FROM_EMAIL,
        name: APP_NAME,
      },
      subject: `Your ${companyName} Brand Archetype Report is Here!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <p>Hi ${name},</p>
          
          <p>Congratulations! Your personalized brand archetype report for ${companyName} is ready.</p>
          
          <p>Based on your quiz, your desired BrandType is <strong>${desiredPrimary}-${desiredSecondary}</strong>. 
          Below, you'll find a detailed comparison with your current brand type, along with actionable recommendations.</p>
          
          <div style="margin: 30px 0;">
            ${htmlReport}
          </div>
          
          <p><strong>Want more?</strong> Upgrade to our premium playbook for in-depth strategies tailored to your brand!</p>
          
          <p>Cheers,<br>${APP_NAME} Team</p>
        </div>
      `,
    };
    
    // Send email using GoHighLevel API
    const response = await axios.post(
      `${API_BASE_URL}/conversations/messages`,
      emailPayload,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          Version: '2021-07-28',
          Location: LOCATION_ID,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('GoHighLevel email sending error:', error);
    throw new AppError(`Error sending report email: ${error.message}`, 500);
  }
};

module.exports = {
  createOrUpdateContact,
  sendReportEmail,
}; 
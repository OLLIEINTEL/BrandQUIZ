const axios = require('axios');

// GoHighLevel API configuration
const GHL_API_KEY = process.env.GOHIGHLEVEL_API_KEY;
const GHL_LOCATION_ID = process.env.GOHIGHLEVEL_LOCATION_ID;
const GHL_BASE_URL = 'https://rest.gohighlevel.com/v1';

// Configure axios instance for GoHighLevel
const ghlApi = axios.create({
  baseURL: GHL_BASE_URL,
  headers: {
    'Authorization': `Bearer ${GHL_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

/**
 * Create or update a contact in GoHighLevel
 * @param {Object} metadata - User metadata
 * @returns {Promise<string>} - Contact ID
 */
exports.createOrUpdateContact = async (metadata) => {
  try {
    // Search for existing contact by email
    const searchResponse = await ghlApi.get(`/contacts/lookup?email=${encodeURIComponent(metadata.email)}&locationId=${GHL_LOCATION_ID}`);
    
    let contactId;
    
    if (searchResponse.data && searchResponse.data.contacts && searchResponse.data.contacts.length > 0) {
      // Update existing contact
      contactId = searchResponse.data.contacts[0].id;
      
      await ghlApi.put(`/contacts/${contactId}`, {
        name: metadata.name,
        email: metadata.email,
        phone: metadata.phone || '',
        companyName: metadata.companyName,
        website: metadata.website,
        locationId: GHL_LOCATION_ID,
        customField: {
          'brand_quiz_completed': 'Yes',
          'brand_quiz_date': new Date().toISOString().split('T')[0]
        }
      });
      
    } else {
      // Create new contact
      const createResponse = await ghlApi.post('/contacts', {
        name: metadata.name,
        email: metadata.email,
        phone: metadata.phone || '',
        companyName: metadata.companyName,
        website: metadata.website,
        locationId: GHL_LOCATION_ID,
        customField: {
          'brand_quiz_completed': 'Yes',
          'brand_quiz_date': new Date().toISOString().split('T')[0]
        },
        tags: ['Brand Quiz']
      });
      
      contactId = createResponse.data.contact.id;
    }
    
    // Add to 'Brand Quiz' opportunity pipeline
    await ghlApi.post('/pipelines/opportunities', {
      name: `${metadata.companyName} - Brand Archetype Analysis`,
      pipelineId: 'brand_archetype_pipeline', // Replace with your actual pipeline ID
      stageId: 'quiz_completed', // Replace with your actual stage ID
      contactId: contactId,
      monetaryValue: 0,
      locationId: GHL_LOCATION_ID
    });
    
    return contactId;
    
  } catch (error) {
    console.error('Error creating/updating contact in GoHighLevel:', error);
    throw new Error('Failed to create or update contact in CRM');
  }
};

/**
 * Send the brand archetype report via email
 * @param {string} contactId - GoHighLevel contact ID
 * @param {string} reportHtml - HTML report content
 * @returns {Promise<Object>} - Email send result
 */
exports.sendReport = async (contactId, reportHtml) => {
  try {
    // Get contact details
    const contactResponse = await ghlApi.get(`/contacts/${contactId}`);
    const contact = contactResponse.data.contact;
    
    // Send email
    const emailResponse = await ghlApi.post('/emails', {
      locationId: GHL_LOCATION_ID,
      contactId: contactId,
      subject: `Your Brand Archetype Report for ${contact.companyName}`,
      body: reportHtml,
      email: contact.email
    });
    
    return {
      id: emailResponse.data.id,
      status: 'sent'
    };
    
  } catch (error) {
    console.error('Error sending report via GoHighLevel:', error);
    throw new Error('Failed to send report email');
  }
};

/**
 * Check the status of an email
 * @param {string} emailId - GoHighLevel email ID
 * @returns {Promise<Object>} - Email status
 */
exports.checkEmailStatus = async (emailId) => {
  try {
    const response = await ghlApi.get(`/emails/${emailId}`);
    
    return {
      id: emailId,
      status: response.data.status || 'unknown'
    };
    
  } catch (error) {
    console.error('Error checking email status in GoHighLevel:', error);
    throw new Error('Failed to check email status');
  }
}; 
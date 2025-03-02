const { validationResult } = require('express-validator');
const { asyncHandler, AppError } = require('../utils/errorHandler');
const { calculateArchetypes } = require('../services/scoringService');
const { scrapeWebsite } = require('../services/scrapingService');
const { classifyCurrentBrand, generateReport } = require('../services/openaiService');
const { createOrUpdateContact, sendReportEmail } = require('../services/crmService');

/**
 * Process quiz submission, generate report, and send email
 * @route   POST /api/quiz/submit
 */
const submitQuiz = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { answers, metadata } = req.body;
  const { name, email, companyName, websiteUrl } = metadata;

  // 1. Calculate desired archetypes from quiz answers
  const desiredArchetypes = calculateArchetypes(answers);
  console.log('Desired archetypes:', desiredArchetypes);

  // 2. Scrape website content
  let websiteData;
  try {
    websiteData = await scrapeWebsite(websiteUrl);
    console.log('Website scraped successfully');
  } catch (error) {
    console.error('Website scraping error:', error);
    websiteData = {
      logoUrl: null,
      content: '', // Empty content
      originalUrl: websiteUrl,
    };
  }

  // 3. Analyze current brand archetypes using AI
  let currentArchetypes;
  try {
    if (websiteData.content && websiteData.content.length > 0) {
      currentArchetypes = await classifyCurrentBrand(websiteData.content);
      console.log('Current archetypes:', currentArchetypes);
    } else {
      // If no content was scraped, use fallback archetypes
      currentArchetypes = {
        currentPrimary: 'Unknown',
        currentSecondary: 'Unknown',
      };
      console.log('Using fallback archetypes due to empty website content');
    }
  } catch (error) {
    console.error('Brand classification error:', error);
    currentArchetypes = {
      currentPrimary: 'Unknown',
      currentSecondary: 'Unknown',
    };
  }

  // 4. Generate HTML report
  const reportData = {
    desiredPrimary: desiredArchetypes.primary,
    desiredSecondary: desiredArchetypes.secondary,
    currentPrimary: currentArchetypes.currentPrimary,
    currentSecondary: currentArchetypes.currentSecondary,
    name,
    companyName,
    websiteUrl: websiteData.originalUrl,
    logoUrl: websiteData.logoUrl,
  };

  const htmlReport = await generateReport(reportData);
  console.log('HTML report generated successfully');

  // 5. Create or update contact in GoHighLevel
  try {
    const contactData = {
      name,
      email,
      companyName,
      websiteUrl,
      desiredPrimary: desiredArchetypes.primary,
      desiredSecondary: desiredArchetypes.secondary,
      currentPrimary: currentArchetypes.currentPrimary,
      currentSecondary: currentArchetypes.currentSecondary,
    };

    await createOrUpdateContact(contactData);
    console.log('Contact created or updated in GoHighLevel');
  } catch (error) {
    console.error('GoHighLevel contact error:', error);
    // Continue anyway - don't fail if CRM integration fails
  }

  // 6. Send email with report
  try {
    const emailData = {
      name,
      email,
      companyName,
      desiredPrimary: desiredArchetypes.primary,
      desiredSecondary: desiredArchetypes.secondary,
      htmlReport,
    };

    await sendReportEmail(emailData);
    console.log('Report email sent successfully');
  } catch (error) {
    console.error('Email sending error:', error);
    // Continue anyway - we'll return success to the user
    // but log the error for troubleshooting
  }

  // 7. Return success response with brand archetype results
  res.status(200).json({
    success: true,
    message: 'Quiz processed successfully. Report will be sent via email.',
    results: {
      desiredBrandType: {
        primary: desiredArchetypes.primary,
        secondary: desiredArchetypes.secondary,
      },
      currentBrandType: {
        primary: currentArchetypes.currentPrimary,
        secondary: currentArchetypes.currentSecondary,
      },
    },
  });
});

/**
 * Check the status of a report
 * @route   GET /api/quiz/status/:reportId
 */
const checkReportStatus = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  
  // In a real implementation, you would check the status in a database
  // For now, we'll simulate a response
  
  // Mock statuses: 'processing', 'completed', 'failed'
  const statuses = ['processing', 'completed', 'failed'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  
  // If this were a real implementation, you would look up the report by ID
  res.status(200).json({
    success: true,
    reportId,
    status: randomStatus,
    message: randomStatus === 'completed' 
      ? 'Your report is ready and has been sent to your email.' 
      : randomStatus === 'processing'
        ? 'Your report is still being generated. Please check back in a few minutes.'
        : 'There was an issue generating your report. Please try again.',
  });
});

module.exports = {
  submitQuiz,
  checkReportStatus
}; 
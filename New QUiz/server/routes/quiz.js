const express = require('express');
const { body, validationResult } = require('express-validator');
const quizController = require('../controllers/quizController');

const router = express.Router();

/**
 * @route   POST /api/quiz/submit
 * @desc    Submit quiz answers and process results
 * @access  Public
 */
router.post(
  '/submit',
  [
    // Validate the request body
    body('answers').isArray().withMessage('Answers must be an array'),
    body('answers.*.questionId').isInt().withMessage('Question ID must be an integer'),
    body('answers.*.optionId').isString().withMessage('Option ID must be a string'),
    
    // Metadata validation
    body('metadata.name').notEmpty().withMessage('Name is required'),
    body('metadata.email').isEmail().withMessage('Valid email is required'),
    body('metadata.companyName').notEmpty().withMessage('Company name is required'),
    body('metadata.websiteUrl').isURL({ require_protocol: true }).withMessage('Valid website URL is required'),
  ],
  quizController.submitQuiz
);

/**
 * @route   GET /api/quiz/status/:reportId
 * @desc    Check the status of a report
 * @access  Public
 */
router.get(
  '/status/:reportId',
  quizController.checkReportStatus
);

module.exports = router; 
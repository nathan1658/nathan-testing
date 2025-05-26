// backend/routes/submissionRoutes.js
const express = require('express');
const router = express.Router();
const Submission = require('../models/submissionModel');
const { checkJwt } = require('../middleware/authMiddleware');

// @route   POST /api/submissions
// @desc    Create a new EPDS submission
// @access  Private (Requires Auth0 JWT)
router.post('/', checkJwt, async (req, res, next) => { // Added next
  try {
    const {
      age, mentalProblemHistory, previousPregnancies, deliveryDate,
      answers, totalScore, q10Score, language,
      bookingRequest, geminiTipsRequested // Optional fields
    } = req.body;

    // Get userId from authenticated user (Auth0 'sub' claim)
    // req.auth is populated by express-oauth2-jwt-bearer
    const userId = req.auth.payload.sub;

    if (!userId) {
      // This case should ideally be caught by checkJwt if token is invalid/missing
      return res.status(401).json({ message: 'User not authenticated or token invalid.' });
    }

    // Basic validation (more can be added based on schema requirements)
    if (answers === undefined || totalScore === undefined || q10Score === undefined || !language ||
        age === undefined || mentalProblemHistory === undefined || previousPregnancies === undefined || !deliveryDate ) {
        return res.status(400).json({ message: 'Missing required submission fields.' });
    }
    
    const newSubmission = new Submission({
      userId,
      age, mentalProblemHistory, previousPregnancies, deliveryDate,
      answers, totalScore, q10Score, language,
      bookingRequest, geminiTipsRequested // Include optional fields
    });

    const savedSubmission = await newSubmission.save();
    res.status(201).json(savedSubmission);
  } catch (error) {
    console.error('Error saving submission:', error);
    // Consider more specific error messages based on error type
    if (error.name === 'ValidationError') {
        // Specific handling for validation errors (client-side issue)
        return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    // For all other errors, pass to the global error handler
    next(error); 
  }
});

module.exports = router;

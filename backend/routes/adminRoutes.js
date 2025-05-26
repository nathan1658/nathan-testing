// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const Submission = require('../models/submissionModel');
const { checkJwt, checkAdminRole } = require('../middleware/authMiddleware');

// @route   GET /api/admin/submissions
// @desc    Get all EPDS submissions (for admins)
// @access  Private (Admin Role Required)
router.get('/submissions', checkJwt, checkAdminRole, async (req, res, next) => { // Added next
  try {
    // Fetch all submissions, sort by newest first
    const submissions = await Submission.find().sort({ submissionTimestamp: -1 });
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions for admin:', error); // Keep console.error for logging
    next(error); // Pass to global error handler
  }
});


// @route   GET /api/admin/statistics
// @desc    Get submission statistics (for admins)
// @access  Private (Admin Role Required)
router.get('/statistics', checkJwt, checkAdminRole, async (req, res, next) => { // Added next
  try {
    const totalSubmissions = await Submission.countDocuments();

    // Average Total Score
    // Using aggregation pipeline for average
    const avgScoreAggregation = await Submission.aggregate([
      { $group: { _id: null, averageScore: { $avg: '$totalScore' } } }
    ]);
    const averageTotalScore = avgScoreAggregation.length > 0 ? avgScoreAggregation[0].averageScore : 0;

    // Score Distribution
    const lowScoreCount = await Submission.countDocuments({ totalScore: { $gte: 0, $lte: 9 } });
    const mediumScoreCount = await Submission.countDocuments({ totalScore: { $gte: 10, $lte: 12 } });
    const highScoreCount = await Submission.countDocuments({ totalScore: { $gte: 13 } });

    // Q10 Critical Count
    const q10CriticalCount = await Submission.countDocuments({ q10Score: { $gt: 0 } });

    // Submissions by Language
    const submissionsByLangAggregation = await Submission.aggregate([
      { $group: { _id: '$language', count: { $sum: 1 } } }
    ]);
    const submissionsByLanguage = submissionsByLangAggregation.reduce((acc, langStat) => {
      if (langStat._id) { // Ensure _id is not null/undefined before assigning
        acc[langStat._id] = langStat.count;
      }
      return acc;
    }, {});

    res.json({
      totalSubmissions,
      averageTotalScore: parseFloat(averageTotalScore.toFixed(2)), // Format to 2 decimal places
      scoreDistribution: {
        low: lowScoreCount,
        medium: mediumScoreCount,
        high: highScoreCount,
      },
      q10CriticalCount,
      submissionsByLanguage,
    });

  } catch (error) {
    console.error('Error fetching statistics for admin:', error); // Keep console.error for logging
    next(error); // Pass to global error handler
  }
});

module.exports = router;

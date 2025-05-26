// backend/models/submissionModel.js
const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true }, // Auth0 user 'sub'
  // Personal Data
  age: { type: Number, required: true },
  mentalProblemHistory: { type: String, enum: ['yes', 'no', ''], required: true }, // Allow empty if not answered initially
  previousPregnancies: { type: Number, required: true, min: 0 },
  deliveryDate: { type: String, required: true }, // Storing as DD/MM/YYYY string as per form
  
  // EPDS Answers (q1 to q10)
  answers: {
    q1: { type: Number, required: true, min: 0, max: 3 },
    q2: { type: Number, required: true, min: 0, max: 3 },
    q3: { type: Number, required: true, min: 0, max: 3 },
    q4: { type: Number, required: true, min: 0, max: 3 },
    q5: { type: Number, required: true, min: 0, max: 3 },
    q6: { type: Number, required: true, min: 0, max: 3 },
    q7: { type: Number, required: true, min: 0, max: 3 },
    q8: { type: Number, required: true, min: 0, max: 3 },
    q9: { type: Number, required: true, min: 0, max: 3 },
    q10: { type: Number, required: true, min: 0, max: 3 },
  },
  
  totalScore: { type: Number, required: true, min: 0, max: 30 },
  q10Score: { type: Number, required: true, min: 0, max: 3 }, // Specifically track q10 score
  
  language: { type: String, required: true, enum: ['en', 'zh'] }, // Language of submission
  bookingRequest: { // Optional booking information
    location: { type: String }, // e.g., 'CN', 'HV', 'Dr. Pan'
    // Add other booking related fields if necessary in future
  },
  geminiTipsRequested: { type: Boolean, default: false }, // If user requested Gemini tips

  submissionTimestamp: { type: Date, default: Date.now }
});

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;

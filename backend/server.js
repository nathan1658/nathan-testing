// backend/server.js
require('dotenv').config(); // Ensure this is at the top
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Updated CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
            ? (process.env.CORS_ORIGIN || '*') // Fallback to '*' if CORS_ORIGIN not set in prod (less secure)
            : '*', // Allow all for development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
};
app.use(cors(corsOptions));
app.use(express.json()); // Middleware to parse JSON bodies

// Placeholder for MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

// Check if MONGODB_URI is provided before attempting to connect
if (MONGODB_URI && MONGODB_URI !== 'your_mongodb_connection_string_here') {
  mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('[DB] MongoDB connected successfully.'))
    .catch(err => console.error('[DB] MongoDB connection error:', err));
} else {
  console.warn('[DB] MONGODB_URI not provided or is a placeholder. Skipping MongoDB connection.');
}

// Basic Route
app.get('/', (req, res) => {
  res.send('EPDS Questionnaire Backend is running!');
});

// API routes
const submissionRoutes = require('./routes/submissionRoutes');
app.use('/api/submissions', submissionRoutes); // Mount the submission routes

const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes); // Mount the admin routes

const utilityRoutes = require('./routes/utilityRoutes');
app.use('/api', utilityRoutes); // Mount utility routes (e.g., /api/gemini-tips)

// Global error handler - MUST be last
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[SERVER] Backend server is running on http://localhost:${PORT}`);
  console.log(`[SERVER] Current NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
});

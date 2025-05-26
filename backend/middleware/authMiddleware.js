// backend/middleware/authMiddleware.js
const { auth } = require('express-oauth2-jwt-bearer');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') }); // Ensure .env variables from backend directory are loaded

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: 'RS256'
});

const checkAdminRole = (req, res, next) => {
  const rolesClaim = 'https://your-app-namespace.com/roles'; // Use the provided namespace
  const roles = req.auth && req.auth.payload && req.auth.payload[rolesClaim];
  if (roles && Array.isArray(roles) && roles.includes('admin')) {
    next(); // User has the admin role
  } else {
    res.status(403).json({ message: 'Forbidden: Requires admin role.' });
  }
};

module.exports = { checkJwt, checkAdminRole };

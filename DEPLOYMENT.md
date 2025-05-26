# Deployment Guide

This document outlines the steps and considerations for deploying the EPDS Questionnaire application (frontend and backend).

## Environment Variables

Ensure the following environment variables are set in your deployment environments.

### Frontend (Vue.js - Vite)

Create a `.env.production` file in the frontend's root directory or configure these directly in your hosting provider's settings:

*   `VITE_AUTH0_DOMAIN`: Your Auth0 application domain.
*   `VITE_AUTH0_CLIENT_ID`: Your Auth0 application Client ID.
*   `VITE_AUTH0_CALLBACK_URL`: The **production** callback URL for Auth0 (e.g., `https://your-frontend-domain.com/callback`).
*   `VITE_API_BASE_URL`: The **production** URL of your deployed backend API (e.g., `https://your-backend-api-domain.com/api`).

### Backend (Node.js - Express.js)

Create a `.env` file in the `backend` directory or configure these directly in your backend hosting environment:

*   `MONGODB_URI`: Connection string for your **production** MongoDB database.
*   `PORT`: The port your backend server will listen on (e.g., `3000` or `8080`. Hosting providers might set this automatically).
*   `AUTH0_AUDIENCE`: Your Auth0 API identifier for **production**.
*   `AUTH0_ISSUER_BASE_URL`: Your Auth0 domain (e.g., `https://your-auth0-domain.com/`).
*   `GEMINI_API_KEY`: Your Gemini API key for **production**.
*   `NODE_ENV`: Set to `production`. This is crucial for optimizations and security.
*   `CORS_ORIGIN`: The **production** URL of your frontend application (e.g., `https://your-frontend-domain.com`). Used to restrict CORS access.

## Build Process

### Frontend

1.  Navigate to the frontend root directory.
2.  Run `npm install` (or `yarn install`) if you haven't already.
3.  Run `npm run build`. This will generate optimized static assets in the `dist/` directory.

### Backend

The backend does not have a separate "build" step for this Express.js setup unless you are using TypeScript (which we are not for the backend in this plan). You deploy the source files. Ensure `npm install --omit=dev` (or `npm install --production`) is run in the production environment to install only necessary dependencies.

## Deployment

### Frontend (Static Site)

*   Deploy the contents of the `dist/` directory to a static hosting provider like:
    *   Vercel
    *   Netlify
    *   AWS S3 + CloudFront
    *   GitHub Pages (if applicable)
    *   Azure Static Web Apps
*   **Important:** Configure your hosting provider to handle Single Page Application (SPA) routing. All routes should typically redirect to `index.html` to let Vue Router handle them.

### Backend (Node.js Server)

*   Deploy the `backend/` directory contents to a Node.js hosting environment:
    *   Heroku
    *   AWS Elastic Beanstalk
    *   DigitalOcean App Platform
    *   Google App Engine or Cloud Run
    *   A Virtual Private Server (VPS) using a process manager like PM2 (`pm2 start backend/server.js --name epds-backend`).
*   Ensure all backend environment variables listed above are configured in the chosen hosting environment.
*   Make sure your MongoDB database is accessible from the deployed backend.
*   **CORS Configuration:** Update `backend/server.js` to use the `CORS_ORIGIN` environment variable for the `cors` middleware:
    ```javascript
    // backend/server.js
    // const cors = require('cors');
    // const corsOptions = {
    //   origin: process.env.NODE_ENV === 'production' ? process.env.CORS_ORIGIN : '*', // Allow all for dev, specific for prod
    // };
    // app.use(cors(corsOptions));
    // Make sure to replace the current app.use(cors()) with this.
    ```

## Auth0 Production Configuration

In your Auth0 Application settings:
*   Update **Allowed Callback URLs** to include your production frontend callback URL (e.g., `https://your-frontend-domain.com/callback`).
*   Update **Allowed Logout URLs** to include your production frontend logout URL (e.g., `https://your-frontend-domain.com/login`).
*   Update **Allowed Web Origins** to include your production frontend domain (e.g., `https://your-frontend-domain.com`).

In your Auth0 API settings (if you defined a specific API for your backend):
*   Ensure the **API Identifier** matches `AUTH0_AUDIENCE`.
*   Consider token expiration times and refresh token policies for production.
```

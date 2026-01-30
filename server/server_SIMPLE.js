/**
 * 🚀 SERVER.JS - BACKEND API SERVER
 * 
 * This file sets up the Express.js server that handles:
 * - Receiving requests from the React frontend
 * - Managing the database
 * - Calling AI APIs
 * - Sending back responses with data
 */

// Import required libraries
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { getDB } = require('./database');

// Import route handlers for different features
const logsRouter = require('./routes/logs');           // Handle log CRUD operations
const insightsRouter = require('./routes/insights');   // Handle AI insights
const cycleRouter = require('./routes/cycle');         // Handle cycle data
const notificationsRouter = require('./routes/notifications'); // Handle notifications

// ============================================================
// SETUP EXPRESS APP
// ============================================================

const app = express();
const PORT = process.env.PORT || 5000; // Use port 5000 by default

// ============================================================
// MIDDLEWARE - Functions that process every request
// ============================================================

// Allow requests from React frontend (different port)
app.use(cors());

// Parse JSON data from requests
app.use(bodyParser.json());

// Parse URL-encoded data from requests
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize the SQLite database
getDB();

// ============================================================
// ROUTE HANDLERS - Map URLs to their handlers
// ============================================================

// Logs routes: /api/logs
// - GET /api/logs - Get all logs
// - POST /api/logs - Create/update a log
app.use('/api/logs', logsRouter);

// Insights routes: /api/insights
// - GET /api/insights - Generate AI insights
app.use('/api/insights', insightsRouter);

// Cycle routes: /api/cycle
// - GET /api/cycle - Get cycle info
// - POST /api/cycle - Save cycle info
// - GET /api/cycle/predict/:year/:month - Predict period days
// - GET /api/cycle/phase/:date - Get phase for a date
app.use('/api/cycle', cycleRouter);

// Notifications routes: /api/notifications
// - GET /api/notifications - Get all notifications
app.use('/api/notifications', notificationsRouter);

// ============================================================
// HEALTH CHECK ENDPOINT
// ============================================================

/**
 * Simple endpoint to check if server is running
 * Useful for testing/monitoring
 * 
 * GET http://localhost:5000/health
 * Response: { status: 'Server is running' }
 */
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running ✅' });
});

// ============================================================
// ERROR HANDLING MIDDLEWARE
// ============================================================

/**
 * Catches any errors that happen during request processing
 * Logs the error and sends a response to the client
 * 
 * This prevents the server from crashing if something goes wrong
 */
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// ============================================================
// START SERVER
// ============================================================

/**
 * Listen for incoming requests on the specified port
 * Once started, the server is ready to handle requests
 */
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 Daily Logging System Server is RUNNING');
  console.log('='.repeat(60));
  console.log(`📍 Server URL: http://localhost:${PORT}`);
  console.log('\n📊 Available API Endpoints:\n');
  console.log('   LOGS:');
  console.log(`     GET  http://localhost:${PORT}/api/logs`);
  console.log(`     POST http://localhost:${PORT}/api/logs`);
  console.log('\n   CYCLE:');
  console.log(`     GET  http://localhost:${PORT}/api/cycle`);
  console.log(`     POST http://localhost:${PORT}/api/cycle`);
  console.log(`     GET  http://localhost:${PORT}/api/cycle/predict/{year}/{month}`);
  console.log(`     GET  http://localhost:${PORT}/api/cycle/phase/{date}`);
  console.log('\n   INSIGHTS:');
  console.log(`     GET  http://localhost:${PORT}/api/insights`);
  console.log('\n   NOTIFICATIONS:');
  console.log(`     GET  http://localhost:${PORT}/api/notifications`);
  console.log('\n   HEALTH:');
  console.log(`     GET  http://localhost:${PORT}/health`);
  console.log('\n' + '='.repeat(60) + '\n');
});

// ============================================================
// EXPLANATION OF HOW THIS WORKS
// ============================================================

/**
 * FLOW OF A REQUEST:
 * 
 * 1. React Frontend sends a request
 *    Example: GET http://localhost:5000/api/logs
 * 
 * 2. Express receives the request
 *    Middleware processes it (cors, bodyParser, etc)
 * 
 * 3. Route handler processes the request
 *    Example: logsRouter handles /api/logs
 *    - Queries the database
 *    - Calls OpenAI if needed
 *    - Gets the data ready
 * 
 * 4. Send response back to React
 *    Example: { logs: [...] }
 * 
 * 5. React updates the UI with the data
 * 
 * ERROR HANDLING:
 * - If anything goes wrong, error middleware catches it
 * - Returns error message to React
 * - Server keeps running (doesn't crash)
 */

module.exports = app;

const express = require('express');
const router = express.Router();
const LogService = require('../services/LogService');
const InsightsService = require('../services/InsightsService');
const CycleService = require('../services/CycleService');

// Get insights from logged data
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const logs = await LogService.getAllLogs();
    const cycleInfo = await CycleService.getCycleInfo();

    if (logs.length < 3) {
      return res.status(400).json({ error: 'Need at least 3 days of logged data for insights' });
    }

    const recentLogs = logs.slice(0, limit);
    const insights = InsightsService.analyzeData(recentLogs, cycleInfo);

    res.json(insights);
  } catch (error) {
    console.error('Error generating insights:', error);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
});

module.exports = router;

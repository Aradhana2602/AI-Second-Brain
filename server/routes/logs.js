const express = require('express');
const router = express.Router();
const LogService = require('../services/LogService');
const InsightsService = require('../services/InsightsService');

// Get all logs
router.get('/', async (req, res) => {
  try {
    const logs = await LogService.getAllLogs();
    res.json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// Get log by date
router.get('/:date', async (req, res) => {
  try {
    const log = await LogService.getLogByDate(req.params.date);
    if (log) {
      res.json(log);
    } else {
      res.status(404).json({ error: 'Log not found' });
    }
  } catch (error) {
    console.error('Error fetching log:', error);
    res.status(500).json({ error: 'Failed to fetch log' });
  }
});

// Create or update log
router.post('/', async (req, res) => {
  try {
    const { date, energyLevel, productivityRating, mood, symptoms, notes } = req.body;

    if (!date || !energyLevel || !productivityRating || !mood) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const log = await LogService.createOrUpdateLog(date, {
      energyLevel,
      productivityRating,
      mood,
      symptoms,
      notes
    });

    res.json(log);
  } catch (error) {
    console.error('Error saving log:', error);
    res.status(500).json({ error: 'Failed to save log' });
  }
});

// Delete log
router.delete('/:date', async (req, res) => {
  try {
    const result = await LogService.deleteLog(req.params.date);
    res.json(result);
  } catch (error) {
    console.error('Error deleting log:', error);
    res.status(500).json({ error: 'Failed to delete log' });
  }
});

module.exports = router;

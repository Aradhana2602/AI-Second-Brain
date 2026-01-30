const express = require('express');
const router = express.Router();
const CycleService = require('../services/CycleService');
const LogService = require('../services/LogService');

// Get cycle info
router.get('/', async (req, res) => {
  try {
    const cycleInfo = await CycleService.getCycleInfo();
    res.json(cycleInfo || { isConfigured: false });
  } catch (error) {
    console.error('Error fetching cycle info:', error);
    res.status(500).json({ error: 'Failed to fetch cycle info' });
  }
});

// Save cycle info
router.post('/', async (req, res) => {
  try {
    const { cycleLength, periodDuration, lastPeriodStartDate } = req.body;

    if (!cycleLength || !periodDuration || !lastPeriodStartDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const cycleInfo = await CycleService.saveCycleInfo(
      cycleLength,
      periodDuration,
      lastPeriodStartDate
    );

    res.json(cycleInfo);
  } catch (error) {
    console.error('Error saving cycle info:', error);
    res.status(500).json({ error: 'Failed to save cycle info' });
  }
});

// Get predicted period days for a month
router.get('/predict/:year/:month', async (req, res) => {
  try {
    const cycleInfo = await CycleService.getCycleInfo();
    
    if (!cycleInfo || !cycleInfo.isConfigured) {
      return res.status(400).json({ error: 'Cycle info not configured' });
    }

    const monthDate = new Date(parseInt(req.params.year), parseInt(req.params.month) - 1, 1);
    const predictedDays = CycleService.predictPeriodDays(
      cycleInfo.cycleLength,
      cycleInfo.periodDuration,
      cycleInfo.lastPeriodStartDate,
      monthDate
    );

    res.json({ predictedDays, cycleInfo });
  } catch (error) {
    console.error('Error predicting period days:', error);
    res.status(500).json({ error: 'Failed to predict period days' });
  }
});

// Get cycle phase for a specific date
router.get('/phase/:date', async (req, res) => {
  try {
    const cycleInfo = await CycleService.getCycleInfo();
    
    if (!cycleInfo || !cycleInfo.isConfigured) {
      return res.status(400).json({ error: 'Cycle info not configured' });
    }

    const phaseInfo = CycleService.predictCyclePhase(
      cycleInfo.cycleLength,
      cycleInfo.periodDuration,
      cycleInfo.lastPeriodStartDate,
      req.params.date
    );

    res.json(phaseInfo);
  } catch (error) {
    console.error('Error predicting cycle phase:', error);
    res.status(500).json({ error: 'Failed to predict cycle phase' });
  }
});

// Get energy analysis by cycle phase
router.get('/energy-analysis', async (req, res) => {
  try {
    const cycleInfo = await CycleService.getCycleInfo();
    
    if (!cycleInfo || !cycleInfo.isConfigured) {
      return res.status(400).json({ error: 'Cycle info not configured' });
    }

    const logs = await LogService.getAllLogs();
    const energyAnalysis = CycleService.getEnergyByPhase(
      logs,
      cycleInfo.cycleLength,
      cycleInfo.periodDuration,
      cycleInfo.lastPeriodStartDate
    );

    res.json({ ...energyAnalysis, cycleInfo });
  } catch (error) {
    console.error('Error analyzing energy by phase:', error);
    res.status(500).json({ error: 'Failed to analyze energy by phase' });
  }
});

module.exports = router;

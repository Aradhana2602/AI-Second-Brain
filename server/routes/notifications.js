const express = require('express');
const router = express.Router();
const NotificationService = require('../services/NotificationService');
const LogService = require('../services/LogService');
const CycleService = require('../services/CycleService');

// Get personalized notifications
router.get('/', async (req, res) => {
  try {
    const logs = await LogService.getAllLogs();
    const cycleInfo = await CycleService.getCycleInfo();

    const notifications = await NotificationService.generateSmartNotifications(logs, cycleInfo);

    res.json({
      notifications,
      timestamp: new Date().toISOString(),
      unreadCount: notifications.length
    });
  } catch (error) {
    console.error('Error generating notifications:', error);
    res.status(500).json({ error: 'Failed to generate notifications' });
  }
});

module.exports = router;

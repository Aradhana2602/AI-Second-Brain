import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NotificationsPanel.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function NotificationsPanel() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const [showPanel, setShowPanel] = useState(false);
  const [readNotifications, setReadNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
    // Refresh notifications every 30 minutes
    const interval = setInterval(fetchNotifications, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/notifications`);
      setNotifications(response.data.notifications);
      setUnread(response.data.unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = (index) => {
    const newRead = [...readNotifications];
    newRead[index] = true;
    setReadNotifications(newRead);
    setUnread(Math.max(0, unread - 1));
  };

  const handleClearAll = () => {
    setReadNotifications(new Array(notifications.length).fill(true));
    setUnread(0);
  };

  return (
    <div className="notifications-widget">
      <button 
        className="notification-bell"
        onClick={() => setShowPanel(!showPanel)}
      >
        🔔
        {unread > 0 && <span className="notification-badge">{unread}</span>}
      </button>

      {showPanel && (
        <div className="notifications-panel">
          <div className="panel-header">
            <h3>🎯 Smart Notifications</h3>
            {unread > 0 && (
              <button className="clear-btn" onClick={handleClearAll}>
                Mark all as read
              </button>
            )}
          </div>

          {loading && <p className="loading">Loading notifications...</p>}

          {notifications.length === 0 && !loading && (
            <p className="no-notifications">No notifications yet. Log some data first!</p>
          )}

          <div className="notifications-list">
            {notifications.map((notification, index) => (
              <div
                key={index}
                className={`notification-card ${readNotifications[index] ? 'read' : 'unread'}`}
                onClick={() => handleNotificationClick(index)}
              >
                <div className="notification-emoji">{notification.emoji}</div>
                <div className="notification-content">
                  <h4 className="notification-title">{notification.title}</h4>
                  <p className="notification-message">{notification.message}</p>
                  {notification.suggestions && (
                    <div className="notification-suggestions">
                      <p className="suggestions-label">💡 Try this:</p>
                      <ul>
                        {notification.suggestions.map((suggestion, idx) => (
                          <li key={idx}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {notification.actionable && (
                    <span className="actionable-badge">Action Recommended</span>
                  )}
                </div>
                {!readNotifications[index] && <div className="unread-indicator"></div>}
              </div>
            ))}
          </div>

          <div className="panel-footer">
            <button 
              className="refresh-btn"
              onClick={fetchNotifications}
              disabled={loading}
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationsPanel;

import React from 'react';
import './InsightsPanel.css';

function InsightsPanel({ insights, cycleInfo, onBack }) {
  const getEnergyTrend = () => {
    if (insights.avgEnergyLevel >= 4) return '⬆️ High Energy Trend';
    if (insights.avgEnergyLevel >= 3) return '➡️ Stable Energy';
    return '⬇️ Low Energy Trend';
  };

  const getProductivityTrend = () => {
    if (insights.avgProductivity >= 4) return '⬆️ High Productivity';
    if (insights.avgProductivity >= 3) return '➡️ Moderate Productivity';
    return '⬇️ Low Productivity';
  };

  return (
    <div className="insights-panel">
      <button className="back-btn" onClick={onBack}>← Back to Logging</button>

      <h2 className="insights-title">🧠 Your AI Insights</h2>

      <div className="insights-grid">
        <div className="insight-card energy">
          <h3>Energy Patterns</h3>
          <div className="insight-stat">
            <span className="stat-value">{insights.avgEnergyLevel?.toFixed(1)}</span>
            <span className="stat-label">/5 Average</span>
          </div>
          <p className="insight-trend">{getEnergyTrend()}</p>
          {insights.bestEnergyDays && insights.bestEnergyDays.length > 0 && (
            <div className="insight-detail">
              <p className="detail-label">Peak Energy Days:</p>
              <ul>
                {insights.bestEnergyDays.map(day => (
                  <li key={day}>{day}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="insight-card productivity">
          <h3>Productivity Insights</h3>
          <div className="insight-stat">
            <span className="stat-value">{insights.avgProductivity?.toFixed(1)}</span>
            <span className="stat-label">/5 Average</span>
          </div>
          <p className="insight-trend">{getProductivityTrend()}</p>
          {insights.mostProductiveMood && (
            <div className="insight-detail">
              <p className="detail-label">Most Productive Mood:</p>
              <p className="detail-value">{insights.mostProductiveMood}</p>
            </div>
          )}
        </div>

        <div className="insight-card symptoms">
          <h3>Symptom Patterns</h3>
          {insights.symptomFrequency && Object.keys(insights.symptomFrequency).length > 0 ? (
            <div className="insight-detail">
              <p className="detail-label">Most Common Symptoms:</p>
              <ul className="symptoms-list">
                {Object.entries(insights.symptomFrequency)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 3)
                  .map(([symptom, count]) => (
                    <li key={symptom}>
                      <span>{symptom}</span>
                      <span className="count">{count} times</span>
                    </li>
                  ))}
              </ul>
            </div>
          ) : (
            <p className="no-data">Not enough data yet</p>
          )}
        </div>

        <div className="insight-card mood">
          <h3>Mood Distribution</h3>
          {insights.moodFrequency && Object.keys(insights.moodFrequency).length > 0 ? (
            <div className="mood-distribution">
              {Object.entries(insights.moodFrequency)
                .sort((a, b) => b[1] - a[1])
                .map(([mood, count]) => (
                  <div key={mood} className="mood-bar">
                    <span className="mood-name">{mood}</span>
                    <div className="bar-container">
                      <div 
                        className="bar-fill" 
                        style={{
                          width: `${(count / insights.totalDaysLogged) * 100}%`,
                          backgroundColor: getMoodColor(mood)
                        }}
                      ></div>
                    </div>
                    <span className="mood-count">{count}</span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="no-data">Not enough data yet</p>
          )}
        </div>

        {cycleInfo && cycleInfo.isConfigured && (
          <div className="insight-card cycle">
            <h3>🔄 Cycle Tracking</h3>
            <div className="insight-detail">
              <p className="detail-label">Your Cycle:</p>
              <p className="detail-value">{cycleInfo.cycleLength}-day cycle</p>
              <p className="detail-value small">{cycleInfo.periodDuration}-day period</p>
              <p className="cycle-description">The AI predicts your period days and tracks energy patterns across all cycle phases to optimize your productivity schedule.</p>
            </div>
          </div>
        )}
      </div>

      <div className="recommendations-section">
        <h3>💡 Personalized Recommendations</h3>
        <div className="recommendations">
          {insights.recommendations && insights.recommendations.length > 0 ? (
            insights.recommendations.map((rec, index) => (
              <div key={index} className="recommendation-card">
                <p>{rec}</p>
              </div>
            ))
          ) : (
            <p className="no-data">Keep logging to get personalized recommendations!</p>
          )}
        </div>
      </div>

      <div className="insights-summary">
        <p>📊 Based on <strong>{insights.totalDaysLogged}</strong> days of logged data</p>
      </div>
    </div>
  );
}

function getMoodColor(mood) {
  const colors = {
    great: '#6bcf7f',
    good: '#9ccc65',
    neutral: '#ffd93d',
    low: '#ff9800',
    irritable: '#ff6b6b'
  };
  return colors[mood] || '#999';
}

export default InsightsPanel;

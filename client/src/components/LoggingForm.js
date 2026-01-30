import React, { useState, useEffect } from 'react';
import './LoggingForm.css';

function LoggingForm({ onSubmit, loading, initialData, cyclePhase }) {
  const [formData, setFormData] = useState({
    energyLevel: 3,
    productivityRating: 3,
    mood: 'neutral',
    symptoms: [],
    notes: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        energyLevel: initialData.energyLevel || 3,
        productivityRating: initialData.productivityRating || 3,
        mood: initialData.mood || 'neutral',
        symptoms: initialData.symptoms || [],
        notes: initialData.notes || ''
      });
    }
  }, [initialData]);

  const symptoms = ['cramps', 'fatigue', 'headache', 'bloating', 'mood swings', 'brain fog'];
  const moods = ['great', 'good', 'neutral', 'low', 'irritable'];

  const handleSymptomToggle = (symptom) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    // Reset form after submission
    setFormData({
      energyLevel: 3,
      productivityRating: 3,
      mood: 'neutral',
      symptoms: [],
      notes: ''
    });
  };

  const getMoodEmoji = (mood) => {
    const emojiMap = {
      great: '😄',
      good: '😊',
      neutral: '😐',
      low: '😔',
      irritable: '😠'
    };
    return emojiMap[mood] || '😐';
  };

  return (
    <form className="logging-form" onSubmit={handleSubmit}>
      {cyclePhase && (
        <div className="cycle-phase-info">
          <p className="phase-label">
            🔄 Current Cycle Phase: <span className="phase-name">{cyclePhase.phase.charAt(0).toUpperCase() + cyclePhase.phase.slice(1)}</span>
          </p>
          <p className="phase-hint">Expected energy: {cyclePhase.typicalEnergy}/5 • {getCyclePhaseDescription(cyclePhase.phase)}</p>
        </div>
      )}
      <div className="form-section">
        <label className="form-label">
          ⚡ Energy Level: <span className="value">{formData.energyLevel}/5</span>
        </label>
        <input
          type="range"
          min="1"
          max="5"
          value={formData.energyLevel}
          onChange={(e) => setFormData(prev => ({ ...prev, energyLevel: parseInt(e.target.value) }))}
          className="slider energy"
        />
        <div className="slider-labels">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>

      <div className="form-section">
        <label className="form-label">
          📈 Productivity Rating: <span className="value">{formData.productivityRating}/5</span>
        </label>
        <input
          type="range"
          min="1"
          max="5"
          value={formData.productivityRating}
          onChange={(e) => setFormData(prev => ({ ...prev, productivityRating: parseInt(e.target.value) }))}
          className="slider productivity"
        />
        <div className="slider-labels">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>

      <div className="form-section">
        <label className="form-label">😊 How's your mood?</label>
        <div className="mood-buttons">
          {moods.map(mood => (
            <button
              key={mood}
              type="button"
              className={`mood-btn ${formData.mood === mood ? 'active' : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, mood }))}
            >
              <span className="mood-emoji">{getMoodEmoji(mood)}</span>
              <span className="mood-label">{mood}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="form-section">
        <label className="form-label">🩺 Physical Symptoms (select all that apply)</label>
        <div className="symptoms-grid">
          {symptoms.map(symptom => (
            <label key={symptom} className="symptom-checkbox">
              <input
                type="checkbox"
                checked={formData.symptoms.includes(symptom)}
                onChange={() => handleSymptomToggle(symptom)}
              />
              <span>{symptom}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-section">
        <label className="form-label">📝 Personal Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Write about your work, activities, and anything else you want to track..."
          className="notes-input"
          rows="6"
        />
      </div>

      <button 
        type="submit" 
        className="submit-btn"
        disabled={loading}
      >
        {loading ? '💾 Saving...' : '💾 Save Log'}
      </button>
    </form>
  );
}

export default LoggingForm;

function getCyclePhaseDescription(phase) {
  const descriptions = {
    menstrual: 'Focus on rest and self-care',
    follicular: 'Great time for new projects!',
    ovulation: 'Peak energy and sociability',
    luteal: 'Reflection and consolidation time'
  };
  return descriptions[phase] || '';
}

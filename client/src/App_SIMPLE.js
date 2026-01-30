/**
 * 🧠 APP.JS - MAIN DASHBOARD COMPONENT
 * 
 * This is the main React component that handles:
 * - State management for all dashboard features
 * - API calls to the backend
 * - Navigation between pages
 * - Displaying the right component based on current page
 */

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Import all sub-components
import Calendar from './components/Calendar';
import LoggingForm from './components/LoggingForm';
import InsightsPanel from './components/InsightsPanel';
import CycleSetup from './components/CycleSetup';
import NotificationsPanel from './components/NotificationsPanel';
import Navbar from './components/Navbar';
import './App.css';

// Backend API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * MAIN APP COMPONENT
 * Manages all state and renders the appropriate page
 */
function App() {
  // ============================================================
  // STATE VARIABLES - These store all the data we need
  // ============================================================
  
  // Calendar & Date
  const [selectedDate, setSelectedDate] = useState(new Date()); // Currently selected date
  
  // Logging Data
  const [logs, setLogs] = useState([]); // All user logs
  const [loggedDates, setLoggedDates] = useState([]); // Dates that have logs
  
  // AI Insights
  const [insights, setInsights] = useState(null); // AI-generated insights
  const [showInsights, setShowInsights] = useState(false); // Show/hide insights panel
  
  // Cycle Information
  const [cycleInfo, setCycleInfo] = useState(null); // User's cycle details
  const [showCycleSetup, setShowCycleSetup] = useState(false); // Show/hide cycle setup form
  const [predictedPeriodDays, setPredictedPeriodDays] = useState([]); // Predicted period dates
  const [cyclePhase, setCyclePhase] = useState(null); // Current cycle phase info
  
  // UI State
  const [loading, setLoading] = useState(false); // Show loading spinner
  const [currentPage, setCurrentPage] = useState('home'); // 'home' or 'streamlit'

  // ============================================================
  // FETCH FUNCTIONS - Get data from the backend
  // ============================================================

  /**
   * Fetch all logs from backend
   * Called when app first loads
   */
  const fetchAllLogs = async () => {
    try {
      const response = await axios.get(`${API_URL}/logs`);
      setLogs(response.data); // Store all logs
      
      // Convert dates to a simpler format for checking
      const dates = response.data.map(log => new Date(log.date).toDateString());
      setLoggedDates(dates);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  /**
   * Fetch cycle information from backend
   * Shows setup form if not configured yet
   */
  const fetchCycleInfo = async () => {
    try {
      const response = await axios.get(`${API_URL}/cycle`);
      setCycleInfo(response.data);
      
      // If user hasn't set up cycle info yet, show the setup form
      if (!response.data.isConfigured) {
        setShowCycleSetup(true);
      }
    } catch (error) {
      console.error('Error fetching cycle info:', error);
    }
  };

  /**
   * Get predicted period dates for selected month
   * Uses cycle length to predict when period will occur
   */
  const fetchPredictedDays = useCallback(async () => {
    try {
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1; // Month is 0-indexed, so add 1
      
      const response = await axios.get(
        `${API_URL}/cycle/predict/${year}/${month}`
      );
      setPredictedPeriodDays(response.data.predictedDays || []);
    } catch (error) {
      console.error('Error fetching predicted days:', error);
    }
  }, [selectedDate]);

  /**
   * Get current cycle phase for selected date
   * Shows info like: "Day 14 - Ovulation phase - High energy"
   */
  const fetchCyclePhase = useCallback(async () => {
    try {
      const dateStr = selectedDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      const response = await axios.get(`${API_URL}/cycle/phase/${dateStr}`);
      setCyclePhase(response.data);
    } catch (error) {
      console.error('Error fetching cycle phase:', error);
    }
  }, [selectedDate]);

  // ============================================================
  // USEEFFECT HOOKS - Run functions at specific times
  // ============================================================

  /**
   * On app load: Fetch all initial data
   * Runs once when app first opens
   */
  useEffect(() => {
    fetchAllLogs();
    fetchCycleInfo();
  }, []); // Empty array = run only once

  /**
   * When cycle info or selected date changes:
   * Fetch predicted period days and current phase
   */
  useEffect(() => {
    if (cycleInfo?.isConfigured) {
      fetchPredictedDays();
      fetchCyclePhase();
    }
  }, [cycleInfo?.isConfigured, fetchPredictedDays, fetchCyclePhase]);

  /**
   * When user clicks on Streamlit link:
   * Open Streamlit app in new tab, then return to home
   */
  useEffect(() => {
    if (currentPage === 'streamlit') {
      window.open('https://ecetpgml2gtkkxarnyfuvp.streamlit.app/', '_blank');
      setCurrentPage('home'); // Go back to dashboard
    }
  }, [currentPage]);

  // ============================================================
  // EVENT HANDLERS - Functions that run when user does something
  // ============================================================

  /**
   * User clicked a date on calendar
   * Update selected date and hide insights panel
   */
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowInsights(false); // Hide old insights
  };

  /**
   * User submitted the logging form
   * Send data to backend and update calendar
   */
  const handleLogSubmit = async (logData) => {
    try {
      setLoading(true);
      
      // Format date as YYYY-MM-DD
      const dateStr = selectedDate.toISOString().split('T')[0];
      
      // Send log to backend
      const response = await axios.post(`${API_URL}/logs`, {
        date: dateStr,
        ...logData // Include mood, energy, symptoms, etc
      });

      // Update local logs list
      // Remove old log for this date, add new one
      const updatedLogs = logs.filter(log => log.date !== dateStr);
      updatedLogs.push(response.data);
      setLogs(updatedLogs);
      
      // Update logged dates list for calendar
      const dateString = new Date(response.data.date).toDateString();
      if (!loggedDates.includes(dateString)) {
        setLoggedDates([...loggedDates, dateString]);
      }

      alert('✅ Log saved successfully!');
    } catch (error) {
      console.error('Error saving log:', error);
      alert('❌ Error saving log. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * User clicked "Get AI Insights"
   * Fetch insights from OpenAI and show them
   */
  const handleGetInsights = async () => {
    try {
      setLoading(true);
      
      // Get insights from backend
      const response = await axios.get(`${API_URL}/insights`, {
        params: { limit: 100 } // Get insights for up to 100 logs
      });
      
      setInsights(response.data);
      setShowInsights(true); // Show the insights panel
    } catch (error) {
      console.error('Error fetching insights:', error);
      alert('❌ Error fetching insights. Make sure you have at least 3 days of logged data.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * User submitted cycle setup form
   * Save cycle info to backend
   */
  const handleCycleSetup = async (cycleData) => {
    try {
      setLoading(true);
      
      // Send cycle info to backend
      const response = await axios.post(`${API_URL}/cycle`, cycleData);
      setCycleInfo(response.data);
      setShowCycleSetup(false); // Hide setup form
      
      // Fetch predicted days now that cycle is configured
      fetchPredictedDays();
      
      alert('✅ Cycle information saved!');
    } catch (error) {
      console.error('Error saving cycle info:', error);
      alert('❌ Error saving cycle information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // HELPER FUNCTIONS - Check if date has logs or is period day
  // ============================================================

  /**
   * Check if a specific date has a log
   * Used to highlight logged dates on calendar
   */
  const isDateLogged = (date) => {
    return loggedDates.includes(date.toDateString());
  };

  /**
   * Check if a date is predicted period day
   * Used to show period indicator on calendar
   */
  const isDatePredictedPeriod = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return predictedPeriodDays.includes(dateStr);
  };

  /**
   * Get the log for currently selected date
   * Used to pre-fill the form with existing data
   */
  const getTodayLog = () => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return logs.find(log => log.date === dateStr);
  };

  // ============================================================
  // PAGE RENDERING - Show different content based on page
  // ============================================================

  // SHOW: Cycle setup screen (before user configures cycle)
  if (showCycleSetup) {
    return (
      <div className="app-wrapper">
        <Navbar currentPage={currentPage} onPageChange={setCurrentPage} />
        <div className="app-container">
          <header className="app-header">
            <h1>🔄 Menstrual Cycle Setup</h1>
            <p>Let's train your AI with your cycle information</p>
          </header>
          <main className="app-main">
            <CycleSetup onSubmit={handleCycleSetup} loading={loading} />
          </main>
        </div>
      </div>
    );
  }

  // SHOW: Streamlit AI Analysis page
  if (currentPage === 'streamlit') {
    return (
      <div className="app-wrapper">
        <Navbar currentPage={currentPage} onPageChange={setCurrentPage} />
        <div className="streamlit-container">
          <iframe
            src="https://ecetpgml2gtkkxarnyfuvp.streamlit.app/"
            style={{
              width: '100%',
              height: 'calc(100vh - 70px)',
              border: 'none',
              display: 'block'
            }}
            title="AI Analysis"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
          />
        </div>
      </div>
    );
  }

  // SHOW: Main dashboard (default)
  return (
    <div className="app-wrapper">
      {/* Navigation bar at top */}
      <Navbar currentPage={currentPage} onPageChange={setCurrentPage} />
      
      <div className="app-container">
        {/* Notifications panel */}
        <NotificationsPanel />
        
        {/* Header */}
        <header className="app-header">
          <h1>📊 Daily Logging System</h1>
          <p>Track your energy, mood, and cycle patterns for personalized insights</p>
          
          {/* Show cycle status if configured */}
          {cycleInfo?.isConfigured && (
            <div className="cycle-info-badge">
              🔄 Cycle Tracking Active • {cycleInfo.cycleLength}-day cycle
              <button 
                className="edit-cycle-btn" 
                onClick={() => setShowCycleSetup(true)}
              >
                Edit
              </button>
            </div>
          )}
        </header>

        {/* Main content area */}
        <main className="app-main">
          
          {/* LEFT PANEL: Calendar and phase info */}
          <div className="left-panel">
            {/* Calendar for date selection */}
            <Calendar 
              selectedDate={selectedDate}
              onDateClick={handleDateClick}
              isDateLogged={isDateLogged}
              isDatePredictedPeriod={isDatePredictedPeriod}
              loggedDates={loggedDates}
              predictedPeriodDays={predictedPeriodDays}
            />
            
            {/* Show current phase info */}
            {cyclePhase && (
              <div className="cycle-phase-card">
                <h3>Current Phase</h3>
                <p className="phase-name">
                  {cyclePhase.phase.charAt(0).toUpperCase() + cyclePhase.phase.slice(1)}
                </p>
                <p className="phase-energy">
                  Expected Energy: {cyclePhase.typicalEnergy}/5
                </p>
              </div>
            )}
            
            {/* Button to get AI insights */}
            <button 
              className="insights-btn"
              onClick={handleGetInsights}
              disabled={loading || logs.length < 3}
            >
              🧠 Get AI Insights ({logs.length} days logged)
            </button>
          </div>

          {/* CENTER PANEL: Logging form or insights */}
          <div className="center-panel">
            {/* Show selected date */}
            <h2 className="date-header">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
              {isDateLogged(selectedDate) && <span className="logged-badge">✓ Logged</span>}
              {isDatePredictedPeriod(selectedDate) && <span className="period-badge">🩸 Period</span>}
            </h2>

            {/* Show logging form (or insights if user clicked insights button) */}
            {!showInsights && (
              <LoggingForm 
                onSubmit={handleLogSubmit}
                loading={loading}
                initialData={getTodayLog()} // Pre-fill if date already has log
                cyclePhase={cyclePhase}
              />
            )}

            {/* Show insights panel */}
            {showInsights && insights && (
              <InsightsPanel 
                insights={insights}
                cycleInfo={cycleInfo}
                onBack={() => setShowInsights(false)} // Hide insights, show form
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

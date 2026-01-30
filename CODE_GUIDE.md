# 📚 CODE EXPLANATION GUIDE - AI Second Brain

## 🎯 Quick Overview

The dashboard has **two main parts**:

### 1️⃣ **Frontend (React)** - What users see
- Files: `client/src/App.js` and components
- Runs on: `http://localhost:3000`
- Shows: Calendar, forms, buttons, pages

### 2️⃣ **Backend (Node.js)** - What processes data
- Files: `server/server.js` and route handlers
- Runs on: `http://localhost:5000`
- Does: Database operations, AI calls, data processing

---

## 📱 FRONTEND EXPLANATION (App.js)

### What is React?
React is a JavaScript library that builds UIs. Think of it like:
- **Variables** = Data storage
- **Functions** = Actions/behaviors
- **Components** = Reusable pieces

### State Variables (Data Storage)

```javascript
// Date that user selected
const [selectedDate, setSelectedDate] = useState(new Date());

// All logs the user created
const [logs, setLogs] = useState([]);

// Mood insights from AI
const [insights, setInsights] = useState(null);
```

**What's `useState`?**
- Stores data that can change
- `setLogs()` updates the data
- React automatically re-renders when data changes

### useEffect (Run code at specific times)

```javascript
// Run this code when app first loads
useEffect(() => {
  fetchAllLogs();
  fetchCycleInfo();
}, []); // Empty [] = run once on load

// Run when selected date changes
useEffect(() => {
  fetchCyclePhase();
}, [selectedDate]); // [selectedDate] = run when date changes
```

**When does useEffect run?**
- `[]` = Once when app loads
- `[variable]` = When variable changes
- No array = Every time component renders

### Functions (Actions)

```javascript
// Get logs from backend
const fetchAllLogs = async () => {
  const response = await axios.get(`${API_URL}/logs`);
  setLogs(response.data); // Store in state
};

// User submitted the form
const handleLogSubmit = async (logData) => {
  const response = await axios.post(`${API_URL}/logs`, logData);
  setLogs([...logs, response.data]); // Add new log
};
```

**Key points:**
- `async/await` = Wait for API response before continuing
- `axios.get()` = Fetch data from backend (READ)
- `axios.post()` = Send data to backend (WRITE)
- `setLogs()` = Update state so UI re-renders

### Rendering (What shows on screen)

```javascript
return (
  <div>
    {/* Show calendar component */}
    <Calendar 
      selectedDate={selectedDate}
      onDateClick={handleDateClick}
    />
    
    {/* Show form component */}
    <LoggingForm 
      onSubmit={handleLogSubmit}
    />
  </div>
);
```

**Components are like building blocks:**
- Each component has its own file
- Components can pass data to each other via "props"
- Example: `<Calendar selectedDate={selectedDate} />`

---

## 🔧 BACKEND EXPLANATION (server.js)

### What is Express?
Express is a Node.js framework for building APIs. It:
- Listens for requests from React
- Processes the request
- Sends back a response

### Basic Request/Response Cycle

```
React sends:  GET http://localhost:5000/api/logs
                     ↓
Server receives and processes
                     ↓
Server responds:  { logs: [...] }
                     ↓
React updates UI
```

### Middleware (Processes every request)

```javascript
// Allow requests from different domains (React is on port 3000)
app.use(cors());

// Parse JSON data from requests
app.use(bodyParser.json());

// Initialize database
getDB();
```

**What's middleware?**
- Functions that run before route handlers
- Process the request before it reaches the handler
- Useful for common operations

### Routes (Define what each URL does)

```javascript
// Define what happens when React calls GET /api/logs
app.use('/api/logs', logsRouter);

// The route handler (in routes/logs.js) does:
// - Query database for logs
// - Return logs as JSON
```

### Route Handler Example

```javascript
// In routes/logs.js
router.get('/', (req, res) => {
  // Get all logs from database
  const logs = db.all("SELECT * FROM logs");
  
  // Send back as JSON
  res.json(logs);
});
```

**Parts:**
- `router.get('/')` = Handle GET requests to /api/logs
- `req` = Request from React (contains data)
- `res` = Response object (send data back)
- `res.json(logs)` = Convert to JSON and send

---

## 🔄 DATA FLOW EXAMPLE

### User logs a mood (Step-by-step)

```
1. User opens dashboard
   └─> React App.js loads
   └─> useEffect runs fetchAllLogs()
   └─> Axios calls: GET http://localhost:5000/api/logs
   └─> Server queries database
   └─> Server responds with all logs
   └─> React stores in state: setLogs(response.data)
   └─> Calendar renders with logged dates

2. User fills the form and clicks "Save"
   └─> handleLogSubmit() runs
   └─> Axios calls: POST http://localhost:5000/api/logs
   └─> Data sent: { date: "2026-01-25", mood: 4, energy: 3 }
   └─> Server receives request
   └─> Server saves to database
   └─> Server responds: { id: 1, date: "2026-01-25", mood: 4, energy: 3 }
   └─> React receives response
   └─> React updates state: setLogs([...old logs, new log])
   └─> Calendar re-renders with new logged date
   └─> User sees "Log saved successfully!"

3. User clicks "Get AI Insights"
   └─> handleGetInsights() runs
   └─> Axios calls: GET http://localhost:5000/api/insights
   └─> Server reads all logs from database
   └─> Server calls OpenAI API with logs
   └─> OpenAI analyzes logs and returns insights
   └─> Server sends insights back to React
   └─> React displays InsightsPanel with recommendations
```

---

## 🗄️ DATABASE (SQLite)

### Three tables

**LOGS** - Daily entries
```
id | date | mood | energy | symptoms | notes
1  | 2026-01-25 | 4 | 3 | cramping | ...
2  | 2026-01-26 | 3 | 2 | tired | ...
```

**CYCLE_INFO** - User's cycle settings
```
id | cycle_length | last_period_date | is_configured
1  | 28 | 2026-01-10 | true
```

**NOTIFICATIONS** - System alerts
```
id | message | type | read
1  | Period in 3 days | alert | false
```

### How database works

```javascript
// QUERY: Get all logs
const logs = db.all("SELECT * FROM logs");
// Returns: [{ id: 1, date: "2026-01-25", mood: 4 }, ...]

// INSERT: Add new log
db.run(
  "INSERT INTO logs (date, mood, energy) VALUES (?, ?, ?)",
  ["2026-01-25", 4, 3]
);
```

---

## 📝 SIMPLE CODE EXAMPLE

### Frontend (React)

```javascript
// App.js - simplified version

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // State: Store data
  const [mood, setMood] = useState(5);
  const [logs, setLogs] = useState([]);

  // Effect: Run on load
  useEffect(() => {
    fetchLogs();
  }, []);

  // Function: Get logs from backend
  const fetchLogs = async () => {
    const response = await axios.get('http://localhost:5000/api/logs');
    setLogs(response.data);
  };

  // Function: Save a log
  const savelog = async () => {
    await axios.post('http://localhost:5000/api/logs', {
      mood: mood,
      date: new Date()
    });
    fetchLogs(); // Refresh list
  };

  // Render: Show on screen
  return (
    <div>
      <h1>My Mood: {mood}</h1>
      <input 
        value={mood}
        onChange={(e) => setMood(e.target.value)}
      />
      <button onClick={savelog}>Save</button>
      
      <h2>My Logs:</h2>
      {logs.map(log => (
        <p key={log.id}>{log.date}: {log.mood}</p>
      ))}
    </div>
  );
}
```

### Backend (Express)

```javascript
// server.js - simplified version

const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Route: Get all logs
app.get('/api/logs', (req, res) => {
  const logs = [
    { id: 1, mood: 4, date: '2026-01-25' },
    { id: 2, mood: 3, date: '2026-01-26' }
  ];
  res.json(logs); // Send to React
});

// Route: Save a log
app.post('/api/logs', (req, res) => {
  const newLog = {
    id: 3,
    mood: req.body.mood,
    date: req.body.date
  };
  res.json(newLog); // Send confirmation
});

// Start server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
```

---

## 🚀 HOW TO RUN

```bash
# Terminal 1: Start backend
cd server
npm start
# Server runs on http://localhost:5000

# Terminal 2: Start frontend
cd client
npm start
# React runs on http://localhost:3000
```

---

## 🎓 LEARNING RESOURCES

### Key Concepts
1. **State** = Data that changes and updates the UI
2. **useEffect** = Run code at specific times
3. **Axios** = Make HTTP requests (frontend → backend)
4. **Express routes** = Define what happens at each URL
5. **Database** = Store data permanently

### Files Structure
```
├── client/
│   └── src/
│       ├── App.js (Main component)
│       ├── components/ (Smaller components)
│       └── styles/ (CSS files)
├── server/
│   ├── server.js (Main server)
│   ├── routes/ (API endpoints)
│   ├── services/ (Business logic)
│   └── database.js (Database setup)
```

---

## 💡 TIPS FOR UNDERSTANDING

1. **Start small** - Look at one component at a time
2. **Read comments** - Code has comments explaining each part
3. **Use the simplified versions** - `App_SIMPLE.js` and `server_SIMPLE.js` are easier to read
4. **Console.log** - Add logs to see what's happening
5. **Test requests** - Use Postman to test API endpoints

---

**Made with ❤️ to make learning easier!**

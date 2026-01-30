# Daily Logging System

## Overview
A full-stack application for tracking daily energy, productivity, mood, and physical symptoms with AI-powered insights.

### Features
- 📅 Interactive calendar with logged day indicators
- 📊 Daily logging form for:
  - Energy level (1-5 scale)
  - Productivity rating (1-5 scale)
  - Mood selection (great, good, neutral, low, irritable)
  - Physical symptoms (cramps, fatigue, headache, bloating, mood swings, brain fog)
  - Personal notes
- 🧠 AI-powered insights based on your patterns:
  - Energy trends
  - Productivity analysis
  - Symptom frequency
  - Mood distribution
  - Personalized recommendations

## Project Structure

```
AI-Second-Brain/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── server/                # Node.js/Express backend
    ├── routes/            # API routes
    ├── services/          # Business logic
    ├── database.js        # SQLite setup
    ├── server.js          # Main server file
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js 14+
- npm or yarn

### Server Setup
```bash
cd server
npm install
npm start
```

The server will run on `http://localhost:5000`

### Client Setup
```bash
cd client
npm install
npm start
```

The client will run on `http://localhost:3000`

## API Endpoints

- `GET /api/logs` - Get all logs
- `POST /api/logs` - Create or update a log
- `GET /api/logs/:date` - Get log for specific date
- `DELETE /api/logs/:date` - Delete a log
- `GET /api/insights` - Get AI insights (requires 3+ days of data)

## How to Use

1. **Log Your Data**: Click on a date in the calendar and fill out the daily logging form
2. **Track Progress**: Purple dots appear on the calendar for logged days
3. **Get Insights**: Click "Get AI Insights" button once you have 3+ days of logged data
4. **Review Patterns**: The AI analyzes your data and provides personalized recommendations

## Tech Stack

- **Frontend**: React 18, Axios, React Calendar, Date-fns
- **Backend**: Node.js, Express, SQLite3
- **Database**: SQLite (file-based, no server required)

## Data Privacy

All your data is stored locally in a SQLite database. No data is sent to external servers.

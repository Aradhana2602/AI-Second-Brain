# 🔔 AI Personalized Notifications Setup Guide

## Quick Start (2 minutes)

### Step 1: Get Your OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up (free tier available with $5 credits)
3. Create a new API key
4. Copy the key

### Step 2: Add API Key to Your Project
1. Open: `server/.env`
2. Replace this line:
```
OPENAI_API_KEY=your_openai_api_key_here
```
With your actual key:
```
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
```

### Step 3: Install New Dependencies
```bash
cd server
npm install
```

### Step 4: Restart Servers
Kill the old Node processes and restart:
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend  
cd client
npm start
```

---

## 🎯 What You Get

### 🔔 Smart Notifications Bell
- Fixed in top-right corner
- Red badge shows unread count
- Click to open/close panel

### 📬 Personalized Messages
The AI generates notifications based on:
- **Current Cycle Phase** (menstrual, follicular, ovulation, luteal)
- **Energy Patterns** (from your logged data)
- **Symptom Trends** (fatigue, bloating, etc.)
- **Mood History** (when are you most positive?)

### Examples of Notifications You'll Get:

**During Menstrual Phase:**
- ❤️ "Period Phase - Rest & Recover"
- "You're menstruating. Prioritize sleep, hydration, and light exercise."
- Suggestions: Drink 3L water, Get 8 hours sleep, Take a warm bath

**During Ovulation:**
- ✨ "PEAK ENERGY - Your Power Days!"
- "Maximum energy, confidence, and social skills. Use this wisely!"
- Suggestions: Schedule presentations, Important meetings, Job interviews

**Smart Predictions:**
- 📅 "Period Coming Soon" (2-3 days before)
- 🌱 "Energy Rising!" (follicular phase)
- 🎯 "Deep Work Phase" (luteal phase)

---

## 🛠️ How It Works

### Backend Flow:
```
User clicks notifications bell
    ↓
GET /api/notifications
    ↓
Backend fetches user's logs + cycle info
    ↓
NotificationService analyzes data
    ↓
Sends to OpenAI GPT API:
  - Recent logs (7 days)
  - Cycle phase data
  - Symptom patterns
  - Mood trends
    ↓
OpenAI generates personalized notifications
    ↓
Returns JSON with emoji, title, message, suggestions
    ↓
Frontend displays in beautiful notification panel
```

### Frontend Flow:
```
🔔 Bell icon (top-right corner)
    ↓ click
Notification panel slides down
    ↓
Shows 3-4 personalized alerts
    ↓
Click notification to mark as read
    ↓
Blue dot disappears, badge count decreases
```

---

## 💡 Features

### ✨ Smart Features:
- **AI-Powered**: Uses GPT to personalize messages
- **Context-Aware**: References YOUR actual data
- **Actionable**: Includes specific suggestions
- **Phase-Based**: Different messages for each cycle phase
- **Automatic Refresh**: Updates every 30 minutes
- **Manual Refresh**: Button to check now

### 📊 Data Used:
- Last 7 days of logs
- Your cycle length & period duration
- Common symptoms
- Average mood
- Current & predicted cycle phase

---

## ⚙️ Customization

### Change Refresh Interval
In `NotificationsPanel.js`, find:
```javascript
const interval = setInterval(fetchNotifications, 30 * 60 * 1000);
```
Change `30` to any minutes you want (e.g., `15` for every 15 min)

### Change AI Model
In `NotificationService.js`, find:
```javascript
model: 'gpt-3.5-turbo',
```
Can upgrade to: `'gpt-4'` (more expensive but smarter)

### Customize Prompts
Edit the `context` variable in `generateSmartNotifications()` to change what AI learns from

---

## 🐛 Troubleshooting

### "API key not found" Error
- Make sure `.env` file exists in `server/` folder
- Check API key is set correctly (no extra spaces)
- Restart servers after changing .env

### Notifications show but generic?
- API key might be invalid
- System falls back to basic notifications
- Check OpenAI API status at [platform.openai.com](https://platform.openai.com)

### Empty Notifications?
- Log at least 2 days of data first
- Click refresh button
- Wait for API response (takes 2-3 seconds)

---

## 💰 OpenAI Costs

- **Free Tier**: $5 credits (≈ 1,500,000 tokens)
- **Per Notification**: ~100-200 tokens
- **Monthly Cost**: Approximately $0.10-0.50 if you generate notifications daily

Free tier covers months of use!

---

## 🚀 Future Enhancements

Coming soon (you can add):
1. **Scheduled Notifications** - Push notifications at specific times
2. **Voice Messages** - AI reads notifications aloud
3. **Email Digests** - Weekly summary sent to email
4. **Slack Integration** - Notifications in your Slack
5. **Smart Goals** - AI tracks workout, water intake, sleep

---

## 📞 Support

If notifications aren't working:
1. Check `.env` file has API key
2. Check internet connection
3. Verify OpenAI account has credits
4. Look at browser console (F12 → Console tab) for errors
5. Check server logs in terminal

---

Enjoy your AI-powered notifications! 🎉

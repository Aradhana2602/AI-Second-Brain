# 🔔 AI Notifications - Quick Setup

## Get Started in 3 Steps:

### 1️⃣ Get OpenAI API Key (FREE)
- Sign up at [OpenAI](https://platform.openai.com)
- Create API key (free $5 credits)

### 2️⃣ Add to Your Project
Edit `server/.env`:
```
OPENAI_API_KEY=sk-your-key-here
```

### 3️⃣ Restart Backend
```bash
cd server
npm start
```

---

## 🎯 What Happens

### The Bell 🔔
- **Top-right corner** of app
- **Red badge** shows unread count
- Click to open notifications panel

### Smart Messages
AI generates personalized notifications:

✨ **Example 1 - Ovulation Phase:**
> ✨ "PEAK ENERGY - Your Power Days!"
> "Maximum energy & confidence. Schedule presentations & interviews now!"
> ✓ Try: Schedule presentations, Job interviews

❤️ **Example 2 - Menstrual Phase:**
> ❤️ "Period Phase - Rest & Recover"
> "Prioritize sleep, hydration, light exercise"
> ✓ Try: Drink 3L water, Get 8 hours sleep

📅 **Example 3 - Smart Prediction:**
> "Period Coming in 2-3 Days"
> "Stock up on supplies & plan light workload"

---

## 🤖 How AI Works

```
Your logged data
    ↓
  7-day history
  + cycle phase info
  + symptom patterns
  + mood trends
    ↓
  Send to OpenAI GPT
    ↓
AI generates personalized
notifications based on YOUR data
(not generic)
    ↓
Beautiful panel with suggestions
```

---

## 💡 No API Key? No Problem!

The app still works with **fallback notifications**:
- Phase-based messages
- Period prediction alerts
- Energy recommendations
- No OpenAI needed!

Get the AI powered version after adding your key.

---

## 🎉 Ready?

1. **Add API Key** to `server/.env`
2. **Restart servers** (npm start)
3. **Click 🔔 bell** in top-right
4. **See AI notifications!**

See `NOTIFICATIONS_SETUP.md` for detailed guide.

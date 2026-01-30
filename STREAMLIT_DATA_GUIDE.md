# Streamlit App - Sample Data Guide

## 📊 Data Format for AI Analysis

The Streamlit app reads from **SQLite database** (not PDF uploads). Use these sample formats to populate your database:

---

## 1️⃣ **CSV Format** (`sample_data.csv`)

```csv
date,mood,energy,symptoms,notes
2026-01-15,4,3,"headache,fatigue","Good day overall"
2026-01-16,3,2,"fatigue,cramps,headache","Felt tired"
2026-01-17,2,1,"cramps,bloating,fatigue","Period started"
```

### Columns:
- **date**: YYYY-MM-DD format
- **mood**: 1-5 scale (1=irritable, 5=great)
- **energy**: 1-5 scale (1=exhausted, 5=energetic)
- **symptoms**: Comma-separated list (headache, fatigue, cramps, bloating, mood_swings, etc.)
- **notes**: Free text observations

---

## 2️⃣ **JSON Format** (`sample_data.json`)

```json
{
  "logs": [
    {
      "date": "2026-01-15",
      "mood": 4,
      "energy": 3,
      "symptoms": ["headache", "fatigue"],
      "notes": "Good day overall"
    }
  ],
  "cycle_info": {
    "cycle_length": 28,
    "last_period_date": "2026-01-17",
    "is_configured": true
  }
}
```

---

## 3️⃣ **How to Use with Streamlit**

### Option A: Upload CSV to React Dashboard
1. Log data manually through the React form (recommended)
2. Submit daily logs
3. Streamlit app automatically reads from database

### Option B: Import CSV to SQLite (if creating sample dataset)
```python
import pandas as pd
import sqlite3

df = pd.read_csv('sample_data.csv')
conn = sqlite3.connect('database.db')
df.to_sql('logs', conn, if_exists='append', index=False)
conn.close()
```

### Option C: Use React Dashboard to Log
1. Open http://localhost:3000
2. Click calendar dates
3. Fill mood, energy, symptoms
4. Click "Submit Log"
5. Streamlit automatically sees the data

---

## 📈 What Streamlit App Analyzes

Once data is in the database, Streamlit generates:

✅ **Mood Trends** - Line charts showing mood over time  
✅ **Energy Patterns** - Energy levels by cycle phase  
✅ **Symptom Correlations** - Which symptoms appear together  
✅ **Cycle Phase Analysis** - Mood/energy by phase (follicular, ovulation, luteal, menstrual)  
✅ **ML Predictions** - Predicts mood/energy for upcoming days  
✅ **Health Recommendations** - Personalized suggestions based on patterns  

---

## 🔄 Data Flow for Analysis

```
React Dashboard (Log data)
    ↓
SQLite Database
    ↓
Streamlit App (Read & Analyze)
    ↓
Visualizations & Predictions
```

---

## 📋 Sample Cycle Configuration

```json
{
  "cycle_length": 28,           // days (typically 21-35)
  "last_period_date": "2026-01-17",  // YYYY-MM-DD format
  "is_configured": true
}
```

### Cycle Phases (28-day cycle):
- **Day 1-5**: Menstrual (Low energy, mood swings)
- **Day 6-13**: Follicular (Rising energy, improving mood)
- **Day 14**: Ovulation (Peak energy, high mood)
- **Day 15-28**: Luteal (Declining energy, mood swings, PMS)

---

## 🎯 Minimum Data Required

- **At least 2-3 weeks** of logs for meaningful patterns
- **Cycle configuration** (cycle length + last period date)
- **Consistent tracking** (daily entries recommended)

---

## 📝 Tips for Best Results

1. **Be consistent** - Log every day for better analysis
2. **Include symptoms** - More detailed symptoms = better correlations
3. **Add notes** - Context helps AI understand patterns
4. **Update cycle info** - Streamlit uses this for phase calculations
5. **Track 1-2 cycles** - Need full cycle data for accurate predictions

---

## 🔗 Files Provided

- `sample_data.csv` - 16 days of sample logs (CSV format)
- `sample_data.json` - Same data in JSON format
- This guide - Instructions for using data with Streamlit

---

**Ready to analyze?**
1. Use React dashboard to log your own data, OR
2. Import sample_data.csv into database, OR
3. Open Streamlit app when you have 3+ days of logs

Streamlit app URL: https://ecetpgml2gtkkxarnyfuvp.streamlit.app/

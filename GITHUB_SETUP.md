# GitHub Setup Instructions for AI Second Brain

## Quick Setup (PowerShell)

Run these commands in order:

```powershell
cd "c:\Users\ARADHANA KUMARI\OneDrive\Desktop\AI-Second-Brain"

# Step 1: Initialize Git
git init

# Step 2: Add all files
git add .

# Step 3: Create initial commit
git commit -m "Initial commit: AI Second Brain - Full-stack health tracking application`n`n- React dashboard for daily logging`n- Express.js backend API`n- SQLite database`n- Streamlit AI analysis tool`n- OpenAI integration for insights"
```

## Then Create Repository on GitHub

1. **Go to:** https://github.com/new
2. **Fill in:**
   - Repository name: `AI-Second-Brain`
   - Description: `Full-stack health tracking app with AI-powered insights`
   - Visibility: **Public** (recommended)
3. **Important:** DO NOT check any boxes for README, .gitignore, or license
4. **Click:** "Create repository"

## Push to GitHub

Copy and run ONE of these command sets:

### Option A: HTTPS (Recommended - Easier)
```powershell
git remote add origin https://github.com/Aradhana2602/AI-Second-Brain.git
git branch -M main
git push -u origin main
```

### Option B: SSH (Requires SSH key setup)
```powershell
git remote add origin git@github.com:Aradhana2602/AI-Second-Brain.git
git branch -M main
git push -u origin main
```

## After Pushing

Your repository will be available at:
```
https://github.com/Aradhana2602/AI-Second-Brain
```

---

## Project Structure Being Pushed

```
AI-Second-Brain/
├── client/                    # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── server/                    # Express backend
│   ├── routes/
│   ├── services/
│   ├── server.js
│   └── database.js
├── sample_data.csv           # 16 days of sample data
├── sample_data.json          # JSON format sample data
├── import_sample_data.py     # Script to import data
├── STREAMLIT_DATA_GUIDE.md   # Guide for Streamlit
├── PROJECT_OVERVIEW.md       # Project documentation
├── README.md                 # Main readme
└── .gitignore               # Git ignore file
```

---

## Troubleshooting

**If you get "fatal: not a git repository":**
```powershell
cd "c:\Users\ARADHANA KUMARI\OneDrive\Desktop\AI-Second-Brain"
git status  # Check if .git folder exists
```

**If you need to authenticate:**
- Use HTTPS with GitHub token: https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token
- Or set up SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

**If files are too large:**
```powershell
# Check which files are large
Get-ChildItem -Recurse | Sort-Object -Property Length -Descending | Select-Object -First 10 FullName, Length
```

---

## Next Steps After Pushing

1. **Add a proper README** with installation instructions
2. **Add LICENSE** (e.g., MIT License)
3. **Create GitHub Issues** for features/bugs
4. **Add GitHub Actions** for automated testing
5. **Enable GitHub Pages** for documentation
6. **Create .gitignore** to exclude node_modules, .env, logs.db

---

**Ready? Start with Step 1 above!** 🚀

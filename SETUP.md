# Padel Tbilisi - Quick Setup Guide

## 🚀 Your Platform is Ready!

The booking platform is fully built and tested. Follow these steps to make it live.

## Step 1: Test Locally ✅

The platform is already working with demo data!

**Open in browser:**
```
file:///C:/Users/kiril/.gemini/antigravity/scratch/padel-booking/index.html
```

You should see 3 demo events. Try:
- ✅ Clicking "Создать новое мероприятие"
- ✅ Clicking "Присоединиться" on an event
- ✅ Resizing your browser to see mobile view

## Step 2: Set Up Google Services

### A. Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create new sheet: "Padel Community"
3. Add these column headers in row 1:
   ```
   ID | DateTime | Location | Organizer | Participants | Status
   ```
4. Add sample data (row 2):
   ```
   1 | 2025-11-29T18:00 | Теннисный клуб | Георгий | Георгий, Лева | active
   ```
5. **Share**: Click "Share" → "Anyone with the link" → "Viewer"
6. **Publish**: File → Share → Publish to web → Select "Events" sheet → CSV
7. **Copy the URL** - you'll need it!

### B. Create Google Forms

**Form 1: Join Event**
1. Create new form: "Padel - Join Event"
2. Add questions:
   - Event ID (Short answer)
   - Your Name (Short answer)
3. Settings → Responses → Link to "Padel Community" sheet

**Form 2: Create Event**
1. Create new form: "Padel - Create Event"
2. Add questions:
   - Date (Date)
   - Time Start (Short answer)
   - Time End (Short answer)
   - Location (Paragraph)
   - Your Name (Short answer)
3. Settings → Responses → Link to same sheet

**Get Form URLs:**
- Click "Send" → Link icon → Copy URL
- You need the "formResponse" URL for submissions

### C. Set Up Apps Script

1. Open your Google Sheet
2. Extensions → Apps Script
3. Delete default code
4. Copy the script from `README.md` section 3
5. Save (Ctrl+S)
6. Set up trigger:
   - Click clock icon (Triggers)
   - Add Trigger
   - Function: `onFormSubmit`
   - Event: "On form submit"
   - Save

## Step 3: Configure the Website

Open `app.js` and update lines 15-21:

```javascript
const CONFIG = {
  // Replace with your Google Sheets JSON URL
  SHEETS_URL: 'https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/gviz/tq?tqx=out:json&sheet=Events',
  
  // Replace with your form URLs
  JOIN_FORM_URL: 'https://docs.google.com/forms/d/e/YOUR_JOIN_FORM_ID/formResponse',
  CREATE_FORM_URL: 'https://docs.google.com/forms/d/e/YOUR_CREATE_FORM_ID/formResponse',
  
  REFRESH_INTERVAL: 30000,
  // ...
};
```

**How to get Sheet URL:**
- Your sheet ID is in the URL: `docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
- Use this format: `https://docs.google.com/spreadsheets/d/SHEET_ID/gviz/tq?tqx=out:json&sheet=Events`

## Step 4: Deploy to GitHub Pages

### Option A: Using GitHub Desktop (Easy)

1. Download [GitHub Desktop](https://desktop.github.com/)
2. File → New Repository
   - Name: `padel-booking`
   - Local Path: `C:\Users\kiril\.gemini\antigravity\scratch\padel-booking`
3. Publish to GitHub (make it public)
4. Go to your repo on GitHub.com
5. Settings → Pages
6. Source: "Deploy from branch"
7. Branch: `main`, folder: `/(root)`
8. Save

Your site will be at: `https://YOUR_USERNAME.github.io/padel-booking/`

### Option B: Using Git Command Line

```bash
cd C:\Users\kiril\.gemini\antigravity\scratch\padel-booking

git init
git add .
git commit -m "Initial commit: Padel Tbilisi Platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/padel-booking.git
git push -u origin main
```

Then enable GitHub Pages in repository settings.

## Step 5: Test Everything

Once deployed, test:

1. ✅ Open your GitHub Pages URL
2. ✅ Check that events load from Google Sheets
3. ✅ Try joining an event (add your name)
4. ✅ Wait 30 seconds, refresh, see if your name appears
5. ✅ Try creating a new event
6. ✅ Check Google Sheet to see if it was added
7. ✅ Test on mobile phone

## 🎉 You're Done!

Share your URL with the Padel community:
- Telegram groups
- WhatsApp
- Social media

The platform will automatically:
- ✅ Show only future events
- ✅ Update every 30 seconds
- ✅ Work on all devices
- ✅ Look great when shared

## 📞 Need Help?

Check the full documentation in `README.md` for:
- Detailed setup instructions
- Troubleshooting guide
- Customization options
- Apps Script code

---

**Current Status:**
- ✅ Platform built and tested
- ✅ Demo data working
- 🔄 Waiting for Google services setup
- 🔄 Ready for deployment

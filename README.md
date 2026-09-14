# 🎓 ExamTrack — Student Exam Preparation Tracker

[![Live Demo](https://img.shields.io/badge/🚀_LIVE_DEMO-Open_ExamTrack_Website-4F46E5?style=for-the-badge&logo=googlechrome&logoColor=white)](https://atulkumar1506.github.io/examtrack/)
[![GitHub Pages](https://img.shields.io/badge/Hosted_on-GitHub_Pages-22c55e?style=for-the-badge&logo=github)](https://atulkumar1506.github.io/examtrack/)

👉 **Direct Web Link**: [https://atulkumar1506.github.io/examtrack/](https://atulkumar1506.github.io/examtrack/)

> **“Prepare Smarter. Track Your Progress. Ace Your Exams.”**


![ExamTrack Dashboard Preview](https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&auto=format&fit=crop&q=80)

---

## ✨ Features

- **📊 Modern Personalized Dashboard**: Dynamic greeting, urgent exam countdown clocks (e.g. *DBMS Exam — 12 Days Left*), study stats (Subjects, Topics, Hours, Readiness %), and upcoming exam cards.
- **✅ Today's Tasks & Circular Progress**: Check off daily syllabus study tasks with priority badges and real-time SVG circular completion ring + study streak tracker.
- **📚 Subjects & Granular Topic Management**: Track status (*Not Started*, *In Progress*, *Completed*), difficulty (*Easy*, *Medium*, *Hard*), estimated vs actual study hours.
- **🔄 Spaced Repetition Revision Tracker**: Dedicated active recall queue that flags topics needing revision before exam day.
- **📅 Smart Study Planner**: Weekly 7-day calendar schedule and study session slots with workload balancing.
- **⏱️ Study Focus Timer (Pomodoro)**: 25m Focus, 5m Short Break, 15m Long Break with Web Audio API chime notifications and auto-logging to topics.
- **📈 Progress Analytics**: Weekly study hours trend chart, subject readiness meters, and syllabus completion velocity.
- **🌓 Light & Dark Theme**: Full theme switcher with persistent contrast adaptation.
- **💾 100% Offline & LocalStorage**: Runs anywhere with zero backend dependencies, instant JSON export/import backups, and demo data reset.

---

## 🚀 Live Demo

You can host this project on **GitHub Pages** for free!

Once deployed, access your live link at:
```
https://<YOUR-GITHUB-USERNAME>.github.io/examtrack/
```

---

## 💻 Local Development

### Option 1: Direct Open
Simply double-click or open `index.html` in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Opera).

### Option 2: Local Server (Windows)
Double-click `start-server.bat` or run:
```powershell
powershell -ExecutionPolicy Bypass -File serve.ps1
```
The server will start at `http://localhost:8080/`.

---

## 📂 Project Structure

```
examtrack/
├── index.html              # Main application entry point & container
├── styles/
│   └── app.css             # Design tokens, themes (light/dark), and animations
├── js/
│   ├── app.js              # Application router, toasts, and controllers
│   ├── store.js            # State management, calculations, and localStorage sync
│   ├── data/
│   │   └── initialData.js  # Pre-seeded college engineering subjects and topics
│   └── components/
│       ├── navbar.js       # Top navigation, urgent exam pill, theme switcher
│       ├── landing.js      # Hero, features, interactive mockup, CTA
│       ├── auth.js         # Login, Sign Up, Forgot Password & Demo Login
│       ├── dashboard.js    # Countdown cards, statistics, today's tasks
│       ├── subjects.js     # Subjects grid, search, priority filters, modals
│       ├── subjectDetail.js# Topic checklist, difficulty, and revision counter
│       ├── planner.js      # Weekly calendar study scheduler
│       ├── timer.js        # Pomodoro focus timer with auto-logging
│       └── analytics.js    # Visual charts and spaced repetition queue
├── serve.ps1               # Lightweight local PowerShell HTTP server
└── start-server.bat        # Windows one-click launcher
```

---

## 📄 License

MIT License &copy; 2026 ExamTrack.

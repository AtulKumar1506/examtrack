/**
 * ExamTrack - Pomodoro & Focus Study Timer Component
 * Focus sessions, short/long breaks, subject/topic assignment, auto-logging to topic actual hours,
 * and Web Audio API chime sounds
 */

(function () {
  window.ExamTrackTimer = {
    timerInterval: null,
    totalSeconds: 25 * 60,
    remainingSeconds: 25 * 60,
    isRunning: false,
    mode: "pomodoro", // "pomodoro" (25m) | "shortBreak" (5m) | "longBreak" (15m) | "stopwatch"
    selectedSubjectId: "",
    selectedTopicId: "",

    render(params = {}) {
      if (params.subjectId) {
        this.selectedSubjectId = params.subjectId;
      }
      if (params.topicId) {
        this.selectedTopicId = params.topicId;
      }

      const container = document.getElementById("main-content");
      if (!container) return;

      const store = window.ExamTrackStore;
      const subjects = store.getSubjects();

      // If no subject selected yet, default to first subject
      if (!this.selectedSubjectId && subjects.length > 0) {
        this.selectedSubjectId = subjects[0].id;
      }

      const selectedSubject = store.getSubjectById(this.selectedSubjectId) || subjects[0];
      const topics = (selectedSubject && selectedSubject.topics) || [];

      // Calculate minutes and seconds
      const mins = Math.floor(this.remainingSeconds / 60);
      const secs = this.remainingSeconds % 60;
      const formattedTime = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

      // Progress percentage for circular ring
      const progressPercent =
        this.totalSeconds > 0
          ? Math.round(((this.totalSeconds - this.remainingSeconds) / this.totalSeconds) * 100)
          : 0;

      container.innerHTML = `
        <div class="fade-in space-y-8 max-w-4xl mx-auto px-4 sm:px-6 py-6">
          
          <!-- Header -->
          <div class="text-center max-w-xl mx-auto">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 mb-3">
              <i data-lucide="sparkles" class="w-3.5 h-3.5 text-amber-500"></i>
              <span>Deep Work Mode</span>
            </div>
            <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Study Focus Timer
            </h1>
            <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Eliminate distractions. Log your focused study hours directly to your syllabus topics.
            </p>
          </div>

          <!-- Main Timer Card -->
          <div class="exam-card rounded-3xl p-6 sm:p-10 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl text-center relative overflow-hidden">
            
            <!-- Mode Switcher Buttons -->
            <div class="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-8">
              <button onclick="window.ExamTrackTimer.setMode('pomodoro')"
                class="px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  this.mode === 'pomodoro'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }">
                Focus (25m)
              </button>
              <button onclick="window.ExamTrackTimer.setMode('shortBreak')"
                class="px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  this.mode === 'shortBreak'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }">
                Short Break (5m)
              </button>
              <button onclick="window.ExamTrackTimer.setMode('longBreak')"
                class="px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  this.mode === 'longBreak'
                    ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }">
                Long Break (15m)
              </button>
            </div>

            <!-- Circular Timer Display -->
            <div class="relative py-4 flex items-center justify-center">
              <svg viewBox="0 0 36 36" class="w-64 h-64 sm:w-72 sm:h-72 circular-chart">
                <path class="circle-bg"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path class="circle-fill ${
                  this.mode === 'pomodoro'
                    ? 'stroke-indigo-600 dark:stroke-indigo-400'
                    : 'stroke-emerald-500'
                }"
                  stroke-dasharray="${progressPercent}, 100"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>

              <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span id="timer-display" class="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white timer-digits tracking-tight">
                  ${formattedTime}
                </span>
                <span class="text-xs font-bold uppercase tracking-widest text-slate-400 mt-2">
                  ${this.isRunning ? 'Session Active' : 'Ready to Start'}
                </span>
              </div>
            </div>

            <!-- Timer Action Buttons -->
            <div class="mt-8 flex items-center justify-center gap-4">
              <button onclick="window.ExamTrackTimer.toggle()"
                class="px-8 py-3.5 rounded-2xl ${
                  this.isRunning
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25'
                } font-bold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer">
                <i data-lucide="${this.isRunning ? 'pause' : 'play'}" class="w-5 h-5"></i>
                <span>${this.isRunning ? 'Pause Timer' : 'Start Focus'}</span>
              </button>

              <button onclick="window.ExamTrackTimer.reset()"
                class="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                title="Reset Timer">
                <i data-lucide="rotate-ccw" class="w-5 h-5"></i>
              </button>

              <button onclick="window.ExamTrackTimer.completeAndLog()"
                class="px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
                title="Log this session now">
                <i data-lucide="check" class="w-5 h-5"></i>
                <span>Log Session</span>
              </button>
            </div>

            <!-- Subject & Topic Assignment Selector -->
            <div class="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 max-w-lg mx-auto">
              <p class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                Log Study Minutes To:
              </p>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                <div>
                  <label class="block text-[11px] font-semibold text-slate-500 mb-1">Subject</label>
                  <select id="timer-subject-select" onchange="window.ExamTrackTimer.handleSubjectChange(this.value)"
                    class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white">
                    ${subjects.map(s => `<option value="${s.id}" ${s.id === this.selectedSubjectId ? 'selected' : ''}>${s.name} (${s.code})</option>`).join("")}
                  </select>
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-slate-500 mb-1">Topic (Optional)</label>
                  <select id="timer-topic-select" onchange="window.ExamTrackTimer.handleTopicChange(this.value)"
                    class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white">
                    <option value="">General Subject Study</option>
                    ${topics.map(t => `<option value="${t.id}" ${t.id === this.selectedTopicId ? 'selected' : ''}>${t.name} (${t.status})</option>`).join("")}
                  </select>
                </div>
              </div>
            </div>

          </div>

          <!-- Pomodoro Methodology Explainer Card -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
                <i data-lucide="target" class="w-5 h-5"></i>
              </div>
              <h4 class="text-sm font-bold text-slate-900 dark:text-white">1. Choose a Topic</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Pick a single difficult concept or past question set.</p>
            </div>

            <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <div class="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-3">
                <i data-lucide="zap" class="w-5 h-5"></i>
              </div>
              <h4 class="text-sm font-bold text-slate-900 dark:text-white">2. 25-Min Pure Focus</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">No phone, no multitasking, no interruptions until the bell rings.</p>
            </div>

            <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <i data-lucide="coffee" class="w-5 h-5"></i>
              </div>
              <h4 class="text-sm font-bold text-slate-900 dark:text-white">3. Recharge & Retain</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Take 5 minutes to stretch and allow neural consolidation.</p>
            </div>
          </div>

        </div>
      `;

      if (window.lucide) {
        window.lucide.createIcons();
      }
    },

    setMode(newMode) {
      this.pause();
      this.mode = newMode;
      if (newMode === "pomodoro") {
        this.totalSeconds = 25 * 60;
      } else if (newMode === "shortBreak") {
        this.totalSeconds = 5 * 60;
      } else if (newMode === "longBreak") {
        this.totalSeconds = 15 * 60;
      }
      this.remainingSeconds = this.totalSeconds;
      this.render();
    },

    toggle() {
      if (this.isRunning) {
        this.pause();
      } else {
        this.start();
      }
    },

    start() {
      if (this.isRunning) return;
      this.isRunning = true;

      this.timerInterval = setInterval(() => {
        if (this.remainingSeconds > 0) {
          this.remainingSeconds--;
          this.updateDisplay();
        } else {
          this.pause();
          this.playChime();
          this.completeAndLog();
        }
      }, 1000);

      this.render();
    },

    pause() {
      this.isRunning = false;
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
      this.render();
    },

    reset() {
      this.pause();
      this.remainingSeconds = this.totalSeconds;
      this.render();
    },

    updateDisplay() {
      const mins = Math.floor(this.remainingSeconds / 60);
      const secs = this.remainingSeconds % 60;
      const display = document.getElementById("timer-display");
      if (display) {
        display.innerText = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
      }
    },

    handleSubjectChange(subId) {
      this.selectedSubjectId = subId;
      this.selectedTopicId = "";
      this.render();
    },

    handleTopicChange(topId) {
      this.selectedTopicId = topId;
    },

    completeAndLog() {
      const minutesSpent = Math.max(1, Math.round((this.totalSeconds - this.remainingSeconds) / 60));
      const store = window.ExamTrackStore;

      store.logStudySession(this.selectedSubjectId, this.selectedTopicId, minutesSpent);
      this.playChime();

      window.ExamTrackApp.showToast(
        `Logged ${minutesSpent} minutes of study time to your course record! 🌟`,
        "success"
      );

      this.reset();
    },

    playChime() {
      // Synthesize a pleasant chime using the Web Audio API
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5

        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.8);
      } catch (e) {
        // AudioContext not allowed or unsupported
      }
    }
  };
})();

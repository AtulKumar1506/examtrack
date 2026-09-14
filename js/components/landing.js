/**
 * ExamTrack - Landing Page Component
 * Hero, interactive dashboard preview, 6 features, 4 how-it-works steps, CTA, and footer
 */

(function () {
  window.ExamTrackLanding = {
    render() {
      const container = document.getElementById("main-content");
      if (!container) return;

      container.innerHTML = `
        <div class="fade-in space-y-24 pb-20">
          
          <!-- Hero Section -->
          <section class="relative pt-12 md:pt-20 pb-12 overflow-hidden">
            <!-- Background subtle ambient glow -->
            <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-400/15 to-purple-400/15 blur-3xl -z-10 rounded-full pointer-events-none"></div>

            <div class="max-w-5xl mx-auto text-center px-4 sm:px-6">
              <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800 mb-6">
                <span class="flex h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
                <span>The All-In-One Exam Preparation Operating System for Students</span>
              </div>

              <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                Prepare Smarter. <br class="hidden sm:inline" />
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-300">Track Your Progress.</span> <br class="hidden sm:inline" />
                Ace Your Exams.
              </h1>

              <p class="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
                Organize your subjects, create study plans, track your preparation, and stay consistent until exam day.
              </p>

              <!-- Hero Buttons -->
              <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onclick="window.ExamTrackRouter.navigate('auth', { mode: 'signup' })"
                  class="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base shadow-lg shadow-indigo-600/25 transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 group">
                  <span>Get Started Free</span>
                  <i data-lucide="arrow-right" class="w-4 h-4 group-hover:translate-x-0.5 transition-transform"></i>
                </button>
                <button onclick="window.ExamTrackRouter.navigate('dashboard')"
                  class="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-semibold text-base border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-150 cursor-pointer flex items-center justify-center gap-2">
                  <i data-lucide="play-circle" class="w-4 h-4 text-indigo-600 dark:text-indigo-400"></i>
                  <span>View Live Demo</span>
                </button>
              </div>

              <!-- Social proof metrics -->
              <div class="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium">
                <div class="flex items-center gap-1.5">
                  <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-500"></i>
                  <span>Zero setup needed</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-500"></i>
                  <span>100% Offline & LocalStorage</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-500"></i>
                  <span>Spaced repetition & Pomodoro</span>
                </div>
              </div>
            </div>

            <!-- Modern Interactive Dashboard Preview Mockup -->
            <div class="max-w-5xl mx-auto px-4 sm:px-6 mt-12">
              <div class="relative rounded-2xl p-2 bg-gradient-to-b from-indigo-500/20 via-slate-200/40 dark:via-slate-800/50 to-transparent border border-slate-200/80 dark:border-slate-800 shadow-2xl">
                
                <div class="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-inner">
                  
                  <!-- Browser Mockup Top Bar -->
                  <div class="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800">
                    <div class="flex items-center gap-2">
                      <span class="w-3 h-3 rounded-full bg-rose-400"></span>
                      <span class="w-3 h-3 rounded-full bg-amber-400"></span>
                      <span class="w-3 h-3 rounded-full bg-emerald-400"></span>
                    </div>
                    <div class="px-3 py-1 rounded-md bg-white dark:bg-slate-800 text-[11px] font-mono text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                      <i data-lucide="lock" class="w-3 h-3 text-emerald-500"></i>
                      <span>examtrack.app/dashboard</span>
                    </div>
                    <button onclick="window.ExamTrackRouter.navigate('dashboard')" class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                      Open App &rarr;
                    </button>
                  </div>

                  <!-- Live Interactive Preview Content -->
                  <div class="p-6 md:p-8 space-y-6">
                    
                    <!-- Preview Top Row -->
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <h3 class="text-xl font-bold text-slate-900 dark:text-white">Good Morning, Alex 👋</h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Here is your preparation roadmap for today. Stay focused!</p>
                      </div>
                      
                      <!-- Urgent Countdown Pill in Mockup -->
                      <div class="flex items-center gap-3 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800">
                        <div class="p-2 rounded-lg bg-indigo-600 text-white">
                          <i data-lucide="calendar-clock" class="w-4 h-4"></i>
                        </div>
                        <div>
                          <p class="text-[11px] font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">Upcoming Exam</p>
                          <p class="text-sm font-extrabold text-indigo-700 dark:text-indigo-300">DBMS Exam &bull; <span class="underline decoration-indigo-400">12 Days Left</span></p>
                        </div>
                      </div>
                    </div>

                    <!-- Mini Stat Cards in Preview -->
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                        <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Subjects</span>
                        <p class="text-2xl font-black text-slate-900 dark:text-white mt-1">6</p>
                        <span class="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                          <i data-lucide="trending-up" class="w-3 h-3"></i> All tracked
                        </span>
                      </div>

                      <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                        <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">Topics Done</span>
                        <p class="text-2xl font-black text-slate-900 dark:text-white mt-1">28<span class="text-xs text-slate-400 font-normal">/50</span></p>
                        <span class="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1 block">56% of syllabus</span>
                      </div>

                      <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                        <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">Study Hours</span>
                        <p class="text-2xl font-black text-slate-900 dark:text-white mt-1">42h</p>
                        <span class="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                          <i data-lucide="flame" class="w-3 h-3"></i> 5 day streak
                        </span>
                      </div>

                      <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                        <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">Overall Progress</span>
                        <p class="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">64%</p>
                        <div class="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div class="bg-indigo-600 h-1.5 rounded-full" style="width: 64%"></div>
                        </div>
                      </div>
                    </div>

                    <!-- Mini Preview interactive task item -->
                    <div class="p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/40 dark:bg-indigo-950/20 flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <span class="w-5 h-5 rounded border-2 border-indigo-500 flex items-center justify-center text-white bg-indigo-600">
                          <i data-lucide="check" class="w-3.5 h-3.5"></i>
                        </span>
                        <div>
                          <p class="text-sm font-bold text-slate-900 dark:text-white line-through text-slate-400 dark:text-slate-500">DBMS — Normalization — 1 hour</p>
                          <span class="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Completed 1NF, 2NF & 3NF notes</span>
                        </div>
                      </div>
                      <span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">High Priority</span>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Features Section (6 Cards) -->
          <section class="max-w-6xl mx-auto px-4 sm:px-6">
            <div class="text-center max-w-2xl mx-auto mb-16">
              <span class="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Everything You Need</span>
              <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight">
                Designed For Serious Exam Success
              </h2>
              <p class="text-slate-600 dark:text-slate-300 mt-3 text-base">
                Stop juggling scattered notebooks and random spreadsheets. ExamTrack brings your preparation into a focused, evidence-based workspace.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <!-- Feature 1 -->
              <div class="exam-card rounded-2xl p-6 transition-all hover:border-indigo-300 dark:hover:border-indigo-700">
                <div class="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                  <i data-lucide="book-open" class="w-6 h-6"></i>
                </div>
                <h3 class="text-lg font-bold text-slate-900 dark:text-white">📚 Subject & Topic Management</h3>
                <p class="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Break down course syllabi into granular topics. Track status (Not Started, In Progress, Completed) and categorize by difficulty.
                </p>
                <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  Granular syllabus mastery &rarr;
                </div>
              </div>

              <!-- Feature 2 -->
              <div class="exam-card rounded-2xl p-6 transition-all hover:border-indigo-300 dark:hover:border-indigo-700">
                <div class="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                  <i data-lucide="calendar" class="w-6 h-6"></i>
                </div>
                <h3 class="text-lg font-bold text-slate-900 dark:text-white">📅 Smart Study Planner</h3>
                <p class="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Weekly and daily calendar scheduler. Plan study slots, balance workload across difficult subjects, and avoid last-minute cramming.
                </p>
                <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-purple-600 dark:text-purple-400">
                  Weekly agenda calendar &rarr;
                </div>
              </div>

              <!-- Feature 3 -->
              <div class="exam-card rounded-2xl p-6 transition-all hover:border-indigo-300 dark:hover:border-indigo-700">
                <div class="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                  <i data-lucide="timer" class="w-6 h-6"></i>
                </div>
                <h3 class="text-lg font-bold text-slate-900 dark:text-white">⏱️ Study Time Tracking</h3>
                <p class="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Built-in Pomodoro and deep focus timer. Log actual study minutes automatically to specific topics, subjects, and analytics.
                </p>
                <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-blue-600 dark:text-blue-400">
                  Pomodoro focus mode &rarr;
                </div>
              </div>

              <!-- Feature 4 -->
              <div class="exam-card rounded-2xl p-6 transition-all hover:border-indigo-300 dark:hover:border-indigo-700">
                <div class="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                  <i data-lucide="check-square" class="w-6 h-6"></i>
                </div>
                <h3 class="text-lg font-bold text-slate-900 dark:text-white">✅ Task & Revision Tracking</h3>
                <p class="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Prioritized daily study tasks with estimated duration. Revision counter helps you apply active recall and spaced repetition before test day.
                </p>
                <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Spaced repetition count &rarr;
                </div>
              </div>

              <!-- Feature 5 -->
              <div class="exam-card rounded-2xl p-6 transition-all hover:border-indigo-300 dark:hover:border-indigo-700">
                <div class="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                  <i data-lucide="bar-chart-2" class="w-6 h-6"></i>
                </div>
                <h3 class="text-lg font-bold text-slate-900 dark:text-white">📊 Progress Analytics</h3>
                <p class="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Visual progress charts, weekly study distribution, readiness scores, and syllabus completion velocity for every subject.
                </p>
                <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-amber-600 dark:text-amber-400">
                  Readiness scores & charts &rarr;
                </div>
              </div>

              <!-- Feature 6 -->
              <div class="exam-card rounded-2xl p-6 transition-all hover:border-indigo-300 dark:hover:border-indigo-700">
                <div class="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
                  <i data-lucide="bell" class="w-6 h-6"></i>
                </div>
                <h3 class="text-lg font-bold text-slate-900 dark:text-white">🔔 Exam & Study Reminders</h3>
                <p class="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Dynamic exam countdown clocks (days, hours, minutes). Never get surprised by a mid-term, practical viva, or final paper.
                </p>
                <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-rose-600 dark:text-rose-400">
                  Never miss an exam &rarr;
                </div>
              </div>

            </div>
          </section>

          <!-- How It Works (4 Simple Steps) -->
          <section class="max-w-5xl mx-auto px-4 sm:px-6">
            <div class="text-center max-w-2xl mx-auto mb-14">
              <span class="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Simple 4-Step Process</span>
              <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight">
                How ExamTrack Works
              </h2>
              <p class="text-slate-600 dark:text-slate-300 mt-3 text-base">
                Get up and running in less than two minutes.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              
              <!-- Step 1 -->
              <div class="relative p-6 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 text-center">
                <div class="w-10 h-10 rounded-full bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center mx-auto mb-4 shadow-md shadow-indigo-600/30">
                  1
                </div>
                <h3 class="font-bold text-base text-slate-900 dark:text-white">Add your exams</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Enter exam dates, subjects, time slots, and target grades.
                </p>
              </div>

              <!-- Step 2 -->
              <div class="relative p-6 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 text-center">
                <div class="w-10 h-10 rounded-full bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center mx-auto mb-4 shadow-md shadow-indigo-600/30">
                  2
                </div>
                <h3 class="font-bold text-base text-slate-900 dark:text-white">Add subjects & topics</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  List syllabus topics, set difficulty levels, and estimate hours needed.
                </p>
              </div>

              <!-- Step 3 -->
              <div class="relative p-6 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 text-center">
                <div class="w-10 h-10 rounded-full bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center mx-auto mb-4 shadow-md shadow-indigo-600/30">
                  3
                </div>
                <h3 class="font-bold text-base text-slate-900 dark:text-white">Create study plan</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Schedule weekly study slots and set prioritized daily tasks.
                </p>
              </div>

              <!-- Step 4 -->
              <div class="relative p-6 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 text-center">
                <div class="w-10 h-10 rounded-full bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center mx-auto mb-4 shadow-md shadow-indigo-600/30">
                  4
                </div>
                <h3 class="font-bold text-base text-slate-900 dark:text-white">Track your progress</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Mark topics done, record revisions, and watch your countdown tick down with confidence.
                </p>
              </div>

            </div>
          </section>

          <!-- CTA Section -->
          <section class="max-w-5xl mx-auto px-4 sm:px-6">
            <div class="relative rounded-3xl overflow-hidden bg-gradient-to-tr from-indigo-700 via-indigo-600 to-purple-700 text-white p-8 sm:p-12 md:p-16 text-center shadow-2xl">
              <!-- Decorative background circles -->
              <div class="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
              <div class="absolute -bottom-12 -left-12 w-64 h-64 bg-purple-500/20 rounded-full blur-2xl pointer-events-none"></div>

              <div class="relative z-10 max-w-2xl mx-auto space-y-6">
                <h2 class="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                  Your exam preparation starts today.
                </h2>
                <p class="text-indigo-100 text-base sm:text-lg">
                  Join thousands of students who traded exam anxiety for structured confidence and higher scores.
                </p>
                <div class="pt-2">
                  <button onclick="window.ExamTrackRouter.navigate('auth', { mode: 'signup' })"
                    class="px-8 py-4 rounded-xl bg-white text-indigo-700 hover:bg-slate-100 font-bold text-base shadow-xl transition-all duration-150 cursor-pointer inline-flex items-center gap-2 group">
                    <span>Create Your Study Plan</span>
                    <i data-lucide="arrow-right" class="w-5 h-5 group-hover:translate-x-1 transition-transform"></i>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- Modern Footer -->
          <footer class="max-w-6xl mx-auto px-4 sm:px-6 pt-12 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <div class="flex flex-col md:flex-row items-center justify-between gap-4">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                  <i data-lucide="graduation-cap" class="w-3.5 h-3.5"></i>
                </div>
                <span class="font-bold text-slate-800 dark:text-white text-sm">ExamTrack</span>
                <span>&mdash; Student Exam Preparation Tracker</span>
              </div>

              <div class="flex items-center gap-6">
                <button onclick="window.ExamTrackRouter.navigate('dashboard')" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Dashboard</button>
                <button onclick="window.ExamTrackRouter.navigate('subjects')" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Subjects</button>
                <button onclick="window.ExamTrackRouter.navigate('planner')" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Study Planner</button>
                <button onclick="window.ExamTrackRouter.navigate('timer')" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Pomodoro Timer</button>
                <button onclick="window.ExamTrackApp.resetData()" class="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Reset Demo</button>
              </div>
            </div>
            <p class="text-center md:text-left mt-4 text-[11px] text-slate-400 dark:text-slate-500">
              Built with modern web standards. All data saved locally in your browser.
            </p>
          </footer>

        </div>
      `;

      if (window.lucide) {
        window.lucide.createIcons();
      }
    }
  };
})();

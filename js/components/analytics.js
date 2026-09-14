/**
 * ExamTrack - Progress Analytics & Revision Tracker Component
 * Weekly study hours chart, subject readiness comparison, and spaced repetition revision queue
 */

(function () {
  window.ExamTrackAnalytics = {
    chartInstance: null,

    render() {
      const container = document.getElementById("main-content");
      if (!container) return;

      const store = window.ExamTrackStore;
      const stats = store.getStatistics();
      const subjects = store.getSubjects();
      const weeklyLogs = store.state.weeklyStudyLogs || [];

      // Find topics needing revision (Spaced repetition: completed topics with revisions <= 1 or oldest revised)
      const revisionQueue = [];
      subjects.forEach((sub) => {
        (sub.topics || []).forEach((top) => {
          if (top.status === "Completed" && (top.revisionCount < 3 || !top.lastRevised)) {
            revisionQueue.push({
              subjectId: sub.id,
              subjectName: sub.name,
              topicId: top.id,
              topicName: top.name,
              difficulty: top.difficulty,
              revisionCount: top.revisionCount || 0,
              lastRevised: top.lastRevised || "Not recorded"
            });
          }
        });
      });

      // Sort revision queue by revisionCount ascending
      revisionQueue.sort((a, b) => a.revisionCount - b.revisionCount);

      // Subject readiness breakdown items
      const readinessHtml = subjects.map((sub) => {
        const topics = sub.topics || [];
        const completed = topics.filter((t) => t.status === "Completed").length;
        const total = topics.length;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

        return `
          <div class="space-y-1.5">
            <div class="flex items-center justify-between text-xs">
              <div class="flex items-center gap-2">
                <span class="font-bold text-slate-800 dark:text-white">${sub.name}</span>
                <span class="text-slate-400">(${completed}/${total} topics)</span>
              </div>
              <span class="font-extrabold ${percent >= 70 ? 'text-emerald-600 dark:text-emerald-400' : percent >= 40 ? 'text-indigo-600 dark:text-indigo-400' : 'text-amber-600 dark:text-amber-400'}">
                ${percent}%
              </span>
            </div>
            <div class="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div class="h-2.5 rounded-full ${percent >= 70 ? 'bg-emerald-500' : percent >= 40 ? 'bg-indigo-600' : 'bg-amber-500'} progress-bar-fill"
                style="width: ${percent}%"></div>
            </div>
          </div>
        `;
      }).join("");

      // Revision queue list items
      const revisionQueueHtml = revisionQueue.length > 0
        ? revisionQueue.slice(0, 6).map((item) => {
            return `
              <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-3">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">${item.subjectName}</span>
                    <span class="text-slate-300 dark:text-slate-700 text-xs">&bull;</span>
                    <span class="text-xs font-bold text-slate-800 dark:text-white">${item.topicName}</span>
                  </div>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Revisions: <strong class="text-slate-700 dark:text-slate-300 font-bold">${item.revisionCount}</strong> &bull; Last: ${item.lastRevised}
                  </p>
                </div>

                <button onclick="window.ExamTrackAnalytics.quickRevise('${item.subjectId}', '${item.topicId}')"
                  class="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 text-xs font-semibold flex items-center gap-1 cursor-pointer shrink-0">
                  <i data-lucide="repeat" class="w-3.5 h-3.5"></i>
                  <span>+ Revise</span>
                </button>
              </div>
            `;
          }).join("")
        : `
          <div class="p-6 text-center text-slate-500 text-xs">
            <i data-lucide="check-circle" class="w-6 h-6 text-emerald-500 mx-auto mb-1"></i>
            All completed topics have been revised at least 3 times! Excellent retention.
          </div>
        `;

      container.innerHTML = `
        <div class="fade-in space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          <!-- Header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                <i data-lucide="bar-chart-3" class="w-7 h-7 text-indigo-600 dark:text-indigo-400"></i>
                <span>Preparation Analytics</span>
              </h1>
              <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Visual insights on your study hours, syllabus completion rate, and spaced repetition readiness.
              </p>
            </div>

            <div class="flex items-center gap-3">
              <span class="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500 pulse-indicator"></span>
                <span>Exam Prep Index: 78 / 100</span>
              </span>
            </div>
          </div>

          <!-- Top Analytics Stats 4-Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div class="exam-card rounded-2xl p-5">
              <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Study Logged</span>
              <p class="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">${stats.totalStudyHours}h</p>
              <span class="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">Across all 6 courses</span>
            </div>

            <div class="exam-card rounded-2xl p-5">
              <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">Completion Velocity</span>
              <p class="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">4.2</p>
              <span class="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-1 block">Topics completed / week</span>
            </div>

            <div class="exam-card rounded-2xl p-5">
              <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Revisions</span>
              <p class="text-3xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">34</p>
              <span class="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-1 block">Active recall sessions</span>
            </div>

            <div class="exam-card rounded-2xl p-5">
              <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">Avg Prep Readiness</span>
              <p class="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">${stats.overallProgress}%</p>
              <span class="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">Ahead of target schedule</span>
            </div>
          </div>

          <!-- Middle Section: Weekly Study Hours Chart & Subject Readiness -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <!-- Weekly Chart (2 Cols) -->
            <div class="lg:col-span-2 exam-card rounded-2xl p-6">
              <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <i data-lucide="trending-up" class="w-4 h-4 text-indigo-600 dark:text-indigo-400"></i>
                    <span>Weekly Study Hours Trend</span>
                  </h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Hours invested over the last 7 days</p>
                </div>
                <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-lg">
                  Target: 4.5h / day
                </span>
              </div>

              <!-- SVG Interactive Bar Chart -->
              <div class="pt-6 pb-2">
                <div class="h-64 flex items-end justify-between gap-2 sm:gap-4 px-2">
                  ${weeklyLogs.map(log => {
                    const maxHours = 8;
                    const heightPercent = Math.min(100, Math.round((log.hours / maxHours) * 100));
                    const isToday = log.day.includes("Today");

                    return `
                      <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        <span class="text-[11px] font-bold text-slate-700 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                          ${log.hours}h
                        </span>
                        <div class="w-full max-w-[48px] rounded-t-xl transition-all duration-300 ${
                          isToday
                            ? 'bg-gradient-to-t from-indigo-700 to-indigo-500 shadow-md shadow-indigo-500/20'
                            : 'bg-indigo-100 dark:bg-slate-800 group-hover:bg-indigo-200 dark:group-hover:bg-slate-700'
                        }" style="height: ${heightPercent}%"></div>
                        <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate text-center block w-full mt-1">
                          ${log.day.split(" ")[0]}
                        </span>
                      </div>
                    `;
                  }).join("")}
                </div>
              </div>
            </div>

            <!-- Subject Readiness Breakdown (1 Col) -->
            <div class="exam-card rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <i data-lucide="pie-chart" class="w-4 h-4 text-purple-600 dark:text-purple-400"></i>
                  <span>Subject Readiness</span>
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Syllabus completion per subject</p>

                <div class="space-y-4 mt-6">
                  ${readinessHtml}
                </div>
              </div>

              <div class="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                <button onclick="window.ExamTrackRouter.navigate('subjects')"
                  class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                  Manage Syllabus Topics &rarr;
                </button>
              </div>
            </div>

          </div>

          <!-- Bottom Section: Spaced Repetition Revision Queue -->
          <div class="exam-card rounded-2xl p-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <i data-lucide="repeat" class="w-4 h-4 text-emerald-600 dark:text-emerald-400"></i>
                  <span>Active Recall & Spaced Repetition Queue</span>
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Scientific revision scheduling: refresh these completed topics to lock them into long-term memory.
                </p>
              </div>

              <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg self-start sm:self-auto">
                ${revisionQueue.length} Topics Recommended
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              ${revisionQueueHtml}
            </div>
          </div>

        </div>
      `;

      if (window.lucide) {
        window.lucide.createIcons();
      }
    },

    quickRevise(subjectId, topicId) {
      const store = window.ExamTrackStore;
      const updated = store.incrementRevision(subjectId, topicId);
      if (updated) {
        window.ExamTrackApp.showToast(`Revision recorded for ${updated.name}! Keep it up. 💪`, "success");
        this.render();
      }
    }
  };
})();

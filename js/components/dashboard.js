/**
 * ExamTrack - Main Dashboard Component
 * Personalized greeting, urgent countdown banner, 4 stats cards, today's tasks checklist,
 * today's circular progress chart, and upcoming exam cards
 */

(function () {
  window.ExamTrackDashboard = {
    render() {
      const container = document.getElementById("main-content");
      if (!container) return;

      const store = window.ExamTrackStore;
      const stats = store.getStatistics();
      const user = store.getCurrentUser();
      const tasks = store.getTasks();

      // Time-based dynamic greeting
      const hour = new Date().getHours();
      let greetingTime = "Good Morning";
      if (hour >= 12 && hour < 17) greetingTime = "Good Afternoon";
      else if (hour >= 17) greetingTime = "Good Evening";

      const urgent = stats.urgentExam;

      // Circular SVG Progress calculation
      const todayPercent = stats.todayCompletionPercentage;
      const strokeDashoffset = 100 - todayPercent;

      // Render Today's tasks list
      const tasksListHtml = tasks && tasks.length > 0
        ? tasks.map(task => {
            const priorityClass = task.priority === "High"
              ? "badge-priority-high"
              : task.priority === "Medium"
              ? "badge-priority-medium"
              : "badge-priority-low";

            return `
              <div class="p-3.5 sm:p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center justify-between gap-3 group">
                <div class="flex items-center gap-3.5 min-w-0">
                  <input type="checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''}
                    onchange="window.ExamTrackDashboard.toggleTask('${task.id}')"
                    class="w-5 h-5 rounded-md border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer transition-colors" />
                  
                  <div class="min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">${task.subjectName}</span>
                      <span class="text-slate-300 dark:text-slate-700 text-xs">&bull;</span>
                      <p class="text-sm font-semibold text-slate-800 dark:text-white truncate ${task.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}">
                        ${task.topic}
                      </p>
                    </div>
                    
                    <div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span class="flex items-center gap-1">
                        <i data-lucide="clock" class="w-3.5 h-3.5"></i>
                        <span>${task.estimatedTimeText || task.estimatedMinutes + ' min'}</span>
                      </span>
                      ${task.notes ? `<span class="hidden sm:inline truncate max-w-xs text-slate-400 dark:text-slate-500">&mdash; ${task.notes}</span>` : ''}
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-2 shrink-0">
                  <span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${priorityClass}">
                    ${task.priority}
                  </span>
                  <button onclick="window.ExamTrackDashboard.deleteTask('${task.id}')"
                    class="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                    title="Delete task">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                  </button>
                </div>
              </div>
            `;
          }).join("")
        : `
          <div class="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <i data-lucide="check-circle" class="w-8 h-8 text-emerald-500 mx-auto mb-2"></i>
            <p class="text-sm font-semibold text-slate-700 dark:text-slate-300">All tasks completed for today!</p>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Add a new task or take a well-deserved study break.</p>
          </div>
        `;

      // Render Upcoming Exams Cards
      const examsCardsHtml = stats.upcomingExams.map(exam => {
        const isUrgent = exam.daysRemaining <= 14;
        return `
          <div onclick="window.ExamTrackRouter.navigate('subject-detail', { id: '${exam.id}' })"
            class="exam-card clickable-card rounded-2xl p-5 cursor-pointer relative overflow-hidden transition-all">
            
            <div class="flex items-start justify-between gap-3">
              <div>
                <span class="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">${exam.code}</span>
                <h4 class="text-base font-bold text-slate-900 dark:text-white mt-0.5">${exam.name}</h4>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${exam.fullName}</p>
              </div>

              <!-- Days remaining badge -->
              <div class="text-right shrink-0">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${isUrgent ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}">
                  ${isUrgent ? '<span class="w-1.5 h-1.5 rounded-full bg-rose-500 pulse-indicator"></span>' : ''}
                  ${exam.daysRemaining} Days Left
                </span>
                <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-1 font-medium">${exam.examDate}</p>
              </div>
            </div>

            <!-- Preparation Progress Bar -->
            <div class="mt-5">
              <div class="flex items-center justify-between text-xs mb-1.5 font-medium">
                <span class="text-slate-600 dark:text-slate-400">Preparation Readiness</span>
                <span class="font-bold text-slate-900 dark:text-white">${exam.preparationPercentage}%</span>
              </div>
              <div class="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div class="h-2 rounded-full ${exam.preparationPercentage >= 75 ? 'bg-emerald-500' : exam.preparationPercentage >= 40 ? 'bg-indigo-600' : 'bg-amber-500'} progress-bar-fill"
                  style="width: ${exam.preparationPercentage}%"></div>
              </div>
              <div class="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                <span>${exam.completedTopicsCount} of ${exam.totalTopicsCount} topics done</span>
                <span>${exam.studyHours}h logged</span>
              </div>
            </div>

          </div>
        `;
      }).join("");

      container.innerHTML = `
        <div class="fade-in space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          <!-- Top Greeting & Action Header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                ${greetingTime}, ${user.name.split(" ")[0]} 👋
              </h1>
              <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Your next major exam is in <strong class="text-indigo-600 dark:text-indigo-400 font-bold">${urgent ? urgent.daysRemaining : 12} days</strong>. Let’s make today count!
              </p>
            </div>

            <div class="flex items-center gap-3">
              <button onclick="window.ExamTrackRouter.navigate('timer')"
                class="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center gap-2">
                <i data-lucide="timer" class="w-4 h-4"></i>
                <span>Start Focus Timer</span>
              </button>
              <button onclick="window.ExamTrackDashboard.openAddTaskModal()"
                class="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer flex items-center gap-2">
                <i data-lucide="plus" class="w-4 h-4 text-indigo-600 dark:text-indigo-400"></i>
                <span>Add Task</span>
              </button>
            </div>
          </div>

          <!-- Featured Exam Countdown Banner -->
          ${urgent ? `
            <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 text-white p-6 sm:p-7 shadow-xl">
              <!-- Decorative backdrop blur circles -->
              <div class="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

              <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white mb-2.5">
                    <span class="w-2 h-2 rounded-full bg-amber-400 pulse-indicator"></span>
                    <span>Target Exam Alert</span>
                  </div>
                  <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">${urgent.name} Exam</h2>
                  <p class="text-indigo-100 text-sm mt-1 max-w-xl">${urgent.fullName} &bull; ${urgent.code} &bull; Scheduled for ${urgent.examDate} (${urgent.examTime})</p>
                </div>

                <!-- Countdown and Quick Action -->
                <div class="flex items-center gap-6 self-start md:self-auto">
                  <div class="text-center bg-white/15 backdrop-blur-md rounded-2xl px-6 py-3.5 border border-white/20 shadow-inner">
                    <div class="text-3xl sm:text-4xl font-black tracking-tight timer-digits">${urgent.daysRemaining}</div>
                    <span class="text-xs font-semibold uppercase tracking-widest text-indigo-100">Days Left</span>
                  </div>

                  <button onclick="window.ExamTrackRouter.navigate('subject-detail', { id: '${urgent.id}' })"
                    class="px-5 py-3.5 rounded-xl bg-white text-indigo-700 hover:bg-slate-100 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2 shrink-0">
                    <span>Review Syllabus</span>
                    <i data-lucide="arrow-right" class="w-4 h-4"></i>
                  </button>
                </div>
              </div>
            </div>
          ` : ''}

          <!-- Statistics Cards (4 Cards) -->
          <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            <!-- Card 1: Total Subjects -->
            <div class="exam-card rounded-2xl p-5">
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Subjects</span>
                <div class="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <i data-lucide="book-open" class="w-4 h-4"></i>
                </div>
              </div>
              <div class="mt-3">
                <p class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">${stats.totalSubjects}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1 font-medium">
                  <i data-lucide="calendar" class="w-3.5 h-3.5 text-indigo-500"></i>
                  <span>All upcoming exams scheduled</span>
                </p>
              </div>
            </div>

            <!-- Card 2: Topics Completed -->
            <div class="exam-card rounded-2xl p-5">
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Topics Completed</span>
                <div class="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                  <i data-lucide="check-circle-2" class="w-4 h-4"></i>
                </div>
              </div>
              <div class="mt-3">
                <p class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  ${stats.completedTopics}<span class="text-sm font-semibold text-slate-400">/${stats.totalTopics}</span>
                </p>
                <p class="text-xs text-purple-600 dark:text-purple-400 mt-1 flex items-center gap-1 font-medium">
                  <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
                  <span>${stats.totalTopics - stats.completedTopics} topics remaining</span>
                </p>
              </div>
            </div>

            <!-- Card 3: Study Hours -->
            <div class="exam-card rounded-2xl p-5">
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Study Hours</span>
                <div class="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <i data-lucide="clock" class="w-4 h-4"></i>
                </div>
              </div>
              <div class="mt-3">
                <p class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">${stats.totalStudyHours}h</p>
                <p class="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                  <i data-lucide="flame" class="w-3.5 h-3.5 text-amber-500"></i>
                  <span>5-day study streak active</span>
                </p>
              </div>
            </div>

            <!-- Card 4: Overall Progress -->
            <div class="exam-card rounded-2xl p-5">
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Overall Progress</span>
                <div class="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <i data-lucide="trending-up" class="w-4 h-4"></i>
                </div>
              </div>
              <div class="mt-3">
                <p class="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">${stats.overallProgress}%</p>
                <div class="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
                  <div class="bg-indigo-600 h-1.5 rounded-full progress-bar-fill" style="width: ${stats.overallProgress}%"></div>
                </div>
              </div>
            </div>

          </div>

          <!-- Middle Section: Today's Tasks & Today's Circular Progress -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <!-- Today's Tasks (2 Columns) -->
            <div class="lg:col-span-2 exam-card rounded-2xl p-6">
              <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <i data-lucide="list-todo" class="w-5 h-5 text-indigo-600 dark:text-indigo-400"></i>
                    <span>Today's Study Tasks</span>
                  </h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    ${stats.completedTodayTasks} of ${stats.todayTasksCount} completed
                  </p>
                </div>

                <button onclick="window.ExamTrackDashboard.openAddTaskModal()"
                  class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer">
                  <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                  <span>Add Task</span>
                </button>
              </div>

              <!-- Tasks List -->
              <div class="space-y-3 mt-4">
                ${tasksListHtml}
              </div>
            </div>

            <!-- Today's Progress Circular Chart & Streak (1 Column) -->
            <div class="exam-card rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <i data-lucide="pie-chart" class="w-5 h-5 text-purple-600 dark:text-purple-400"></i>
                  <span>Today's Progress</span>
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Daily syllabus target completion</p>
              </div>

              <!-- Circular Progress SVG -->
              <div class="relative py-6 flex items-center justify-center">
                <svg viewBox="0 0 36 36" class="w-40 h-40 circular-chart">
                  <path class="circle-bg"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path class="circle-fill stroke-indigo-600 dark:stroke-indigo-400"
                    stroke-dasharray="${todayPercent}, 100"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>

                <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">${todayPercent}%</span>
                  <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Completed</span>
                </div>
              </div>

              <!-- Daily Study Streak & Goal -->
              <div class="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-slate-500 dark:text-slate-400 font-medium">Daily Streak:</span>
                  <span class="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <i data-lucide="flame" class="w-4 h-4 fill-amber-500"></i>
                    <span>5 Days In A Row</span>
                  </span>
                </div>
                <div class="flex items-center justify-between text-xs">
                  <span class="text-slate-500 dark:text-slate-400 font-medium">Daily Study Target:</span>
                  <span class="font-bold text-slate-900 dark:text-white">3.2 / 4.5 Hours</span>
                </div>
              </div>

            </div>

          </div>

          <!-- Bottom Section: Upcoming Exams Cards -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <i data-lucide="calendar" class="w-5 h-5 text-indigo-600 dark:text-indigo-400"></i>
                  <span>Upcoming Exams Schedule</span>
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Click any exam card to inspect topic breakdown and start revising</p>
              </div>

              <button onclick="window.ExamTrackRouter.navigate('subjects')"
                class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                <span>View All Subjects</span>
                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              ${examsCardsHtml}
            </div>
          </div>

        </div>

        <!-- Add Task Modal -->
        <div id="add-task-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
          <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 animate-in fade-in">
            <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 class="text-lg font-bold text-slate-900 dark:text-white">Add Study Task</h3>
              <button onclick="window.ExamTrackDashboard.closeAddTaskModal()" class="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <i data-lucide="x" class="w-5 h-5"></i>
              </button>
            </div>

            <form onsubmit="window.ExamTrackDashboard.handleAddTask(event)" class="space-y-4 mt-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                <select id="new-task-subject" required class="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white">
                  ${store.getSubjects().map(s => `<option value="${s.id}|${s.name}">${s.name} (${s.code})</option>`).join("")}
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Topic Name / Chapter</label>
                <input type="text" id="new-task-topic" required placeholder="e.g. B-Trees & Indexing"
                  class="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white" />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Estimated Time</label>
                  <select id="new-task-time" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white">
                    <option value="30">30 min</option>
                    <option value="45" selected>45 min</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                  <select id="new-task-priority" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white">
                    <option value="High">High</option>
                    <option value="Medium" selected>Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Notes / Target Goal</label>
                <input type="text" id="new-task-notes" placeholder="e.g. Solve previous year exam questions"
                  class="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white" />
              </div>

              <div class="flex items-center justify-end gap-3 pt-3">
                <button type="button" onclick="window.ExamTrackDashboard.closeAddTaskModal()"
                  class="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                  Cancel
                </button>
                <button type="submit"
                  class="px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20">
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      `;

      if (window.lucide) {
        window.lucide.createIcons();
      }
    },

    toggleTask(taskId) {
      const store = window.ExamTrackStore;
      const updated = store.toggleTask(taskId);
      if (updated) {
        if (updated.completed) {
          window.ExamTrackApp.showToast(`Completed: ${updated.topic}! Great progress. 🎉`, "success");
        }
        this.render();
      }
    },

    deleteTask(taskId) {
      const store = window.ExamTrackStore;
      store.deleteTask(taskId);
      window.ExamTrackApp.showToast("Task removed.", "info");
      this.render();
    },

    openAddTaskModal() {
      const modal = document.getElementById("add-task-modal");
      if (modal) {
        modal.classList.remove("hidden");
        const topicInput = document.getElementById("new-task-topic");
        if (topicInput) topicInput.focus();
      }
    },

    closeAddTaskModal() {
      const modal = document.getElementById("add-task-modal");
      if (modal) modal.classList.add("hidden");
    },

    handleAddTask(e) {
      e.preventDefault();
      const subjectVal = document.getElementById("new-task-subject").value;
      const [subjectId, subjectName] = subjectVal.split("|");
      const topic = document.getElementById("new-task-topic").value;
      const minutes = parseInt(document.getElementById("new-task-time").value);
      const priority = document.getElementById("new-task-priority").value;
      const notes = document.getElementById("new-task-notes").value;

      const store = window.ExamTrackStore;
      store.addTask({
        subjectId,
        subjectName,
        topic,
        estimatedMinutes: minutes,
        estimatedTimeText: minutes >= 60 ? `${minutes / 60} hour` : `${minutes} min`,
        priority,
        notes
      });

      this.closeAddTaskModal();
      window.ExamTrackApp.showToast("New study task created!", "success");
      this.render();
    }
  };
})();

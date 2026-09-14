/**
 * ExamTrack - Study Planner Component
 * Weekly and Daily interactive calendar schedule, study session booking, and workload tracker
 */

(function () {
  window.ExamTrackPlanner = {
    selectedDate: "2026-09-14", // Current date
    viewMode: "week", // "week" | "day"
    filterSubjectId: "all",

    render() {
      const container = document.getElementById("main-content");
      if (!container) return;

      const store = window.ExamTrackStore;
      const subjects = store.getSubjects();
      let events = store.getPlannerEvents();

      if (this.filterSubjectId !== "all") {
        events = events.filter((e) => e.subjectId === this.filterSubjectId);
      }

      // Generate week days (Sep 14 to Sep 20, 2026)
      const weekDays = [
        { dateStr: "2026-09-14", dayName: "Mon", dayNum: "14", isToday: true },
        { dateStr: "2026-09-15", dayName: "Tue", dayNum: "15", isToday: false },
        { dateStr: "2026-09-16", dayName: "Wed", dayNum: "16", isToday: false },
        { dateStr: "2026-09-17", dayName: "Thu", dayNum: "17", isToday: false },
        { dateStr: "2026-09-18", dayName: "Fri", dayNum: "18", isToday: false },
        { dateStr: "2026-09-19", dayName: "Sat", dayNum: "19", isToday: false },
        { dateStr: "2026-09-20", dayName: "Sun", dayNum: "20", isToday: false }
      ];

      // Calculate total planned hours this week
      const totalPlannedMinutes = events.reduce((acc, curr) => acc + (curr.durationMinutes || 60), 0);
      const totalPlannedHours = Math.round((totalPlannedMinutes / 60) * 10) / 10;
      const completedEventsCount = events.filter((e) => e.status === "completed").length;

      // Render week grid
      const weekColumnsHtml = weekDays
        .map((day) => {
          const dayEvents = events.filter((e) => e.date === day.dateStr);
          const isSelected = this.selectedDate === day.dateStr;

          const dayEventsHtml = dayEvents.length > 0
            ? dayEvents.map((evt) => {
                const isCompleted = evt.status === "completed";
                return `
                  <div class="p-3 rounded-xl border ${
                    isCompleted
                      ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-75'
                      : 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-200/80 dark:border-indigo-800'
                  } transition-all space-y-1.5 group relative">
                    <div class="flex items-start justify-between gap-1">
                      <span class="text-[10px] font-bold uppercase tracking-wider ${
                        isCompleted ? 'text-slate-500' : 'text-indigo-600 dark:text-indigo-400'
                      }">
                        ${evt.subjectName}
                      </span>
                      <button onclick="window.ExamTrackPlanner.deleteEvent('${evt.id}')"
                        class="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-rose-500 transition-opacity">
                        <i data-lucide="x" class="w-3 h-3"></i>
                      </button>
                    </div>

                    <p class="text-xs font-bold text-slate-800 dark:text-white leading-snug ${
                      isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
                    }">
                      ${evt.topicName}
                    </p>

                    <div class="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                      <span class="flex items-center gap-1">
                        <i data-lucide="clock" class="w-3 h-3"></i>
                        <span>${evt.startTime} - ${evt.endTime}</span>
                      </span>

                      <button onclick="window.ExamTrackPlanner.toggleEventStatus('${evt.id}')"
                        class="cursor-pointer text-[10px] font-semibold px-2 py-0.5 rounded ${
                          isCompleted
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200'
                        }">
                        ${isCompleted ? 'Done ✓' : 'Mark Done'}
                      </button>
                    </div>
                  </div>
                `;
              }).join("")
            : `
              <div class="py-8 text-center text-slate-400 dark:text-slate-600 text-xs">
                <span>No sessions</span>
              </div>
            `;

          return `
            <div class="rounded-2xl border ${
              isSelected || day.isToday
                ? 'border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-900 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60'
            } p-3.5 flex flex-col justify-between min-h-[300px]">
              <div>
                <!-- Day Header -->
                <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-xl ${
                      day.isToday
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold'
                    } flex items-center justify-center text-xs">
                      ${day.dayNum}
                    </div>
                    <div>
                      <p class="text-xs font-bold text-slate-900 dark:text-white">${day.dayName}</p>
                      ${day.isToday ? '<span class="text-[10px] text-indigo-600 dark:text-indigo-400 font-extrabold uppercase">Today</span>' : ''}
                    </div>
                  </div>

                  <button onclick="window.ExamTrackPlanner.openAddModal('${day.dateStr}')"
                    class="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Add Study Session">
                    <i data-lucide="plus" class="w-4 h-4"></i>
                  </button>
                </div>

                <!-- Sessions in this day -->
                <div class="space-y-2.5">
                  ${dayEventsHtml}
                </div>
              </div>

              <!-- Quick Add Slot Button at bottom -->
              <button onclick="window.ExamTrackPlanner.openAddModal('${day.dateStr}')"
                class="mt-3 w-full py-1.5 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 hover:text-indigo-600 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors flex items-center justify-center gap-1 cursor-pointer">
                <i data-lucide="plus" class="w-3 h-3"></i>
                <span>Add Slot</span>
              </button>
            </div>
          `;
        })
        .join("");

      container.innerHTML = `
        <div class="fade-in space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          <!-- Header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                <i data-lucide="calendar" class="w-7 h-7 text-indigo-600 dark:text-indigo-400"></i>
                <span>Smart Study Planner</span>
              </h1>
              <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Organize your study calendar, prevent last-minute cramming, and pace your revisions.
              </p>
            </div>

            <!-- Header Quick Stats -->
            <div class="flex items-center gap-3">
              <div class="hidden sm:flex items-center gap-3 px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs shadow-sm">
                <div>
                  <span class="text-slate-400 block text-[10px] uppercase font-bold">Planned This Week</span>
                  <strong class="font-extrabold text-slate-900 dark:text-white text-sm">${totalPlannedHours} Hours</strong>
                </div>
                <div class="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
                <div>
                  <span class="text-slate-400 block text-[10px] uppercase font-bold">Completed Slots</span>
                  <strong class="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">${completedEventsCount}/${events.length}</strong>
                </div>
              </div>

              <button onclick="window.ExamTrackPlanner.openAddModal()"
                class="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer">
                <i data-lucide="plus" class="w-4 h-4"></i>
                <span>Schedule Session</span>
              </button>
            </div>
          </div>

          <!-- Planner Controls Toolbar -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div class="flex items-center gap-3">
              <span class="text-sm font-bold text-slate-800 dark:text-white">Week of Sep 14 — Sep 20, 2026</span>
              <span class="px-2 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                Exam Preparation Sprint
              </span>
            </div>

            <!-- Subject Filter -->
            <div class="flex items-center gap-2">
              <span class="text-xs text-slate-500 font-medium">Filter Subject:</span>
              <select onchange="window.ExamTrackPlanner.filterBySubject(this.value)"
                class="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white">
                <option value="all">All Subjects</option>
                ${subjects.map(s => `<option value="${s.id}" ${this.filterSubjectId === s.id ? 'selected' : ''}>${s.name}</option>`).join("")}
              </select>
            </div>
          </div>

          <!-- 7-Day Weekly Grid View -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            ${weekColumnsHtml}
          </div>

          <!-- Study Planner Tips Card -->
          <div class="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center gap-3.5">
              <div class="p-2.5 rounded-xl bg-indigo-600 text-white shrink-0">
                <i data-lucide="lightbulb" class="w-5 h-5"></i>
              </div>
              <div>
                <h4 class="text-sm font-bold text-slate-900 dark:text-white">Spaced Interval Tip</h4>
                <p class="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Schedule hard topics like DBMS Normalization and DAA Dynamic Programming in 90-minute morning focus slots when cognitive retention is highest.
                </p>
              </div>
            </div>

            <button onclick="window.ExamTrackRouter.navigate('timer')"
              class="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-all whitespace-nowrap cursor-pointer">
              Launch Focus Timer &rarr;
            </button>
          </div>

        </div>

        <!-- Add Planner Event Modal -->
        <div id="planner-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
          <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 animate-in fade-in">
            <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 class="text-lg font-bold text-slate-900 dark:text-white">Schedule Study Session</h3>
              <button onclick="window.ExamTrackPlanner.closeAddModal()" class="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <i data-lucide="x" class="w-5 h-5"></i>
              </button>
            </div>

            <form onsubmit="window.ExamTrackPlanner.handleSubmit(event)" class="space-y-4 mt-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Date</label>
                <input type="date" id="plan-input-date" required
                  class="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white" />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                <select id="plan-input-subject" required class="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white">
                  ${subjects.map(s => `<option value="${s.id}|${s.name}">${s.name} (${s.code})</option>`).join("")}
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Topic Name / Module</label>
                <input type="text" id="plan-input-topic" required placeholder="e.g. OSI Model Layering"
                  class="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white" />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Start Time</label>
                  <input type="time" id="plan-input-start" value="10:00" required
                    class="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">End Time</label>
                  <input type="time" id="plan-input-end" value="11:30" required
                    class="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white" />
                </div>
              </div>

              <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onclick="window.ExamTrackPlanner.closeAddModal()"
                  class="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                  Cancel
                </button>
                <button type="submit"
                  class="px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20">
                  Save Session
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

    filterBySubject(subId) {
      this.filterSubjectId = subId;
      this.render();
    },

    toggleEventStatus(eventId) {
      const store = window.ExamTrackStore;
      const updated = store.togglePlannerEvent(eventId);
      if (updated) {
        window.ExamTrackApp.showToast(`Study slot updated: ${updated.topicName}`, "success");
        this.render();
      }
    },

    deleteEvent(eventId) {
      const store = window.ExamTrackStore;
      store.deletePlannerEvent(eventId);
      window.ExamTrackApp.showToast("Study session removed", "info");
      this.render();
    },

    openAddModal(dateStr) {
      const modal = document.getElementById("planner-modal");
      const dateInput = document.getElementById("plan-input-date");
      if (dateInput) {
        dateInput.value = dateStr || new Date().toISOString().split("T")[0];
      }
      if (modal) modal.classList.remove("hidden");
    },

    closeAddModal() {
      const modal = document.getElementById("planner-modal");
      if (modal) modal.classList.add("hidden");
    },

    handleSubmit(e) {
      e.preventDefault();
      const date = document.getElementById("plan-input-date").value;
      const subVal = document.getElementById("plan-input-subject").value;
      const [subjectId, subjectName] = subVal.split("|");
      const topicName = document.getElementById("plan-input-topic").value;
      const startTime = document.getElementById("plan-input-start").value;
      const endTime = document.getElementById("plan-input-end").value;

      const store = window.ExamTrackStore;
      store.addPlannerEvent({
        date,
        subjectId,
        subjectName,
        topicName,
        startTime,
        endTime,
        durationMinutes: 90
      });

      this.closeAddModal();
      window.ExamTrackApp.showToast(`Study session scheduled for ${date}!`, "success");
      this.render();
    }
  };
})();

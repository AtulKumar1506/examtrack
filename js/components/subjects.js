/**
 * ExamTrack - Subjects Page Component
 * List of subjects, search/filtering, add/edit/delete subject modals, progress bars, and stats
 */

(function () {
  window.ExamTrackSubjects = {
    searchQuery: "",
    priorityFilter: "All", // "All" | "High" | "Medium" | "Low"
    sortBy: "examDate", // "examDate" | "progress" | "name"
    editingSubjectId: null,

    render() {
      const container = document.getElementById("main-content");
      if (!container) return;

      const store = window.ExamTrackStore;
      const subjects = store.getSubjects();

      // Compute days remaining and progress for each subject
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      let processedSubjects = subjects.map((s) => {
        const examDate = new Date(s.examDate);
        examDate.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((examDate - now) / (1000 * 60 * 60 * 24));
        const totalTopics = s.topics ? s.topics.length : 0;
        const completedTopics = s.topics ? s.topics.filter((t) => t.status === "Completed").length : 0;
        const progressPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

        return {
          ...s,
          daysRemaining: diffDays,
          totalTopics,
          completedTopics,
          progressPercent
        };
      });

      // Filter by search
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        processedSubjects = processedSubjects.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.fullName.toLowerCase().includes(q) ||
            s.code.toLowerCase().includes(q)
        );
      }

      // Filter by priority
      if (this.priorityFilter !== "All") {
        processedSubjects = processedSubjects.filter((s) => s.priority === this.priorityFilter);
      }

      // Sort
      if (this.sortBy === "examDate") {
        processedSubjects.sort((a, b) => a.daysRemaining - b.daysRemaining);
      } else if (this.sortBy === "progress") {
        processedSubjects.sort((a, b) => b.progressPercent - a.progressPercent);
      } else if (this.sortBy === "name") {
        processedSubjects.sort((a, b) => a.name.localeCompare(b.name));
      }

      // Render cards
      const cardsHtml = processedSubjects.length > 0
        ? processedSubjects
            .map((s) => {
              const priorityClass =
                s.priority === "High"
                  ? "badge-priority-high"
                  : s.priority === "Medium"
                  ? "badge-priority-medium"
                  : "badge-priority-low";

              return `
                <div class="exam-card rounded-2xl p-6 transition-all duration-200 flex flex-col justify-between group">
                  <div>
                    <!-- Header with tags & actions -->
                    <div class="flex items-start justify-between gap-3">
                      <div class="flex items-center gap-2">
                        <span class="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                          ${s.code}
                        </span>
                        <span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${priorityClass}">
                          ${s.priority} Priority
                        </span>
                      </div>

                      <!-- Edit / Delete Quick Actions -->
                      <div class="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button onclick="event.stopPropagation(); window.ExamTrackSubjects.openEditModal('${s.id}')"
                          class="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit Subject">
                          <i data-lucide="edit-3" class="w-4 h-4"></i>
                        </button>
                        <button onclick="event.stopPropagation(); window.ExamTrackSubjects.confirmDelete('${s.id}', '${s.name}')"
                          class="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Delete Subject">
                          <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                      </div>
                    </div>

                    <!-- Subject Title -->
                    <div class="mt-4 cursor-pointer" onclick="window.ExamTrackRouter.navigate('subject-detail', { id: '${s.id}' })">
                      <h3 class="text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        ${s.name}
                      </h3>
                      <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 font-medium">
                        ${s.fullName}
                      </p>
                    </div>

                    <!-- Meta Information Grid -->
                    <div class="grid grid-cols-2 gap-3 mt-5 p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
                      <div>
                        <span class="text-[11px] text-slate-400 dark:text-slate-500 font-medium block">Exam Date</span>
                        <span class="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block flex items-center gap-1">
                          <i data-lucide="calendar" class="w-3.5 h-3.5 text-indigo-500"></i>
                          <span>${s.daysRemaining} Days Left</span>
                        </span>
                      </div>
                      <div>
                        <span class="text-[11px] text-slate-400 dark:text-slate-500 font-medium block">Study Hours</span>
                        <span class="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block flex items-center gap-1">
                          <i data-lucide="clock" class="w-3.5 h-3.5 text-blue-500"></i>
                          <span>${s.studyHours}h logged</span>
                        </span>
                      </div>
                    </div>

                    <!-- Topics Count and Progress Bar -->
                    <div class="mt-5">
                      <div class="flex items-center justify-between text-xs mb-1.5 font-semibold">
                        <span class="text-slate-600 dark:text-slate-400">
                          ${s.completedTopics} of ${s.totalTopics} Topics Done
                        </span>
                        <span class="text-indigo-600 dark:text-indigo-400 font-extrabold">${s.progressPercent}%</span>
                      </div>
                      <div class="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div class="h-2.5 rounded-full ${s.progressPercent >= 75 ? 'bg-emerald-500' : s.progressPercent >= 40 ? 'bg-indigo-600' : 'bg-amber-500'} progress-bar-fill"
                          style="width: ${s.progressPercent}%"></div>
                      </div>
                    </div>
                  </div>

                  <!-- Footer: View Details CTA -->
                  <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">Target: <strong class="text-slate-700 dark:text-slate-300 font-bold">${s.targetGrade}</strong></span>
                    <button onclick="window.ExamTrackRouter.navigate('subject-detail', { id: '${s.id}' })"
                      class="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer">
                      <span>View Topics</span>
                      <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                    </button>
                  </div>
                </div>
              `;
            })
            .join("")
        : `
          <div class="col-span-full py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <i data-lucide="search" class="w-10 h-10 text-slate-400 mx-auto mb-3"></i>
            <h4 class="text-base font-bold text-slate-800 dark:text-white">No subjects match your search</h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Try clearing filters or create a new subject.</p>
            <button onclick="window.ExamTrackSubjects.clearFilters()"
              class="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300">
              Clear Filters
            </button>
          </div>
        `;

      container.innerHTML = `
        <div class="fade-in space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          <!-- Top Header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                <span>Course Subjects</span>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  ${subjects.length} Total
                </span>
              </h1>
              <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Manage your syllabus topics, study progress, exam dates, and priority levels.
              </p>
            </div>

            <div>
              <button onclick="window.ExamTrackSubjects.openAddModal()"
                class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center gap-2">
                <i data-lucide="plus" class="w-4 h-4"></i>
                <span>Add New Subject</span>
              </button>
            </div>
          </div>

          <!-- Filter & Search Toolbar -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            
            <!-- Search Bar -->
            <div class="relative flex-1 max-w-md">
              <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3"></i>
              <input type="text" id="subject-search-input" value="${this.searchQuery}"
                oninput="window.ExamTrackSubjects.handleSearch(this.value)"
                placeholder="Search subject by name, code (e.g. DBMS, CS-501)..."
                class="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
            </div>

            <!-- Priority & Sort Options -->
            <div class="flex items-center gap-3 flex-wrap">
              <!-- Priority Filter -->
              <div class="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <span class="text-[11px] font-semibold text-slate-400 px-2">Priority:</span>
                ${["All", "High", "Medium"].map(p => `
                  <button onclick="window.ExamTrackSubjects.setPriorityFilter('${p}')"
                    class="px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${this.priorityFilter === p ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}">
                    ${p}
                  </button>
                `).join("")}
              </div>

              <!-- Sort Dropdown -->
              <select onchange="window.ExamTrackSubjects.setSort(this.value)"
                class="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <option value="examDate" ${this.sortBy === 'examDate' ? 'selected' : ''}>Sort: Exam Date</option>
                <option value="progress" ${this.sortBy === 'progress' ? 'selected' : ''}>Sort: Progress %</option>
                <option value="name" ${this.sortBy === 'name' ? 'selected' : ''}>Sort: Name</option>
              </select>
            </div>

          </div>

          <!-- Subject Cards Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${cardsHtml}
          </div>

        </div>

        <!-- Add/Edit Subject Modal -->
        <div id="subject-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
          <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 id="subject-modal-title" class="text-lg font-bold text-slate-900 dark:text-white">Add New Subject</h3>
              <button onclick="window.ExamTrackSubjects.closeModal()" class="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <i data-lucide="x" class="w-5 h-5"></i>
              </button>
            </div>

            <form onsubmit="window.ExamTrackSubjects.handleSubmit(event)" class="space-y-4 mt-4">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject Short Name</label>
                  <input type="text" id="sub-input-name" required placeholder="e.g. DBMS, Java, OS"
                    class="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Course Code</label>
                  <input type="text" id="sub-input-code" required placeholder="e.g. CS-501"
                    class="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white" />
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Course Title</label>
                <input type="text" id="sub-input-fullname" required placeholder="e.g. Database Management Systems & Architecture"
                  class="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white" />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Exam Date</label>
                  <input type="date" id="sub-input-date" required
                    class="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Exam Time Slot</label>
                  <input type="text" id="sub-input-time" placeholder="10:00 AM - 01:00 PM"
                    class="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white" />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                  <select id="sub-input-priority" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white">
                    <option value="High">High</option>
                    <option value="Medium" selected>Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Grade</label>
                  <select id="sub-input-grade" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white">
                    <option value="A+" selected>A+ (Distinction)</option>
                    <option value="A">A (Excellent)</option>
                    <option value="B+">B+ (Very Good)</option>
                    <option value="B">B (Good)</option>
                  </select>
                </div>
              </div>

              <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onclick="window.ExamTrackSubjects.closeModal()"
                  class="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                  Cancel
                </button>
                <button type="submit"
                  class="px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20">
                  Save Subject
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

    handleSearch(query) {
      this.searchQuery = query;
      this.render();
      const input = document.getElementById("subject-search-input");
      if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    },

    setPriorityFilter(priority) {
      this.priorityFilter = priority;
      this.render();
    },

    setSort(sort) {
      this.sortBy = sort;
      this.render();
    },

    clearFilters() {
      this.searchQuery = "";
      this.priorityFilter = "All";
      this.sortBy = "examDate";
      this.render();
    },

    openAddModal() {
      this.editingSubjectId = null;
      const modal = document.getElementById("subject-modal");
      const title = document.getElementById("subject-modal-title");
      if (title) title.innerText = "Add New Subject";

      document.getElementById("sub-input-name").value = "";
      document.getElementById("sub-input-code").value = "";
      document.getElementById("sub-input-fullname").value = "";
      document.getElementById("sub-input-date").value = new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0];
      document.getElementById("sub-input-time").value = "10:00 AM - 01:00 PM";
      document.getElementById("sub-input-priority").value = "Medium";
      document.getElementById("sub-input-grade").value = "A+";

      if (modal) modal.classList.remove("hidden");
    },

    openEditModal(id) {
      this.editingSubjectId = id;
      const subject = window.ExamTrackStore.getSubjectById(id);
      if (!subject) return;

      const modal = document.getElementById("subject-modal");
      const title = document.getElementById("subject-modal-title");
      if (title) title.innerText = `Edit Subject: ${subject.name}`;

      document.getElementById("sub-input-name").value = subject.name || "";
      document.getElementById("sub-input-code").value = subject.code || "";
      document.getElementById("sub-input-fullname").value = subject.fullName || "";
      document.getElementById("sub-input-date").value = subject.examDate || "";
      document.getElementById("sub-input-time").value = subject.examTime || "";
      document.getElementById("sub-input-priority").value = subject.priority || "Medium";
      document.getElementById("sub-input-grade").value = subject.targetGrade || "A+";

      if (modal) modal.classList.remove("hidden");
    },

    closeModal() {
      const modal = document.getElementById("subject-modal");
      if (modal) modal.classList.add("hidden");
    },

    handleSubmit(e) {
      e.preventDefault();
      const name = document.getElementById("sub-input-name").value;
      const code = document.getElementById("sub-input-code").value;
      const fullName = document.getElementById("sub-input-fullname").value;
      const examDate = document.getElementById("sub-input-date").value;
      const examTime = document.getElementById("sub-input-time").value;
      const priority = document.getElementById("sub-input-priority").value;
      const targetGrade = document.getElementById("sub-input-grade").value;

      const store = window.ExamTrackStore;

      if (this.editingSubjectId) {
        store.updateSubject(this.editingSubjectId, {
          name,
          code,
          fullName,
          examDate,
          examTime,
          priority,
          targetGrade
        });
        window.ExamTrackApp.showToast(`Updated subject: ${name}`, "success");
      } else {
        store.addSubject({
          name,
          code,
          fullName,
          examDate,
          examTime,
          priority,
          targetGrade
        });
        window.ExamTrackApp.showToast(`Added new subject: ${name}`, "success");
      }

      this.closeModal();
      this.render();
    },

    confirmDelete(id, name) {
      if (confirm(`Are you sure you want to delete ${name} and all its topics?`)) {
        window.ExamTrackStore.deleteSubject(id);
        window.ExamTrackApp.showToast(`Deleted ${name}`, "info");
        this.render();
      }
    }
  };
})();

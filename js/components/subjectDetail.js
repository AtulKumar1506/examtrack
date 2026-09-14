/**
 * ExamTrack - Subject Details Page Component
 * Subject Overview, granular Topic list with status, difficulty, estimated vs actual hours,
 * revision count tracking, add/edit/delete topic modals
 */

(function () {
  window.ExamTrackSubjectDetail = {
    currentSubjectId: null,
    editingTopicId: null,

    render(params = {}) {
      if (params.id) {
        this.currentSubjectId = params.id;
      }

      const container = document.getElementById("main-content");
      if (!container) return;

      const store = window.ExamTrackStore;
      const subject = store.getSubjectById(this.currentSubjectId);

      if (!subject) {
        container.innerHTML = `
          <div class="max-w-4xl mx-auto py-16 text-center">
            <h2 class="text-xl font-bold text-slate-800 dark:text-white">Subject Not Found</h2>
            <button onclick="window.ExamTrackRouter.navigate('subjects')"
              class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold">
              Back to Subjects
            </button>
          </div>
        `;
        return;
      }

      // Calculations
      const topics = subject.topics || [];
      const totalTopics = topics.length;
      const completedTopics = topics.filter((t) => t.status === "Completed").length;
      const inProgressTopics = topics.filter((t) => t.status === "In Progress").length;
      const notStartedTopics = topics.filter((t) => t.status === "Not Started").length;
      const progressPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const examDate = new Date(subject.examDate);
      examDate.setHours(0, 0, 0, 0);
      const daysRemaining = Math.ceil((examDate - now) / (1000 * 60 * 60 * 24));

      // Build topic list HTML
      const topicsListHtml = topics.length > 0
        ? topics.map((topic) => {
            // Status icons & styling
            let statusIcon = "circle";
            let statusTextClass = "text-slate-600 dark:text-slate-400";
            let statusBg = "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300";

            if (topic.status === "Completed") {
              statusIcon = "check-circle-2";
              statusTextClass = "text-emerald-600 dark:text-emerald-400";
              statusBg = "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800";
            } else if (topic.status === "In Progress") {
              statusIcon = "clock";
              statusTextClass = "text-amber-600 dark:text-amber-400";
              statusBg = "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800";
            }

            // Difficulty styling
            const diffClass =
              topic.difficulty === "Hard"
                ? "badge-diff-hard"
                : topic.difficulty === "Medium"
                ? "badge-diff-med"
                : "badge-diff-easy";

            return `
              <div class="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                
                <!-- Left: Status checkbox/toggle, Name, and Difficulty -->
                <div class="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                  
                  <!-- Clickable Status Toggle Button -->
                  <button onclick="window.ExamTrackSubjectDetail.cycleStatus('${topic.id}')"
                    class="p-1 rounded-lg hover:scale-110 transition-transform cursor-pointer shrink-0 mt-0.5 sm:mt-0"
                    title="Click to cycle status: Not Started -> In Progress -> Completed">
                    ${
                      topic.status === "Completed"
                        ? '<i data-lucide="check-circle-2" class="w-5 h-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950"></i>'
                        : topic.status === "In Progress"
                        ? '<i data-lucide="circle-dot" class="w-5 h-5 text-amber-500"></i>'
                        : '<i data-lucide="circle" class="w-5 h-5 text-slate-400 hover:text-slate-600"></i>'
                    }
                  </button>

                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2.5 flex-wrap">
                      <span class="text-sm font-bold text-slate-900 dark:text-white ${topic.status === 'Completed' ? 'line-through text-slate-400 dark:text-slate-500 font-medium' : ''}">
                        ${topic.name}
                      </span>

                      <!-- Status Badge -->
                      <span class="px-2 py-0.5 text-[10px] font-bold rounded-md ${statusBg}">
                        ${topic.status}
                      </span>

                      <!-- Difficulty Badge -->
                      <span class="px-2 py-0.5 text-[10px] font-semibold rounded-md ${diffClass}">
                        ${topic.difficulty}
                      </span>
                    </div>

                    <!-- Study time & Last Revised subtext -->
                    <div class="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap font-medium">
                      <span class="flex items-center gap-1">
                        <i data-lucide="clock" class="w-3.5 h-3.5 text-slate-400"></i>
                        <span>Est: <strong class="text-slate-700 dark:text-slate-300 font-bold">${topic.estimatedHours}h</strong></span>
                        <span class="text-slate-300 dark:text-slate-700">&bull;</span>
                        <span>Actual: <strong class="text-indigo-600 dark:text-indigo-400 font-bold">${topic.actualHours || 0}h</strong></span>
                      </span>

                      ${topic.lastRevised ? `
                        <span class="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                          <i data-lucide="check" class="w-3 h-3"></i>
                          <span>Revised on ${topic.lastRevised}</span>
                        </span>
                      ` : ''}
                    </div>
                  </div>

                </div>

                <!-- Right: Revision Counter & Actions -->
                <div class="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                  
                  <!-- Revision Count Pill with Quick +1 Button -->
                  <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs">
                    <i data-lucide="repeat" class="w-3.5 h-3.5 text-indigo-500"></i>
                    <span class="font-medium text-slate-600 dark:text-slate-300">Revisions:</span>
                    <strong class="font-bold text-slate-900 dark:text-white">${topic.revisionCount || 0}</strong>
                    <button onclick="window.ExamTrackSubjectDetail.incrementRevision('${topic.id}')"
                      class="ml-1 p-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors cursor-pointer"
                      title="Mark revised (+1)">
                      <i data-lucide="plus" class="w-3 h-3"></i>
                    </button>
                  </div>

                  <!-- Focus Timer Launcher for this topic -->
                  <button onclick="window.ExamTrackRouter.navigate('timer', { subjectId: '${subject.id}', topicId: '${topic.id}' })"
                    class="p-2 rounded-xl text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors cursor-pointer"
                    title="Focus study on this topic">
                    <i data-lucide="play" class="w-4 h-4"></i>
                  </button>

                  <!-- Edit / Delete Topic -->
                  <div class="flex items-center gap-1">
                    <button onclick="window.ExamTrackSubjectDetail.openEditTopicModal('${topic.id}')"
                      class="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                      title="Edit Topic">
                      <i data-lucide="edit-3" class="w-4 h-4"></i>
                    </button>
                    <button onclick="window.ExamTrackSubjectDetail.deleteTopic('${topic.id}')"
                      class="p-2 rounded-xl text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                      title="Delete Topic">
                      <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                  </div>

                </div>

              </div>
            `;
          }).join("")
        : `
          <div class="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <i data-lucide="book-open" class="w-8 h-8 text-slate-400 mx-auto mb-2"></i>
            <h4 class="text-sm font-bold text-slate-700 dark:text-slate-300">No topics added yet</h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Break down this course syllabus by adding chapters or concepts.</p>
            <button onclick="window.ExamTrackSubjectDetail.openAddTopicModal()"
              class="mt-4 px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
              Add First Topic
            </button>
          </div>
        `;

      container.innerHTML = `
        <div class="fade-in space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          <!-- Back button & Page Breadcrumb -->
          <div class="flex items-center justify-between">
            <button onclick="window.ExamTrackRouter.navigate('subjects')"
              class="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
              <i data-lucide="arrow-left" class="w-4 h-4"></i>
              <span>Back to All Subjects</span>
            </button>

            <div class="flex items-center gap-2">
              <button onclick="window.ExamTrackRouter.navigate('timer', { subjectId: '${subject.id}' })"
                class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer">
                <i data-lucide="timer" class="w-4 h-4"></i>
                <span>Study This Subject</span>
              </button>
              <button onclick="window.ExamTrackSubjectDetail.openAddTopicModal()"
                class="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2 cursor-pointer">
                <i data-lucide="plus" class="w-4 h-4 text-indigo-600 dark:text-indigo-400"></i>
                <span>Add Topic</span>
              </button>
            </div>
          </div>

          <!-- Section 6: Subject Overview Card -->
          <div class="exam-card rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border border-slate-200/90 dark:border-slate-800 shadow-lg">
            
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div class="flex items-center gap-2 flex-wrap mb-2">
                  <span class="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                    ${subject.code}
                  </span>
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold badge-priority-${subject.priority.toLowerCase()}">
                    ${subject.priority} Priority
                  </span>
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                    Target: ${subject.targetGrade}
                  </span>
                </div>
                <h1 class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  ${subject.name}
                </h1>
                <p class="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
                  ${subject.fullName}
                </p>
              </div>

              <!-- Exam Date & Countdown Ring Pill -->
              <div class="flex items-center gap-4 bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-sm self-start lg:self-auto">
                <div class="text-center px-2">
                  <span class="text-3xl font-black text-indigo-600 dark:text-indigo-400 timer-digits">${daysRemaining}</span>
                  <p class="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">Days Left</p>
                </div>
                <div class="h-10 w-px bg-slate-200 dark:bg-slate-700"></div>
                <div class="text-xs">
                  <p class="font-bold text-slate-800 dark:text-slate-200">${subject.examDate}</p>
                  <p class="text-slate-500 dark:text-slate-400 mt-0.5">${subject.examTime}</p>
                </div>
              </div>
            </div>

            <!-- Subject Metrics 4-Box Grid -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              
              <div class="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70">
                <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">Overall Progress</span>
                <p class="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">${progressPercent}%</p>
                <div class="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div class="bg-indigo-600 h-1.5 rounded-full" style="width: ${progressPercent}%"></div>
                </div>
              </div>

              <div class="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70">
                <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Study Hours</span>
                <p class="text-2xl font-black text-slate-900 dark:text-white mt-1">${subject.studyHours}h</p>
                <span class="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                  <i data-lucide="check" class="w-3 h-3"></i> Verified logs
                </span>
              </div>

              <div class="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70">
                <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">Completed Topics</span>
                <p class="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  ${completedTopics}<span class="text-sm font-semibold text-slate-400">/${totalTopics}</span>
                </p>
                <span class="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1 block">
                  ${totalTopics - completedTopics} pending
                </span>
              </div>

              <div class="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70">
                <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">In Progress / Active</span>
                <p class="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">${inProgressTopics}</p>
                <span class="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-1 block">
                  ${notStartedTopics} not started
                </span>
              </div>

            </div>

          </div>

          <!-- Section 6 Topic List -->
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 class="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <i data-lucide="layers" class="w-5 h-5 text-indigo-600 dark:text-indigo-400"></i>
                  <span>Syllabus Topics & Mastery</span>
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Click status icons to cycle: <strong class="text-slate-700 dark:text-slate-300">○ Not Started &rarr; ◐ In Progress &rarr; ☑ Completed</strong>
                </p>
              </div>

              <button onclick="window.ExamTrackSubjectDetail.openAddTopicModal()"
                class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer">
                <i data-lucide="plus" class="w-4 h-4"></i>
                <span>Add Topic</span>
              </button>
            </div>

            <!-- List Container -->
            <div class="space-y-3">
              ${topicsListHtml}
            </div>
          </div>

        </div>

        <!-- Add/Edit Topic Modal -->
        <div id="topic-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
          <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 animate-in fade-in">
            <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 id="topic-modal-title" class="text-lg font-bold text-slate-900 dark:text-white">Add Topic</h3>
              <button onclick="window.ExamTrackSubjectDetail.closeTopicModal()" class="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <i data-lucide="x" class="w-5 h-5"></i>
              </button>
            </div>

            <form onsubmit="window.ExamTrackSubjectDetail.handleSubmitTopic(event)" class="space-y-4 mt-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Topic Name</label>
                <input type="text" id="top-input-name" required placeholder="e.g. Normalization (1NF, 2NF, 3NF, BCNF)"
                  class="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white" />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select id="top-input-status" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white">
                    <option value="Not Started" selected>Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Difficulty</label>
                  <select id="top-input-difficulty" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white">
                    <option value="Easy">Easy</option>
                    <option value="Medium" selected>Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Estimated Hours</label>
                  <input type="number" step="0.5" id="top-input-estimated" value="2.0"
                    class="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Revision Count</label>
                  <input type="number" id="top-input-revisions" value="0"
                    class="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white" />
                </div>
              </div>

              <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onclick="window.ExamTrackSubjectDetail.closeTopicModal()"
                  class="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                  Cancel
                </button>
                <button type="submit"
                  class="px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20">
                  Save Topic
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

    cycleStatus(topicId) {
      const store = window.ExamTrackStore;
      const updated = store.cycleTopicStatus(this.currentSubjectId, topicId);
      if (updated) {
        if (updated.status === "Completed") {
          window.ExamTrackApp.showToast(`Marked "${updated.name}" as Completed! 🎯`, "success");
        }
        this.render();
      }
    },

    incrementRevision(topicId) {
      const store = window.ExamTrackStore;
      const updated = store.incrementRevision(this.currentSubjectId, topicId);
      if (updated) {
        window.ExamTrackApp.showToast(`Revision recorded for ${updated.name} (Total: ${updated.revisionCount})!`, "success");
        this.render();
      }
    },

    openAddTopicModal() {
      this.editingTopicId = null;
      const modal = document.getElementById("topic-modal");
      const title = document.getElementById("topic-modal-title");
      if (title) title.innerText = "Add Syllabus Topic";

      document.getElementById("top-input-name").value = "";
      document.getElementById("top-input-status").value = "Not Started";
      document.getElementById("top-input-difficulty").value = "Medium";
      document.getElementById("top-input-estimated").value = "2.5";
      document.getElementById("top-input-revisions").value = "0";

      if (modal) modal.classList.remove("hidden");
    },

    openEditTopicModal(topicId) {
      this.editingTopicId = topicId;
      const subject = window.ExamTrackStore.getSubjectById(this.currentSubjectId);
      if (!subject || !subject.topics) return;
      const topic = subject.topics.find((t) => t.id === topicId);
      if (!topic) return;

      const modal = document.getElementById("topic-modal");
      const title = document.getElementById("topic-modal-title");
      if (title) title.innerText = `Edit Topic: ${topic.name}`;

      document.getElementById("top-input-name").value = topic.name || "";
      document.getElementById("top-input-status").value = topic.status || "Not Started";
      document.getElementById("top-input-difficulty").value = topic.difficulty || "Medium";
      document.getElementById("top-input-estimated").value = topic.estimatedHours || 2.0;
      document.getElementById("top-input-revisions").value = topic.revisionCount || 0;

      if (modal) modal.classList.remove("hidden");
    },

    closeTopicModal() {
      const modal = document.getElementById("topic-modal");
      if (modal) modal.classList.add("hidden");
    },

    handleSubmitTopic(e) {
      e.preventDefault();
      const name = document.getElementById("top-input-name").value;
      const status = document.getElementById("top-input-status").value;
      const difficulty = document.getElementById("top-input-difficulty").value;
      const estimatedHours = parseFloat(document.getElementById("top-input-estimated").value);
      const revisionCount = parseInt(document.getElementById("top-input-revisions").value);

      const store = window.ExamTrackStore;

      if (this.editingTopicId) {
        store.updateTopic(this.currentSubjectId, this.editingTopicId, {
          name,
          status,
          difficulty,
          estimatedHours,
          revisionCount
        });
        window.ExamTrackApp.showToast(`Updated topic: ${name}`, "success");
      } else {
        store.addTopic(this.currentSubjectId, {
          name,
          status,
          difficulty,
          estimatedHours,
          revisionCount
        });
        window.ExamTrackApp.showToast(`Added topic: ${name}`, "success");
      }

      this.closeTopicModal();
      this.render();
    },

    deleteTopic(topicId) {
      if (confirm("Are you sure you want to delete this topic?")) {
        window.ExamTrackStore.deleteTopic(this.currentSubjectId, topicId);
        window.ExamTrackApp.showToast("Topic deleted", "info");
        this.render();
      }
    }
  };
})();

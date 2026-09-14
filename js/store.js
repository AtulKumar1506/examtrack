/**
 * ExamTrack - State Management Store
 * Handles localStorage persistence, reactivity, calculations, and data mutations
 */

(function () {
  const STORAGE_KEY = "examtrack_data_v1";

  class Store {
    constructor() {
      this.listeners = [];
      this.state = this.loadState();
    }

    loadState() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.subjects && parsed.subjects.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.error("Error loading stored data", e);
      }
      // Return fresh copy of initial data
      return JSON.parse(JSON.stringify(window.ExamTrackData));
    }

    saveState() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.error("Error saving state to localStorage", e);
      }
      this.notify();
    }

    resetToDemoData() {
      this.state = JSON.parse(JSON.stringify(window.ExamTrackData));
      this.saveState();
      this.notify("RESET");
    }

    subscribe(listener) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((l) => l !== listener);
      };
    }

    notify(action = "UPDATE") {
      for (const listener of this.listeners) {
        try {
          listener(this.state, action);
        } catch (e) {
          console.error("Listener error", e);
        }
      }
    }

    // --- User & Auth ---
    getCurrentUser() {
      return this.state.currentUser;
    }

    isAuthenticated() {
      return !!(this.state.currentUser && this.state.currentUser.email);
    }

    login(email, name = "Student") {
      this.state.currentUser = {
        name: name || "Student",
        email: email,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        institution: "Engineering College",
        major: "Computer Science",
        semester: "Semester 5"
      };
      this.saveState();
    }

    logout() {
      this.state.currentUser = null;
      this.saveState();
    }

    // --- Theme & Settings ---
    getTheme() {
      return (this.state.settings && this.state.settings.theme) || "light";
    }

    setTheme(theme) {
      if (!this.state.settings) this.state.settings = {};
      this.state.settings.theme = theme;
      this.saveState();
    }

    // --- Subject Operations ---
    getSubjects() {
      return this.state.subjects || [];
    }

    getSubjectById(id) {
      return (this.state.subjects || []).find((s) => s.id === id);
    }

    addSubject(subjectData) {
      const newSubject = {
        id: "sub-" + Date.now(),
        name: subjectData.name || "Untitled Subject",
        fullName: subjectData.fullName || subjectData.name,
        code: subjectData.code || "SUB-" + Math.floor(100 + Math.random() * 900),
        color: subjectData.color || "indigo",
        examDate: subjectData.examDate || new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0],
        examTime: subjectData.examTime || "10:00 AM - 01:00 PM",
        priority: subjectData.priority || "Medium",
        targetGrade: subjectData.targetGrade || "A",
        studyHours: 0,
        topics: []
      };
      this.state.subjects.push(newSubject);
      this.saveState();
      return newSubject;
    }

    updateSubject(id, updatedData) {
      const index = this.state.subjects.findIndex((s) => s.id === id);
      if (index !== -1) {
        this.state.subjects[index] = {
          ...this.state.subjects[index],
          ...updatedData
        };
        this.saveState();
        return this.state.subjects[index];
      }
      return null;
    }

    deleteSubject(id) {
      this.state.subjects = this.state.subjects.filter((s) => s.id !== id);
      // Also cleanup tasks and planner sessions tied to this subject
      this.state.tasks = (this.state.tasks || []).filter((t) => t.subjectId !== id);
      this.state.plannerEvents = (this.state.plannerEvents || []).filter((e) => e.subjectId !== id);
      this.saveState();
    }

    // --- Topic Operations ---
    addTopic(subjectId, topicData) {
      const subject = this.getSubjectById(subjectId);
      if (!subject) return null;

      const newTopic = {
        id: "top-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
        name: topicData.name || "New Topic",
        status: topicData.status || "Not Started",
        difficulty: topicData.difficulty || "Medium",
        estimatedHours: parseFloat(topicData.estimatedHours) || 2.0,
        actualHours: parseFloat(topicData.actualHours) || 0,
        revisionCount: parseInt(topicData.revisionCount) || 0,
        lastRevised: topicData.status === "Completed" ? new Date().toISOString().split("T")[0] : null
      };

      if (!subject.topics) subject.topics = [];
      subject.topics.push(newTopic);
      this.saveState();
      return newTopic;
    }

    updateTopic(subjectId, topicId, updatedData) {
      const subject = this.getSubjectById(subjectId);
      if (!subject || !subject.topics) return null;

      const index = subject.topics.findIndex((t) => t.id === topicId);
      if (index !== -1) {
        const oldTopic = subject.topics[index];
        const newTopic = { ...oldTopic, ...updatedData };

        // If status changed to completed and wasn't before, update lastRevised
        if (newTopic.status === "Completed" && oldTopic.status !== "Completed" && !newTopic.lastRevised) {
          newTopic.lastRevised = new Date().toISOString().split("T")[0];
        }

        subject.topics[index] = newTopic;
        this.saveState();
        return newTopic;
      }
      return null;
    }

    cycleTopicStatus(subjectId, topicId) {
      const subject = this.getSubjectById(subjectId);
      if (!subject || !subject.topics) return null;

      const topic = subject.topics.find((t) => t.id === topicId);
      if (!topic) return null;

      let nextStatus = "In Progress";
      if (topic.status === "Not Started") {
        nextStatus = "In Progress";
      } else if (topic.status === "In Progress") {
        nextStatus = "Completed";
      } else if (topic.status === "Completed") {
        nextStatus = "Not Started";
      }

      return this.updateTopic(subjectId, topicId, {
        status: nextStatus,
        lastRevised: nextStatus === "Completed" ? new Date().toISOString().split("T")[0] : topic.lastRevised
      });
    }

    incrementRevision(subjectId, topicId) {
      const subject = this.getSubjectById(subjectId);
      if (!subject || !subject.topics) return null;

      const topic = subject.topics.find((t) => t.id === topicId);
      if (!topic) return null;

      const newCount = (topic.revisionCount || 0) + 1;
      return this.updateTopic(subjectId, topicId, {
        revisionCount: newCount,
        lastRevised: new Date().toISOString().split("T")[0]
      });
    }

    deleteTopic(subjectId, topicId) {
      const subject = this.getSubjectById(subjectId);
      if (!subject || !subject.topics) return;

      subject.topics = subject.topics.filter((t) => t.id !== topicId);
      this.saveState();
    }

    // --- Task Operations ---
    getTasks() {
      return this.state.tasks || [];
    }

    addTask(taskData) {
      const newTask = {
        id: "task-" + Date.now(),
        subjectId: taskData.subjectId || "",
        subjectName: taskData.subjectName || "General",
        topic: taskData.topic || "Study Task",
        estimatedMinutes: parseInt(taskData.estimatedMinutes) || 45,
        estimatedTimeText: taskData.estimatedTimeText || `${taskData.estimatedMinutes || 45} min`,
        priority: taskData.priority || "Medium",
        completed: false,
        dueDate: taskData.dueDate || new Date().toISOString().split("T")[0],
        notes: taskData.notes || ""
      };

      if (!this.state.tasks) this.state.tasks = [];
      this.state.tasks.unshift(newTask);
      this.saveState();
      return newTask;
    }

    toggleTask(taskId) {
      const task = (this.state.tasks || []).find((t) => t.id === taskId);
      if (task) {
        task.completed = !task.completed;
        this.saveState();
        return task;
      }
      return null;
    }

    deleteTask(taskId) {
      this.state.tasks = (this.state.tasks || []).filter((t) => t.id !== taskId);
      this.saveState();
    }

    // --- Planner Sessions ---
    getPlannerEvents() {
      return this.state.plannerEvents || [];
    }

    addPlannerEvent(eventData) {
      const newEvent = {
        id: "plan-" + Date.now(),
        date: eventData.date || new Date().toISOString().split("T")[0],
        startTime: eventData.startTime || "10:00",
        endTime: eventData.endTime || "11:00",
        subjectId: eventData.subjectId || "",
        subjectName: eventData.subjectName || "Subject",
        topicName: eventData.topicName || "Topic Review",
        durationMinutes: parseInt(eventData.durationMinutes) || 60,
        status: "pending"
      };
      if (!this.state.plannerEvents) this.state.plannerEvents = [];
      this.state.plannerEvents.push(newEvent);
      this.saveState();
      return newEvent;
    }

    togglePlannerEvent(eventId) {
      const event = (this.state.plannerEvents || []).find((e) => e.id === eventId);
      if (event) {
        event.status = event.status === "completed" ? "pending" : "completed";
        this.saveState();
        return event;
      }
      return null;
    }

    deletePlannerEvent(eventId) {
      this.state.plannerEvents = (this.state.plannerEvents || []).filter((e) => e.id !== eventId);
      this.saveState();
    }

    // --- Study Logging (From Timer) ---
    logStudySession(subjectId, topicId, minutes) {
      const hours = Math.round((minutes / 60) * 10) / 10;
      const subject = this.getSubjectById(subjectId);

      if (subject) {
        subject.studyHours = Math.round(((subject.studyHours || 0) + hours) * 10) / 10;

        if (topicId && subject.topics) {
          const topic = subject.topics.find((t) => t.id === topicId);
          if (topic) {
            topic.actualHours = Math.round(((topic.actualHours || 0) + hours) * 10) / 10;
            if (topic.status === "Not Started") {
              topic.status = "In Progress";
            }
          }
        }
      }

      // Add to today's study logs
      const today = new Date().toISOString().split("T")[0];
      if (!this.state.studyLogs) this.state.studyLogs = [];
      this.state.studyLogs.push({
        id: "log-" + Date.now(),
        date: today,
        subjectId,
        topicId,
        minutes,
        timestamp: new Date().toISOString()
      });

      this.saveState();
    }

    // --- Computed Metrics & Dashboard Stats ---
    getStatistics() {
      const subjects = this.state.subjects || [];
      let totalTopics = 0;
      let completedTopics = 0;
      let totalStudyHours = 0;

      subjects.forEach((s) => {
        totalStudyHours += s.studyHours || 0;
        if (s.topics) {
          totalTopics += s.topics.length;
          completedTopics += s.topics.filter((t) => t.status === "Completed").length;
        }
      });

      const overallProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

      // Today's tasks completion
      const tasks = this.state.tasks || [];
      const todayTasks = tasks; // All current tasks shown for today
      const completedTodayTasks = todayTasks.filter((t) => t.completed).length;
      const todayCompletionPercentage =
        todayTasks.length > 0 ? Math.round((completedTodayTasks / todayTasks.length) * 100) : 0;

      // Exam countdown calculations
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const examsWithDays = subjects
        .map((s) => {
          const examDate = new Date(s.examDate);
          examDate.setHours(0, 0, 0, 0);
          const diffDays = Math.ceil((examDate - now) / (1000 * 60 * 60 * 24));
          const subTopics = s.topics || [];
          const doneTopics = subTopics.filter((t) => t.status === "Completed").length;
          const prepPercent = subTopics.length > 0 ? Math.round((doneTopics / subTopics.length) * 100) : 0;

          return {
            ...s,
            daysRemaining: diffDays,
            preparationPercentage: prepPercent,
            totalTopicsCount: subTopics.length,
            completedTopicsCount: doneTopics
          };
        })
        .sort((a, b) => a.daysRemaining - b.daysRemaining);

      const urgentExam = examsWithDays.find((e) => e.daysRemaining >= 0) || examsWithDays[0];

      return {
        totalSubjects: subjects.length,
        totalTopics,
        completedTopics,
        totalStudyHours: Math.round(totalStudyHours * 10) / 10,
        overallProgress,
        todayTasksCount: todayTasks.length,
        completedTodayTasks,
        todayCompletionPercentage,
        urgentExam,
        upcomingExams: examsWithDays
      };
    }
  }

  window.ExamTrackStore = new Store();
})();

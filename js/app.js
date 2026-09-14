/**
 * ExamTrack - Main Application Controller & Router
 * Manages view routing, toasts, theme toggling, data export/reset, and global event binding
 */

(function () {
  // Application router
  window.ExamTrackRouter = {
    currentView: "dashboard",
    currentParams: {},

    navigate(view, params = {}) {
      this.currentView = view;
      this.currentParams = params;
      window.location.hash = view + (params.id ? `?id=${params.id}` : "");
      this.renderCurrentView();
    },

    renderCurrentView() {
      // Always render navbar
      window.ExamTrackNavbar.render(this.currentView);

      // Scroll smoothly to top
      window.scrollTo({ top: 0, behavior: "instant" });

      switch (this.currentView) {
        case "landing":
          window.ExamTrackLanding.render();
          break;
        case "auth":
          window.ExamTrackAuth.render(this.currentParams);
          break;
        case "dashboard":
          window.ExamTrackDashboard.render();
          break;
        case "subjects":
          window.ExamTrackSubjects.render();
          break;
        case "subject-detail":
          window.ExamTrackSubjectDetail.render(this.currentParams);
          break;
        case "planner":
          window.ExamTrackPlanner.render();
          break;
        case "timer":
          window.ExamTrackTimer.render(this.currentParams);
          break;
        case "analytics":
          window.ExamTrackAnalytics.render();
          break;
        default:
          window.ExamTrackDashboard.render();
      }

      if (window.lucide) {
        window.lucide.createIcons();
      }
    },

    initFromHash() {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        const [view, query] = hash.split("?");
        const params = {};
        if (query) {
          query.split("&").forEach((part) => {
            const [k, v] = part.split("=");
            params[k] = decodeURIComponent(v || "");
          });
        }
        this.navigate(view, params);
      } else {
        this.navigate("landing");
      }
    }
  };

  // Main application logic & helpers
  window.ExamTrackApp = {
    init() {
      // 1. Initialize theme
      this.initTheme();

      // 2. Subscribe to store changes
      window.ExamTrackStore.subscribe((state, action) => {
        if (action === "RESET") {
          this.showToast("Restored demo study dataset.", "info");
        }
        window.ExamTrackNavbar.render(window.ExamTrackRouter.currentView);
      });

      // 3. Setup hash change listener
      window.addEventListener("hashchange", () => {
        const hash = window.location.hash.replace("#", "");
        if (hash) {
          const [view, query] = hash.split("?");
          const params = {};
          if (query) {
            query.split("&").forEach((part) => {
              const [k, v] = part.split("=");
              params[k] = decodeURIComponent(v || "");
            });
          }
          if (view !== window.ExamTrackRouter.currentView) {
            window.ExamTrackRouter.navigate(view, params);
          }
        }
      });

      // 4. Initial route load
      window.ExamTrackRouter.initFromHash();
    },

    initTheme() {
      const store = window.ExamTrackStore;
      const theme = store.getTheme();
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },

    toggleTheme() {
      const store = window.ExamTrackStore;
      const current = store.getTheme();
      const nextTheme = current === "dark" ? "light" : "dark";
      store.setTheme(nextTheme);

      if (nextTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      window.ExamTrackNavbar.render(window.ExamTrackRouter.currentView);
      this.showToast(`Switched to ${nextTheme} mode`, "info");
    },

    showToast(message, type = "info") {
      const container = document.getElementById("toast-container");
      if (!container) return;

      const toast = document.createElement("div");
      toast.className = `flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold border transition-all duration-300 transform translate-y-2 opacity-0 ${
        type === "success"
          ? "bg-emerald-600 text-white border-emerald-500 shadow-emerald-600/20"
          : type === "info"
          ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-700 shadow-slate-900/20"
          : "bg-rose-600 text-white border-rose-500 shadow-rose-600/20"
      }`;

      const iconName = type === "success" ? "check-circle" : type === "info" ? "info" : "alert-circle";
      toast.innerHTML = `
        <i data-lucide="${iconName}" class="w-4 h-4 shrink-0"></i>
        <span>${message}</span>
      `;

      container.appendChild(toast);
      if (window.lucide) window.lucide.createIcons();

      // Animate in
      requestAnimationFrame(() => {
        toast.classList.remove("translate-y-2", "opacity-0");
      });

      // Remove after 3.2 seconds
      setTimeout(() => {
        toast.classList.add("translate-y-2", "opacity-0");
        setTimeout(() => {
          if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 300);
      }, 3200);
    },

    resetData() {
      if (confirm("Reset all subjects, topics, and planner events back to the default demo data?")) {
        window.ExamTrackStore.resetToDemoData();
        window.ExamTrackRouter.renderCurrentView();
      }
    },

    exportData() {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(window.ExamTrackStore.state, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `examtrack-backup-${new Date().toISOString().split("T")[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      this.showToast("Data backup downloaded as JSON", "success");
    }
  };

  // Launch on DOM ready
  document.addEventListener("DOMContentLoaded", () => {
    window.ExamTrackApp.init();
  });
})();

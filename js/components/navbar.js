/**
 * ExamTrack - Navigation Component
 * Header with brand, responsive navigation links, exam countdown badge, theme toggle, and profile menu
 */

(function () {
  window.ExamTrackNavbar = {
    render(activeView = "dashboard") {
      const store = window.ExamTrackStore;
      const stats = store.getStatistics();
      const user = store.getCurrentUser();
      const theme = store.getTheme();
      const urgentExam = stats.urgentExam;

      const navContainer = document.getElementById("navbar-container");
      if (!navContainer) return;

      const urgentBadgeHtml = urgentExam && urgentExam.daysRemaining >= 0
        ? `
          <button onclick="window.ExamTrackRouter.navigate('subject-detail', { id: '${urgentExam.id}' })"
            class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/80 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer" title="Click to view exam topics">
            <span class="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 pulse-indicator"></span>
            <span>${urgentExam.name} Exam: <strong class="font-bold">${urgentExam.daysRemaining} Days Left</strong></span>
          </button>
        `
        : "";

      const navItems = [
        { id: "dashboard", label: "Dashboard", icon: "layout-dashboard" },
        { id: "subjects", label: "Subjects", icon: "book-open" },
        { id: "planner", label: "Study Planner", icon: "calendar" },
        { id: "timer", label: "Focus Timer", icon: "timer" },
        { id: "analytics", label: "Analytics", icon: "bar-chart-3" }
      ];

      const navLinksHtml = navItems
        .map((item) => {
          const isActive = activeView === item.id;
          const activeClasses = isActive
            ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold border-indigo-200 dark:border-indigo-800"
            : "text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 font-medium";

          return `
            <button onclick="window.ExamTrackRouter.navigate('${item.id}')"
              class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm transition-all duration-150 cursor-pointer ${activeClasses}">
              <i data-lucide="${item.icon}" class="w-4 h-4"></i>
              <span>${item.label}</span>
            </button>
          `;
        })
        .join("");

      navContainer.innerHTML = `
        <header class="sticky top-0 z-40 w-full glass-nav transition-colors duration-200">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
              
              <!-- Brand Logo -->
              <div class="flex items-center gap-8">
                <div onclick="window.ExamTrackRouter.navigate('landing')" class="flex items-center gap-3 cursor-pointer group">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                    <i data-lucide="graduation-cap" class="w-5 h-5"></i>
                  </div>
                  <div>
                    <div class="flex items-center gap-1.5">
                      <span class="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">Exam<span class="text-indigo-600 dark:text-indigo-400">Track</span></span>
                      <span class="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">v2.0</span>
                    </div>
                    <p class="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block font-medium">Exam Prep & Mastery</p>
                  </div>
                </div>

                <!-- Desktop Navigation Links -->
                <nav class="hidden lg:flex items-center gap-1">
                  ${navLinksHtml}
                </nav>
              </div>

              <!-- Right Tools: Urgent Countdown, Theme Toggle, Profile Menu -->
              <div class="flex items-center gap-3">
                ${urgentBadgeHtml}

                <!-- Theme Toggle Button -->
                <button id="theme-toggle-btn" onclick="window.ExamTrackApp.toggleTheme()"
                  class="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  title="Toggle Light/Dark Theme">
                  <i data-lucide="${theme === 'dark' ? 'sun' : 'moon'}" class="w-5 h-5"></i>
                </button>

                <!-- Profile Dropdown -->
                <div class="relative">
                  <button id="profile-dropdown-btn" onclick="window.ExamTrackNavbar.toggleProfileMenu()"
                    class="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                    <img src="${user.avatar}" alt="${user.name}" class="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-700" />
                    <div class="text-left hidden xl:block leading-tight">
                      <p class="text-xs font-semibold text-slate-900 dark:text-white">${user.name}</p>
                      <p class="text-[11px] text-slate-500 dark:text-slate-400">${user.semester}</p>
                    </div>
                    <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400"></i>
                  </button>

                  <!-- Profile Menu Dropdown -->
                  <div id="profile-menu" class="hidden absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div class="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                      <p class="text-xs font-bold text-slate-900 dark:text-white">${user.name}</p>
                      <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate">${user.email}</p>
                      <p class="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">${user.major}</p>
                    </div>

                    <div class="py-1">
                      <button onclick="window.ExamTrackRouter.navigate('landing')" class="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer text-left">
                        <i data-lucide="home" class="w-4 h-4 text-slate-400"></i>
                        <span>Landing Page</span>
                      </button>
                      <button onclick="window.ExamTrackApp.exportData()" class="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer text-left">
                        <i data-lucide="download" class="w-4 h-4 text-slate-400"></i>
                        <span>Export Backup (JSON)</span>
                      </button>
                      <button onclick="window.ExamTrackApp.resetData()" class="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors cursor-pointer text-left">
                        <i data-lucide="rotate-ccw" class="w-4 h-4"></i>
                        <span>Reset to Demo Data</span>
                      </button>
                    </div>

                    <div class="border-t border-slate-100 dark:border-slate-800 pt-1">
                      <button onclick="window.ExamTrackRouter.navigate('auth')" class="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer text-left">
                        <i data-lucide="log-out" class="w-4 h-4"></i>
                        <span>Switch User / Log Out</span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Mobile Menu Hamburger Button -->
                <button onclick="window.ExamTrackNavbar.toggleMobileMenu()"
                  class="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                  <i data-lucide="menu" class="w-5 h-5"></i>
                </button>
              </div>
            </div>

            <!-- Mobile Navigation Drawer -->
            <div id="mobile-menu" class="hidden lg:hidden border-t border-slate-200 dark:border-slate-800 py-3 space-y-1">
              ${navItems
                .map((item) => {
                  const isActive = activeView === item.id;
                  return `
                    <button onclick="window.ExamTrackRouter.navigate('${item.id}'); window.ExamTrackNavbar.toggleMobileMenu(false);"
                      class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium ${
                        isActive
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }">
                      <i data-lucide="${item.icon}" class="w-4 h-4"></i>
                      <span>${item.label}</span>
                    </button>
                  `;
                })
                .join("")}
            </div>
          </div>
        </header>
      `;

      if (window.lucide) {
        window.lucide.createIcons();
      }
    },

    toggleProfileMenu(force) {
      const menu = document.getElementById("profile-menu");
      if (menu) {
        if (typeof force === "boolean") {
          menu.classList.toggle("hidden", !force);
        } else {
          menu.classList.toggle("hidden");
        }
      }
    },

    toggleMobileMenu(force) {
      const menu = document.getElementById("mobile-menu");
      if (menu) {
        if (typeof force === "boolean") {
          menu.classList.toggle("hidden", !force);
        } else {
          menu.classList.toggle("hidden");
        }
      }
    }
  };

  // Close menus when clicking outside
  document.addEventListener("click", (e) => {
    const profileBtn = document.getElementById("profile-dropdown-btn");
    const profileMenu = document.getElementById("profile-menu");
    if (profileMenu && !profileMenu.classList.contains("hidden")) {
      if (profileBtn && !profileBtn.contains(e.target) && !profileMenu.contains(e.target)) {
        profileMenu.classList.add("hidden");
      }
    }
  });
})();

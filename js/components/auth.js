/**
 * ExamTrack - Authentication Component
 * Login, Sign Up, and Forgot Password views with local storage persistence and Quick Demo login
 */

(function () {
  window.ExamTrackAuth = {
    currentTab: "login", // "login" | "signup" | "forgot"

    render(options = {}) {
      if (options.mode) {
        this.currentTab = options.mode;
      }

      const container = document.getElementById("main-content");
      if (!container) return;

      container.innerHTML = `
        <div class="fade-in max-w-md mx-auto py-12 px-4 sm:px-6">
          <div class="text-center mb-8">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-600/25 mb-4">
              <i data-lucide="graduation-cap" class="w-6 h-6"></i>
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              ${this.currentTab === "login" ? "Welcome Back to ExamTrack" : this.currentTab === "signup" ? "Create Your Student Account" : "Reset Your Password"}
            </h2>
            <p class="text-sm text-slate-600 dark:text-slate-400 mt-2">
              ${this.currentTab === "login" ? "Track your syllabus, exam dates, and daily study streak." : this.currentTab === "signup" ? "Start organizing your preparation and acing exams." : "Enter your email to receive recovery instructions."}
            </p>
          </div>

          <!-- Auth Card -->
          <div class="exam-card rounded-2xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
            
            <!-- Tab Buttons -->
            <div class="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6">
              <button onclick="window.ExamTrackAuth.switchTab('login')"
                class="flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${this.currentTab === 'login' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}">
                Log In
              </button>
              <button onclick="window.ExamTrackAuth.switchTab('signup')"
                class="flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${this.currentTab === 'signup' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}">
                Sign Up
              </button>
            </div>

            <!-- Tab Content -->
            ${this.renderTabContent()}

            <!-- Demo Quick Login Button (Zero Barrier Access) -->
            <div class="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
              <p class="text-xs text-slate-500 dark:text-slate-400 mb-3">Want to preview the app instantly?</p>
              <button onclick="window.ExamTrackAuth.quickDemoLogin()"
                class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer flex items-center justify-center gap-2">
                <i data-lucide="zap" class="w-4 h-4 text-amber-500 fill-amber-500"></i>
                <span>One-Click Demo Login (Student Profile)</span>
              </button>
            </div>

          </div>

          <div class="text-center mt-6">
            <button onclick="window.ExamTrackRouter.navigate('landing')" class="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium inline-flex items-center gap-1">
              <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
              <span>Back to Landing Page</span>
            </button>
          </div>
        </div>
      `;

      if (window.lucide) {
        window.lucide.createIcons();
      }
    },

    switchTab(tab) {
      this.currentTab = tab;
      this.render();
    },

    renderTabContent() {
      if (this.currentTab === "login") {
        return `
          <form onsubmit="window.ExamTrackAuth.handleLogin(event)" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Student Email</label>
              <div class="relative">
                <i data-lucide="mail" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3"></i>
                <input type="email" id="auth-email" required value="alex.rivera@student.edu"
                  placeholder="student@university.edu"
                  class="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500" />
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                <button type="button" onclick="window.ExamTrackAuth.switchTab('forgot')" class="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                  Forgot Password?
                </button>
              </div>
              <div class="relative">
                <i data-lucide="lock" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3"></i>
                <input type="password" id="auth-password" required value="••••••••"
                  placeholder="Enter your password"
                  class="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500" />
              </div>
            </div>

            <button type="submit"
              class="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2">
              <span>Log In to Dashboard</span>
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </button>
          </form>
        `;
      } else if (this.currentTab === "signup") {
        return `
          <form onsubmit="window.ExamTrackAuth.handleSignup(event)" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
              <div class="relative">
                <i data-lucide="user" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3"></i>
                <input type="text" id="signup-name" required placeholder="e.g. Maya Chen"
                  class="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">College or School Email</label>
              <div class="relative">
                <i data-lucide="mail" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3"></i>
                <input type="email" id="signup-email" required placeholder="name@college.edu"
                  class="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Degree / Major</label>
              <div class="relative">
                <i data-lucide="book" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3"></i>
                <input type="text" id="signup-major" placeholder="e.g. Computer Science & Eng"
                  class="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <div class="relative">
                <i data-lucide="lock" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3"></i>
                <input type="password" id="signup-password" required placeholder="Create a secure password"
                  class="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500" />
              </div>
            </div>

            <button type="submit"
              class="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2">
              <span>Create Free Account</span>
              <i data-lucide="check" class="w-4 h-4"></i>
            </button>
          </form>
        `;
      } else {
        return `
          <form onsubmit="window.ExamTrackAuth.handleForgot(event)" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Registered Email</label>
              <div class="relative">
                <i data-lucide="mail" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3"></i>
                <input type="email" id="forgot-email" required placeholder="Enter your email"
                  class="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500" />
              </div>
            </div>

            <button type="submit"
              class="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2">
              <span>Send Reset Instructions</span>
              <i data-lucide="send" class="w-4 h-4"></i>
            </button>

            <div class="text-center pt-2">
              <button type="button" onclick="window.ExamTrackAuth.switchTab('login')" class="text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                &larr; Return to login
              </button>
            </div>
          </form>
        `;
      }
    },

    handleLogin(e) {
      e.preventDefault();
      const email = document.getElementById("auth-email").value;
      const store = window.ExamTrackStore;
      store.login(email, "Alex Rivera");
      window.ExamTrackApp.showToast("Welcome back, Alex! Preparation tracker loaded.", "success");
      window.ExamTrackRouter.navigate("dashboard");
    },

    handleSignup(e) {
      e.preventDefault();
      const name = document.getElementById("signup-name").value;
      const email = document.getElementById("signup-email").value;
      const major = document.getElementById("signup-major")?.value || "Computer Science";
      
      const store = window.ExamTrackStore;
      store.login(email, name);
      if (store.state.currentUser) {
        store.state.currentUser.major = major;
        store.saveState();
      }

      window.ExamTrackApp.showToast(`Account created for ${name}! Welcome to ExamTrack.`, "success");
      window.ExamTrackRouter.navigate("dashboard");
    },

    handleForgot(e) {
      e.preventDefault();
      window.ExamTrackApp.showToast("Password reset link sent to your registered email.", "info");
      this.switchTab("login");
    },

    quickDemoLogin() {
      const store = window.ExamTrackStore;
      store.login("alex.rivera@student.edu", "Alex Rivera");
      window.ExamTrackApp.showToast("Logged in with Student Demo Profile.", "success");
      window.ExamTrackRouter.navigate("dashboard");
    }
  };
})();

/**
 * LifeOS — Navigation & Router
 * Handles hash-based page transitions, active navigation states,
 * header title updates, and responsive mobile sidebar drawer.
 */

const PAGE_METADATA = {
  dashboard: {
    title: 'Dashboard',
    subtitle: 'A clearer today. A brighter tomorrow.'
  },
  inbox: {
    title: 'Inbox',
    subtitle: 'Capture everything before you forget it.'
  },
  tasks: {
    title: 'Tasks',
    subtitle: 'Everything you need to get done.'
  },
  calendar: {
    title: 'Calendar',
    subtitle: 'See deadlines and commitments in one place.'
  },
  planner: {
    title: 'Daily Planner',
    subtitle: 'Decide what deserves your time today.'
  },
  projects: {
    title: 'Projects',
    subtitle: 'Manage work across different areas of your life.'
  },
  learning: {
    title: 'Learning',
    subtitle: "Track what you're currently learning."
  },
  ideas: {
    title: 'Ideas',
    subtitle: 'Store ideas without letting them distract you.'
  },
  money: {
    title: 'Money',
    subtitle: 'Understand where your money is going.'
  },
  review: {
    title: 'Weekly Review',
    subtitle: 'Understand what happened this week.'
  },
  settings: {
    title: 'Settings',
    subtitle: 'Manage preferences, areas, and data.'
  }
};

const Navigation = {
  currentPage: 'dashboard',

  init() {
    this.bindEvents();
    this.handleRoute();
  },

  bindEvents() {
    // Listen for hash changes in URL
    window.addEventListener('hashchange', () => this.handleRoute());

    // Mobile sidebar toggle buttons
    const mobileToggleBtn = document.getElementById('mobile-nav-toggle');
    const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');

    if (mobileToggleBtn) {
      mobileToggleBtn.addEventListener('click', () => this.openMobileSidebar());
    }
    if (sidebarCloseBtn) {
      sidebarCloseBtn.addEventListener('click', () => this.closeMobileSidebar());
    }
    if (sidebarBackdrop) {
      sidebarBackdrop.addEventListener('click', () => this.closeMobileSidebar());
    }

    // Direct nav item clicks
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const page = item.getAttribute('data-page');
        if (page) {
          window.location.hash = page;
          this.closeMobileSidebar();
        }
      });
    });
  },

  handleRoute() {
    const hash = window.location.hash.replace('#', '').trim();
    const targetPage = PAGE_METADATA[hash] ? hash : 'dashboard';
    this.navigateTo(targetPage);
  },

  navigateTo(pageName) {
    if (!PAGE_METADATA[pageName]) pageName = 'dashboard';
    this.currentPage = pageName;

    // 1. Update Active Navigation Link
    document.querySelectorAll('.nav-item').forEach(item => {
      const itemPage = item.getAttribute('data-page');
      if (itemPage === pageName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // 2. Update Header Title & Subtitle
    const titleEl = document.getElementById('current-page-title');
    const subtitleEl = document.getElementById('current-page-subtitle');
    const meta = PAGE_METADATA[pageName];

    if (titleEl) titleEl.textContent = meta.title;
    if (subtitleEl) subtitleEl.textContent = meta.subtitle;

    // 3. Switch Active Page View Section
    document.querySelectorAll('.page-view').forEach(view => {
      if (view.getAttribute('data-page') === pageName) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });

    // 4. Scroll main content area to top
    const mainWrapper = document.querySelector('.main-wrapper');
    if (mainWrapper) mainWrapper.scrollTop = 0;

    // Refresh views if active
    if (pageName === 'dashboard' && window.Dashboard) {
      window.Dashboard.init();
    }
    if (pageName === 'inbox' && window.Inbox) {
      window.Inbox.init();
    }
    if (pageName === 'tasks' && window.Tasks) {
      window.Tasks.init();
    }
    if (pageName === 'projects' && window.Projects) {
      window.Projects.init();
    }
    if (pageName === 'calendar' && window.Calendar) {
      window.Calendar.init();
    }
    if (pageName === 'planner' && window.Planner) {
      window.Planner.init();
    }
    if (pageName === 'money' && window.Finance) {
      window.Finance.init();
    }
    if (pageName === 'learning' && window.Learning) {
      window.Learning.init();
    }
    if (pageName === 'ideas' && window.Ideas) {
      window.Ideas.init();
    }
    if (pageName === 'review' && window.WeeklyReview) {
      window.WeeklyReview.init();
    }
    if (pageName === 'settings' && window.Settings) {
      window.Settings.init();
    }

    // Trigger Lucide icons update if needed
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  },

  openMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar) sidebar.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
  },

  closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
  }
};

window.Navigation = Navigation;

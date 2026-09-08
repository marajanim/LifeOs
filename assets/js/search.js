/**
 * LifeOS — Global Search & Command Center (Step 16)
 * Fast ⌘K modal searching across Tasks, Projects, Inbox, Ideas, Learning, Finance, and Reminders
 * with keyboard navigation and quick actions.
 */

const GlobalSearch = {
  isOpen: false,
  selectedIndex: 0,
  currentCategory: 'all',
  currentQuery: '',
  results: [],

  init() {
    this.bindEvents();
  },

  bindEvents() {
    // 1. Keyboard shortcut: ⌘K or Ctrl+K or / (when not in input)
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.open();
      } else if (e.key === 'Escape' && this.isOpen) {
        this.close();
      } else if (this.isOpen) {
        this.handleKeyboardNav(e);
      }
    });

    // 2. Click on Header Search Box
    const headerSearchBtn = document.getElementById('header-search-btn');
    if (headerSearchBtn && !headerSearchBtn.dataset.bound) {
      headerSearchBtn.dataset.bound = 'true';
      headerSearchBtn.addEventListener('click', () => {
        this.open();
      });
    }

    // 3. Search Input in Command Modal
    const searchInput = document.getElementById('command-search-input');
    if (searchInput && !searchInput.dataset.bound) {
      searchInput.dataset.bound = 'true';
      searchInput.addEventListener('input', (e) => {
        this.currentQuery = e.target.value.toLowerCase().trim();
        this.selectedIndex = 0;
        this.renderResults();
      });
    }

    // 4. Close button and backdrop
    const modal = document.getElementById('command-search-modal');
    if (modal && !modal.dataset.bound) {
      modal.dataset.bound = 'true';
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.close();
      });
    }

    // 5. Filter chips inside command modal
    const chips = document.querySelectorAll('.command-filter-chip');
    chips.forEach(chip => {
      if (!chip.dataset.bound) {
        chip.dataset.bound = 'true';
        chip.addEventListener('click', () => {
          chips.forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          this.currentCategory = chip.getAttribute('data-cat') || 'all';
          this.selectedIndex = 0;
          this.renderResults();
        });
      }
    });
  },

  open() {
    this.isOpen = true;
    const modal = document.getElementById('command-search-modal');
    const input = document.getElementById('command-search-input');

    if (modal) {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    }
    if (input) {
      input.value = '';
      this.currentQuery = '';
      this.selectedIndex = 0;
      setTimeout(() => input.focus(), 50);
    }
    this.renderResults();
  },

  close() {
    this.isOpen = false;
    const modal = document.getElementById('command-search-modal');
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
  },

  handleKeyboardNav(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.results.length > 0) {
        this.selectedIndex = (this.selectedIndex + 1) % this.results.length;
        this.updateSelectedState();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.results.length > 0) {
        this.selectedIndex = (this.selectedIndex - 1 + this.results.length) % this.results.length;
        this.updateSelectedState();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (this.results.length > 0 && this.results[this.selectedIndex]) {
        this.executeResult(this.results[this.selectedIndex]);
      }
    }
  },

  searchData() {
    const q = this.currentQuery;
    const results = [];

    // Always include top quick actions if query is empty or matches action
    const actions = [
      { type: 'Action', title: 'Create New Task', icon: 'check-square', color: '#2563eb', action: () => { window.LifeOS.openModal('create-task-modal'); } },
      { type: 'Action', title: 'Capture New Idea', icon: 'lightbulb', color: '#f59e0b', action: () => { window.location.hash = 'ideas'; } },
      { type: 'Action', title: 'Add Finance Transaction', icon: 'plus-circle', color: '#10b981', action: () => { window.LifeOS.openModal('add-transaction-modal'); } },
      { type: 'Action', title: 'Go to Daily Planner', icon: 'clock', color: '#6366f1', action: () => { window.location.hash = 'planner'; } },
      { type: 'Action', title: 'Weekly Review', icon: 'bar-chart-2', color: '#8b5cf6', action: () => { window.location.hash = 'review'; } },
      { type: 'Action', title: 'Settings & Preferences', icon: 'settings', color: '#64748b', action: () => { window.location.hash = 'settings'; } }
    ];

    if (!q) {
      if (this.currentCategory === 'all' || this.currentCategory === 'actions') {
        return actions;
      }
    }

    // Filter actions if query matches
    if (this.currentCategory === 'all' || this.currentCategory === 'actions') {
      actions.forEach(a => {
        if (a.title.toLowerCase().includes(q)) results.push(a);
      });
    }

    // 1. Tasks
    if (this.currentCategory === 'all' || this.currentCategory === 'tasks') {
      const tasks = StorageService.getTasks();
      tasks.forEach(t => {
        if ((t.title && t.title.toLowerCase().includes(q)) ||
            (t.project && t.project.toLowerCase().includes(q)) ||
            (t.area && t.area.toLowerCase().includes(q))) {
          results.push({
            type: 'Task',
            title: t.title,
            sub: `${t.area} • ${t.project || 'General'} • Due ${t.deadline || 'Soon'}`,
            icon: 'check-square',
            color: '#2563eb',
            action: () => {
              window.location.hash = 'tasks';
              setTimeout(() => window.Tasks?.selectTask?.(t.id), 100);
            }
          });
        }
      });
    }

    // 2. Projects
    if (this.currentCategory === 'all' || this.currentCategory === 'projects') {
      const projects = StorageService.getProjects();
      projects.forEach(p => {
        if ((p.name && p.name.toLowerCase().includes(q)) ||
            (p.description && p.description.toLowerCase().includes(q)) ||
            (p.area && p.area.toLowerCase().includes(q))) {
          results.push({
            type: 'Project',
            title: p.name,
            sub: `${p.area} • ${p.status} • ${p.progress || 0}%`,
            icon: 'folder',
            color: '#7c3aed',
            action: () => {
              window.location.hash = 'projects';
              setTimeout(() => window.Projects?.selectProject?.(p.id), 100);
            }
          });
        }
      });
    }

    // 3. Ideas
    if (this.currentCategory === 'all' || this.currentCategory === 'ideas') {
      const ideas = StorageService.getIdeas();
      ideas.forEach(i => {
        if ((i.title && i.title.toLowerCase().includes(q)) ||
            (i.description && i.description.toLowerCase().includes(q)) ||
            (i.category && i.category.toLowerCase().includes(q))) {
          results.push({
            type: 'Idea',
            title: i.title,
            sub: `${i.category} • ${i.status} • ${i.fomoBucket} Bucket`,
            icon: 'lightbulb',
            color: '#f59e0b',
            action: () => {
              window.location.hash = 'ideas';
              setTimeout(() => window.Ideas?.selectIdea?.(i.id), 100);
            }
          });
        }
      });
    }

    // 4. Learning
    if (this.currentCategory === 'all' || this.currentCategory === 'learning') {
      const learning = StorageService.getLearningItems();
      learning.forEach(l => {
        if ((l.title && l.title.toLowerCase().includes(q)) ||
            (l.topic && l.topic.toLowerCase().includes(q)) ||
            (l.type && l.type.toLowerCase().includes(q))) {
          results.push({
            type: 'Learning',
            title: l.title,
            sub: `${l.type} • ${l.topic} • ${l.progress || 0}%`,
            icon: 'graduation-cap',
            color: '#059669',
            action: () => {
              window.location.hash = 'learning';
              setTimeout(() => window.Learning?.selectItem?.(l.id), 100);
            }
          });
        }
      });
    }

    // 5. Finance
    if (this.currentCategory === 'all' || this.currentCategory === 'finance') {
      const txs = StorageService.getTransactions();
      txs.forEach(t => {
        if ((t.description && t.description.toLowerCase().includes(q)) ||
            (t.category && t.category.toLowerCase().includes(q))) {
          results.push({
            type: 'Finance',
            title: t.description,
            sub: `${t.category} • ৳ ${Number(t.amount || 0).toLocaleString()} • ${t.dateDisplay}`,
            icon: 'wallet',
            color: t.type === 'income' ? '#10b981' : '#e11d48',
            action: () => {
              window.location.hash = 'money';
            }
          });
        }
      });
    }

    // 6. Reminders
    if (this.currentCategory === 'all' || this.currentCategory === 'reminders') {
      const rems = StorageService.getReminders();
      rems.forEach(r => {
        if ((r.title && r.title.toLowerCase().includes(q)) ||
            (r.description && r.description.toLowerCase().includes(q))) {
          results.push({
            type: 'Reminder',
            title: r.title,
            sub: `${r.dateDisplay || r.date} • ${r.time || ''} • ${r.repeat || 'None'}`,
            icon: 'bell',
            color: '#2563eb',
            action: () => {
              Reminders.handleClickReminder(r.id);
            }
          });
        }
      });
    }

    return results;
  },

  renderResults() {
    const container = document.getElementById('command-results-list');
    if (!container) return;

    this.results = this.searchData();

    if (this.results.length === 0) {
      container.innerHTML = `
        <div style="padding: 32px 20px; text-align: center; color: var(--color-text-secondary); font-size: 13px;">
          No results found for "${this.currentQuery}". Try another keyword.
        </div>
      `;
      return;
    }

    let html = '';
    this.results.forEach((item, index) => {
      const isSelected = index === this.selectedIndex;
      html += `
        <div class="command-result-item ${isSelected ? 'selected' : ''}" data-index="${index}" onclick="GlobalSearch.executeResultByIndex(${index})">
          <div class="command-item-icon" style="color: ${item.color || '#2563eb'};">
            <i data-lucide="${item.icon || 'circle'}" style="width: 16px; height: 16px;"></i>
          </div>
          <div class="command-item-content">
            <div class="command-item-title">${item.title}</div>
            ${item.sub ? `<div class="command-item-sub">${item.sub}</div>` : ''}
          </div>
          <div class="command-item-badge">${item.type}</div>
        </div>
      `;
    });

    container.innerHTML = html;
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  },

  updateSelectedState() {
    const items = document.querySelectorAll('.command-result-item');
    items.forEach((item, idx) => {
      if (idx === this.selectedIndex) {
        item.classList.add('selected');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('selected');
      }
    });
  },

  executeResultByIndex(index) {
    if (this.results[index]) {
      this.executeResult(this.results[index]);
    }
  },

  executeResult(item) {
    this.close();
    if (typeof item.action === 'function') {
      item.action();
    }
  }
};

window.GlobalSearch = GlobalSearch;

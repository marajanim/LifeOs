/**
 * LifeOS — Dashboard Controller (Step 2)
 * Renders and manages the complete personal dashboard overview:
 * - Dynamic Greeting & Date
 * - Top KPI Stat Cards
 * - Today's Focus Table with live checkbox toggles
 * - Upcoming Deadlines with urgency tags
 * - Active Projects with progress bars
 * - Waiting For list with duration indicators
 * - Workload Snapshot with weekly CSS bar chart
 * - Financial Snapshot with Taka (৳) metrics
 * - Quick Capture saving directly to Inbox
 */

const Dashboard = {
  selectedCaptureType: 'Task',

  init() {
    this.renderHeader();
    this.renderKPICards();
    this.renderTodaysFocus();
    this.renderUpcomingDeadlines();
    this.renderActiveProjects();
    this.renderWaitingFor();
    this.renderWorkloadSnapshot();
    this.renderFinancialSnapshot();
    this.bindQuickCapture();
  },

  renderHeader() {
    const greetingEl = document.getElementById('dashboard-greeting');
    const dateEl = document.getElementById('dashboard-date');

    const now = new Date();
    const hour = now.getHours();
    let timeGreeting = 'Good afternoon';
    if (hour < 12) timeGreeting = 'Good morning';
    else if (hour >= 18) timeGreeting = 'Good evening';

    if (greetingEl) {
      greetingEl.textContent = `${timeGreeting}, Anim`;
    }

    if (dateEl) {
      const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
      dateEl.textContent = now.toLocaleDateString('en-US', options);
    }
  },

  renderKPICards() {
    const tasks = StorageService.getTasks();
    const totalTodayTasks = 8;
    const completedTasks = tasks.filter(t => t.completed).length;

    // 1. Today's Tasks
    const taskRatioEl = document.getElementById('kpi-task-ratio');
    const taskBarEl = document.getElementById('kpi-task-bar');
    const taskPercent = Math.round((completedTasks / totalTodayTasks) * 100);
    if (taskRatioEl) taskRatioEl.textContent = `${completedTasks} / ${totalTodayTasks}`;
    if (taskBarEl) taskBarEl.style.width = `${taskPercent}%`;

    // 2. Upcoming Deadlines
    const deadlineValEl = document.getElementById('kpi-deadline-val');
    if (deadlineValEl) deadlineValEl.textContent = '3';

    // 3. Focus Hours
    const focusValEl = document.getElementById('kpi-focus-val');
    const focusBarEl = document.getElementById('kpi-focus-bar');
    if (focusValEl) focusValEl.textContent = '3.5 / 6';
    if (focusBarEl) focusBarEl.style.width = '58%';

    // 4. Remaining Budget
    const finance = StorageService.getFinanceSnapshot();
    const budgetValEl = document.getElementById('kpi-budget-val');
    const budgetBarEl = document.getElementById('kpi-budget-bar');
    if (budgetValEl) budgetValEl.textContent = `${finance.currency} ${finance.remainingBudget.toLocaleString()}`;
    if (budgetBarEl) {
      const budgetPct = Math.round((finance.remainingBudget / finance.totalBudget) * 100);
      budgetBarEl.style.width = `${budgetPct}%`;
    }
  },

  renderTodaysFocus() {
    const tbody = document.getElementById('todays-focus-tbody');
    if (!tbody) return;

    const tasks = StorageService.getTasks().slice(0, 5);
    tbody.innerHTML = '';

    tasks.forEach((task, index) => {
      const tr = document.createElement('tr');
      tr.className = `task-table-row ${task.completed ? 'task-row-completed' : ''}`;

      const areaClassMap = {
        Job: 'badge-job',
        University: 'badge-university',
        Freelance: 'badge-freelance',
        SaaS: 'badge-saas',
        Learning: 'badge-learning',
        Personal: 'badge-personal'
      };

      const priorityClassMap = {
        High: 'badge-priority-high',
        Medium: 'badge-priority-medium',
        Low: 'badge-priority-low'
      };

      const areaClass = areaClassMap[task.area] || 'badge-job';
      const priorityClass = priorityClassMap[task.priority] || 'badge-priority-medium';

      tr.innerHTML = `
        <td class="task-col-num">${index + 1}</td>
        <td class="task-col-check">
          <input type="checkbox" class="form-checkbox task-check" data-id="${task.id}" ${task.completed ? 'checked' : ''} aria-label="Toggle task ${task.title}">
        </td>
        <td class="task-col-title">
          <span class="task-title-text ${task.completed ? 'completed-strike' : ''}">${task.title}</span>
        </td>
        <td class="task-col-area">
          <span class="badge ${areaClass}">
            <span class="badge-dot"></span>${task.area}
          </span>
        </td>
        <td class="task-col-deadline">${task.deadline}</td>
        <td class="task-col-priority">
          <span class="badge ${priorityClass}">${task.priority}</span>
        </td>
      `;

      tbody.appendChild(tr);
    });

    // Bind checkbox change events
    tbody.querySelectorAll('.task-check').forEach(box => {
      box.addEventListener('change', (e) => {
        const taskId = e.target.getAttribute('data-id');
        const updated = StorageService.toggleTask(taskId);
        if (updated) {
          this.renderKPICards();
          this.renderTodaysFocus();
          LifeOSToast.show(
            updated.completed ? `Task marked as completed!` : `Task reopened.`,
            updated.completed ? 'success' : 'info'
          );
        }
      });
    });
  },

  renderUpcomingDeadlines() {
    const listEl = document.getElementById('upcoming-deadlines-list');
    if (!listEl) return;

    const deadlines = [
      {
        title: 'CSE assignment submission',
        context: 'University • Apr 23, 2024',
        urgency: 'Due today',
        urgencyClass: 'badge-priority-high',
        dotColor: 'var(--color-danger)'
      },
      {
        title: 'Client proposal (Brand website)',
        context: 'Freelance • Apr 24, 2024',
        urgency: 'Tomorrow',
        urgencyClass: 'badge-priority-medium',
        dotColor: 'var(--color-info)'
      },
      {
        title: 'Monthly expense report',
        context: 'Finance • Apr 25, 2024',
        urgency: 'In 2 days',
        urgencyClass: 'badge-status-todo',
        dotColor: 'var(--color-success)'
      },
      {
        title: 'LifeOS prototype wireframe',
        context: 'SaaS • Apr 25, 2024',
        urgency: 'In 2 days',
        urgencyClass: 'badge-status-todo',
        dotColor: 'var(--color-primary)'
      },
      {
        title: 'AI course lesson 4',
        context: 'Learning • Apr 28, 2024',
        urgency: 'In 5 days',
        urgencyClass: 'badge-status-todo',
        dotColor: 'var(--badge-learning-text)'
      }
    ];

    listEl.innerHTML = '';
    deadlines.forEach(item => {
      const div = document.createElement('div');
      div.className = 'deadline-item-row';
      div.innerHTML = `
        <div class="deadline-dot" style="background-color: ${item.dotColor};"></div>
        <div class="deadline-info">
          <div class="deadline-title">${item.title}</div>
          <div class="deadline-context">${item.context}</div>
        </div>
        <div class="deadline-badge-wrap">
          <span class="badge ${item.urgencyClass}">${item.urgency}</span>
        </div>
      `;
      listEl.appendChild(div);
    });
  },

  renderActiveProjects() {
    const container = document.getElementById('active-projects-list');
    if (!container) return;

    const projects = StorageService.getProjects();
    container.innerHTML = '';

    const iconMap = {
      SaaS: 'box',
      Freelance: 'palette',
      University: 'file-text',
      Learning: 'smile'
    };

    const iconBgMap = {
      SaaS: 'rgba(37, 99, 235, 0.1)',
      Freelance: 'rgba(236, 72, 153, 0.1)',
      University: 'rgba(5, 150, 105, 0.1)',
      Learning: 'rgba(13, 148, 136, 0.1)'
    };

    const iconColorMap = {
      SaaS: '#2563eb',
      Freelance: '#ec4899',
      University: '#059669',
      Learning: '#0d9488'
    };

    projects.forEach(p => {
      const item = document.createElement('div');
      item.className = 'active-project-card';
      const icon = iconMap[p.area] || 'folder';
      const iconBg = iconBgMap[p.area] || 'rgba(37, 99, 235, 0.1)';
      const iconColor = iconColorMap[p.area] || '#2563eb';

      item.innerHTML = `
        <div class="project-card-left">
          <div class="project-icon-box" style="background-color: ${iconBg}; color: ${iconColor};">
            <i data-lucide="${icon}" style="width: 20px; height: 20px;"></i>
          </div>
          <div class="project-details">
            <div class="project-name">${p.name}</div>
            <div class="project-sub">${p.description}</div>
          </div>
        </div>
        <div class="project-card-right">
          <div class="project-progress-bar">
            <div class="project-progress-fill" style="width: ${p.progress}%; background-color: ${p.color || '#2563eb'};"></div>
          </div>
          <span class="project-progress-pct">${p.progress}%</span>
        </div>
      `;
      container.appendChild(item);
    });

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons({ root: container });
    }
  },

  renderWaitingFor() {
    const container = document.getElementById('waiting-for-list');
    if (!container) return;

    const items = StorageService.getWaitingFor();
    container.innerHTML = '';

    items.forEach(w => {
      const row = document.createElement('div');
      row.className = 'waiting-item-row';
      row.innerHTML = `
        <div class="waiting-dot"></div>
        <div class="waiting-info">
          <div class="waiting-title">${w.title}</div>
          <div class="waiting-context">${w.context}</div>
        </div>
        <div class="waiting-since-tag">${w.sinceDate}</div>
      `;
      container.appendChild(row);
    });
  },

  renderWorkloadSnapshot() {
    const chartContainer = document.getElementById('workload-bar-chart');
    if (!chartContainer) return;

    const workload = StorageService.getWorkloadSnapshot();
    chartContainer.innerHTML = '';

    const maxHours = 8;

    workload.days.forEach(d => {
      const col = document.createElement('div');
      col.className = `workload-day-col ${d.active ? 'active-day' : ''}`;

      const focusHeightPct = Math.min(100, Math.round((d.focus / maxHours) * 100));
      const otherHeightPct = Math.min(100, Math.round((d.other / maxHours) * 100));

      col.innerHTML = `
        <div class="bar-track">
          <div class="bar-other" style="height: ${otherHeightPct}%;" title="Other Time: ${d.other}h"></div>
          <div class="bar-focus" style="height: ${focusHeightPct}%;" title="Focus Time: ${d.focus}h"></div>
        </div>
        <span class="day-label">${d.day}</span>
      `;
      chartContainer.appendChild(col);
    });
  },

  renderFinancialSnapshot() {
    const finance = StorageService.getFinanceSnapshot();
    const curr = finance.currency;

    const incEl = document.getElementById('fin-income-val');
    const expEl = document.getElementById('fin-expense-val');
    const recEl = document.getElementById('fin-receivable-val');
    const payEl = document.getElementById('fin-payable-val');
    const remEl = document.getElementById('fin-remaining-val');

    if (incEl) incEl.textContent = `${curr} ${finance.incomeThisMonth.toLocaleString()}`;
    if (expEl) expEl.textContent = `${curr} ${finance.expensesThisMonth.toLocaleString()}`;
    if (recEl) recEl.textContent = `${curr} ${finance.receivables.toLocaleString()}`;
    if (payEl) payEl.textContent = `${curr} ${finance.payables.toLocaleString()}`;
    if (remEl) remEl.textContent = `${curr} ${finance.remainingBudget.toLocaleString()}`;
  },

  bindQuickCapture() {
    const input = document.getElementById('quick-capture-input');
    const chips = document.querySelectorAll('.capture-type-chip');

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.selectedCaptureType = chip.getAttribute('data-type') || 'Task';
      });
    });

    const submitCapture = () => {
      if (!input) return;
      const text = input.value.trim();
      if (!text) {
        LifeOSToast.show('Please enter something to remember.', 'warning');
        return;
      }

      StorageService.addInboxItem(text, this.selectedCaptureType);
      input.value = '';
      LifeOSToast.show(`Saved to Inbox as ${this.selectedCaptureType}: "${text}"`, 'success');
    };

    const captureSubmitBtn = document.getElementById('quick-capture-submit-btn');
    if (captureSubmitBtn) {
      captureSubmitBtn.addEventListener('click', submitCapture);
    }

    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          submitCapture();
        }
      });
    }
  }
};

window.Dashboard = Dashboard;

// Auto-boot dashboard when navigation opens dashboard
document.addEventListener('DOMContentLoaded', () => {
  Dashboard.init();
});

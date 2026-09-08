/**
 * LifeOS — Task Management Controller (Step 4)
 * Comprehensive management of tasks:
 * - 4 Task Metrics (Total Tasks, Due Today, Overdue, Completed This Week)
 * - Multi-dimensional Filters: View Tabs, Area, Project, Priority, Status, Deadline, Search
 * - Sorting: Deadline, Priority, Created, Estimated Time
 * - Rule-based Deadline Risk Calculation (Safe, Attention, High Risk, Critical)
 * - Interactive Task Detail Drawer with live status change, notes, and next action
 * - Create Task Modal, Duplicate, Delete (with confirmation), and Checkbox toggle
 */

const Tasks = {
  currentView: 'all',
  filterArea: 'all',
  filterProject: 'all',
  filterPriority: 'all',
  filterStatus: 'all',
  filterDeadline: 'all',
  searchQuery: '',
  sortOrder: 'deadline',
  selectedTaskId: 'task_1',

  init() {
    this.renderKPIs();
    this.renderTaskList();
    this.renderTaskDetails();
    this.bindEvents();
  },

  calculateRisk(task) {
    if (task.completed) return 'Safe';
    if (task.risk) return task.risk;

    const dl = (task.deadline || '').toLowerCase();
    const prio = (task.priority || '').toLowerCase();
    const est = parseFloat(task.estimatedTime) || 1;

    if (dl.includes('overdue')) return 'Critical';
    if (dl.includes('today')) {
      if (prio === 'high' || prio === 'critical' || est >= 3) return 'High Risk';
      return 'Attention';
    }
    if (dl.includes('tomorrow')) {
      if (prio === 'high' || est >= 4) return 'Attention';
      return 'Safe';
    }
    return 'Safe';
  },

  renderKPIs() {
    const tasks = StorageService.getTasks();

    const totalCount = tasks.length;
    const dueTodayCount = tasks.filter(t => (t.deadline || '').toLowerCase().includes('today') && !t.completed).length;
    const overdueCount = tasks.filter(t => (t.deadline || '').toLowerCase().includes('overdue') && !t.completed).length;
    const completedCount = tasks.filter(t => t.completed).length;

    const totalEl = document.getElementById('tasks-kpi-total');
    const todayEl = document.getElementById('tasks-kpi-today');
    const overdueEl = document.getElementById('tasks-kpi-overdue');
    const compEl = document.getElementById('tasks-kpi-completed');

    if (totalEl) totalEl.textContent = totalCount;
    if (todayEl) todayEl.textContent = dueTodayCount;
    if (overdueEl) overdueEl.textContent = overdueCount;
    if (compEl) compEl.textContent = completedCount;

    // View tab counts
    const tabAll = document.getElementById('tasks-tab-count-all');
    const tabToday = document.getElementById('tasks-tab-count-today');
    const tabUpcoming = document.getElementById('tasks-tab-count-upcoming');
    const tabOverdue = document.getElementById('tasks-tab-count-overdue');
    const tabComp = document.getElementById('tasks-tab-count-completed');

    if (tabAll) tabAll.textContent = totalCount;
    if (tabToday) tabToday.textContent = dueTodayCount;
    if (tabUpcoming) tabUpcoming.textContent = tasks.filter(t => !t.completed && !(t.deadline || '').toLowerCase().includes('today')).length;
    if (tabOverdue) tabOverdue.textContent = overdueCount;
    if (tabComp) tabComp.textContent = completedCount;
  },

  getFilteredTasks() {
    let tasks = StorageService.getTasks();

    // 1. View Tab Filter
    if (this.currentView === 'today') {
      tasks = tasks.filter(t => (t.deadline || '').toLowerCase().includes('today'));
    } else if (this.currentView === 'upcoming') {
      tasks = tasks.filter(t => !t.completed && !(t.deadline || '').toLowerCase().includes('today'));
    } else if (this.currentView === 'overdue') {
      tasks = tasks.filter(t => (t.deadline || '').toLowerCase().includes('overdue'));
    } else if (this.currentView === 'completed') {
      tasks = tasks.filter(t => t.completed);
    }

    // 2. Dropdown Filters
    if (this.filterArea !== 'all') {
      tasks = tasks.filter(t => (t.area || '').toLowerCase() === this.filterArea.toLowerCase());
    }
    if (this.filterProject !== 'all') {
      tasks = tasks.filter(t => (t.project || '').toLowerCase() === this.filterProject.toLowerCase());
    }
    if (this.filterPriority !== 'all') {
      tasks = tasks.filter(t => (t.priority || '').toLowerCase() === this.filterPriority.toLowerCase());
    }
    if (this.filterStatus !== 'all') {
      tasks = tasks.filter(t => (t.status || '').toLowerCase() === this.filterStatus.toLowerCase());
    }
    if (this.filterDeadline !== 'all') {
      tasks = tasks.filter(t => (t.deadline || '').toLowerCase().includes(this.filterDeadline.toLowerCase()));
    }

    // 3. Search Query
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      tasks = tasks.filter(t =>
        (t.title && t.title.toLowerCase().includes(q)) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.project && t.project.toLowerCase().includes(q)) ||
        (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q)))
      );
    }

    // 4. Sorting
    tasks.sort((a, b) => {
      if (this.sortOrder === 'priority') {
        const pOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return (pOrder[(b.priority || '').toLowerCase()] || 0) - (pOrder[(a.priority || '').toLowerCase()] || 0);
      } else if (this.sortOrder === 'created') {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      } else if (this.sortOrder === 'estTime') {
        return (parseFloat(b.estimatedTime) || 0) - (parseFloat(a.estimatedTime) || 0);
      } else {
        // deadline default
        const aToday = (a.deadline || '').toLowerCase().includes('today') ? 0 : 1;
        const bToday = (b.deadline || '').toLowerCase().includes('today') ? 0 : 1;
        return aToday - bToday;
      }
    });

    return tasks;
  },

  renderTaskList() {
    const tbody = document.getElementById('tasks-tbody');
    if (!tbody) return;

    const tasks = this.getFilteredTasks();
    tbody.innerHTML = '';

    if (tasks.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align: center; padding: 48px 16px; color: var(--color-text-muted);">
            <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
              <i data-lucide="check-square" style="width: 36px; height: 36px; color: var(--color-text-muted);"></i>
              <div style="font-weight: 600; color: var(--color-text-primary);">No tasks found</div>
              <div style="font-size: 13px;">Adjust your filters or add a new task.</div>
            </div>
          </td>
        </tr>
      `;
      if (window.lucide) window.lucide.createIcons({ root: tbody });
      return;
    }

    const areaClassMap = {
      Job: 'badge-job',
      University: 'badge-university',
      Freelance: 'badge-freelance',
      SaaS: 'badge-saas',
      Learning: 'badge-learning',
      Personal: 'badge-personal',
      Career: 'badge-job'
    };

    const priorityClassMap = {
      Critical: 'badge-priority-high',
      High: 'badge-priority-high',
      Medium: 'badge-priority-medium',
      Low: 'badge-priority-low'
    };

    const statusClassMap = {
      'To Do': 'badge-status-todo',
      'In Progress': 'badge-status-progress',
      Waiting: 'badge-status-waiting',
      Completed: 'badge-status-completed',
      Cancelled: 'badge-status-todo'
    };

    const riskClassMap = {
      Critical: 'badge-priority-high',
      'High Risk': 'badge-risk-high',
      Attention: 'badge-risk-attention',
      Safe: 'badge-risk-safe'
    };

    tasks.forEach(task => {
      const tr = document.createElement('tr');
      const isSelected = task.id === this.selectedTaskId;
      tr.className = `tasks-table-row ${task.completed ? 'task-row-completed' : ''} ${isSelected ? 'task-row-selected' : ''}`;
      tr.setAttribute('data-id', task.id);

      const areaClass = areaClassMap[task.area] || 'badge-job';
      const priorityClass = priorityClassMap[task.priority] || 'badge-priority-medium';
      const statusClass = statusClassMap[task.status] || 'badge-status-todo';
      const risk = this.calculateRisk(task);
      const riskClass = riskClassMap[risk] || 'badge-risk-safe';

      tr.innerHTML = `
        <td class="task-col-check">
          <input type="checkbox" class="form-checkbox task-checkbox-toggle" data-id="${task.id}" ${task.completed ? 'checked' : ''} aria-label="Complete task">
        </td>
        <td class="task-col-name">
          <div class="task-row-clickable" data-id="${task.id}">
            <span class="task-table-title ${task.completed ? 'completed-strike' : ''}">${task.title}</span>
          </div>
        </td>
        <td class="task-col-area">
          <span class="badge ${areaClass}"><span class="badge-dot"></span>${task.area || 'Personal'}</span>
        </td>
        <td class="task-col-project">
          <span class="task-project-label">${task.project || 'General'}</span>
        </td>
        <td class="task-col-deadline">
          <span class="task-deadline-text ${task.deadline && task.deadline.includes('Today') ? 'deadline-highlight-red' : ''}">
            ${task.deadline || 'No date'}
          </span>
        </td>
        <td class="task-col-prio">
          <span class="badge ${priorityClass}">${task.priority || 'Medium'}</span>
        </td>
        <td class="task-col-status">
          <span class="badge ${statusClass}">${task.status || 'To Do'}</span>
        </td>
        <td class="task-col-est">${task.estimatedTime || '1h'}</td>
        <td class="task-col-risk">
          <span class="badge ${riskClass}">${risk}</span>
        </td>
        <td class="task-col-more">
          <div class="dropdown-wrapper">
            <button class="icon-btn btn-sm task-actions-btn" data-id="${task.id}" aria-label="Task actions">
              <i data-lucide="more-horizontal" style="width: 14px; height: 14px;"></i>
            </button>
            <div class="dropdown-menu task-actions-menu" id="task-menu-${task.id}">
              <button class="dropdown-item task-action-dup" data-id="${task.id}">
                <i data-lucide="copy"></i>
                <span>Duplicate</span>
              </button>
              <button class="dropdown-item task-action-del" data-id="${task.id}" style="color: var(--color-danger);">
                <i data-lucide="trash-2"></i>
                <span>Delete</span>
              </button>
            </div>
          </div>
        </td>
      `;

      tbody.appendChild(tr);
    });

    if (window.lucide) window.lucide.createIcons({ root: tbody });

    this.bindRowActions();
  },

  bindRowActions() {
    // Row click selects task for detail drawer
    document.querySelectorAll('.task-row-clickable').forEach(cell => {
      cell.addEventListener('click', (e) => {
        const id = cell.getAttribute('data-id');
        this.selectTask(id);
      });
    });

    // Checkbox toggle
    document.querySelectorAll('.task-checkbox-toggle').forEach(box => {
      box.addEventListener('change', (e) => {
        e.stopPropagation();
        const id = box.getAttribute('data-id');
        const updated = StorageService.toggleTask(id);
        if (updated) {
          this.renderKPIs();
          this.renderTaskList();
          this.renderTaskDetails();
          LifeOSToast.show(
            updated.completed ? `Task completed: "${updated.title}"` : `Task reopened: "${updated.title}"`,
            updated.completed ? 'success' : 'info'
          );
        }
      });
    });

    // Action menu triggers
    document.querySelectorAll('.task-actions-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const menu = document.getElementById(`task-menu-${id}`);
        const isShown = menu && menu.classList.contains('show');
        document.querySelectorAll('.task-actions-menu').forEach(m => m.classList.remove('show'));
        if (!isShown && menu) menu.classList.add('show');
      });
    });

    // Duplicate action
    document.querySelectorAll('.task-action-dup').forEach(act => {
      act.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = act.getAttribute('data-id');
        document.querySelectorAll('.task-actions-menu').forEach(m => m.classList.remove('show'));
        const cloned = StorageService.duplicateTask(id);
        if (cloned) {
          this.renderKPIs();
          this.renderTaskList();
          LifeOSToast.show(`Duplicated task: "${cloned.title}"`, 'success');
        }
      });
    });

    // Delete action with confirmation
    document.querySelectorAll('.task-action-del').forEach(act => {
      act.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = act.getAttribute('data-id');
        document.querySelectorAll('.task-actions-menu').forEach(m => m.classList.remove('show'));
        this.confirmDeleteTask(id);
      });
    });
  },

  selectTask(taskId) {
    this.selectedTaskId = taskId;
    document.querySelectorAll('.tasks-table-row').forEach(row => {
      if (row.getAttribute('data-id') === taskId) {
        row.classList.add('task-row-selected');
      } else {
        row.classList.remove('task-row-selected');
      }
    });
    this.renderTaskDetails();

    // On mobile, scroll or open drawer
    const drawer = document.getElementById('task-detail-drawer');
    if (window.innerWidth <= 1024 && drawer) {
      drawer.classList.add('mobile-open');
    }
  },

  renderTaskDetails() {
    const tasks = StorageService.getTasks();
    let task = tasks.find(t => t.id === this.selectedTaskId);
    if (!task && tasks.length > 0) {
      task = tasks[0];
      this.selectedTaskId = task.id;
    }
    if (!task) return;

    const drawer = document.getElementById('task-detail-drawer');
    if (!drawer) return;

    const risk = this.calculateRisk(task);

    const titleEl = document.getElementById('task-detail-title');
    const prioEl = document.getElementById('task-detail-priority');
    const areaEl = document.getElementById('task-detail-area');
    const projectEl = document.getElementById('task-detail-project');
    const statusSelect = document.getElementById('task-detail-status-select');
    const dateEl = document.getElementById('task-detail-date');
    const timeEl = document.getElementById('task-detail-time');
    const riskEl = document.getElementById('task-detail-risk');
    const descEl = document.getElementById('task-detail-desc');
    const relProjectName = document.getElementById('task-detail-rel-project-name');
    const relProjectArea = document.getElementById('task-detail-rel-project-area');
    const nextActionBox = document.getElementById('task-detail-next-action');
    const notesBox = document.getElementById('task-detail-notes');
    const tagsBox = document.getElementById('task-detail-tags');

    if (titleEl) titleEl.textContent = task.title;
    if (prioEl) {
      prioEl.textContent = task.priority || 'Medium';
      prioEl.className = `badge ${task.priority === 'High' ? 'badge-priority-high' : 'badge-priority-medium'}`;
    }
    if (areaEl) areaEl.textContent = task.area || 'Personal';
    if (projectEl) projectEl.textContent = task.project || 'General';
    if (statusSelect) statusSelect.value = task.status || 'To Do';
    if (dateEl) dateEl.textContent = task.deadline || 'No deadline';
    if (timeEl) timeEl.textContent = `${task.estimatedTime || '1h'} estimated`;
    if (riskEl) {
      riskEl.textContent = risk;
      riskEl.className = `badge ${risk === 'High Risk' ? 'badge-risk-high' : (risk === 'Attention' ? 'badge-risk-attention' : 'badge-risk-safe')}`;
    }
    if (descEl) descEl.textContent = task.description || 'No description provided for this task.';
    if (relProjectName) relProjectName.textContent = task.project || 'General Workspace';
    if (relProjectArea) relProjectArea.textContent = task.area || 'Personal';
    if (nextActionBox) nextActionBox.textContent = task.nextAction || 'Review next milestone';
    if (notesBox) notesBox.textContent = task.notes || 'No extra notes recorded.';

    if (tagsBox) {
      tagsBox.innerHTML = '';
      const tags = task.tags || ['task', 'lifeos'];
      tags.forEach(t => {
        const span = document.createElement('span');
        span.className = 'task-tag-pill';
        span.textContent = `#${t}`;
        tagsBox.appendChild(span);
      });
    }

    if (window.lucide) window.lucide.createIcons({ root: drawer });
  },

  confirmDeleteTask(taskId) {
    const tasks = StorageService.getTasks();
    const task = tasks.find(t => t.id === taskId);
    const title = task ? task.title : 'this task';

    if (confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      StorageService.deleteTask(taskId);
      this.renderKPIs();
      this.renderTaskList();
      this.renderTaskDetails();
      LifeOSToast.show('Task deleted.', 'danger');
    }
  },

  bindEvents() {
    // View tabs
    document.querySelectorAll('.tasks-view-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tasks-view-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentView = tab.getAttribute('data-view') || 'all';
        this.renderTaskList();
      });
    });

    // Toolbar filters
    const areaSel = document.getElementById('tasks-filter-area');
    const prioSel = document.getElementById('tasks-filter-priority');
    const statusSel = document.getElementById('tasks-filter-status');
    const sortSel = document.getElementById('tasks-sort-select');
    const searchInput = document.getElementById('tasks-search-input');

    if (areaSel) {
      areaSel.addEventListener('change', (e) => {
        this.filterArea = e.target.value;
        this.renderTaskList();
      });
    }
    if (prioSel) {
      prioSel.addEventListener('change', (e) => {
        this.filterPriority = e.target.value;
        this.renderTaskList();
      });
    }
    if (statusSel) {
      statusSel.addEventListener('change', (e) => {
        this.filterStatus = e.target.value;
        this.renderTaskList();
      });
    }
    if (sortSel) {
      sortSel.addEventListener('change', (e) => {
        this.sortOrder = e.target.value;
        this.renderTaskList();
      });
    }
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderTaskList();
      });
    }

    // Detail drawer status change
    const detailStatus = document.getElementById('task-detail-status-select');
    if (detailStatus) {
      detailStatus.addEventListener('change', (e) => {
        const newStatus = e.target.value;
        const isCompleted = newStatus === 'Completed';
        StorageService.updateTask(this.selectedTaskId, { status: newStatus, completed: isCompleted });
        this.renderKPIs();
        this.renderTaskList();
        LifeOSToast.show(`Task status updated to ${newStatus}`, 'success');
      });
    }

    // Close detail drawer (mobile)
    const drawerCloseBtn = document.getElementById('task-detail-close-btn');
    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', () => {
        const drawer = document.getElementById('task-detail-drawer');
        if (drawer) drawer.classList.remove('mobile-open');
      });
    }

    // Create Task Modal Save
    const saveNewTaskBtn = document.getElementById('modal-save-task-btn');
    if (saveNewTaskBtn) {
      saveNewTaskBtn.addEventListener('click', () => {
        const title = document.getElementById('new-task-title').value.trim();
        const area = document.getElementById('new-task-area').value;
        const project = document.getElementById('new-task-project').value.trim() || 'General';
        const deadline = document.getElementById('new-task-deadline').value.trim() || 'Upcoming';
        const priority = document.getElementById('new-task-priority').value;
        const estTime = document.getElementById('new-task-time').value.trim() || '2h';
        const desc = document.getElementById('new-task-desc').value.trim();

        if (!title) {
          LifeOSToast.show('Please enter a task title.', 'warning');
          return;
        }

        const newTask = StorageService.addTask({
          title,
          area,
          project,
          deadline,
          priority,
          estimatedTime: estTime,
          description: desc,
          status: 'To Do',
          completed: false,
          isFocus: false,
          createdAt: new Date().toISOString()
        });

        LifeOSModal.close('create-task-modal');
        document.getElementById('new-task-title').value = '';
        document.getElementById('new-task-desc').value = '';

        this.selectedTaskId = newTask.id;
        this.renderKPIs();
        this.renderTaskList();
        this.renderTaskDetails();
        LifeOSToast.show(`Task "${title}" created successfully!`, 'success');
      });
    }
  }
};

window.Tasks = Tasks;

// Initialize when ready
document.addEventListener('DOMContentLoaded', () => {
  Tasks.init();
});

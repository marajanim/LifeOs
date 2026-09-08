/**
 * LifeOS — Projects Module (Step 5)
 * Handles Life Areas, Project Cards Grid/List, Filtering,
 * Interactive Project Detail Drawer (Milestones, Linked Tasks, Notes, Files),
 * and Project/Area CRUD Modals.
 */

const Projects = {
  currentView: 'grid', // 'grid' | 'list'
  selectedProjectId: null,
  activeDetailTab: 'overview', // 'overview' | 'tasks' | 'notes' | 'files'
  searchQuery: '',
  selectedArea: 'all',
  selectedStatus: 'all',

  init() {
    this.bindEvents();
    this.populateAreaFilters();
    this.render();
  },

  bindEvents() {
    // Prevent multiple event bindings
    if (this._eventsBound) return;
    this._eventsBound = true;

    // Live search
    const searchInput = document.getElementById('projects-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        this.renderProjectsListOnly();
      });
    }

    // Area filter dropdown
    const areaFilter = document.getElementById('projects-area-filter');
    if (areaFilter) {
      areaFilter.addEventListener('change', (e) => {
        if (e.target.value === '__add_custom_area__') {
          this.openCreateAreaModal();
          areaFilter.value = this.selectedArea; // revert until created
          return;
        }
        this.selectedArea = e.target.value;
        this.renderProjectsListOnly();
      });
    }

    // Status filter dropdown
    const statusFilter = document.getElementById('projects-status-filter');
    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => {
        this.selectedStatus = e.target.value;
        this.renderProjectsListOnly();
      });
    }

    // View switcher (Grid vs List)
    const gridBtn = document.getElementById('projects-grid-view-btn');
    const listBtn = document.getElementById('projects-list-view-btn');
    if (gridBtn && listBtn) {
      gridBtn.addEventListener('click', () => {
        this.currentView = 'grid';
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
        this.renderProjectsListOnly();
      });

      listBtn.addEventListener('click', () => {
        this.currentView = 'list';
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
        this.renderProjectsListOnly();
      });
    }

    // New Project Button
    const newProjBtn = document.getElementById('btn-new-project');
    if (newProjBtn) {
      newProjBtn.addEventListener('click', () => this.openCreateProjectModal());
    }

    // Add Area Button
    const addAreaBtn = document.getElementById('btn-add-area');
    if (addAreaBtn) {
      addAreaBtn.addEventListener('click', () => this.openCreateAreaModal());
    }

    // Modal submit handlers
    const createProjectForm = document.getElementById('create-project-form');
    if (createProjectForm) {
      createProjectForm.addEventListener('submit', (e) => this.handleCreateProject(e));
    }

    const editProjectForm = document.getElementById('edit-project-form');
    if (editProjectForm) {
      editProjectForm.addEventListener('submit', (e) => this.handleEditProject(e));
    }

    const createAreaForm = document.getElementById('create-area-form');
    if (createAreaForm) {
      createAreaForm.addEventListener('submit', (e) => this.handleCreateArea(e));
    }

    // Escape key modal close
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });
  },

  populateAreaFilters() {
    const areas = window.StorageService ? window.StorageService.getAreas() : [];
    const areaFilter = document.getElementById('projects-area-filter');
    const modalAreaSelect = document.getElementById('new-proj-area');
    const editAreaSelect = document.getElementById('edit-proj-area');

    if (areaFilter) {
      const currentVal = areaFilter.value || 'all';
      let html = '<option value="all">All Areas</option>';
      areas.forEach(a => {
        html += `<option value="${a.name}">${a.name}</option>`;
      });
      html += '<option value="__add_custom_area__">+ Add Custom Area...</option>';
      areaFilter.innerHTML = html;
      areaFilter.value = currentVal;
    }

    const populateSelect = (sel) => {
      if (!sel) return;
      sel.innerHTML = areas.map(a => `<option value="${a.name}">${a.name}</option>`).join('');
    };

    populateSelect(modalAreaSelect);
    populateSelect(editAreaSelect);
  },

  render() {
    this.renderKPIs();
    this.renderProjectsListOnly();
  },

  renderKPIs() {
    if (!window.StorageService) return;
    const projects = window.StorageService.getProjects();

    const activeCount = projects.filter(p => p.status === 'Active' || p.status === 'Planned').length;
    const onHoldCount = projects.filter(p => p.status === 'On Hold').length;
    const completedCount = projects.filter(p => p.status === 'Completed').length;
    
    // Sum estimated hours
    let totalEstHours = 0;
    projects.forEach(p => {
      if (p.status !== 'Completed' && p.status !== 'Cancelled') {
        totalEstHours += Number(p.estimatedHours) || 0;
      }
    });

    const activeEl = document.getElementById('project-kpi-active');
    const onHoldEl = document.getElementById('project-kpi-onhold');
    const completedEl = document.getElementById('project-kpi-completed');
    const hoursEl = document.getElementById('project-kpi-hours');

    if (activeEl) activeEl.textContent = activeCount;
    if (onHoldEl) onHoldEl.textContent = onHoldCount;
    if (completedEl) completedEl.textContent = completedCount;
    if (hoursEl) hoursEl.textContent = `${totalEstHours} hrs`;
  },

  getFilteredProjects() {
    if (!window.StorageService) return [];
    let projects = window.StorageService.getProjects();

    if (this.selectedArea !== 'all') {
      projects = projects.filter(p => p.area.toLowerCase() === this.selectedArea.toLowerCase());
    }

    if (this.selectedStatus !== 'all') {
      projects = projects.filter(p => p.status.toLowerCase() === this.selectedStatus.toLowerCase());
    }

    if (this.searchQuery) {
      projects = projects.filter(p => 
        (p.name && p.name.toLowerCase().includes(this.searchQuery)) ||
        (p.description && p.description.toLowerCase().includes(this.searchQuery)) ||
        (p.area && p.area.toLowerCase().includes(this.searchQuery)) ||
        (p.notes && p.notes.toLowerCase().includes(this.searchQuery))
      );
    }

    return projects;
  },

  renderProjectsListOnly() {
    const projects = this.getFilteredProjects();
    const container = document.getElementById('projects-view-container');
    if (!container) return;

    // Ensure selected project exists in filtered list or fallback to first
    if (!this.selectedProjectId || !projects.find(p => p.id === this.selectedProjectId)) {
      if (projects.length > 0) {
        this.selectedProjectId = projects[0].id;
      } else {
        this.selectedProjectId = null;
      }
    }

    if (projects.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="padding: var(--space-8); grid-column: 1 / -1;">
          <div class="empty-state-icon-wrap">
            <i data-lucide="folder-kanban"></i>
          </div>
          <div class="empty-state-title">No projects found</div>
          <div class="empty-state-desc">No projects match the current filter or search criteria.</div>
          <button class="btn btn-primary" onclick="Projects.openCreateProjectModal()" style="margin-top: var(--space-3);">
            <i data-lucide="plus"></i>
            <span>Create New Project</span>
          </button>
        </div>
      `;
      this.renderDetailDrawer(null);
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    if (this.currentView === 'grid') {
      container.className = 'projects-cards-grid';
      container.innerHTML = projects.map(p => this.renderProjectCard(p)).join('');
    } else {
      container.className = 'projects-table-wrap card';
      container.innerHTML = this.renderProjectTable(projects);
    }

    // Render detail drawer for selected project
    const selectedProject = window.StorageService.getProjectById(this.selectedProjectId);
    this.renderDetailDrawer(selectedProject);

    if (window.lucide) window.lucide.createIcons();
  },

  getAreaConfig(areaName) {
    const configs = {
      'Job': { color: '#2563eb', bg: '#eff6ff', icon: 'briefcase' },
      'University': { color: '#059669', bg: '#ecfdf5', icon: 'graduation-cap' },
      'Freelance': { color: '#7c3aed', bg: '#f5f3ff', icon: 'laptop' },
      'SaaS': { color: '#3b82f6', bg: '#eff6ff', icon: 'box' },
      'Personal': { color: '#ec4899', bg: '#fdf2f8', icon: 'heart' },
      'Learning': { color: '#0d9488', bg: '#f0fdfa', icon: 'book-open' }
    };
    return configs[areaName] || { color: '#4b5563', bg: '#f3f4f6', icon: 'folder' };
  },

  getStatusBadgeClass(status) {
    switch (status) {
      case 'Active': return 'badge-proj-active';
      case 'On Hold': return 'badge-proj-onhold';
      case 'Planned': return 'badge-proj-planned';
      case 'Completed': return 'badge-proj-completed';
      case 'Cancelled': return 'badge-proj-cancelled';
      default: return 'badge-proj-active';
    }
  },

  getPriorityBadgeClass(priority) {
    switch (priority) {
      case 'Critical':
      case 'High': return 'badge-risk-critical';
      case 'Medium': return 'badge-risk-attention';
      case 'Low': return 'badge-risk-safe';
      default: return 'badge-risk-safe';
    }
  },

  renderProjectCard(p) {
    const isSelected = p.id === this.selectedProjectId;
    const areaConf = this.getAreaConfig(p.area);
    const progress = Math.min(100, Math.max(0, p.progress || 0));

    return `
      <div class="project-card ${isSelected ? 'is-selected' : ''}" 
           onclick="Projects.selectProject('${p.id}')"
           data-project-id="${p.id}">
        <!-- Top header row -->
        <div class="project-card-header">
          <div class="project-card-icon" style="background-color: ${areaConf.bg}; color: ${areaConf.color};">
            <i data-lucide="${p.icon || areaConf.icon}" style="width: 20px; height: 20px;"></i>
          </div>
          <div class="project-card-heading-meta">
            <h3 class="project-card-title">${p.name}</h3>
            <div class="project-card-submeta">
              <span class="project-card-area-badge">
                <span class="project-card-area-dot" style="background-color: ${areaConf.color};"></span>
                <span>${p.area}</span>
              </span>
              <span class="project-status-badge ${this.getStatusBadgeClass(p.status)}">${p.status}</span>
            </div>
          </div>
        </div>

        <!-- Description -->
        <p class="project-card-desc">${p.description || 'No description provided.'}</p>

        <!-- Progress bar -->
        <div class="project-card-progress-wrap">
          <div class="project-card-progress-bar-bg">
            <div class="project-card-progress-bar-fill" style="width: ${progress}%; background-color: ${progress === 100 ? '#10b981' : areaConf.color};"></div>
          </div>
          <span class="project-card-progress-label">${progress}%</span>
        </div>

        <!-- Meta info rows matching mockup -->
        <div class="project-card-meta-list">
          <div class="project-card-meta-row">
            <div class="project-card-meta-item">
              <i data-lucide="calendar" style="width: 14px; height: 14px; color: var(--color-text-muted);"></i>
              <span>${p.deadline || 'No deadline'}</span>
            </div>
            <span class="badge ${this.getPriorityBadgeClass(p.priority)}">${p.priority}</span>
          </div>

          <div class="project-card-meta-row">
            <div class="project-card-meta-item">
              <i data-lucide="clock" style="width: 14px; height: 14px; color: var(--color-text-muted);"></i>
              <span>${p.estimatedHours ? `${p.estimatedHours} hrs` : 'Flexible'}</span>
            </div>
          </div>

          <div class="project-card-next-task-row">
            <div class="project-card-next-task-info">
              <i data-lucide="list-todo" style="width: 14px; height: 14px; color: var(--color-text-muted); flex-shrink: 0;"></i>
              <span class="project-card-next-task-text" title="${p.nextTask || 'All tasks completed!'}">
                ${p.nextTask || 'All tasks completed!'}
              </span>
            </div>
            <span class="project-card-tasks-ratio">${p.tasksDone || 0} / ${p.tasksTotal || 0} tasks</span>
          </div>
        </div>
      </div>
    `;
  },

  renderProjectTable(projects) {
    return `
      <div class="task-table-wrap">
        <table class="task-table" aria-label="Projects Table View">
          <thead>
            <tr>
              <th>Project & Area</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Deadline</th>
              <th>Priority</th>
              <th>Hours</th>
              <th>Tasks</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${projects.map(p => {
              const isSelected = p.id === this.selectedProjectId;
              const areaConf = this.getAreaConfig(p.area);
              const progress = Math.min(100, Math.max(0, p.progress || 0));
              return `
                <tr class="project-table-row ${isSelected ? 'selected' : ''}" onclick="Projects.selectProject('${p.id}')">
                  <td>
                    <div style="display: flex; align-items: center; gap: var(--space-3);">
                      <div class="project-card-icon-sm" style="background-color: ${areaConf.bg}; color: ${areaConf.color};">
                        <i data-lucide="${p.icon || areaConf.icon}" style="width: 14px; height: 14px;"></i>
                      </div>
                      <div>
                        <div style="font-weight: 600; color: var(--color-text-primary);">${p.name}</div>
                        <div style="font-size: 11px; color: var(--color-text-muted);">${p.area}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="project-status-badge ${this.getStatusBadgeClass(p.status)}">${p.status}</span>
                  </td>
                  <td style="min-width: 120px;">
                    <div style="display: flex; align-items: center; gap: var(--space-2);">
                      <div class="project-card-progress-bar-bg" style="flex: 1;">
                        <div class="project-card-progress-bar-fill" style="width: ${progress}%; background-color: ${progress === 100 ? '#10b981' : areaConf.color};"></div>
                      </div>
                      <span style="font-size: 11px; font-weight: 600;">${progress}%</span>
                    </div>
                  </td>
                  <td>
                    <div style="font-size: 12px; color: var(--color-text-secondary); display: flex; align-items: center; gap: 4px;">
                      <i data-lucide="calendar" style="width: 13px; height: 13px; color: var(--color-text-muted);"></i>
                      <span>${p.deadline}</span>
                    </div>
                  </td>
                  <td>
                    <span class="badge ${this.getPriorityBadgeClass(p.priority)}">${p.priority}</span>
                  </td>
                  <td style="font-size: 12px; font-weight: 500;">
                    ${p.estimatedHours} hrs
                  </td>
                  <td style="font-size: 12px; color: var(--color-text-secondary);">
                    ${p.tasksDone || 0} / ${p.tasksTotal || 0}
                  </td>
                  <td style="text-align: right;">
                    <div class="table-actions-cell" onclick="event.stopPropagation()">
                      <button class="btn-icon" title="Edit project" onclick="Projects.openEditProjectModal('${p.id}')">
                        <i data-lucide="edit-3"></i>
                      </button>
                      <button class="btn-icon text-danger" title="Delete project" onclick="Projects.deleteProject('${p.id}')">
                        <i data-lucide="trash-2"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  selectProject(projectId) {
    this.selectedProjectId = projectId;

    // Update active highlight on cards
    document.querySelectorAll('.project-card').forEach(el => {
      if (el.getAttribute('data-project-id') === projectId) {
        el.classList.add('is-selected');
      } else {
        el.classList.remove('is-selected');
      }
    });

    // Update active highlight on table rows
    document.querySelectorAll('.project-table-row').forEach(row => {
      row.classList.remove('selected');
    });

    const project = window.StorageService ? window.StorageService.getProjectById(projectId) : null;
    this.renderDetailDrawer(project);
    if (window.lucide) window.lucide.createIcons();
  },

  renderDetailDrawer(p) {
    const drawer = document.getElementById('project-detail-drawer');
    if (!drawer) return;

    if (!p) {
      drawer.innerHTML = `
        <div class="empty-state" style="padding: var(--space-8);">
          <div class="empty-state-icon-wrap">
            <i data-lucide="folder"></i>
          </div>
          <div class="empty-state-title">Select a Project</div>
          <div class="empty-state-desc">Click on any project to view its milestones, connected tasks, notes, and progress.</div>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    const areaConf = this.getAreaConfig(p.area);
    const progress = Math.min(100, Math.max(0, p.progress || 0));

    // Linked tasks from lifeos_tasks matching project name or area
    const allTasks = window.StorageService ? window.StorageService.getTasks() : [];
    const relatedTasks = allTasks.filter(t => 
      (t.project && t.project.toLowerCase().includes(p.name.toLowerCase())) ||
      (p.name.toLowerCase().includes(t.project ? t.project.toLowerCase() : '')) ||
      (t.area && t.area.toLowerCase() === p.area.toLowerCase())
    );

    const notesCount = p.notes ? 1 : 0;
    const filesCount = (p.files && p.files.length) || 0;

    drawer.innerHTML = `
      <!-- Drawer Header -->
      <div class="project-drawer-header">
        <div class="project-drawer-header-main">
          <div class="project-card-icon" style="background-color: ${areaConf.bg}; color: ${areaConf.color};">
            <i data-lucide="${p.icon || areaConf.icon}" style="width: 22px; height: 22px;"></i>
          </div>
          <div class="project-drawer-title-wrap">
            <h2 class="project-drawer-title">${p.name}</h2>
            <div class="project-card-submeta">
              <span class="project-card-area-badge">
                <span class="project-card-area-dot" style="background-color: ${areaConf.color};"></span>
                <span>${p.area}</span>
              </span>
              <span class="project-status-badge ${this.getStatusBadgeClass(p.status)}">● ${p.status}</span>
            </div>
          </div>
        </div>
        <div class="project-drawer-actions">
          <button class="btn-icon" title="Edit Project" onclick="Projects.openEditProjectModal('${p.id}')">
            <i data-lucide="edit-3"></i>
          </button>
          <button class="btn-icon text-danger" title="Delete Project" onclick="Projects.deleteProject('${p.id}')">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </div>

      <!-- Navigation Tabs matching mockup: Overview, Tasks, Notes, Files -->
      <div class="project-drawer-tabs">
        <button class="project-drawer-tab-btn ${this.activeDetailTab === 'overview' ? 'active' : ''}" 
                onclick="Projects.switchDetailTab('overview')">
          Overview
        </button>
        <button class="project-drawer-tab-btn ${this.activeDetailTab === 'tasks' ? 'active' : ''}" 
                onclick="Projects.switchDetailTab('tasks')">
          Tasks (${relatedTasks.length})
        </button>
        <button class="project-drawer-tab-btn ${this.activeDetailTab === 'notes' ? 'active' : ''}" 
                onclick="Projects.switchDetailTab('notes')">
          Notes (${notesCount})
        </button>
        <button class="project-drawer-tab-btn ${this.activeDetailTab === 'files' ? 'active' : ''}" 
                onclick="Projects.switchDetailTab('files')">
          Files
        </button>
      </div>

      <!-- Tab Content Area -->
      <div class="project-drawer-tab-body">
        ${this.renderDetailTabContent(p, relatedTasks)}
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  },

  switchDetailTab(tabName) {
    this.activeDetailTab = tabName;
    const project = window.StorageService ? window.StorageService.getProjectById(this.selectedProjectId) : null;
    this.renderDetailDrawer(project);
  },

  renderDetailTabContent(p, relatedTasks) {
    const areaConf = this.getAreaConfig(p.area);
    const progress = Math.min(100, Math.max(0, p.progress || 0));

    if (this.activeDetailTab === 'overview') {
      return `
        <!-- Description Section -->
        <div class="drawer-section">
          <div class="drawer-section-title">Description</div>
          <p class="drawer-section-desc">
            ${p.detailedDescription || p.description || 'No detailed description.'}
          </p>
        </div>

        <!-- Key Metrics Stack matching mockup -->
        <div class="project-drawer-metrics-stack">
          <div class="project-drawer-metric-row">
            <div class="project-drawer-metric-label">
              <i data-lucide="calendar" style="width: 16px; height: 16px; color: var(--color-text-muted);"></i>
              <div>
                <span class="label-heading">Deadline</span>
                <div class="label-sub">${p.deadline || 'None'}</div>
              </div>
            </div>
            <span class="badge ${this.getPriorityBadgeClass(p.priority)}">${p.priority} Priority</span>
          </div>

          <div class="project-drawer-metric-row">
            <div class="project-drawer-metric-label">
              <i data-lucide="clock" style="width: 16px; height: 16px; color: var(--color-text-muted);"></i>
              <div>
                <span class="label-heading">Estimated Hours</span>
                <div class="label-sub">${p.estimatedHours ? `${p.estimatedHours} hrs` : 'Flexible'}</div>
              </div>
            </div>
          </div>

          <div class="project-drawer-metric-row" style="flex-direction: column; align-items: stretch; gap: var(--space-2);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div class="project-drawer-metric-label">
                <i data-lucide="check-square" style="width: 16px; height: 16px; color: var(--color-text-muted);"></i>
                <div>
                  <span class="label-heading">Progress</span>
                  <div class="label-sub">${progress}% (${p.tasksDone || 0} / ${p.tasksTotal || 0} tasks)</div>
                </div>
              </div>
            </div>
            <div class="project-card-progress-bar-bg" style="height: 6px;">
              <div class="project-card-progress-bar-fill" style="width: ${progress}%; background-color: ${progress === 100 ? '#10b981' : areaConf.color};"></div>
            </div>
          </div>
        </div>

        <!-- Milestones Section matching mockup -->
        <div class="drawer-section" style="margin-top: var(--space-4);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-3);">
            <div class="drawer-section-title" style="margin-bottom: 0;">Milestones</div>
            <button class="card-action-link" onclick="Projects.promptAddMilestone('${p.id}')">
              <span>+ Add milestone</span>
            </button>
          </div>

          <div class="milestones-timeline-list">
            ${(p.milestones && p.milestones.length > 0) ? p.milestones.map((ms, idx) => `
              <div class="milestone-timeline-item" onclick="Projects.toggleMilestone('${p.id}', ${idx})" title="Click to cycle status">
                <div class="milestone-dot-indicator ${ms.status}">
                  ${ms.status === 'completed' ? '<i data-lucide="check" style="width: 12px; height: 12px;"></i>' : 
                    ms.status === 'in-progress' ? '●' : '○'}
                </div>
                <div class="milestone-text-wrap">
                  <div class="milestone-title ${ms.status === 'completed' ? 'is-completed' : ''}">${ms.title}</div>
                </div>
                <div class="milestone-date">${ms.date || ''}</div>
              </div>
            `).join('') : '<div class="text-muted" style="font-size: 12px;">No milestones created yet.</div>'}
          </div>
        </div>

        <!-- Next Task Card matching mockup -->
        <div class="drawer-section" style="margin-top: var(--space-4);">
          <div class="drawer-section-title">Next Task</div>
          <div class="project-next-task-card" onclick="window.location.hash='tasks'">
            <div class="next-task-radio-icon">
              <i data-lucide="circle" style="width: 18px; height: 18px; color: var(--color-primary);"></i>
            </div>
            <div class="next-task-content">
              <div class="next-task-name">${p.nextTask || 'All current tasks completed!'}</div>
              <div class="next-task-time">${p.nextTaskDue || 'Today'}</div>
            </div>
            <div class="next-task-arrow">
              <i data-lucide="chevron-right" style="width: 16px; height: 16px;"></i>
            </div>
          </div>
        </div>
      `;
    }

    if (this.activeDetailTab === 'tasks') {
      return `
        <div class="drawer-section">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-3);">
            <div class="drawer-section-title" style="margin-bottom: 0;">Connected Tasks</div>
            <button class="btn btn-sm btn-primary" onclick="window.location.hash='tasks'">
              <i data-lucide="plus"></i>
              <span>Add Task</span>
            </button>
          </div>

          ${relatedTasks.length === 0 ? `
            <div class="empty-state" style="padding: var(--space-4);">
              <p style="font-size: 13px; color: var(--color-text-secondary); margin-bottom: var(--space-3);">No tasks linked to this project yet.</p>
              <button class="btn btn-sm btn-secondary" onclick="window.location.hash='tasks'">Go to Tasks</button>
            </div>
          ` : `
            <div class="related-tasks-list">
              ${relatedTasks.map(t => `
                <div class="related-task-item ${t.completed ? 'completed' : ''}">
                  <input type="checkbox" class="task-checkbox" ${t.completed ? 'checked' : ''} 
                         onchange="Projects.toggleRelatedTask('${t.id}')">
                  <div class="related-task-content">
                    <div class="related-task-title ${t.completed ? 'completed' : ''}">${t.title}</div>
                    <div class="related-task-sub">
                      <span>${t.deadline}</span>
                      <span class="badge ${Projects.getPriorityBadgeClass(t.priority)}" style="font-size: 10px; padding: 1px 6px;">${t.priority}</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      `;
    }

    if (this.activeDetailTab === 'notes') {
      return `
        <div class="drawer-section">
          <div class="drawer-section-title">Project Notes & Scratchpad</div>
          <textarea id="project-notes-textarea" class="form-textarea" rows="8" placeholder="Type project notes, key links, decisions, and meeting takeaways...">${p.notes || ''}</textarea>
          <button class="btn btn-primary btn-sm" style="margin-top: var(--space-3);" onclick="Projects.saveProjectNotes('${p.id}')">
            <i data-lucide="save"></i>
            <span>Save Notes</span>
          </button>
        </div>
      `;
    }

    if (this.activeDetailTab === 'files') {
      const files = p.files || [];
      return `
        <div class="drawer-section">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-3);">
            <div class="drawer-section-title" style="margin-bottom: 0;">Resources & Attachments</div>
            <button class="btn btn-sm btn-secondary" onclick="Projects.promptAddFile('${p.id}')">
              <i data-lucide="link"></i>
              <span>+ Add Link</span>
            </button>
          </div>

          ${files.length === 0 ? `
            <div class="empty-state" style="padding: var(--space-4);">
              <p style="font-size: 13px; color: var(--color-text-secondary);">No attached files or links yet.</p>
            </div>
          ` : `
            <div class="project-files-list">
              ${files.map(f => `
                <div class="project-file-item">
                  <i data-lucide="file-text" style="width: 18px; height: 18px; color: var(--color-primary); flex-shrink: 0;"></i>
                  <div style="flex: 1; min-width: 0;">
                    <div style="font-size: 13px; font-weight: 500; color: var(--color-text-primary); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${f.name}</div>
                    <div style="font-size: 11px; color: var(--color-text-muted);">${f.size || 'Link'} · ${f.date || 'Added recently'}</div>
                  </div>
                  <i data-lucide="external-link" style="width: 14px; height: 14px; color: var(--color-text-muted);"></i>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      `;
    }

    return '';
  },

  toggleMilestone(projectId, milestoneIndex) {
    if (!window.StorageService) return;
    const updated = window.StorageService.toggleProjectMilestone(projectId, milestoneIndex);
    if (updated) {
      this.render();
      if (window.showToast) window.showToast('Milestone status updated', 'info');
    }
  },

  promptAddMilestone(projectId) {
    const title = prompt('Enter new milestone title:');
    if (!title || !title.trim()) return;
    const date = prompt('Target date (e.g. May 10, 2024):') || 'Upcoming';

    const project = window.StorageService.getProjectById(projectId);
    if (!project) return;

    const milestones = project.milestones || [];
    milestones.push({
      id: `ms_${Date.now()}`,
      title: title.trim(),
      date: date.trim(),
      status: 'pending'
    });

    window.StorageService.updateProject(projectId, { milestones });
    this.render();
    if (window.showToast) window.showToast('Milestone added', 'success');
  },

  toggleRelatedTask(taskId) {
    if (!window.StorageService) return;
    window.StorageService.toggleTask(taskId);
    
    // Update tasksDone count on project
    const project = window.StorageService.getProjectById(this.selectedProjectId);
    if (project) {
      const allTasks = window.StorageService.getTasks();
      const relatedTasks = allTasks.filter(t => 
        (t.project && t.project.toLowerCase().includes(project.name.toLowerCase())) ||
        (t.area && t.area.toLowerCase() === project.area.toLowerCase())
      );
      const doneCount = relatedTasks.filter(t => t.completed).length;
      window.StorageService.updateProject(this.selectedProjectId, {
        tasksDone: doneCount,
        tasksTotal: Math.max(relatedTasks.length, project.tasksTotal || 0),
        progress: relatedTasks.length > 0 ? Math.round((doneCount / relatedTasks.length) * 100) : project.progress
      });
    }

    this.render();
    if (window.Dashboard) window.Dashboard.render();
    if (window.showToast) window.showToast('Task updated', 'info');
  },

  saveProjectNotes(projectId) {
    const textarea = document.getElementById('project-notes-textarea');
    if (!textarea) return;
    const notes = textarea.value.trim();
    window.StorageService.updateProject(projectId, { notes });
    if (window.showToast) window.showToast('Project notes saved', 'success');
  },

  promptAddFile(projectId) {
    const name = prompt('Resource name or link title:');
    if (!name || !name.trim()) return;
    const project = window.StorageService.getProjectById(projectId);
    if (!project) return;

    const files = project.files || [];
    files.push({
      name: name.trim(),
      size: 'Web Link',
      date: 'Today'
    });

    window.StorageService.updateProject(projectId, { files });
    this.render();
    if (window.showToast) window.showToast('Resource link added', 'success');
  },

  // Modal handlers
  openCreateProjectModal() {
    this.populateAreaFilters();
    const modal = document.getElementById('create-project-modal');
    if (modal) modal.classList.add('open');
  },

  openEditProjectModal(projectId) {
    const project = window.StorageService.getProjectById(projectId);
    if (!project) return;
    this.populateAreaFilters();

    const modal = document.getElementById('edit-project-modal');
    if (!modal) return;

    document.getElementById('edit-proj-id').value = project.id;
    document.getElementById('edit-proj-name').value = project.name;
    document.getElementById('edit-proj-area').value = project.area;
    document.getElementById('edit-proj-status').value = project.status;
    document.getElementById('edit-proj-priority').value = project.priority;
    document.getElementById('edit-proj-deadline').value = project.deadline;
    document.getElementById('edit-proj-hours').value = project.estimatedHours || 10;
    document.getElementById('edit-proj-desc').value = project.description || '';
    document.getElementById('edit-proj-nexttask').value = project.nextTask || '';

    modal.classList.add('open');
  },

  openCreateAreaModal() {
    const modal = document.getElementById('create-area-modal');
    if (modal) modal.classList.add('open');
  },

  closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.classList.remove('open');
    });
  },

  handleCreateProject(e) {
    e.preventDefault();
    const name = document.getElementById('new-proj-name').value.trim();
    if (!name) return;

    const area = document.getElementById('new-proj-area').value;
    const status = document.getElementById('new-proj-status').value;
    const priority = document.getElementById('new-proj-priority').value;
    const deadline = document.getElementById('new-proj-deadline').value.trim() || 'Upcoming';
    const estimatedHours = Number(document.getElementById('new-proj-hours').value) || 10;
    const description = document.getElementById('new-proj-desc').value.trim();
    const nextTask = document.getElementById('new-proj-nexttask').value.trim() || 'Plan initial step';

    const areaConf = this.getAreaConfig(area);

    const newProject = window.StorageService.addProject({
      name,
      area,
      status,
      priority,
      deadline,
      estimatedHours,
      description,
      detailedDescription: description,
      nextTask,
      nextTaskDue: 'Upcoming',
      icon: areaConf.icon,
      color: areaConf.color,
      tasksDone: 0,
      tasksTotal: 1,
      progress: 0,
      milestones: [
        { id: 'm1', title: 'Project kick-off', date: deadline, status: 'in-progress' },
        { id: 'm2', title: 'Final delivery', date: deadline, status: 'pending' }
      ]
    });

    this.selectedProjectId = newProject.id;
    this.closeAllModals();
    e.target.reset();
    this.render();

    if (window.showToast) window.showToast(`Project "${name}" created!`, 'success');
  },

  handleEditProject(e) {
    e.preventDefault();
    const id = document.getElementById('edit-proj-id').value;
    const name = document.getElementById('edit-proj-name').value.trim();
    if (!name) return;

    const area = document.getElementById('edit-proj-area').value;
    const status = document.getElementById('edit-proj-status').value;
    const priority = document.getElementById('edit-proj-priority').value;
    const deadline = document.getElementById('edit-proj-deadline').value.trim();
    const estimatedHours = Number(document.getElementById('edit-proj-hours').value) || 10;
    const description = document.getElementById('edit-proj-desc').value.trim();
    const nextTask = document.getElementById('edit-proj-nexttask').value.trim();

    const areaConf = this.getAreaConfig(area);

    window.StorageService.updateProject(id, {
      name,
      area,
      status,
      priority,
      deadline,
      estimatedHours,
      description,
      nextTask,
      icon: areaConf.icon,
      color: areaConf.color
    });

    this.closeAllModals();
    this.render();
    if (window.showToast) window.showToast(`Project "${name}" updated!`, 'success');
  },

  handleCreateArea(e) {
    e.preventDefault();
    const name = document.getElementById('new-area-name').value.trim();
    if (!name) return;

    const icon = document.getElementById('new-area-icon').value || 'folder';
    const color = document.getElementById('new-area-color').value || '#2563eb';
    const description = document.getElementById('new-area-desc').value.trim();

    window.StorageService.addArea({
      name,
      icon,
      color,
      description
    });

    this.populateAreaFilters();
    this.closeAllModals();
    e.target.reset();

    if (window.showToast) window.showToast(`Life Area "${name}" added!`, 'success');
  },

  deleteProject(projectId) {
    const project = window.StorageService.getProjectById(projectId);
    if (!project) return;

    // Rule 17: User confirmation before destructive action
    const confirmed = confirm(`Are you sure you want to delete the project "${project.name}"?\nThis action cannot be undone.`);
    if (!confirmed) return;

    window.StorageService.deleteProject(projectId);
    this.selectedProjectId = null;
    this.render();

    if (window.showToast) window.showToast('Project deleted successfully', 'warning');
  }
};

window.Projects = Projects;

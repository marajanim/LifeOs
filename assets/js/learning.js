/**
 * LifeOS — Learning Tracker Module (Step 13)
 * Tracks coding, AI, courses, books, tutorials, study topics, weekly syllabus,
 * interactive modules checklist, and learning streaks.
 */

const Learning = {
  typeFilter: 'all',
  statusFilter: 'all',
  topicFilter: 'all',
  priorityFilter: 'all',
  sortBy: 'targetDate',
  selectedItemId: null,
  pendingDeleteId: null,

  init() {
    this.bindEvents();
    const items = StorageService.getLearningItems();
    const activeItems = items.filter(i => !i.isBacklog);
    if (!this.selectedItemId && activeItems.length > 0) {
      this.selectedItemId = activeItems[0].id;
    }
    this.render();
  },

  bindEvents() {
    // 1. Filter dropdowns
    const typeFilter = document.getElementById('learn-filter-type');
    if (typeFilter && !typeFilter.dataset.bound) {
      typeFilter.dataset.bound = 'true';
      typeFilter.addEventListener('change', (e) => {
        this.typeFilter = e.target.value;
        this.renderItemsList();
      });
    }

    const statusFilter = document.getElementById('learn-filter-status');
    if (statusFilter && !statusFilter.dataset.bound) {
      statusFilter.dataset.bound = 'true';
      statusFilter.addEventListener('change', (e) => {
        this.statusFilter = e.target.value;
        this.renderItemsList();
      });
    }

    const topicFilter = document.getElementById('learn-filter-topic');
    if (topicFilter && !topicFilter.dataset.bound) {
      topicFilter.dataset.bound = 'true';
      topicFilter.addEventListener('change', (e) => {
        this.topicFilter = e.target.value;
        this.renderItemsList();
      });
    }

    const priorityFilter = document.getElementById('learn-filter-priority');
    if (priorityFilter && !priorityFilter.dataset.bound) {
      priorityFilter.dataset.bound = 'true';
      priorityFilter.addEventListener('change', (e) => {
        this.priorityFilter = e.target.value;
        this.renderItemsList();
      });
    }

    const btnClear = document.getElementById('learn-btn-clear-filters');
    if (btnClear && !btnClear.dataset.bound) {
      btnClear.dataset.bound = 'true';
      btnClear.addEventListener('click', () => {
        if (typeFilter) typeFilter.value = 'all';
        if (statusFilter) statusFilter.value = 'all';
        if (topicFilter) topicFilter.value = 'all';
        if (priorityFilter) priorityFilter.value = 'all';
        this.typeFilter = 'all';
        this.statusFilter = 'all';
        this.topicFilter = 'all';
        this.priorityFilter = 'all';
        this.renderItemsList();
      });
    }

    // 2. Sort dropdown
    const sortSelect = document.getElementById('learn-sort-select');
    if (sortSelect && !sortSelect.dataset.bound) {
      sortSelect.dataset.bound = 'true';
      sortSelect.addEventListener('change', (e) => {
        this.sortBy = e.target.value;
        this.renderItemsList();
      });
    }

    // 3. New Learning Item Modal button
    const btnNew = document.getElementById('btn-new-learning');
    if (btnNew && !btnNew.dataset.bound) {
      btnNew.dataset.bound = 'true';
      btnNew.addEventListener('click', () => {
        this.openCreateModal();
      });
    }

    // 4. Create Learning Form Submit
    const createForm = document.getElementById('create-learning-form');
    if (createForm && !createForm.dataset.bound) {
      createForm.dataset.bound = 'true';
      createForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleCreateSubmit();
      });
    }

    // 5. Edit Learning Form Submit
    const editForm = document.getElementById('edit-learning-form');
    if (editForm && !editForm.dataset.bound) {
      editForm.dataset.bound = 'true';
      editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleEditSubmit();
      });
    }

    // 6. Delete Confirmation Button (Rule 17)
    const btnConfirmDelete = document.getElementById('btn-confirm-delete-learn');
    if (btnConfirmDelete && !btnConfirmDelete.dataset.bound) {
      btnConfirmDelete.dataset.bound = 'true';
      btnConfirmDelete.addEventListener('click', () => {
        if (this.pendingDeleteId) {
          const item = StorageService.getLearningItemById(this.pendingDeleteId);
          const title = item ? item.title : 'Item';
          StorageService.deleteLearningItem(this.pendingDeleteId);
          window.LifeOS?.showToast?.(`Deleted "${title}" permanently`, 'info');
          window.LifeOS?.closeModal?.('confirm-delete-learning-modal');

          if (this.selectedItemId === this.pendingDeleteId) {
            const remaining = StorageService.getLearningItems().filter(i => !i.isBacklog);
            this.selectedItemId = remaining.length > 0 ? remaining[0].id : null;
          }
          this.pendingDeleteId = null;
          this.render();
        }
      });
    }
  },

  openCreateModal() {
    const form = document.getElementById('create-learning-form');
    if (form) form.reset();
    window.LifeOS?.openModal?.('create-learning-modal');
  },

  handleCreateSubmit() {
    const title = document.getElementById('new-learn-title')?.value.trim();
    if (!title) return;

    const type = document.getElementById('new-learn-type')?.value || 'Course';
    const topic = document.getElementById('new-learn-topic')?.value || 'Web Development';
    const source = document.getElementById('new-learn-source')?.value.trim() || '';
    const status = document.getElementById('new-learn-status')?.value || 'Learning';
    const priority = document.getElementById('new-learn-priority')?.value || 'Medium';
    const targetDate = document.getElementById('new-learn-target-date')?.value || '';
    const estimatedHours = Number(document.getElementById('new-learn-hours')?.value) || 10;
    const description = document.getElementById('new-learn-desc')?.value.trim() || '';
    const modulesText = document.getElementById('new-learn-modules')?.value.trim() || '';

    let targetDateDisplay = 'Upcoming';
    if (targetDate) {
      const d = new Date(targetDate);
      if (!isNaN(d.getTime())) {
        targetDateDisplay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
    }

    const modules = [];
    if (modulesText) {
      modulesText.split('\n').map(s => s.trim()).filter(Boolean).forEach((mTitle, idx) => {
        modules.push({ id: `m_${idx + 1}`, title: mTitle.replace(/^[-*•]\s*/, ''), completed: false, isCurrent: idx === 0 });
      });
    } else {
      modules.push({ id: 'm_1', title: 'Module 1: Foundations', completed: false, isCurrent: true });
    }

    const created = StorageService.addLearningItem({
      title,
      type,
      topic,
      source,
      status,
      priority,
      targetDate,
      targetDateDisplay,
      estimatedHours,
      description,
      modules,
      nextAction: modules.length > 0 ? `Start: ${modules[0].title}` : 'Begin study plan'
    });

    window.LifeOS?.closeModal?.('create-learning-modal');
    window.LifeOS?.showToast?.(`Added "${title}" to Learning Tracker!`, 'success');

    this.selectedItemId = created.id;
    this.render();
  },

  openEditModal(id) {
    const item = StorageService.getLearningItemById(id);
    if (!item) return;

    document.getElementById('edit-learn-id').value = item.id;
    document.getElementById('edit-learn-title').value = item.title || '';
    document.getElementById('edit-learn-type').value = item.type || 'Course';
    document.getElementById('edit-learn-topic').value = item.topic || 'Web Development';
    document.getElementById('edit-learn-source').value = item.source || '';
    document.getElementById('edit-learn-status').value = item.status || 'Learning';
    document.getElementById('edit-learn-priority').value = item.priority || 'Medium';
    document.getElementById('edit-learn-target-date').value = item.targetDate || '';
    document.getElementById('edit-learn-hours').value = item.estimatedHours || 10;
    document.getElementById('edit-learn-spent').value = item.hoursSpent || 0;
    document.getElementById('edit-learn-desc').value = item.description || '';

    window.LifeOS?.openModal?.('edit-learning-modal');
  },

  handleEditSubmit() {
    const id = document.getElementById('edit-learn-id')?.value;
    if (!id) return;

    const title = document.getElementById('edit-learn-title')?.value.trim();
    const type = document.getElementById('edit-learn-type')?.value || 'Course';
    const topic = document.getElementById('edit-learn-topic')?.value || 'Web Development';
    const source = document.getElementById('edit-learn-source')?.value.trim() || '';
    const status = document.getElementById('edit-learn-status')?.value || 'Learning';
    const priority = document.getElementById('edit-learn-priority')?.value || 'Medium';
    const targetDate = document.getElementById('edit-learn-target-date')?.value || '';
    const estimatedHours = Number(document.getElementById('edit-learn-hours')?.value) || 10;
    const hoursSpent = Number(document.getElementById('edit-learn-spent')?.value) || 0;
    const description = document.getElementById('edit-learn-desc')?.value.trim() || '';

    let targetDateDisplay = 'Upcoming';
    if (targetDate) {
      const d = new Date(targetDate);
      if (!isNaN(d.getTime())) {
        targetDateDisplay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
    }

    StorageService.updateLearningItem(id, {
      title,
      type,
      topic,
      source,
      status,
      priority,
      targetDate,
      targetDateDisplay,
      estimatedHours,
      hoursSpent,
      description
    });

    window.LifeOS?.closeModal?.('edit-learning-modal');
    window.LifeOS?.showToast?.(`Updated "${title}"`, 'success');
    this.render();
  },

  confirmDelete(id) {
    const item = StorageService.getLearningItemById(id);
    if (!item) return;

    this.pendingDeleteId = id;
    const titlePlaceholder = document.getElementById('delete-learn-title-placeholder');
    if (titlePlaceholder) {
      titlePlaceholder.textContent = `"${item.title}"`;
    }
    window.LifeOS?.openModal?.('confirm-delete-learning-modal');
  },

  selectItem(id) {
    this.selectedItemId = id;
    this.renderListSelectedState();
    this.renderDetail();

    if (window.innerWidth < 992) {
      const detailPanel = document.getElementById('learning-detail-panel');
      if (detailPanel) {
        detailPanel.scrollIntoView({ behavior: 'smooth' });
      }
    }
  },

  toggleModule(itemId, moduleIndex) {
    const updated = StorageService.toggleLearningModule(itemId, moduleIndex);
    if (updated) {
      this.render();
    }
  },

  startBacklogItem(id) {
    const item = StorageService.getLearningItemById(id);
    if (!item) return;

    StorageService.updateLearningItem(id, { isBacklog: false, status: 'Learning' });
    window.LifeOS?.showToast?.(`Moved "${item.title}" from Backlog to Active Learning!`, 'success');
    this.selectedItemId = id;
    this.render();
  },

  render() {
    this.renderKPIs();
    this.renderItemsList();
    this.renderBacklog();
    this.renderWeekPlan();
    this.renderDetail();
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  },

  renderKPIs() {
    const metrics = StorageService.calculateLearningMetrics();

    // 1. Active Learning Items
    const kpiActive = document.getElementById('learn-kpi-active');
    const kpiActiveSub = document.getElementById('learn-kpi-active-sub');
    if (kpiActive) kpiActive.textContent = metrics.activeCount;
    if (kpiActiveSub) kpiActiveSub.textContent = `${metrics.learningNowCount} learning`;

    // 2. Hours Planned This Week
    const kpiHours = document.getElementById('learn-kpi-hours');
    const kpiHoursBar = document.getElementById('learn-kpi-hours-bar');
    const kpiHoursSub = document.getElementById('learn-kpi-hours-sub');
    if (kpiHours) kpiHours.textContent = `${metrics.hoursPlannedThisWeek} / ${metrics.hoursGoalThisWeek}`;
    if (kpiHoursBar) kpiHoursBar.style.width = `${metrics.hoursPct}%`;
    if (kpiHoursSub) kpiHoursSub.textContent = `${metrics.hoursPct}%`;

    // 3. Completed This Month
    const kpiCompleted = document.getElementById('learn-kpi-completed');
    const kpiCompletedBar = document.getElementById('learn-kpi-completed-bar');
    const kpiCompletedSub = document.getElementById('learn-kpi-completed-sub');
    if (kpiCompleted) kpiCompleted.textContent = metrics.completedThisMonth;
    if (kpiCompletedBar) kpiCompletedBar.style.width = `${metrics.completedPct}%`;
    if (kpiCompletedSub) kpiCompletedSub.textContent = `${metrics.completedPct}%`;

    // 4. Current Focus
    const kpiFocus = document.getElementById('learn-kpi-focus');
    if (kpiFocus) kpiFocus.textContent = metrics.currentFocus;
  },

  getFilteredItems() {
    let list = StorageService.getLearningItems().filter(i => !i.isBacklog);

    if (this.typeFilter !== 'all') {
      list = list.filter(i => i.type && i.type.toLowerCase() === this.typeFilter.toLowerCase());
    }
    if (this.statusFilter !== 'all') {
      list = list.filter(i => i.status && i.status.toLowerCase() === this.statusFilter.toLowerCase());
    }
    if (this.topicFilter !== 'all') {
      list = list.filter(i => i.topic && i.topic.toLowerCase() === this.topicFilter.toLowerCase());
    }
    if (this.priorityFilter !== 'all') {
      list = list.filter(i => i.priority && i.priority.toLowerCase() === this.priorityFilter.toLowerCase());
    }

    // Sort
    if (this.sortBy === 'targetDate') {
      list.sort((a, b) => new Date(a.targetDate || '2099-12-31') - new Date(b.targetDate || '2099-12-31'));
    } else if (this.sortBy === 'progress') {
      list.sort((a, b) => (b.progress || 0) - (a.progress || 0));
    } else if (this.sortBy === 'hours') {
      list.sort((a, b) => (b.estimatedHours || 0) - (a.estimatedHours || 0));
    } else if (this.sortBy === 'title') {
      list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    return list;
  },

  renderItemsList() {
    const container = document.getElementById('learn-items-container');
    const countBadge = document.getElementById('learn-items-count');
    if (!container) return;

    const filtered = this.getFilteredItems();
    if (countBadge) countBadge.textContent = filtered.length;

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="padding: 36px 20px; text-align: center; background: var(--color-bg-surface); border: 1px dashed var(--color-border); border-radius: var(--radius-lg);">
          <p style="font-size: 13px; color: var(--color-text-secondary); margin: 0 0 12px;">No learning items match the selected filters.</p>
          <button class="btn btn-secondary btn-sm" onclick="document.getElementById('learn-btn-clear-filters').click();">Reset Filters</button>
        </div>
      `;
      return;
    }

    let html = '';
    filtered.forEach(item => {
      const isSelected = item.id === this.selectedItemId;

      // Status pill color
      let statusDotColor = '#10b981';
      let statusText = item.status || 'Learning';
      if (statusText === 'Planned') {
        statusDotColor = '#2563eb';
      } else if (statusText === 'Paused') {
        statusDotColor = '#f59e0b';
      } else if (statusText === 'Completed') {
        statusDotColor = '#10b981';
      }

      html += `
        <div class="learn-item-card ${isSelected ? 'selected' : ''}" data-id="${item.id}" onclick="Learning.selectItem('${item.id}')">
          <!-- Icon / Brand Badge -->
          <div class="learn-badge-box" style="background-color: ${item.badgeBg || '#000000'}; color: ${item.badgeColor || '#ffffff'};">
            ${item.badgeText || (item.title ? item.title.substring(0, 2).toUpperCase() : 'N')}
          </div>

          <!-- Main Info -->
          <div class="learn-main-info">
            <div class="learn-title-row">
              <h4 class="learn-card-title">${this.escapeHtml(item.title)}</h4>
            </div>
            <div class="learn-tags-row">
              <span class="learn-tag-pill learn-type-pill">${this.escapeHtml(item.type || 'Course')}</span>
              <span class="learn-tag-pill learn-topic-pill">${this.escapeHtml(item.topic || 'Web Development')}</span>
            </div>
            <p class="learn-card-desc">${this.escapeHtml(item.description || 'Learn syllabus and complete practice exercises.')}</p>
          </div>

          <!-- Progress Block -->
          <div class="learn-progress-block">
            <div class="learn-bar-wrap">
              <div class="learn-progress-bar" style="width: ${item.progress || 0}%;"></div>
            </div>
            <div class="learn-progress-text">${item.hoursSpent || 0} / ${item.estimatedHours || 20} hrs</div>
          </div>

          <!-- Percentage & Due Date -->
          <div class="learn-date-block">
            <div class="learn-pct-label">${item.progress || 0}%</div>
            <div class="learn-due-label">
              <i data-lucide="calendar" style="width: 12px; height: 12px;"></i>
              <span>${this.escapeHtml(item.targetDateDisplay || 'Apr 30, 2024')}</span>
            </div>
          </div>

          <!-- Status Badge -->
          <div class="learn-status-block">
            <span class="learn-status-indicator">
              <span class="status-dot" style="background-color: ${statusDotColor};"></span>
              <span>${this.escapeHtml(statusText)}</span>
            </span>
          </div>

          <!-- Right Chevron -->
          <div class="learn-chevron-block">
            <i data-lucide="chevron-right" style="width: 18px; height: 18px; color: var(--color-text-muted);"></i>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  },

  renderListSelectedState() {
    document.querySelectorAll('.learn-item-card').forEach(c => {
      if (c.getAttribute('data-id') === this.selectedItemId) {
        c.classList.add('selected');
      } else {
        c.classList.remove('selected');
      }
    });
  },

  renderBacklog() {
    const container = document.getElementById('learn-backlog-container');
    if (!container) return;

    const backlog = StorageService.getLearningItems().filter(i => i.isBacklog);
    if (backlog.length === 0) {
      container.innerHTML = `<p style="font-size: 13px; color: var(--color-text-secondary); margin: 8px 0;">No items in backlog.</p>`;
      return;
    }

    let html = '';
    backlog.forEach(item => {
      html += `
        <div class="learn-backlog-row">
          <input type="checkbox" class="learn-backlog-checkbox" title="Start learning this item" onchange="Learning.startBacklogItem('${item.id}')">
          <span class="learn-backlog-title">${this.escapeHtml(item.title)}</span>
          <span class="learn-tag-pill learn-type-pill">${this.escapeHtml(item.type || 'Course')}</span>
          <span class="learn-tag-pill learn-topic-pill">${this.escapeHtml(item.topic || 'General')}</span>
          <span class="learn-backlog-est">Est. ${item.estimatedHours || 15} hrs</span>
          <span class="learn-status-pill badge-gray" style="font-size: 11px; padding: 2px 8px;">Not started</span>
        </div>
      `;
    });

    container.innerHTML = html;
  },

  renderWeekPlan() {
    const container = document.getElementById('learn-weekplan-container');
    if (!container) return;

    const weekSchedule = [
      { day: 'Mon', title: 'Next.js Fundamentals', hrs: '2h', completed: true },
      { day: 'Tue', title: 'AI Agents Course', hrs: '2h', completed: true },
      { day: 'Wed', title: 'JavaScript Interview Prep', hrs: '2h', completed: false },
      { day: 'Thu', title: 'UI/UX Practice', hrs: '2h', completed: false },
      { day: 'Fri', title: 'Research Paper Reading', hrs: '2h', completed: false }
    ];

    let html = '';
    weekSchedule.forEach(item => {
      html += `
        <div class="learn-plan-item-row">
          <div class="learn-plan-day-col">
            ${item.completed ? `
              <i data-lucide="check-circle" style="width: 14px; height: 14px; color: #10b981;"></i>
            ` : `
              <span class="circle-empty" style="width: 13px; height: 13px; border: 1.5px solid #94a3b8; border-radius: 50%; display: inline-block;"></span>
            `}
            <span style="font-weight: 600; font-size: 12px; color: ${item.completed ? '#10b981' : 'var(--color-text-secondary)'};">${item.day}</span>
          </div>
          <div class="learn-plan-title-col">${this.escapeHtml(item.title)}</div>
          <div class="learn-plan-hrs-col">${item.hrs}</div>
        </div>
      `;
    });

    container.innerHTML = html;
  },

  renderDetail() {
    const panel = document.getElementById('learning-detail-panel');
    if (!panel) return;

    if (!this.selectedItemId) {
      panel.innerHTML = `<div class="card" style="padding: 30px; text-align: center;"><p style="color: var(--color-text-secondary); margin:0;">Select a learning item to see details</p></div>`;
      return;
    }

    const item = StorageService.getLearningItemById(this.selectedItemId);
    if (!item) return;

    // Status pill
    let statusDotColor = '#10b981';
    let statusText = item.status || 'Learning';
    if (statusText === 'Planned') statusDotColor = '#2563eb';
    else if (statusText === 'Paused') statusDotColor = '#f59e0b';

    // Modules checklist
    let modulesHtml = '';
    const modules = item.modules || [];
    modules.forEach((mod, idx) => {
      modulesHtml += `
        <div class="learn-module-row ${mod.completed ? 'completed' : ''}" onclick="Learning.toggleModule('${item.id}', ${idx})">
          <div class="learn-module-check-icon">
            ${mod.completed ? `
              <i data-lucide="check-circle-2" style="width: 16px; height: 16px; color: #10b981; fill: #ecfdf5;"></i>
            ` : (mod.isCurrent ? `
              <i data-lucide="disc" style="width: 16px; height: 16px; color: #2563eb;"></i>
            ` : `
              <span class="module-circle-empty"></span>
            `)}
          </div>
          <span class="learn-module-title ${mod.completed ? 'strikethrough' : ''}">${this.escapeHtml(mod.title)}</span>
        </div>
      `;
    });

    panel.innerHTML = `
      <div class="card learn-detail-card">
        <!-- Top Title & Action -->
        <div class="learn-detail-top">
          <div class="learn-badge-box" style="background-color: ${item.badgeBg || '#000000'}; color: ${item.badgeColor || '#ffffff'}; width: 38px; height: 38px; font-size: 14px;">
            ${item.badgeText || 'N'}
          </div>
          <div class="learn-detail-title-box">
            <div class="learn-detail-title-row">
              <h3 class="learn-detail-title">${this.escapeHtml(item.title)}</h3>
              <i data-lucide="external-link" style="width: 14px; height: 14px; color: var(--color-text-muted);"></i>
            </div>
            <div class="learn-tags-row" style="margin-top: 4px;">
              <span class="learn-tag-pill learn-type-pill">${this.escapeHtml(item.type || 'Course')}</span>
              <span class="learn-tag-pill learn-topic-pill">${this.escapeHtml(item.topic || 'Web Development')}</span>
            </div>
          </div>
          <div class="dropdown" style="position: relative;">
            <button class="icon-btn" onclick="Learning.toggleMenu(this)" title="Options">
              <i data-lucide="more-horizontal" style="width: 18px; height: 18px;"></i>
            </button>
            <div class="dropdown-menu learn-menu" style="display: none; position: absolute; right: 0; top: 100%; z-index: 20; min-width: 140px;">
              <button class="dropdown-item" onclick="Learning.openEditModal('${item.id}')">
                <i data-lucide="edit-3"></i>
                <span>Edit Item</span>
              </button>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item text-danger" onclick="Learning.confirmDelete('${item.id}')">
                <i data-lucide="trash-2"></i>
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Description -->
        <p class="learn-detail-desc">${this.escapeHtml(item.description || 'Learn core concepts and complete real-world challenges.')}</p>

        <!-- Progress Header & Bar -->
        <div class="learn-detail-progress-section">
          <div class="learn-detail-pct-row">
            <span style="font-size: 12px; font-weight: 600; color: var(--color-text-secondary);">Progress</span>
            <span style="font-size: 14px; font-weight: 700; color: var(--color-text-primary);">${item.progress || 0}%</span>
          </div>
          <div class="learn-detail-progress-track">
            <div class="learn-detail-progress-fill" style="width: ${item.progress || 0}%;"></div>
          </div>
          <div class="learn-detail-progress-meta">
            <span>${item.hoursSpent || 0} / ${item.estimatedHours || 20} hrs</span>
            <span><i data-lucide="calendar" style="width: 11px; height: 11px; display: inline-block; vertical-align: middle;"></i> Target: ${this.escapeHtml(item.targetDateDisplay || 'Apr 30, 2024')}</span>
          </div>
        </div>

        <!-- 3 Metrics Tiles -->
        <div class="learn-stat-tiles-row">
          <div class="learn-tile">
            <div class="learn-tile-label"><i data-lucide="flag" style="width: 12px; height: 12px; color: #ef4444;"></i> Priority</div>
            <div class="learn-tile-val text-danger">${this.escapeHtml(item.priority || 'High')}</div>
          </div>
          <div class="learn-tile">
            <div class="learn-tile-label"><i data-lucide="activity" style="width: 12px; height: 12px; color: #10b981;"></i> Status</div>
            <div class="learn-tile-val" style="color: ${statusDotColor};">● ${this.escapeHtml(statusText)}</div>
          </div>
          <div class="learn-tile">
            <div class="learn-tile-label"><i data-lucide="clock" style="width: 12px; height: 12px; color: #2563eb;"></i> Est. Hours</div>
            <div class="learn-tile-val">${item.estimatedHours || 20} hrs</div>
          </div>
        </div>

        <!-- Modules / Topics Checklist -->
        <div class="learn-modules-section">
          <div class="learn-modules-header">
            <div style="font-size: 13px; font-weight: 700; color: var(--color-text-primary);">
              Modules / Topics <span class="badge badge-sm badge-gray" style="font-size: 11px; padding: 1px 6px;">${modules.length}</span>
            </div>
            <span style="font-size: 12px; color: var(--color-primary); cursor: pointer;">View All</span>
          </div>
          <div class="learn-modules-list">
            ${modulesHtml}
          </div>
        </div>

        <!-- Next Action Card -->
        <div class="learn-next-action-card">
          <div class="learn-next-action-icon">
            <i data-lucide="alert-circle" style="width: 16px; height: 16px;"></i>
          </div>
          <div class="learn-next-action-content">
            <div class="learn-next-action-title">${this.escapeHtml(item.nextAction || 'Continue next lesson')}</div>
            <div class="learn-next-action-sub">${this.escapeHtml(item.nextActionSub || 'Complete upcoming exercise.')}</div>
          </div>
          <i data-lucide="chevron-right" style="width: 16px; height: 16px; color: var(--color-primary);"></i>
        </div>

        <!-- Bottom Weekly Hours Bar & Streak Widget -->
        <div class="learn-bottom-card-row">
          <div class="learn-bottom-hours-track">
            <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; margin-bottom: 6px;">
              <span>8 / 12 hrs</span>
              <a href="#planner" style="font-size: 11.5px; color: var(--color-primary); text-decoration: none;">View full plan ➔</a>
            </div>
            <div class="progress-bar-container" style="height: 6px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
              <div style="width: 67%; height: 100%; background: #2563eb; border-radius: 4px;"></div>
            </div>
          </div>

          <div class="learn-streak-widget">
            <div class="learn-streak-icon">🔥</div>
            <div>
              <div style="font-size: 11px; color: var(--color-text-muted); font-weight: 600;">Current Streak</div>
              <div style="font-size: 15px; font-weight: 800; color: #ea580c;">7 days</div>
              <div style="font-size: 11px; color: var(--color-text-secondary);">Keep going! Consistency builds mastery.</div>
            </div>
          </div>
        </div>
      </div>
    `;

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  },

  toggleMenu(btn) {
    const menu = btn.nextElementSibling;
    if (!menu) return;
    const isVisible = menu.style.display === 'block';
    document.querySelectorAll('.learn-menu').forEach(m => m.style.display = 'none');
    menu.style.display = isVisible ? 'none' : 'block';

    const closeListener = (e) => {
      if (!btn.contains(e.target) && !menu.contains(e.target)) {
        menu.style.display = 'none';
        document.removeEventListener('click', closeListener);
      }
    };
    if (!isVisible) {
      setTimeout(() => document.addEventListener('click', closeListener), 0);
    }
  },

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};

window.Learning = Learning;

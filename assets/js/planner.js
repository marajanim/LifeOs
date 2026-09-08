/**
 * LifeOS — Daily Planner & Time Blocking Service (Step 7)
 * Implements interactive hourly timeline (6 AM to 12 AM),
 * capacity gauges, deep work tracking, overbooked warnings,
 * and daily priorities synchronization.
 */

const Planner = {
  activeDate: '2024-04-23', // Tuesday, Apr 23, 2024 (consistent with prototype mockups)
  blockToDeleteId: null,

  CATEGORY_CONFIG: {
    'Personal': { icon: 'heart', cls: 'tb-cat-personal', color: '#16a34a' },
    'Learning': { icon: 'book-open', cls: 'tb-cat-learning', color: '#2563eb' },
    'Study': { icon: 'code', cls: 'tb-cat-study', color: '#e11d48' },
    'Freelance': { icon: 'briefcase', cls: 'tb-cat-freelance', color: '#7c3aed' },
    'Break': { icon: 'coffee', cls: 'tb-cat-break', color: '#475569' },
    'SaaS': { icon: 'file-text', cls: 'tb-cat-saas', color: '#1d4ed8' },
    'Job': { icon: 'building', cls: 'tb-cat-job', color: '#1e40af' },
    'Custom': { icon: 'sparkles', cls: 'tb-cat-custom', color: '#d97706' }
  },

  init() {
    this.bindEvents();
    this.renderAll();
  },

  bindEvents() {
    // Day Navigation
    const prevBtn = document.getElementById('planner-prev-day-btn');
    const nextBtn = document.getElementById('planner-next-day-btn');
    const todayBtn = document.getElementById('planner-today-btn');

    if (prevBtn && !prevBtn._bound) {
      prevBtn._bound = true;
      prevBtn.addEventListener('click', () => this.shiftDay(-1));
    }
    if (nextBtn && !nextBtn._bound) {
      nextBtn._bound = true;
      nextBtn.addEventListener('click', () => this.shiftDay(1));
    }
    if (todayBtn && !todayBtn._bound) {
      todayBtn._bound = true;
      todayBtn.addEventListener('click', () => {
        this.activeDate = '2024-04-23';
        this.renderAll();
        if (window.showToast) window.showToast("Jumped to Today (Apr 23, 2024)", "info");
      });
    }

    // Quick Add Form
    const quickAddForm = document.getElementById('planner-quick-add-form');
    if (quickAddForm && !quickAddForm._bound) {
      quickAddForm._bound = true;
      quickAddForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleQuickAdd();
      });
    }

    // Edit Modal Form
    const editForm = document.getElementById('edit-timeblock-form');
    if (editForm && !editForm._bound) {
      editForm._bound = true;
      editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSaveEdit();
      });
    }

    // Edit Modal Delete Button
    const editDeleteBtn = document.getElementById('edit-tb-delete-btn');
    if (editDeleteBtn && !editDeleteBtn._bound) {
      editDeleteBtn._bound = true;
      editDeleteBtn.addEventListener('click', () => {
        const blockId = document.getElementById('edit-tb-id').value;
        this.closeModal('edit-timeblock-modal');
        this.promptDelete(blockId);
      });
    }

    // Confirm Delete Action Button (Rule 17)
    const confirmDeleteBtn = document.getElementById('btn-confirm-delete-tb');
    if (confirmDeleteBtn && !confirmDeleteBtn._bound) {
      confirmDeleteBtn._bound = true;
      confirmDeleteBtn.addEventListener('click', () => {
        this.executeDelete();
      });
    }

    // Capacity Period Switcher
    const periodSelect = document.getElementById('planner-capacity-period-select');
    if (periodSelect && !periodSelect._bound) {
      periodSelect._bound = true;
      periodSelect.addEventListener('change', () => {
        this.renderCapacityInsight();
      });
    }
  },

  shiftDay(offset) {
    try {
      const parts = this.activeDate.split('-').map(Number);
      const d = new Date(parts[0], parts[1] - 1, parts[2] + offset);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      this.activeDate = `${yyyy}-${mm}-${dd}`;
      this.renderAll();
    } catch (err) {
      console.error('Error shifting day:', err);
    }
  },

  renderAll() {
    this.renderDateHeader();
    this.renderKPIs();
    this.renderTimeline();
    this.renderPriorities();
    this.renderCapacityInsight();

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  },

  formatDateDisplay(dateStr) {
    const parts = dateStr.split('-').map(Number);
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${dayNames[d.getDay()]}, ${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  },

  renderDateHeader() {
    const formatted = this.formatDateDisplay(this.activeDate);
    const dateDisplayEl = document.getElementById('planner-active-date-display');
    const heroDateEl = document.getElementById('planner-hero-date');

    if (dateDisplayEl) dateDisplayEl.textContent = formatted;
    if (heroDateEl) heroDateEl.textContent = formatted;
  },

  renderKPIs() {
    const cap = StorageService.calculateDayCapacity(this.activeDate);

    // 1. Planned Hours
    const plannedValEl = document.getElementById('planner-kpi-planned');
    const plannedBarEl = document.getElementById('planner-kpi-planned-bar');
    const plannedPctEl = document.getElementById('planner-kpi-planned-pct');

    if (plannedValEl) plannedValEl.textContent = `${cap.totalPlannedHours.toFixed(1)} / ${cap.dayCapacityHours}`;
    if (plannedBarEl) plannedBarEl.style.width = `${cap.plannedRatio}%`;
    if (plannedPctEl) plannedPctEl.textContent = `${cap.plannedRatio}%`;

    // 2. Focus Hours
    const focusValEl = document.getElementById('planner-kpi-focus');
    const focusBarEl = document.getElementById('planner-kpi-focus-bar');
    const focusPctEl = document.getElementById('planner-kpi-focus-pct');

    if (focusValEl) focusValEl.textContent = `${cap.focusHours.toFixed(1)} / ${cap.maxFocusCapacity}`;
    if (focusBarEl) focusBarEl.style.width = `${cap.focusRatio}%`;
    if (focusPctEl) focusPctEl.textContent = `${cap.focusRatio}%`;

    // 3. Free Time
    const freeValEl = document.getElementById('planner-kpi-free');
    const freeBarEl = document.getElementById('planner-kpi-free-bar');
    const freePctEl = document.getElementById('planner-kpi-free-pct');

    if (freeValEl) freeValEl.textContent = `${cap.freeHours.toFixed(1)} hrs`;
    if (freeBarEl) freeBarEl.style.width = `${cap.freeRatio}%`;
    if (freePctEl) freePctEl.textContent = `${cap.freeRatio}%`;

    // 4. Overbooked Warning
    const warningTextEl = document.getElementById('planner-kpi-warning-text');
    const warningDotEl = document.getElementById('planner-kpi-warning-dot');
    const warningSubEl = document.getElementById('planner-kpi-warning-sub');
    const warningIconWrap = document.getElementById('planner-kpi-warning-icon');

    if (cap.isOverbooked) {
      if (warningTextEl) {
        warningTextEl.textContent = 'Overbooked';
        warningTextEl.style.color = '#ef4444';
      }
      if (warningDotEl) warningDotEl.style.backgroundColor = '#ef4444';
      if (warningSubEl) {
        warningSubEl.textContent = `You have planned ${cap.focusHours.toFixed(1)} hours of focused work today.`;
        warningSubEl.style.color = '#ef4444';
        warningSubEl.style.fontWeight = '600';
      }
      if (warningIconWrap) {
        warningIconWrap.style.backgroundColor = '#fef2f2';
        warningIconWrap.style.color = '#ef4444';
      }
    } else {
      if (warningTextEl) {
        warningTextEl.textContent = 'On track';
        warningTextEl.style.color = '#10b981';
      }
      if (warningDotEl) warningDotEl.style.backgroundColor = '#10b981';
      if (warningSubEl) {
        warningSubEl.textContent = 'You have a healthy balance today.';
        warningSubEl.style.color = 'var(--color-text-secondary)';
        warningSubEl.style.fontWeight = 'normal';
      }
      if (warningIconWrap) {
        warningIconWrap.style.backgroundColor = '#ecfdf5';
        warningIconWrap.style.color = '#059669';
      }
    }
  },

  formatTime(timeStr) {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    const minStr = m > 0 ? `:${String(m).padStart(2, '0')}` : ':00';
    return `${hour12}${minStr} ${suffix}`;
  },

  renderTimeline() {
    const container = document.getElementById('planner-timeline-container');
    if (!container) return;

    const blocks = StorageService.getTimeblocksForDate(this.activeDate);

    // Default visible timeline hours: 6 AM to 12 AM (midnight)
    const hours = [
      { h: 6, label: '6 AM', timeVal: '06:00' },
      { h: 7, label: '7 AM', timeVal: '07:00' },
      { h: 8, label: '8 AM', timeVal: '08:00' },
      { h: 9, label: '9 AM', timeVal: '09:00' },
      { h: 10, label: '10 AM', timeVal: '10:00' },
      { h: 11, label: '11 AM', timeVal: '11:00' },
      { h: 12, label: '12 PM', timeVal: '12:00' },
      { h: 13, label: '1 PM', timeVal: '13:00' },
      { h: 14, label: '2 PM', timeVal: '14:00' },
      { h: 15, label: '3 PM', timeVal: '15:00' },
      { h: 16, label: '4 PM', timeVal: '16:00' },
      { h: 17, label: '5 PM', timeVal: '17:00' },
      { h: 18, label: '6 PM', timeVal: '18:00' },
      { h: 19, label: '7 PM', timeVal: '19:00' },
      { h: 20, label: '8 PM', timeVal: '20:00' },
      { h: 21, label: '9 PM', timeVal: '21:00' },
      { h: 22, label: '10 PM', timeVal: '22:00' },
      { h: 23, label: '11 PM', timeVal: '23:00' },
      { h: 24, label: '12 AM', timeVal: '23:59' }
    ];

    let html = '';

    hours.forEach((slot, idx) => {
      // Find blocks starting at or within this hour
      const matchingBlocks = blocks.filter(b => {
        if (!b.startTime) return false;
        const startH = parseInt(b.startTime.split(':')[0], 10);
        return startH === slot.h;
      });

      html += `<div class="timeline-slot-row" data-hour="${slot.h}">
        <div class="timeline-hour-gutter">${slot.label}</div>
        <div style="display: flex; flex-direction: column; gap: 8px; flex: 1;">`;

      if (matchingBlocks.length > 0) {
        matchingBlocks.forEach(b => {
          const cfg = this.CATEGORY_CONFIG[b.category] || this.CATEGORY_CONFIG['Custom'];
          const completedCls = b.completed ? 'is-completed' : '';
          const timeDisplay = b.timeDisplay || `${this.formatTime(b.startTime)} – ${this.formatTime(b.endTime)}`;

          html += `
            <div class="timeline-block-card ${cfg.cls} ${completedCls}" data-id="${b.id}">
              <div class="tb-icon-wrap" title="${b.category}">
                <i data-lucide="${b.icon || cfg.icon}" style="width: 16px; height: 16px;"></i>
              </div>
              <div class="tb-content" onclick="Planner.openEditModal('${b.id}')" style="cursor: pointer;">
                <div class="tb-title-row">
                  <span class="tb-time-badge">${timeDisplay}</span>
                  <span class="tb-title">${b.title}</span>
                </div>
                <div class="tb-meta-line">
                  <span class="tb-cat-dot"></span>
                  <span class="tb-cat-name">${b.category}</span>
                  ${b.notes ? `<span>•</span><span class="tb-notes">${b.notes}</span>` : ''}
                </div>
              </div>
              <div class="tb-actions-wrap">
                <button class="tb-check-btn ${b.completed ? 'checked' : ''}" onclick="Planner.toggleBlockComplete('${b.id}', event)" title="${b.completed ? 'Mark pending' : 'Mark complete'}">
                  <i data-lucide="${b.completed ? 'check-circle-2' : 'circle'}" style="width: 17px; height: 17px;"></i>
                </button>
                <button class="tb-more-btn" onclick="Planner.openEditModal('${b.id}')" title="Edit block">
                  <i data-lucide="more-horizontal" style="width: 16px; height: 16px;"></i>
                </button>
              </div>
            </div>`;
        });
      } else {
        // Subtle empty slot allowing quick planning
        const defaultEndH = slot.h + 1 < 24 ? String(slot.h + 1).padStart(2, '0') : '23';
        const startVal = `${String(slot.h).padStart(2, '0')}:00`;
        const endVal = `${defaultEndH}:00`;

        html += `
          <div class="timeline-empty-slot" onclick="Planner.prefillAddForm('${startVal}', '${endVal}')" title="Click to schedule time block at ${slot.label}">
            <i data-lucide="plus" style="width: 12px; height: 12px; margin-right: 6px;"></i>
            <span>Add block at ${slot.label}</span>
          </div>`;
      }

      html += `</div></div>`;
    });

    container.innerHTML = html;
  },

  renderPriorities() {
    const listEl = document.getElementById('planner-priorities-list');
    if (!listEl) return;

    // Grab focus tasks from lifeos_tasks
    const tasks = StorageService.getTasks();
    const priorityTasks = tasks.slice(0, 5);

    if (priorityTasks.length === 0) {
      listEl.innerHTML = `<div style="font-size: var(--font-size-xs); color: var(--color-text-muted); padding: var(--space-3); text-align: center;">No priority tasks today.</div>`;
      return;
    }

    const areaBadges = {
      'Study': { bg: '#ffe4e6', color: '#e11d48' },
      'University': { bg: '#ffe4e6', color: '#e11d48' },
      'Freelance': { bg: '#ede9fe', color: '#7c3aed' },
      'Learning': { bg: '#dcfce7', color: '#16a34a' },
      'SaaS': { bg: '#dbeafe', color: '#1d4ed8' },
      'Job': { bg: '#eff6ff', color: '#2563eb' },
      'Personal': { bg: '#f1f5f9', color: '#475569' }
    };

    let html = '';
    priorityTasks.forEach((task, index) => {
      const rank = index + 1;
      const isDone = !!task.completed;
      const badgeCfg = areaBadges[task.area] || { bg: '#f1f5f9', color: '#475569' };
      const deadlineDisplay = task.deadline || 'Today';

      html += `
        <div class="planner-priority-row">
          <div class="priority-rank">${rank}</div>
          <input type="checkbox" class="priority-checkbox" ${isDone ? 'checked' : ''} onchange="Planner.toggleTaskPriority('${task.id}', event)">
          <div class="priority-info">
            <div class="priority-title" style="${isDone ? 'text-decoration: line-through; color: var(--color-text-muted);' : ''}">${task.title}</div>
            <div class="priority-tags">
              <span class="priority-badge-pill" style="background-color: ${badgeCfg.bg}; color: ${badgeCfg.color};">${task.area || 'General'}</span>
              <span class="priority-due-text">${deadlineDisplay}</span>
            </div>
          </div>
          <button class="priority-add-to-timeline-btn" onclick="Planner.scheduleTaskAsBlock('${task.id}')" title="Add directly to plan timeline">
            <i data-lucide="plus" style="width: 14px; height: 14px;"></i>
          </button>
        </div>`;
    });

    listEl.innerHTML = html;
  },

  renderCapacityInsight() {
    const cap = StorageService.calculateDayCapacity(this.activeDate);

    const plannedVal = document.getElementById('cap-box-planned');
    const plannedBar = document.getElementById('cap-bar-planned');
    const focusVal = document.getElementById('cap-box-focus');
    const focusBar = document.getElementById('cap-bar-focus');
    const freeVal = document.getElementById('cap-box-free');
    const freeBar = document.getElementById('cap-bar-free');

    if (plannedVal) plannedVal.textContent = `${cap.totalPlannedHours.toFixed(1)} hrs`;
    if (plannedBar) plannedBar.style.width = `${cap.plannedRatio}%`;

    if (focusVal) focusVal.textContent = `${cap.focusHours.toFixed(1)} hrs`;
    if (focusBar) {
      // Focus ratio relative to planned or max capacity
      const focusRatioInPlanned = cap.totalPlannedHours > 0
        ? Math.min(100, Math.round((cap.focusHours / cap.totalPlannedHours) * 100))
        : 0;
      focusBar.style.width = `${focusRatioInPlanned}%`;
    }

    if (freeVal) freeVal.textContent = `${cap.freeHours.toFixed(1)} hrs`;
    if (freeBar) freeBar.style.width = `${cap.freeRatio}%`;

    // Banner
    const bannerEl = document.getElementById('planner-capacity-banner');
    const bannerTitle = document.getElementById('planner-banner-title');
    const bannerDesc = document.getElementById('planner-banner-desc');
    const bannerIcon = document.getElementById('planner-banner-icon');

    if (bannerEl && bannerTitle && bannerDesc && bannerIcon) {
      if (cap.isOverbooked) {
        bannerEl.className = 'capacity-insight-banner banner-warning';
        bannerIcon.innerHTML = `<i data-lucide="alert-triangle" style="width: 14px; height: 14px;"></i>`;
        bannerTitle.textContent = 'Heavy workload planned!';
        bannerDesc.textContent = `You have planned ${cap.focusHours.toFixed(1)} hours of focused work today.`;
      } else {
        bannerEl.className = 'capacity-insight-banner banner-balanced';
        bannerIcon.innerHTML = `<i data-lucide="check" style="width: 14px; height: 14px;"></i>`;
        bannerTitle.textContent = 'Your day looks balanced!';
        bannerDesc.textContent = 'You have time for focused work and personal life.';
      }
    }
  },

  prefillAddForm(startTime, endTime) {
    const startInput = document.getElementById('tb-quick-start');
    const endInput = document.getElementById('tb-quick-end');
    const titleInput = document.getElementById('tb-quick-title');

    if (startInput) startInput.value = startTime;
    if (endInput) endInput.value = endTime;
    if (titleInput) {
      titleInput.focus();
      titleInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  },

  handleQuickAdd() {
    const title = document.getElementById('tb-quick-title').value.trim();
    const category = document.getElementById('tb-quick-category').value;
    const startTime = document.getElementById('tb-quick-start').value;
    const endTime = document.getElementById('tb-quick-end').value;
    const isDeepWork = document.getElementById('tb-quick-deepwork').checked;
    const notes = document.getElementById('tb-quick-notes').value.trim();

    if (!title || !startTime || !endTime) {
      if (window.showToast) window.showToast("Please provide title and times", "error");
      return;
    }

    const cfg = this.CATEGORY_CONFIG[category] || this.CATEGORY_CONFIG['Custom'];
    const timeDisplay = `${this.formatTime(startTime)} – ${this.formatTime(endTime)}`;

    const newBlock = {
      date: this.activeDate,
      title,
      category,
      startTime,
      endTime,
      timeDisplay,
      notes,
      icon: cfg.icon,
      isDeepWork: isDeepWork,
      completed: false
    };

    StorageService.addTimeblock(newBlock);

    // Reset form
    document.getElementById('planner-quick-add-form').reset();
    document.getElementById('tb-quick-start').value = '15:00';
    document.getElementById('tb-quick-end').value = '16:00';

    if (window.showToast) {
      window.showToast(`Time block "${title}" added to schedule!`, 'success');
    }

    this.renderAll();
  },

  scheduleTaskAsBlock(taskId) {
    const tasks = StorageService.getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Find next available 1h slot starting from 14:00
    const blocks = StorageService.getTimeblocksForDate(this.activeDate);
    const existingStartHours = blocks.map(b => parseInt(b.startTime.split(':')[0], 10));

    let freeHour = 14;
    for (let h = 14; h < 23; h++) {
      if (!existingStartHours.includes(h)) {
        freeHour = h;
        break;
      }
    }

    const startVal = `${String(freeHour).padStart(2, '0')}:00`;
    const endVal = `${String(freeHour + 1).padStart(2, '0')}:00`;

    const blockCat = ['University', 'Study'].includes(task.area) ? 'Study'
      : ['Job'].includes(task.area) ? 'Job'
      : ['Freelance'].includes(task.area) ? 'Freelance'
      : ['SaaS'].includes(task.area) ? 'SaaS'
      : ['Learning'].includes(task.area) ? 'Learning' : 'Personal';

    const cfg = this.CATEGORY_CONFIG[blockCat] || this.CATEGORY_CONFIG['Custom'];

    const newBlock = {
      date: this.activeDate,
      title: task.title,
      category: blockCat,
      startTime: startVal,
      endTime: endVal,
      timeDisplay: `${this.formatTime(startVal)} – ${this.formatTime(endVal)}`,
      notes: task.notes || `Focus on ${task.project || 'task'}`,
      icon: cfg.icon,
      isDeepWork: true,
      relatedTaskId: task.id,
      completed: false
    };

    StorageService.addTimeblock(newBlock);

    if (window.showToast) {
      window.showToast(`Task "${task.title}" scheduled at ${this.formatTime(startVal)}!`, 'success');
    }

    this.renderAll();
  },

  toggleBlockComplete(blockId, event) {
    if (event) event.stopPropagation();
    const block = StorageService.toggleTimeblockComplete(blockId);
    if (block && window.showToast) {
      const msg = block.completed ? `Completed "${block.title}"` : `Reopened "${block.title}"`;
      window.showToast(msg, 'info');
    }
    this.renderAll();
  },

  toggleTaskPriority(taskId, event) {
    if (event) event.stopPropagation();
    const task = StorageService.toggleTask(taskId);
    if (task && window.showToast) {
      const msg = task.completed ? `Task "${task.title}" completed!` : `Task reopened`;
      window.showToast(msg, 'info');
    }
    this.renderPriorities();
  },

  openEditModal(blockId) {
    const blocks = StorageService.getTimeblocks();
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    document.getElementById('edit-tb-id').value = block.id;
    document.getElementById('edit-tb-title').value = block.title || '';
    document.getElementById('edit-tb-category').value = block.category || 'Job';
    document.getElementById('edit-tb-date').value = block.date || this.activeDate;
    document.getElementById('edit-tb-start').value = block.startTime || '09:00';
    document.getElementById('edit-tb-end').value = block.endTime || '10:00';
    document.getElementById('edit-tb-deepwork').checked = !!block.isDeepWork;
    document.getElementById('edit-tb-notes').value = block.notes || '';

    this.openModal('edit-timeblock-modal');
  },

  handleSaveEdit() {
    const id = document.getElementById('edit-tb-id').value;
    const title = document.getElementById('edit-tb-title').value.trim();
    const category = document.getElementById('edit-tb-category').value;
    const date = document.getElementById('edit-tb-date').value;
    const startTime = document.getElementById('edit-tb-start').value;
    const endTime = document.getElementById('edit-tb-end').value;
    const isDeepWork = document.getElementById('edit-tb-deepwork').checked;
    const notes = document.getElementById('edit-tb-notes').value.trim();

    if (!title || !startTime || !endTime) return;

    const cfg = this.CATEGORY_CONFIG[category] || this.CATEGORY_CONFIG['Custom'];
    const timeDisplay = `${this.formatTime(startTime)} – ${this.formatTime(endTime)}`;

    StorageService.updateTimeblock(id, {
      title,
      category,
      date,
      startTime,
      endTime,
      timeDisplay,
      isDeepWork,
      notes,
      icon: cfg.icon
    });

    this.closeModal('edit-timeblock-modal');

    if (window.showToast) {
      window.showToast(`Updated "${title}"`, 'success');
    }

    this.renderAll();
  },

  promptDelete(blockId) {
    const blocks = StorageService.getTimeblocks();
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    this.blockToDeleteId = blockId;
    const placeholder = document.getElementById('delete-tb-title-placeholder');
    if (placeholder) placeholder.textContent = `"${block.title}"`;

    this.openModal('confirm-delete-block-modal');
  },

  executeDelete() {
    if (!this.blockToDeleteId) return;

    const deleted = StorageService.deleteTimeblock(this.blockToDeleteId);
    this.closeModal('confirm-delete-block-modal');

    if (deleted && window.showToast) {
      window.showToast('Time block deleted successfully', 'info');
    }

    this.blockToDeleteId = null;
    this.renderAll();
  },

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('show');
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('show');
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
  }
};

window.Planner = Planner;

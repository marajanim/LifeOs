/**
 * LifeOS — Calendar & Deadlines Module (Step 6)
 * Handles Month Grid View, Date Selection, Event Type Indicators,
 * Selected Day Commitments, Next 7 Days Upcoming Section, and Event CRUD Modals.
 */

const Calendar = {
  currentYear: 2024,
  currentMonth: 3, // 0-indexed: 3 = April
  selectedDate: '2024-04-23', // YYYY-MM-DD
  activeView: 'month', // 'month' | 'upcoming'
  selectedEventId: null,

  monthNames: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ],

  dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

  typeConfig: {
    'Task': { color: '#2563eb', bg: '#eff6ff', label: 'Task' },
    'Project': { color: '#7c3aed', bg: '#f5f3ff', label: 'Project' },
    'Learning': { color: '#059669', bg: '#ecfdf5', label: 'Learning' },
    'Money': { color: '#0d9488', bg: '#f0fdfa', label: 'Money' },
    'Reminder': { color: '#d97706', bg: '#fffbeb', label: 'Reminder' },
    'Other': { color: '#ec4899', bg: '#fdf2f8', label: 'Other' }
  },

  init() {
    this.bindEvents();
    this.render();
  },

  bindEvents() {
    if (this._eventsBound) return;
    this._eventsBound = true;

    // Month Navigation
    const prevBtn = document.getElementById('calendar-prev-month');
    const nextBtn = document.getElementById('calendar-next-month');
    if (prevBtn) prevBtn.addEventListener('click', () => this.changeMonth(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => this.changeMonth(1));

    // View toggles: Month vs Upcoming
    const monthViewBtn = document.getElementById('cal-view-month-btn');
    const upcomingViewBtn = document.getElementById('cal-view-upcoming-btn');
    if (monthViewBtn && upcomingViewBtn) {
      monthViewBtn.addEventListener('click', () => {
        this.activeView = 'month';
        monthViewBtn.classList.add('active');
        upcomingViewBtn.classList.remove('active');
        this.render();
      });

      upcomingViewBtn.addEventListener('click', () => {
        this.activeView = 'upcoming';
        upcomingViewBtn.classList.add('active');
        monthViewBtn.classList.remove('active');
        this.render();
      });
    }

    // Add Event Button
    const addEventBtn = document.getElementById('btn-add-calendar-event');
    if (addEventBtn) {
      addEventBtn.addEventListener('click', () => this.openCreateEventModal());
    }

    // Create Event Form
    const createEventForm = document.getElementById('create-calendar-event-form');
    if (createEventForm) {
      createEventForm.addEventListener('submit', (e) => this.handleCreateEvent(e));
    }

    // Quick Day Note Input
    const quickNoteInput = document.getElementById('cal-day-quick-note');
    if (quickNoteInput) {
      quickNoteInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && quickNoteInput.value.trim()) {
          this.handleQuickNoteAdd(quickNoteInput.value.trim());
          quickNoteInput.value = '';
        }
      });
    }

    // Escape key closes modals
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });
  },

  changeMonth(delta) {
    this.currentMonth += delta;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.render();
  },

  render() {
    this.renderMonthHeader();
    this.renderMonthGrid();
    this.renderSelectedDateEvents();
    this.renderUpcomingSection();

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  },

  renderMonthHeader() {
    const titleEl = document.getElementById('calendar-month-title');
    if (titleEl) {
      titleEl.textContent = `${this.monthNames[this.currentMonth]} ${this.currentYear}`;
    }
  },

  getAllEvents() {
    if (!window.StorageService) return [];
    const calEvents = window.StorageService.getCalendarEvents();
    return calEvents;
  },

  getEventsForDate(dateStr) {
    const events = this.getAllEvents();
    return events.filter(e => e.date === dateStr);
  },

  renderMonthGrid() {
    const gridContainer = document.getElementById('calendar-month-days-grid');
    if (!gridContainer) return;

    // Days in current month
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    // First day of current month (0 = Sun, 1 = Mon, etc.)
    const firstDayIndex = new Date(this.currentYear, this.currentMonth, 1).getDay();
    // Days in previous month
    const prevMonthDays = new Date(this.currentYear, this.currentMonth, 0).getDate();

    let html = '';

    // Day of week headers
    this.dayNames.forEach(name => {
      html += `<div class="cal-day-header">${name}</div>`;
    });

    // Previous month trailing days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      const prevMonth = this.currentMonth === 0 ? 11 : this.currentMonth - 1;
      const prevYear = this.currentMonth === 0 ? this.currentYear - 1 : this.currentYear;
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      html += `
        <div class="cal-day-cell other-month" onclick="Calendar.selectDate('${dateStr}')">
          <span class="cal-day-num">${dayNum}</span>
        </div>
      `;
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isSelected = dateStr === this.selectedDate;
      const dayEvents = this.getEventsForDate(dateStr);

      // Render small indicator dots for types (up to 4 distinct dots)
      let dotsHtml = '';
      if (dayEvents.length > 0) {
        const uniqueTypes = [...new Set(dayEvents.map(e => e.type))];
        dotsHtml = `
          <div class="cal-day-dots">
            ${uniqueTypes.slice(0, 4).map(type => {
              const conf = this.typeConfig[type] || this.typeConfig['Other'];
              return `<span class="cal-dot" style="background-color: ${conf.color};" title="${type}"></span>`;
            }).join('')}
          </div>
        `;
      }

      html += `
        <div class="cal-day-cell ${isSelected ? 'is-selected' : ''}" onclick="Calendar.selectDate('${dateStr}')" data-date="${dateStr}">
          <span class="cal-day-num">${d}</span>
          ${dotsHtml}
        </div>
      `;
    }

    // Next month leading days to complete grid (42 cells total: 7 cols * 6 rows)
    const totalRendered = firstDayIndex + daysInMonth;
    const remaining = (7 - (totalRendered % 7)) % 7;
    for (let n = 1; n <= (remaining > 0 ? remaining : 0); n++) {
      const nextMonth = this.currentMonth === 11 ? 0 : this.currentMonth + 1;
      const nextYear = this.currentMonth === 11 ? this.currentYear + 1 : this.currentYear;
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(n).padStart(2, '0')}`;
      html += `
        <div class="cal-day-cell other-month" onclick="Calendar.selectDate('${dateStr}')">
          <span class="cal-day-num">${n}</span>
        </div>
      `;
    }

    gridContainer.innerHTML = html;
  },

  selectDate(dateStr) {
    this.selectedDate = dateStr;

    // Update active highlight in DOM
    document.querySelectorAll('.cal-day-cell').forEach(cell => {
      if (cell.getAttribute('data-date') === dateStr) {
        cell.classList.add('is-selected');
      } else {
        cell.classList.remove('is-selected');
      }
    });

    this.renderSelectedDateEvents();
    if (window.lucide) window.lucide.createIcons();
  },

  formatDisplayDate(dateStr) {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
        const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];
        return `${dayName}, ${monthName} ${d.getDate()}, ${d.getFullYear()}`;
      }
    } catch (e) {
      console.error(e);
    }
    return dateStr;
  },

  renderSelectedDateEvents() {
    const titleEl = document.getElementById('cal-selected-date-heading');
    if (titleEl) {
      titleEl.textContent = this.formatDisplayDate(this.selectedDate);
    }

    const container = document.getElementById('cal-selected-events-list');
    if (!container) return;

    const events = this.getEventsForDate(this.selectedDate);

    if (events.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="padding: var(--space-6);">
          <div class="empty-state-icon-wrap" style="width: 42px; height: 42px;">
            <i data-lucide="calendar" style="width: 20px; height: 20px;"></i>
          </div>
          <div class="empty-state-title" style="font-size: 14px;">No commitments for this day</div>
          <div class="empty-state-desc" style="font-size: 12px;">Click "+ Add Event" above or write a quick note below.</div>
        </div>
      `;
      return;
    }

    container.innerHTML = events.map(ev => {
      const typeConf = this.typeConfig[ev.type] || this.typeConfig['Other'];
      const isDone = ev.completed;
      const prioClass = ev.priority === 'Critical' || ev.priority === 'High' ? 'badge-risk-critical' :
                        ev.priority === 'Medium' ? 'badge-risk-attention' : 'badge-risk-safe';

      return `
        <div class="cal-event-row ${isDone ? 'is-completed' : ''}" onclick="Calendar.openEventDetail('${ev.id}')">
          <input type="checkbox" class="task-checkbox" ${isDone ? 'checked' : ''} 
                 onclick="event.stopPropagation()" 
                 onchange="Calendar.toggleEvent('${ev.id}')">

          <div class="cal-event-time">${ev.time || 'All Day'}</div>

          <div class="cal-event-info">
            <div class="cal-event-title ${isDone ? 'completed-text' : ''}">${ev.title}</div>
            <div class="cal-event-context">${ev.area ? `${ev.area}` : ''}${ev.context ? ` · ${ev.context}` : ''}</div>
          </div>

          <div class="cal-event-meta">
            <span class="cal-type-pill" style="background-color: ${typeConf.bg}; color: ${typeConf.color};">
              <span class="cal-dot-sm" style="background-color: ${typeConf.color};"></span>
              <span>${ev.type}</span>
            </span>
            <span class="badge ${prioClass}" style="font-size: 11px; padding: 2px 7px;">${ev.priority || 'Normal'}</span>
          </div>

          <button class="btn-icon text-danger" title="Delete event" onclick="event.stopPropagation(); Calendar.deleteEvent('${ev.id}')" style="margin-left: 4px;">
            <i data-lucide="trash-2" style="width: 13px; height: 13px;"></i>
          </button>
        </div>
      `;
    }).join('');
  },

  renderUpcomingSection() {
    const todayCol = document.getElementById('cal-upcoming-today-col');
    const tomorrowCol = document.getElementById('cal-upcoming-tomorrow-col');
    const weekCol = document.getElementById('cal-upcoming-week-col');

    const allEvents = this.getAllEvents();

    const todayEvents = allEvents.filter(e => e.date === '2024-04-23');
    const tomorrowEvents = allEvents.filter(e => e.date === '2024-04-24');
    const weekEvents = allEvents.filter(e => e.date > '2024-04-24' && e.date <= '2024-04-30');

    const renderColumnItems = (list) => {
      if (!list || list.length === 0) {
        return '<div style="font-size: 12px; color: var(--color-text-muted); padding: var(--space-2);">No commitments</div>';
      }
      return list.map(ev => {
        const typeConf = this.typeConfig[ev.type] || this.typeConfig['Other'];
        const prioClass = ev.priority === 'Critical' || ev.priority === 'High' ? 'badge-risk-critical' :
                          ev.priority === 'Medium' ? 'badge-risk-attention' : 'badge-risk-safe';
        return `
          <div class="cal-upcoming-mini-row" onclick="Calendar.selectDate('${ev.date}')">
            <span class="cal-mini-time">${ev.dateDisplay && ev.date > '2024-04-24' ? ev.dateDisplay : (ev.time || '10:00 AM')}</span>
            <div class="cal-mini-content">
              <div class="cal-mini-title">${ev.title}</div>
              <div class="cal-mini-sub">${ev.area || 'General'}</div>
            </div>
            <div class="cal-mini-badges">
              <span class="cal-type-pill-sm" style="background-color: ${typeConf.bg}; color: ${typeConf.color};">
                <span class="cal-dot-xs" style="background-color: ${typeConf.color};"></span>
                <span>${ev.type}</span>
              </span>
              <span class="badge ${prioClass}" style="font-size: 10px; padding: 1px 5px;">${ev.priority}</span>
            </div>
          </div>
        `;
      }).join('');
    };

    if (todayCol) todayCol.innerHTML = renderColumnItems(todayEvents);
    if (tomorrowCol) tomorrowCol.innerHTML = renderColumnItems(tomorrowEvents);
    if (weekCol) weekCol.innerHTML = renderColumnItems(weekEvents);
  },

  toggleEvent(eventId) {
    if (!window.StorageService) return;
    window.StorageService.toggleCalendarEvent(eventId);
    this.renderSelectedDateEvents();
    if (window.showToast) window.showToast('Commitment status updated', 'info');
    if (window.lucide) window.lucide.createIcons();
  },

  deleteEvent(eventId) {
    if (!confirm('Are you sure you want to remove this commitment from your calendar?')) return;
    if (!window.StorageService) return;
    window.StorageService.deleteCalendarEvent(eventId);
    this.render();
    if (window.showToast) window.showToast('Event removed', 'warning');
  },

  handleQuickNoteAdd(noteText) {
    if (!window.StorageService) return;
    window.StorageService.addCalendarEvent({
      title: noteText,
      date: this.selectedDate,
      time: 'Flexible',
      type: 'Other',
      priority: 'Low',
      area: 'Personal',
      context: 'Quick note'
    });
    this.render();
    if (window.showToast) window.showToast('Note added for this date!', 'success');
  },

  openCreateEventModal() {
    const modal = document.getElementById('create-calendar-event-modal');
    if (!modal) return;
    const dateInput = document.getElementById('cal-new-event-date');
    if (dateInput) dateInput.value = this.selectedDate;
    modal.classList.add('open');
  },

  closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.classList.remove('open');
    });
  },

  handleCreateEvent(e) {
    e.preventDefault();
    const title = document.getElementById('cal-new-event-title').value.trim();
    if (!title) return;

    const date = document.getElementById('cal-new-event-date').value || this.selectedDate;
    const time = document.getElementById('cal-new-event-time').value.trim() || '10:00 AM';
    const type = document.getElementById('cal-new-event-type').value;
    const priority = document.getElementById('cal-new-event-priority').value;
    const area = document.getElementById('cal-new-event-area').value;
    const context = document.getElementById('cal-new-event-context').value.trim();

    window.StorageService.addCalendarEvent({
      title,
      date,
      time,
      type,
      priority,
      area,
      context
    });

    this.selectedDate = date;
    this.closeAllModals();
    e.target.reset();
    this.render();

    if (window.showToast) window.showToast(`Event "${title}" added!`, 'success');
  },

  openEventDetail(eventId) {
    const events = this.getAllEvents();
    const eventItem = events.find(e => e.id === eventId);
    if (!eventItem) return;

    alert(`Calendar Commitment:\n\nTitle: ${eventItem.title}\nDate: ${eventItem.date}\nTime: ${eventItem.time}\nType: ${eventItem.type}\nArea: ${eventItem.area || 'Personal'}\nPriority: ${eventItem.priority}`);
  }
};

window.Calendar = Calendar;

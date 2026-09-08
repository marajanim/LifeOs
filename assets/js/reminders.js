/**
 * LifeOS — Reminders & Notifications System (Steps 14 & 17)
 * Manages reminders, notification bell dropdown in header, repeat schedules,
 * notification badges, and in-app alerts.
 */

const Reminders = {
  init() {
    this.bindEvents();
    this.updateNotificationBadge();
    this.renderNotificationList();
  },

  bindEvents() {
    const notifBtn = document.getElementById('notification-btn');
    const notifDropdown = document.getElementById('notification-dropdown');

    if (notifBtn && !notifBtn.dataset.bound) {
      notifBtn.dataset.bound = 'true';
      notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleDropdown();
      });
    }

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (notifDropdown && !notifDropdown.contains(e.target) && notifBtn && !notifBtn.contains(e.target)) {
        notifDropdown.classList.remove('open');
      }
    });

    // Mark all as read button
    const markAllBtn = document.getElementById('notif-mark-all-read');
    if (markAllBtn && !markAllBtn.dataset.bound) {
      markAllBtn.dataset.bound = 'true';
      markAllBtn.addEventListener('click', () => {
        StorageService.markAllRemindersRead();
        this.updateNotificationBadge();
        this.renderNotificationList();
        window.LifeOS?.showToast?.('All notifications marked as read', 'info');
      });
    }

    // Create Reminder Form Submit
    const createForm = document.getElementById('create-reminder-form');
    if (createForm && !createForm.dataset.bound) {
      createForm.dataset.bound = 'true';
      createForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleCreateReminder();
      });
    }
  },

  toggleDropdown() {
    const dropdown = document.getElementById('notification-dropdown');
    if (!dropdown) return;
    const isOpen = dropdown.classList.contains('open');
    if (isOpen) {
      dropdown.classList.remove('open');
    } else {
      dropdown.classList.add('open');
      this.renderNotificationList();
    }
  },

  updateNotificationBadge() {
    const badge = document.getElementById('notification-badge');
    const unreadCount = StorageService.getUnreadRemindersCount();

    if (badge) {
      if (unreadCount > 0) {
        badge.style.display = 'block';
        badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
      } else {
        badge.style.display = 'none';
      }
    }
  },

  renderNotificationList() {
    const container = document.getElementById('notification-items-list');
    if (!container) return;

    const reminders = StorageService.getReminders();
    if (reminders.length === 0) {
      container.innerHTML = `
        <div style="padding: 24px; text-align: center; color: var(--color-text-secondary); font-size: 13px;">
          No active reminders.
        </div>
      `;
      return;
    }

    let html = '';
    reminders.forEach(rem => {
      let icon = 'bell';
      let iconColor = '#2563eb';
      let iconBg = '#eff6ff';

      if (rem.type === 'Money') {
        icon = 'wallet';
        iconColor = '#10b981';
        iconBg = '#ecfdf5';
      } else if (rem.type === 'Deadline') {
        icon = 'clock';
        iconColor = '#ef4444';
        iconBg = '#fef2f2';
      } else if (rem.type === 'Follow-up') {
        icon = 'user-check';
        iconColor = '#8b5cf6';
        iconBg = '#f5f3ff';
      }

      html += `
        <div class="notification-item ${rem.unread ? 'unread' : ''}" onclick="Reminders.handleClickReminder('${rem.id}')">
          <div class="notif-icon-box" style="background-color: ${iconBg}; color: ${iconColor};">
            <i data-lucide="${icon}" style="width: 16px; height: 16px;"></i>
          </div>
          <div class="notif-text-box">
            <div class="notif-title-row">
              <span class="notif-title">${rem.title}</span>
              ${rem.unread ? `<span class="notif-unread-dot"></span>` : ''}
            </div>
            <p class="notif-desc">${rem.description || ''}</p>
            <div class="notif-meta-row">
              <span>${rem.dateDisplay || rem.date} • ${rem.time || ''}</span>
              ${rem.repeat && rem.repeat !== 'None' ? `<span class="badge badge-sm badge-gray" style="font-size: 10px;">${rem.repeat}</span>` : ''}
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  },

  handleClickReminder(id) {
    const rem = StorageService.getReminderById(id);
    if (!rem) return;

    StorageService.markReminderRead(id);
    this.updateNotificationBadge();
    this.renderNotificationList();

    // Navigate to related area if applicable
    if (rem.type === 'Money') {
      window.location.hash = 'money';
    } else if (rem.type === 'Deadline') {
      window.location.hash = 'calendar';
    } else if (rem.type === 'Task') {
      window.location.hash = 'tasks';
    }

    const dropdown = document.getElementById('notification-dropdown');
    if (dropdown) dropdown.classList.remove('open');
  },

  openAddReminderModal() {
    const form = document.getElementById('create-reminder-form');
    if (form) form.reset();
    window.LifeOS?.openModal?.('create-reminder-modal');
  },

  handleCreateReminder() {
    const title = document.getElementById('new-rem-title')?.value.trim();
    if (!title) return;

    const date = document.getElementById('new-rem-date')?.value || new Date().toISOString().split('T')[0];
    const time = document.getElementById('new-rem-time')?.value || '10:00 AM';
    const type = document.getElementById('new-rem-type')?.value || 'Custom';
    const repeat = document.getElementById('new-rem-repeat')?.value || 'None';
    const priority = document.getElementById('new-rem-priority')?.value || 'Medium';
    const description = document.getElementById('new-rem-desc')?.value.trim() || '';

    let dateDisplay = date;
    const d = new Date(date);
    if (!isNaN(d.getTime())) {
      dateDisplay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    StorageService.addReminder({
      title,
      description,
      date,
      dateDisplay,
      time,
      type,
      repeat,
      priority,
      status: 'Active'
    });

    window.LifeOS?.closeModal?.('create-reminder-modal');
    window.LifeOS?.showToast?.(`Reminder set: "${title}"`, 'success');

    this.updateNotificationBadge();
    this.renderNotificationList();
  }
};

window.Reminders = Reminders;

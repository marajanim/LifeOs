/**
 * LifeOS — Settings Module (Step 18 & 19)
 * Manages user profile, work preferences, life areas, currency/finance preferences,
 * notification options, theme/dark mode toggling, JSON data export/import, and data reset.
 */

const Settings = {
  init() {
    this.renderSettings();
    this.renderAreas();
    this.bindEvents();
    this.applyThemeFromStorage();
  },

  applyThemeFromStorage() {
    const settings = StorageService.getSettings();
    const theme = settings?.appearance?.theme || localStorage.getItem('lifeos_theme') || 'light';
    this.applyTheme(theme, false);
  },

  applyTheme(theme, save = true) {
    const html = document.documentElement;
    let effectiveTheme = theme;

    if (theme === 'system') {
      const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      effectiveTheme = isDark ? 'dark' : 'light';
    }

    if (effectiveTheme === 'dark') {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
    }

    // Update active button state
    document.querySelectorAll('.theme-option-btn').forEach(btn => {
      const btnTheme = btn.getAttribute('data-theme');
      if (btnTheme === theme) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (save) {
      localStorage.setItem('lifeos_theme', theme);
      StorageService.updateSettings({ appearance: { theme } });
      window.LifeOS?.showToast?.(`Theme changed to ${theme}`, 'info');
    }
  },

  bindEvents() {
    // 1. Profile Form Submit
    const profileForm = document.getElementById('settings-profile-form');
    if (profileForm && !profileForm.dataset.bound) {
      profileForm.dataset.bound = 'true';
      profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('setting-name')?.value.trim() || 'Anim';
        const greetingName = document.getElementById('setting-greeting')?.value.trim() || 'Anim';
        const tagline = document.getElementById('setting-tagline')?.value.trim() || '';

        StorageService.updateSettings({
          profile: { name, greetingName, tagline }
        });

        // Update UI greetings live
        const avatarEls = document.querySelectorAll('.header-user-avatar, .sidebar-avatar');
        avatarEls.forEach(el => {
          el.textContent = name.charAt(0).toUpperCase();
        });

        const sidebarName = document.querySelector('.sidebar-user-name');
        if (sidebarName) sidebarName.textContent = name;

        window.LifeOS?.showToast?.('Profile updated successfully', 'success');
      });
    }

    // 2. Work Preferences Form Submit
    const workForm = document.getElementById('settings-work-form');
    if (workForm && !workForm.dataset.bound) {
      workForm.dataset.bound = 'true';
      workForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const startTime = document.getElementById('setting-work-start')?.value || '09:00';
        const endTime = document.getElementById('setting-work-end')?.value || '18:00';
        const dailyHours = parseFloat(document.getElementById('setting-work-hours')?.value) || 8;

        StorageService.updateSettings({
          work: { startTime, endTime, dailyHours }
        });

        window.LifeOS?.showToast?.('Work preferences saved', 'success');
      });
    }

    // 3. Finance Preferences Form Submit
    const financeForm = document.getElementById('settings-finance-form');
    if (financeForm && !financeForm.dataset.bound) {
      financeForm.dataset.bound = 'true';
      financeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const currency = document.getElementById('setting-currency')?.value || 'BDT';
        const monthlyBudget = parseFloat(document.getElementById('setting-monthly-budget')?.value) || 45000;
        const savingsTarget = parseFloat(document.getElementById('setting-savings-target')?.value) || 15000;

        let currencySymbol = '৳';
        if (currency === 'USD') currencySymbol = '$';
        if (currency === 'EUR') currencySymbol = '€';
        if (currency === 'GBP') currencySymbol = '£';

        StorageService.updateSettings({
          finance: { currency, currencySymbol, monthlyBudget, savingsTarget }
        });

        window.LifeOS?.showToast?.('Finance settings updated', 'success');
      });
    }

    // 4. Notification Toggles
    const notifInputs = ['notif-opt-deadlines', 'notif-opt-finance', 'notif-opt-review', 'notif-opt-planner'];
    notifInputs.forEach(id => {
      const el = document.getElementById(id);
      if (el && !el.dataset.bound) {
        el.dataset.bound = 'true';
        el.addEventListener('change', () => {
          StorageService.updateSettings({
            notifications: {
              deadlines: document.getElementById('notif-opt-deadlines')?.checked ?? true,
              finance: document.getElementById('notif-opt-finance')?.checked ?? true,
              weeklyReview: document.getElementById('notif-opt-review')?.checked ?? true,
              dailyPlanner: document.getElementById('notif-opt-planner')?.checked ?? true
            }
          });
          window.LifeOS?.showToast?.('Notification preferences saved', 'info');
        });
      }
    });

    // 5. Theme option buttons
    document.querySelectorAll('.theme-option-btn').forEach(btn => {
      if (!btn.dataset.bound) {
        btn.dataset.bound = 'true';
        btn.addEventListener('click', () => {
          const theme = btn.getAttribute('data-theme');
          this.applyTheme(theme, true);
        });
      }
    });

    // 6. Add Area Form
    const addAreaForm = document.getElementById('settings-add-area-form');
    if (addAreaForm && !addAreaForm.dataset.bound) {
      addAreaForm.dataset.bound = 'true';
      addAreaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('new-area-name');
        const colorInput = document.getElementById('new-area-color');
        const name = nameInput?.value.trim();
        const color = colorInput?.value || '#2563eb';

        if (!name) return;

        StorageService.addArea({ name, color });
        if (nameInput) nameInput.value = '';
        this.renderAreas();
        window.LifeOS?.showToast?.(`Area "${name}" added`, 'success');
      });
    }

    // 7. Data Export Button
    const exportBtn = document.getElementById('btn-export-data');
    if (exportBtn && !exportBtn.dataset.bound) {
      exportBtn.dataset.bound = 'true';
      exportBtn.addEventListener('click', () => {
        this.handleExportData();
      });
    }

    // 8. Data Import Button & File Input
    const importBtn = document.getElementById('btn-import-data');
    const importFileInput = document.getElementById('import-file-input');
    if (importBtn && importFileInput && !importBtn.dataset.bound) {
      importBtn.dataset.bound = 'true';
      importBtn.addEventListener('click', () => {
        importFileInput.click();
      });
      importFileInput.addEventListener('change', (e) => {
        this.handleImportFile(e);
      });
    }

    // 9. Reset Data Button
    const resetBtn = document.getElementById('btn-reset-data');
    if (resetBtn && !resetBtn.dataset.bound) {
      resetBtn.dataset.bound = 'true';
      resetBtn.addEventListener('click', () => {
        window.LifeOS?.openModal?.('confirm-reset-data-modal');
      });
    }

    // 10. Confirm Reset Button in Modal
    const confirmResetBtn = document.getElementById('btn-confirm-reset-data');
    if (confirmResetBtn && !confirmResetBtn.dataset.bound) {
      confirmResetBtn.dataset.bound = 'true';
      confirmResetBtn.addEventListener('click', () => {
        this.handleResetAllData();
      });
    }
  },

  renderSettings() {
    const settings = StorageService.getSettings();
    if (!settings) return;

    // Profile
    const nameEl = document.getElementById('setting-name');
    const greetingEl = document.getElementById('setting-greeting');
    const taglineEl = document.getElementById('setting-tagline');
    if (nameEl && settings.profile) nameEl.value = settings.profile.name || 'Anim';
    if (greetingEl && settings.profile) greetingEl.value = settings.profile.greetingName || 'Anim';
    if (taglineEl && settings.profile) taglineEl.value = settings.profile.tagline || '';

    // Work
    const startEl = document.getElementById('setting-work-start');
    const endEl = document.getElementById('setting-work-end');
    const hoursEl = document.getElementById('setting-work-hours');
    if (startEl && settings.work) startEl.value = settings.work.startTime || '09:00';
    if (endEl && settings.work) endEl.value = settings.work.endTime || '18:00';
    if (hoursEl && settings.work) hoursEl.value = settings.work.dailyHours || 8;

    // Finance
    const currEl = document.getElementById('setting-currency');
    const budgetEl = document.getElementById('setting-monthly-budget');
    const savingsEl = document.getElementById('setting-savings-target');
    if (currEl && settings.finance) currEl.value = settings.finance.currency || 'BDT';
    if (budgetEl && settings.finance) budgetEl.value = settings.finance.monthlyBudget || 45000;
    if (savingsEl && settings.finance) savingsEl.value = settings.finance.savingsTarget || 15000;

    // Notifications
    if (settings.notifications) {
      const dEl = document.getElementById('notif-opt-deadlines');
      const fEl = document.getElementById('notif-opt-finance');
      const rEl = document.getElementById('notif-opt-review');
      const pEl = document.getElementById('notif-opt-planner');
      if (dEl) dEl.checked = settings.notifications.deadlines ?? true;
      if (fEl) fEl.checked = settings.notifications.finance ?? true;
      if (rEl) rEl.checked = settings.notifications.weeklyReview ?? true;
      if (pEl) pEl.checked = settings.notifications.dailyPlanner ?? true;
    }

    // Appearance Theme
    const activeTheme = settings.appearance?.theme || localStorage.getItem('lifeos_theme') || 'light';
    document.querySelectorAll('.theme-option-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-theme') === activeTheme);
    });
  },

  renderAreas() {
    const container = document.getElementById('settings-areas-list');
    if (!container) return;

    const areas = StorageService.getAreas();
    if (areas.length === 0) {
      container.innerHTML = '<div style="color: var(--color-text-secondary); font-size: 13px;">No areas found.</div>';
      return;
    }

    let html = '';
    areas.forEach(area => {
      html += `
        <div class="settings-area-row">
          <div class="settings-area-info">
            <span class="settings-area-dot" style="background-color: ${area.color || '#2563eb'};"></span>
            <span class="settings-area-name">${area.name}</span>
            <span class="badge badge-sm badge-gray">${area.icon || 'tag'}</span>
          </div>
          <button type="button" class="btn-icon-subtle" title="Delete area" onclick="Settings.deleteArea('${area.id}', '${area.name}')">
            <i data-lucide="trash-2" style="width: 14px; height: 14px; color: var(--color-danger);"></i>
          </button>
        </div>
      `;
    });

    container.innerHTML = html;
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  },

  deleteArea(id, name) {
    if (confirm(`Remove area "${name}"? Existing tasks will retain their area tag.`)) {
      StorageService.deleteArea(id);
      this.renderAreas();
      window.LifeOS?.showToast?.(`Area "${name}" removed`, 'info');
    }
  },

  handleExportData() {
    const jsonStr = StorageService.exportAllData();
    const dateStr = new Date().toISOString().split('T')[0];
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lifeos_backup_${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    window.LifeOS?.showToast?.('JSON backup exported and downloaded', 'success');
  },

  handleImportFile(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const success = StorageService.importAllData(content);
        if (success) {
          window.LifeOS?.showToast?.('Backup successfully restored! Reloading...', 'success');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          window.LifeOS?.showToast?.('Failed to import: Invalid JSON structure', 'danger');
        }
      } catch (err) {
        console.error('Import error:', err);
        window.LifeOS?.showToast?.('Failed to read file', 'danger');
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  },

  handleResetAllData() {
    StorageService.clearAllData();
    window.LifeOS?.closeModal?.('confirm-reset-data-modal');
    window.LifeOS?.showToast?.('All data cleared. Restoring defaults...', 'warning');
    setTimeout(() => {
      window.location.reload();
    }, 800);
  }
};

window.Settings = Settings;

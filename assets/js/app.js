/**
 * LifeOS — Core Application Scripts
 * Handles UI interactions: Dropdowns, Modals, Toast Notifications,
 * Keyboard shortcuts, and Lucide Icon Initialization.
 */

// ==========================================================================
// Toast Notification Manager
// ==========================================================================
const LifeOSToast = {
  container: null,

  init() {
    this.container = document.getElementById('toast-container');
  },

  show(message, type = 'info', duration = 3500) {
    if (!this.container) {
      this.container = document.getElementById('toast-container');
      if (!this.container) return;
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconName = 'info';
    if (type === 'success') iconName = 'check-circle';
    if (type === 'warning') iconName = 'alert-triangle';
    if (type === 'danger') iconName = 'alert-circle';

    toast.innerHTML = `
      <i data-lucide="${iconName}" class="toast-icon"></i>
      <div class="toast-message">${message}</div>
      <button class="toast-close" aria-label="Dismiss notification">
        <i data-lucide="x" style="width: 14px; height: 14px;"></i>
      </button>
    `;

    this.container.appendChild(toast);

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons({ root: toast });
    }

    const closeBtn = toast.querySelector('.toast-close');
    const dismissToast = () => {
      toast.classList.add('toast-hiding');
      setTimeout(() => {
        if (toast.parentElement) toast.remove();
      }, 150);
    };

    if (closeBtn) {
      closeBtn.addEventListener('click', dismissToast);
    }

    setTimeout(dismissToast, duration);
  }
};

// ==========================================================================
// Modal Dialog Manager
// ==========================================================================
const LifeOSModal = {
  activeModal: null,

  open(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('show');
    this.activeModal = modal;
    document.body.style.overflow = 'hidden';

    // Refresh icons inside modal
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons({ root: modal });
    }
  },

  close(modalId) {
    const modal = modalId ? document.getElementById(modalId) : this.activeModal;
    if (!modal) return;
    modal.classList.remove('show');
    this.activeModal = null;
    document.body.style.overflow = '';
  },

  init() {
    // Backdrop clicks close modal
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.close(modal.id);
        }
      });

      // Close buttons
      const closeButtons = modal.querySelectorAll('[data-dismiss="modal"]');
      closeButtons.forEach(btn => {
        btn.addEventListener('click', () => this.close(modal.id));
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.close();
      }
    });
  }
};

// ==========================================================================
// Dropdowns & Global Interactions
// ==========================================================================
const LifeOSApp = {
  init() {
    LifeOSToast.init();
    LifeOSModal.init();
    this.bindDropdowns();
    this.bindQuickAddItems();
    this.bindKeyboardShortcuts();

    // Initialize Navigation Router
    if (window.Navigation) {
      window.Navigation.init();
    }

    // Initialize Reminders & Notifications
    if (window.Reminders) {
      window.Reminders.init();
    }

    // Initialize Global Search & Command Center
    if (window.GlobalSearch) {
      window.GlobalSearch.init();
    }

    // Apply Saved Theme
    if (window.Settings) {
      window.Settings.applyThemeFromStorage();
    }

    // Initialize Lucide Icons
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  },

  bindDropdowns() {
    const quickAddBtn = document.getElementById('quick-add-btn');
    const quickAddDropdown = document.getElementById('quick-add-dropdown');

    const toggleDropdown = (menu) => {
      const isVisible = menu.classList.contains('show');
      this.closeAllDropdowns();
      if (!isVisible) {
        menu.classList.add('show');
      }
    };

    if (quickAddBtn && quickAddDropdown) {
      quickAddBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown(quickAddDropdown);
      });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.dropdown-wrapper')) {
        this.closeAllDropdowns();
      }
    });

    // Close dropdowns on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllDropdowns();
      }
    });
  },

  closeAllDropdowns() {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
      menu.classList.remove('show');
    });
  },

  bindQuickAddItems() {
    document.querySelectorAll('#quick-add-dropdown .dropdown-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const actionType = item.getAttribute('data-type');
        this.closeAllDropdowns();

        if (actionType === 'task') {
          LifeOSModal.open('create-task-modal');
        } else if (actionType === 'expense') {
          if (window.Finance?.openAddTransactionModal) {
            window.Finance.openAddTransactionModal('expense');
          } else {
            LifeOSModal.open('add-transaction-modal');
          }
        } else if (actionType === 'income') {
          if (window.Finance?.openAddTransactionModal) {
            window.Finance.openAddTransactionModal('income');
          } else {
            LifeOSModal.open('add-transaction-modal');
          }
        } else if (actionType === 'money_lent') {
          if (window.Finance?.openAddReceivableModal) {
            window.Finance.openAddReceivableModal();
          } else {
            window.location.hash = 'money';
          }
        } else if (actionType === 'reminder') {
          if (window.Reminders?.openAddReminderModal) {
            window.Reminders.openAddReminderModal();
          }
        } else if (actionType === 'idea') {
          if (window.Ideas?.openCreateModal) {
            window.Ideas.openCreateModal();
          } else {
            window.location.hash = 'ideas';
          }
        }
      });
    });
  },

  bindKeyboardShortcuts() {
    // Search input click opens Global Search
    const searchInput = document.getElementById('global-search-input');
    if (searchInput) {
      searchInput.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.GlobalSearch) {
          window.GlobalSearch.open();
        }
      });
      searchInput.addEventListener('focus', (e) => {
        e.preventDefault();
        searchInput.blur();
        if (window.GlobalSearch) {
          window.GlobalSearch.open();
        }
      });
    }

    let gKeyPressed = false;
    let gTimeout = null;

    document.addEventListener('keydown', (e) => {
      // Ignore if user is inside an input, textarea, select, or contenteditable
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      const isInput = activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select' || document.activeElement?.isContentEditable;

      // Ctrl+K / Cmd+K -> Open Global Search Command Center
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        if (window.GlobalSearch) {
          window.GlobalSearch.open();
        }
        return;
      }

      if (isInput) return;

      // 'q' or 'Q' -> Toggle Quick Add
      if (e.key.toLowerCase() === 'q' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        const quickAddDropdown = document.getElementById('quick-add-dropdown');
        if (quickAddDropdown) {
          quickAddDropdown.classList.toggle('show');
        }
        return;
      }

      // 'g' sequence handling
      if (e.key.toLowerCase() === 'g' && !e.ctrlKey && !e.metaKey) {
        gKeyPressed = true;
        clearTimeout(gTimeout);
        gTimeout = setTimeout(() => { gKeyPressed = false; }, 1200);
        return;
      }

      if (gKeyPressed) {
        gKeyPressed = false;
        clearTimeout(gTimeout);
        const k = e.key.toLowerCase();
        if (k === 'd') window.location.hash = 'dashboard';
        else if (k === 't') window.location.hash = 'tasks';
        else if (k === 'p') window.location.hash = 'planner';
        else if (k === 'm') window.location.hash = 'money';
        else if (k === 'r') window.location.hash = 'review';
        else if (k === 's') window.location.hash = 'settings';
        else if (k === 'i') window.location.hash = 'inbox';
        else if (k === 'l') window.location.hash = 'learning';
        else if (k === 'c') window.location.hash = 'calendar';
        else if (k === 'e') window.location.hash = 'ideas';
        else if (k === 'j') window.location.hash = 'projects';
      }
    });
  }
};

// Global Exposure
window.LifeOSToast = LifeOSToast;
window.LifeOSModal = LifeOSModal;
window.LifeOSApp = LifeOSApp;
window.showToast = (msg, type) => LifeOSToast.show(msg, type);

window.LifeOS = {
  showToast: (msg, type) => LifeOSToast.show(msg, type),
  openModal: (id) => LifeOSModal.open(id),
  closeModal: (id) => LifeOSModal.close(id)
};

// Auto-boot on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  LifeOSApp.init();
});

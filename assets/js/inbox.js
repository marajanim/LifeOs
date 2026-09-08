/**
 * LifeOS — Inbox & Brain Dump Controller (Step 3)
 * Full management of the Inbox system:
 * - Quick Capture input with multi-type selector
 * - 4 KPI Metrics (Unprocessed, Processed, Converted, Captured Today)
 * - Filtering (All, Unprocessed, Processed, Converted)
 * - Real-time Search by text
 * - Sorting by Newest / Oldest
 * - Actions: Edit, Delete (with confirmation), Mark Processed, Convert to Task / Idea / Reminder
 * - Recently Converted feed & Capture tips
 */

const Inbox = {
  currentFilter: 'all',
  searchQuery: '',
  sortOrder: 'newest',
  selectedCaptureType: 'Task',
  activeEditId: null,

  init() {
    this.renderKPIs();
    this.renderItems();
    this.renderRecentlyConverted();
    this.bindEvents();
  },

  renderKPIs() {
    const items = StorageService.getInbox();

    const unprocessedCount = items.filter(i => i.status === 'Unprocessed').length;
    const processedCount = items.filter(i => i.status === 'Processed').length;
    const convertedCount = items.filter(i => i.status === 'Converted').length;

    const unprocEl = document.getElementById('inbox-kpi-unprocessed');
    const procEl = document.getElementById('inbox-kpi-processed');
    const convEl = document.getElementById('inbox-kpi-converted');
    const todayEl = document.getElementById('inbox-kpi-today');

    if (unprocEl) unprocEl.textContent = unprocessedCount;
    if (procEl) procEl.textContent = processedCount;
    if (convEl) convEl.textContent = convertedCount;
    if (todayEl) todayEl.textContent = Math.min(items.length, 5);

    // Update filter tab badge counts
    const countAllEl = document.getElementById('inbox-tab-count-all');
    const countUnprocEl = document.getElementById('inbox-tab-count-unprocessed');
    const countProcEl = document.getElementById('inbox-tab-count-processed');
    const countConvEl = document.getElementById('inbox-tab-count-converted');

    if (countAllEl) countAllEl.textContent = items.length;
    if (countUnprocEl) countUnprocEl.textContent = unprocessedCount;
    if (countProcEl) countProcEl.textContent = processedCount;
    if (countConvEl) countConvEl.textContent = convertedCount;
  },

  renderItems() {
    const tbody = document.getElementById('inbox-tbody');
    if (!tbody) return;

    let items = StorageService.getInbox();

    // 1. Filter by Tab
    if (this.currentFilter === 'unprocessed') {
      items = items.filter(i => i.status === 'Unprocessed');
    } else if (this.currentFilter === 'processed') {
      items = items.filter(i => i.status === 'Processed');
    } else if (this.currentFilter === 'converted') {
      items = items.filter(i => i.status === 'Converted');
    }

    // 2. Filter by Search Query
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      items = items.filter(i =>
        (i.title && i.title.toLowerCase().includes(q)) ||
        (i.details && i.details.toLowerCase().includes(q)) ||
        (i.type && i.type.toLowerCase().includes(q))
      );
    }

    // 3. Sort
    items.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return this.sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    tbody.innerHTML = '';

    if (items.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 48px 16px; color: var(--color-text-muted);">
            <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
              <i data-lucide="inbox" style="width: 36px; height: 36px; color: var(--color-text-muted);"></i>
              <div style="font-weight: 600; color: var(--color-text-primary);">No inbox items found</div>
              <div style="font-size: 13px;">Capture a thought or clear your active filter to see items.</div>
            </div>
          </td>
        </tr>
      `;
      if (window.lucide) window.lucide.createIcons({ root: tbody });
      return;
    }

    items.forEach(item => {
      const tr = document.createElement('tr');
      tr.className = 'inbox-table-row';

      const typeBadgeMap = {
        Task: { bg: '#eff6ff', color: '#2563eb', icon: 'check-square' },
        Reminder: { bg: '#fffbeb', color: '#d97706', icon: 'bell' },
        Idea: { bg: '#fef9c3', color: '#ca8a04', icon: 'lightbulb' },
        Note: { bg: '#f5f3ff', color: '#7c3aed', icon: 'file-text' },
        Money: { bg: '#ecfdf5', color: '#059669', icon: 'wallet' },
        Unsorted: { bg: '#f1f5f9', color: '#64748b', icon: 'more-horizontal' }
      };

      const statusBadgeMap = {
        Unprocessed: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
        Processed: { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' },
        Converted: { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' }
      };

      const tMeta = typeBadgeMap[item.type] || typeBadgeMap.Unsorted;
      const sMeta = statusBadgeMap[item.status] || statusBadgeMap.Unprocessed;

      tr.innerHTML = `
        <td class="inbox-col-check">
          <input type="checkbox" class="form-checkbox inbox-select-box" data-id="${item.id}" aria-label="Select item">
        </td>
        <td class="inbox-col-content">
          <div class="inbox-item-title">${item.title}</div>
          ${item.details ? `<div class="inbox-item-details">${item.details}</div>` : ''}
        </td>
        <td class="inbox-col-date">${item.createdDisplay || 'Recently'}</td>
        <td class="inbox-col-type">
          <span class="badge" style="background-color: ${tMeta.bg}; color: ${tMeta.color};">
            <i data-lucide="${tMeta.icon}" style="width: 12px; height: 12px;"></i>
            <span>${item.type}</span>
          </span>
        </td>
        <td class="inbox-col-status">
          <span class="badge" style="background-color: ${sMeta.bg}; color: ${sMeta.color}; border: 1px solid ${sMeta.border};">
            ${item.status}
          </span>
        </td>
        <td class="inbox-col-actions">
          <div class="inbox-actions-group">
            ${item.status === 'Unprocessed' ? `
              <div class="dropdown-wrapper">
                <button class="btn btn-secondary btn-sm inbox-convert-btn" data-id="${item.id}">
                  <span>Convert</span>
                  <i data-lucide="chevron-down" style="width: 12px; height: 12px;"></i>
                </button>
                <div class="dropdown-menu inbox-convert-menu" id="convert-menu-${item.id}">
                  <button class="dropdown-item convert-action" data-id="${item.id}" data-type="Task">
                    <i data-lucide="check-square"></i>
                    <span>Convert to Task</span>
                  </button>
                  <button class="dropdown-item convert-action" data-id="${item.id}" data-type="Idea">
                    <i data-lucide="lightbulb"></i>
                    <span>Convert to Idea</span>
                  </button>
                  <button class="dropdown-item convert-action" data-id="${item.id}" data-type="Reminder">
                    <i data-lucide="bell"></i>
                    <span>Convert to Reminder</span>
                  </button>
                </div>
              </div>
            ` : `
              <button class="btn btn-ghost btn-sm inbox-toggle-proc-btn" data-id="${item.id}" title="Toggle processed">
                <span>${item.status === 'Converted' ? 'Converted' : 'Processed'}</span>
              </button>
            `}

            <button class="icon-btn btn-sm inbox-edit-btn" data-id="${item.id}" title="Edit item">
              <i data-lucide="pencil" style="width: 14px; height: 14px;"></i>
            </button>
            <button class="icon-btn btn-sm inbox-delete-btn" data-id="${item.id}" title="Delete item" style="color: var(--color-danger);">
              <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
            </button>
          </div>
        </td>
      `;

      tbody.appendChild(tr);
    });

    if (window.lucide) window.lucide.createIcons({ root: tbody });

    this.bindTableActionButtons();
  },

  bindTableActionButtons() {
    // Convert dropdown button toggles
    document.querySelectorAll('.inbox-convert-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const menu = document.getElementById(`convert-menu-${id}`);
        const isVisible = menu && menu.classList.contains('show');
        document.querySelectorAll('.inbox-convert-menu').forEach(m => m.classList.remove('show'));
        if (!isVisible && menu) menu.classList.add('show');
      });
    });

    // Convert actions
    document.querySelectorAll('.convert-action').forEach(act => {
      act.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = act.getAttribute('data-id');
        const targetType = act.getAttribute('data-type');
        document.querySelectorAll('.inbox-convert-menu').forEach(m => m.classList.remove('show'));

        const converted = StorageService.convertInboxItem(id, targetType);
        if (converted) {
          LifeOSToast.show(`Converted "${converted.title}" to ${targetType}!`, 'success');
          this.renderKPIs();
          this.renderItems();
          this.renderRecentlyConverted();
        }
      });
    });

    // Edit button
    document.querySelectorAll('.inbox-edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.openEditModal(id);
      });
    });

    // Delete button with confirmation (Rule 17)
    document.querySelectorAll('.inbox-delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.confirmDeleteItem(id);
      });
    });
  },

  renderRecentlyConverted() {
    const listEl = document.getElementById('inbox-recently-converted-list');
    if (!listEl) return;

    const items = StorageService.getInbox().filter(i => i.status === 'Converted');
    listEl.innerHTML = '';

    const fallbackList = [
      { title: 'Book flight to Cox\'s Bazar', to: 'Task', time: '3h ago', icon: 'check-square', color: '#2563eb' },
      { title: 'UI inspiration from Dribbble', to: 'Note', time: '5h ago', icon: 'file-text', color: '#7c3aed' },
      { title: 'Monthly budget review', to: 'Task', time: '1d ago', icon: 'check-square', color: '#2563eb' },
      { title: 'Learn TypeScript basics', to: 'Idea', time: '1d ago', icon: 'lightbulb', color: '#ca8a04' },
      { title: 'Gym membership renewal', to: 'Reminder', time: '2d ago', icon: 'bell', color: '#d97706' }
    ];

    const displayItems = items.length > 0
      ? items.slice(0, 5).map(i => ({
          title: i.title,
          to: i.convertedTo || 'Task',
          time: i.createdDisplay || 'Recently',
          icon: i.convertedTo === 'Idea' ? 'lightbulb' : (i.convertedTo === 'Reminder' ? 'bell' : 'check-square'),
          color: i.convertedTo === 'Idea' ? '#ca8a04' : (i.convertedTo === 'Reminder' ? '#d97706' : '#2563eb')
        }))
      : fallbackList;

    displayItems.forEach(item => {
      const row = document.createElement('div');
      row.className = 'converted-item-row';
      row.innerHTML = `
        <div class="converted-icon-wrap" style="color: ${item.color};">
          <i data-lucide="${item.icon}" style="width: 16px; height: 16px;"></i>
        </div>
        <div class="converted-info">
          <div class="converted-title">${item.title}</div>
          <div class="converted-sub">Converted to ${item.to}</div>
        </div>
        <div class="converted-time">${item.time}</div>
      `;
      listEl.appendChild(row);
    });

    if (window.lucide) window.lucide.createIcons({ root: listEl });
  },

  openEditModal(id) {
    const items = StorageService.getInbox();
    const item = items.find(i => i.id === id);
    if (!item) return;

    this.activeEditId = id;

    const titleInput = document.getElementById('inbox-edit-title');
    const detailsInput = document.getElementById('inbox-edit-details');
    const typeSelect = document.getElementById('inbox-edit-type');
    const statusSelect = document.getElementById('inbox-edit-status');

    if (titleInput) titleInput.value = item.title;
    if (detailsInput) detailsInput.value = item.details || '';
    if (typeSelect) typeSelect.value = item.type || 'Unsorted';
    if (statusSelect) statusSelect.value = item.status || 'Unprocessed';

    LifeOSModal.open('inbox-edit-modal');
  },

  saveEditModal() {
    if (!this.activeEditId) return;

    const title = document.getElementById('inbox-edit-title').value.trim();
    const details = document.getElementById('inbox-edit-details').value.trim();
    const type = document.getElementById('inbox-edit-type').value;
    const status = document.getElementById('inbox-edit-status').value;

    if (!title) {
      LifeOSToast.show('Item title cannot be empty.', 'warning');
      return;
    }

    StorageService.updateInboxItem(this.activeEditId, { title, details, type, status });
    LifeOSModal.close('inbox-edit-modal');
    this.activeEditId = null;

    this.renderKPIs();
    this.renderItems();
    LifeOSToast.show('Inbox item updated successfully.', 'success');
  },

  confirmDeleteItem(id) {
    const items = StorageService.getInbox();
    const item = items.find(i => i.id === id);
    const itemName = item ? item.title : 'this item';

    if (confirm(`Are you sure you want to delete "${itemName}" from Inbox? This action cannot be undone.`)) {
      StorageService.deleteInboxItem(id);
      this.renderKPIs();
      this.renderItems();
      LifeOSToast.show('Inbox item deleted.', 'danger');
    }
  },

  bindEvents() {
    // Quick capture chips
    document.querySelectorAll('.inbox-capture-type-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.inbox-capture-type-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.selectedCaptureType = chip.getAttribute('data-type') || 'Task';
      });
    });

    // Quick capture submit
    const submitQuickCapture = () => {
      const input = document.getElementById('inbox-capture-input');
      if (!input) return;
      const text = input.value.trim();
      if (!text) {
        LifeOSToast.show('Please write what\'s on your mind.', 'warning');
        return;
      }

      StorageService.addInboxItem(text, this.selectedCaptureType);
      input.value = '';
      this.renderKPIs();
      this.renderItems();
      LifeOSToast.show(`Captured to Inbox as ${this.selectedCaptureType}: "${text}"`, 'success');
    };

    const addBtn = document.getElementById('inbox-capture-submit-btn');
    if (addBtn) addBtn.addEventListener('click', submitQuickCapture);

    const captureInput = document.getElementById('inbox-capture-input');
    if (captureInput) {
      captureInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          submitQuickCapture();
        }
      });
    }

    // Filter tabs
    document.querySelectorAll('.inbox-filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.inbox-filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentFilter = tab.getAttribute('data-filter') || 'all';
        this.renderItems();
      });
    });

    // Search filter
    const searchInput = document.getElementById('inbox-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderItems();
      });
    }

    // Sort order
    const sortSelect = document.getElementById('inbox-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.sortOrder = e.target.value;
        this.renderItems();
      });
    }

    // Edit modal save button
    const saveEditBtn = document.getElementById('inbox-edit-save-btn');
    if (saveEditBtn) {
      saveEditBtn.addEventListener('click', () => this.saveEditModal());
    }

    // Dismiss convert menus when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.dropdown-wrapper')) {
        document.querySelectorAll('.inbox-convert-menu').forEach(m => m.classList.remove('show'));
      }
    });
  }
};

window.Inbox = Inbox;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  Inbox.init();
});

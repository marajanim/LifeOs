/**
 * LifeOS — Finance Module (Steps 8–11)
 * Handles:
 * - Step 8: Finance Dashboard (KPIs, Spending Overview, Monthly Budget gauge)
 * - Step 9: Income & Expense Transactions
 * - Step 10: Money Lent / Receivables (Overdue alerts, Mark Paid)
 * - Step 11: Money Owed / Payables (Due date alerts, Mark Paid)
 * - Impulse Buy Calculator ("Should I Buy This?")
 */

const Finance = {
  activeTab: 'transactions',
  searchQuery: '',
  deleteTarget: null,

  CATEGORY_CONFIG: {
    'Food & Dining': { icon: 'utensils', color: '#3b82f6', bg: '#eff6ff' },
    'Transport': { icon: 'car', color: '#8b5cf6', bg: '#f5f3ff' },
    'Education': { icon: 'book-open', color: '#10b981', bg: '#ecfdf5' },
    'Subscriptions': { icon: 'layers', color: '#f97316', bg: '#fff7ed' },
    'Business': { icon: 'briefcase', color: '#a855f7', bg: '#faf5ff' },
    'Family & Personal': { icon: 'heart', color: '#ec4899', bg: '#fdf2f8' },
    'Income': { icon: 'trending-up', color: '#16a34a', bg: '#f0fdf4' },
    'Salary': { icon: 'briefcase', color: '#16a34a', bg: '#f0fdf4' },
    'Freelance': { icon: 'code', color: '#16a34a', bg: '#f0fdf4' },
    'Other': { icon: 'circle', color: '#64748b', bg: '#f8fafc' }
  },

  init() {
    this.bindEvents();
    this.renderAll();
  },

  bindEvents() {
    // 1. Tab Switching
    const tabBtns = document.querySelectorAll('.finance-tab-btn');
    tabBtns.forEach(btn => {
      if (!btn._bound) {
        btn._bound = true;
        btn.addEventListener('click', () => {
          tabBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.activeTab = btn.getAttribute('data-tab');

          // Update Add button label to reflect active tab
          const addBtnText = document.getElementById('btn-add-finance-text');
          if (addBtnText) {
            if (this.activeTab === 'transactions') addBtnText.textContent = 'Add Transaction';
            else if (this.activeTab === 'receivables') addBtnText.textContent = 'Add Receivable';
            else if (this.activeTab === 'payables') addBtnText.textContent = 'Add Payable';
          }

          // Update Search placeholder
          const searchInput = document.getElementById('finance-search-input');
          if (searchInput) {
            searchInput.placeholder = `Search ${this.activeTab}...`;
          }

          this.renderTable();
        });
      }
    });

    // 2. Search Filter
    const searchInput = document.getElementById('finance-search-input');
    if (searchInput && !searchInput._bound) {
      searchInput._bound = true;
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        this.renderTable();
      });
    }

    // 3. Add Record Primary Trigger Button
    const addRecordBtn = document.getElementById('btn-add-finance-record');
    if (addRecordBtn && !addRecordBtn._bound) {
      addRecordBtn._bound = true;
      addRecordBtn.addEventListener('click', () => {
        this.openAddModal();
      });
    }

    // 4. Impulse Buy Calculator Inputs
    const priceInput = document.getElementById('impulse-price-input');
    const itemInput = document.getElementById('impulse-item-input');
    if (priceInput && !priceInput._bound) {
      priceInput._bound = true;
      priceInput.addEventListener('input', () => this.renderImpulseCalc());
    }
    if (itemInput && !itemInput._bound) {
      itemInput._bound = true;
      itemInput.addEventListener('input', () => this.renderImpulseCalc());
    }

    // 5. Impulse Wishlist Button
    const wishlistBtn = document.getElementById('btn-impulse-wishlist');
    if (wishlistBtn && !wishlistBtn._bound) {
      wishlistBtn._bound = true;
      wishlistBtn.addEventListener('click', () => {
        const item = document.getElementById('impulse-item-input').value.trim() || 'Wishlist item';
        const price = document.getElementById('impulse-price-input').value || 0;
        StorageService.addInboxItem(`Buy ${item} (৳ ${Number(price).toLocaleString()})`, 'Money', 'Saved from impulse buy calculator');
        if (window.showToast) {
          window.showToast(`Saved "${item}" to your Inbox wishlist!`, 'success');
        }
      });
    }

    // 6. Add Transaction Form Submit
    const addTxForm = document.getElementById('add-transaction-form');
    if (addTxForm && !addTxForm._bound) {
      addTxForm._bound = true;
      addTxForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAddTransaction();
      });
    }

    // 7. Add Receivable Form Submit
    const addRecForm = document.getElementById('add-receivable-form');
    if (addRecForm && !addRecForm._bound) {
      addRecForm._bound = true;
      addRecForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAddReceivable();
      });
    }

    // 8. Add Payable Form Submit
    const addPayForm = document.getElementById('add-payable-form');
    if (addPayForm && !addPayForm._bound) {
      addPayForm._bound = true;
      addPayForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAddPayable();
      });
    }

    // 9. Confirm Delete Button (Rule 17)
    const confirmDeleteBtn = document.getElementById('btn-confirm-delete-fin');
    if (confirmDeleteBtn && !confirmDeleteBtn._bound) {
      confirmDeleteBtn._bound = true;
      confirmDeleteBtn.addEventListener('click', () => {
        this.executeDelete();
      });
    }
  },

  renderAll() {
    this.renderKPIs();
    this.renderSpendingOverview();
    this.renderMonthlyBudget();
    this.renderImpulseCalc();
    this.renderTable();

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  },

  formatMoney(amount) {
    return '৳ ' + Number(amount || 0).toLocaleString();
  },

  renderKPIs() {
    const metrics = StorageService.calculateFinanceMetrics();

    const incomeEl = document.getElementById('fin-kpi-income');
    const expenseEl = document.getElementById('fin-kpi-expense');
    const balanceEl = document.getElementById('fin-kpi-balance');
    const collectEl = document.getElementById('fin-kpi-collect');
    const collectSubEl = document.getElementById('fin-kpi-collect-sub');
    const payEl = document.getElementById('fin-kpi-pay');
    const paySubEl = document.getElementById('fin-kpi-pay-sub');
    const savingsEl = document.getElementById('fin-kpi-savings');

    if (incomeEl) incomeEl.textContent = this.formatMoney(metrics.totalIncome);
    if (expenseEl) expenseEl.textContent = this.formatMoney(metrics.totalExpenses);
    if (balanceEl) balanceEl.textContent = this.formatMoney(metrics.currentBalance);
    if (collectEl) collectEl.textContent = this.formatMoney(metrics.moneyToCollect);
    if (collectSubEl) collectSubEl.innerHTML = `<span>${metrics.receivablesCount} people</span>`;
    if (payEl) payEl.textContent = this.formatMoney(metrics.moneyToPay);
    if (paySubEl) paySubEl.innerHTML = `<span>${metrics.payablesCount} items</span>`;
    if (savingsEl) savingsEl.textContent = this.formatMoney(metrics.savings);
  },

  renderSpendingOverview() {
    const container = document.getElementById('spending-category-container');
    if (!container) return;

    const metrics = StorageService.calculateFinanceMetrics();
    const categories = [
      { name: 'Food & Dining', icon: 'utensils', color: '#3b82f6', bg: '#eff6ff' },
      { name: 'Transport', icon: 'car', color: '#8b5cf6', bg: '#f5f3ff' },
      { name: 'Education', icon: 'book-open', color: '#10b981', bg: '#ecfdf5' },
      { name: 'Subscriptions', icon: 'layers', color: '#f97316', bg: '#fff7ed' },
      { name: 'Business', icon: 'briefcase', color: '#a855f7', bg: '#faf5ff' },
      { name: 'Family & Personal', icon: 'heart', color: '#ec4899', bg: '#fdf2f8' }
    ];

    const totalExp = metrics.totalExpenses > 0 ? metrics.totalExpenses : 1;

    let html = '';
    categories.forEach(cat => {
      const amt = metrics.categoryTotals[cat.name] || 0;
      const pct = Math.round((amt / totalExp) * 100);

      html += `
        <div class="spending-cat-row">
          <div class="spending-cat-icon" style="background-color: ${cat.bg}; color: ${cat.color};">
            <i data-lucide="${cat.icon}" style="width: 14px; height: 14px;"></i>
          </div>
          <div class="spending-cat-label">${cat.name}</div>
          <div class="spending-cat-bar-wrap">
            <div class="spending-cat-bar-fill" style="width: ${pct}%; background-color: ${cat.color};"></div>
          </div>
          <div class="spending-cat-amount">${this.formatMoney(amt)}</div>
          <div class="spending-cat-pct">${pct}%</div>
        </div>`;
    });

    container.innerHTML = html;
  },

  renderMonthlyBudget() {
    const metrics = StorageService.calculateFinanceMetrics();

    // Donut SVG circumference: 2 * PI * 50 = 314.159
    const circumference = 314.159;
    const usedPct = Math.min(100, metrics.budgetUsedPct);
    const offset = circumference - (circumference * usedPct) / 100;

    const circle = document.getElementById('budget-donut-circle');
    const pctDisplay = document.getElementById('budget-pct-display');
    const usedVal = document.getElementById('budget-legend-used');
    const remainVal = document.getElementById('budget-legend-remaining');
    const totalVal = document.getElementById('budget-legend-total');
    const insightBanner = document.getElementById('budget-insight-banner');
    const insightTitle = document.getElementById('budget-insight-title');
    const insightDesc = document.getElementById('budget-insight-desc');

    if (circle) circle.style.strokeDashoffset = offset;
    if (pctDisplay) pctDisplay.textContent = `${usedPct}%`;
    if (usedVal) usedVal.textContent = this.formatMoney(metrics.totalExpenses);
    if (remainVal) remainVal.textContent = this.formatMoney(metrics.remainingBudget);
    if (totalVal) totalVal.textContent = this.formatMoney(metrics.totalBudget);

    if (insightBanner && insightTitle && insightDesc) {
      if (usedPct >= 90) {
        insightBanner.className = 'capacity-insight-banner banner-warning';
        insightTitle.style.color = '#e11d48';
        insightTitle.textContent = 'Budget nearly reached!';
        insightDesc.style.color = '#be123c';
        insightDesc.textContent = `You have used ${usedPct}% of your monthly budget. Watch expenses.`;
      } else {
        insightBanner.className = 'capacity-insight-banner banner-balanced';
        insightTitle.style.color = '#15803d';
        insightTitle.textContent = "You're on track!";
        insightDesc.style.color = '#166534';
        insightDesc.textContent = `You've used ${usedPct}% of your monthly budget.`;
      }
    }
  },

  renderImpulseCalc() {
    const priceInput = document.getElementById('impulse-price-input');
    const price = Number(priceInput ? priceInput.value : 40500) || 0;

    const metrics = StorageService.calculateFinanceMetrics();
    const remaining = metrics.remainingBudget > 0 ? metrics.remainingBudget : 21700;
    const impactPct = Math.round((price / remaining) * 100);

    const valEl = document.getElementById('impulse-impact-val');
    const descEl = document.getElementById('impulse-impact-desc');
    const boxEl = document.getElementById('impulse-impact-box');
    const headerEl = document.getElementById('impulse-impact-header');

    if (valEl) valEl.textContent = `${impactPct}%`;

    if (boxEl && descEl && headerEl) {
      if (impactPct > 100) {
        boxEl.style.backgroundColor = '#fff1f2';
        boxEl.style.borderColor = '#fecdd3';
        valEl.style.color = '#e11d48';
        headerEl.style.color = '#e11d48';
        descEl.style.color = '#9f1239';
        descEl.textContent = `This is ${impactPct}% of your remaining budget. Consider waiting or saving more.`;
      } else if (impactPct >= 50) {
        boxEl.style.backgroundColor = '#fffbeb';
        boxEl.style.borderColor = '#fde68a';
        valEl.style.color = '#d97706';
        headerEl.style.color = '#d97706';
        descEl.style.color = '#92400e';
        descEl.textContent = `This is ${impactPct}% of your remaining budget. Significant purchase, proceed with caution.`;
      } else {
        boxEl.style.backgroundColor = '#f0fdf4';
        boxEl.style.borderColor = '#bbf7d0';
        valEl.style.color = '#16a34a';
        headerEl.style.color = '#16a34a';
        descEl.style.color = '#166534';
        descEl.textContent = `Safe purchase! This is ${impactPct}% of your remaining budget.`;
      }
    }
  },

  renderTable() {
    const container = document.getElementById('finance-table-view-container');
    if (!container) return;

    if (this.activeTab === 'transactions') {
      this.renderTransactionsTable(container);
    } else if (this.activeTab === 'receivables') {
      this.renderReceivablesTable(container);
    } else if (this.activeTab === 'payables') {
      this.renderPayablesTable(container);
    }

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons({ root: container });
    }
  },

  renderTransactionsTable(container) {
    const list = StorageService.getTransactions();
    const query = this.searchQuery;

    const filtered = list.filter(t => {
      if (!query) return true;
      return (t.description || '').toLowerCase().includes(query) ||
             (t.category || '').toLowerCase().includes(query) ||
             (t.method || '').toLowerCase().includes(query);
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="padding: 40px; text-align: center; color: var(--color-text-muted);">
          <i data-lucide="receipt" style="width: 32px; height: 32px; margin-bottom: 8px;"></i>
          <div>No transactions found matching "${query}".</div>
        </div>`;
      return;
    }

    let html = `
      <table class="finance-data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th style="text-align: right;">Amount</th>
            <th>Payment Method</th>
            <th style="text-align: right;">Actions</th>
          </tr>
        </thead>
        <tbody>`;

    filtered.forEach(tx => {
      const isIncome = tx.type === 'income';
      const amtCls = isIncome ? 'amt-income' : 'amt-expense';
      const sign = isIncome ? '+' : '-';
      const cfg = this.CATEGORY_CONFIG[tx.category] || this.CATEGORY_CONFIG['Other'];

      html += `
        <tr>
          <td style="white-space: nowrap; color: var(--color-text-secondary); font-size: 12px;">${tx.dateDisplay || tx.date}</td>
          <td>
            <div style="font-weight: 600; color: var(--color-text-primary);">${tx.description}</div>
            ${tx.relatedProject ? `<div style="font-size: 11px; color: var(--color-text-muted);">${tx.relatedProject}</div>` : ''}
          </td>
          <td>
            <span class="category-pill" style="background-color: ${cfg.bg}; color: ${cfg.color};">
              <span style="width: 5px; height: 5px; border-radius: 50%; background-color: currentColor;"></span>
              <span>${tx.category}</span>
            </span>
          </td>
          <td style="text-align: right;" class="${amtCls}">
            ${sign} ${this.formatMoney(tx.amount)}
          </td>
          <td style="color: var(--color-text-secondary);">${tx.method || 'Bank Transfer'}</td>
          <td style="text-align: right;">
            <button class="btn-icon btn-sm" onclick="Finance.promptDelete('transaction', '${tx.id}', '${tx.description}')" title="Delete transaction">
              <i data-lucide="trash-2" style="width: 14px; height: 14px; color: var(--color-text-muted);"></i>
            </button>
          </td>
        </tr>`;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
  },

  renderReceivablesTable(container) {
    const list = StorageService.getReceivables();
    const query = this.searchQuery;

    const filtered = list.filter(r => {
      if (!query) return true;
      return (r.person || '').toLowerCase().includes(query) ||
             (r.description || '').toLowerCase().includes(query) ||
             (r.contactNote || '').toLowerCase().includes(query);
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="padding: 40px; text-align: center; color: var(--color-text-muted);">
          <i data-lucide="user-check" style="width: 32px; height: 32px; margin-bottom: 8px;"></i>
          <div>No money lent records found.</div>
        </div>`;
      return;
    }

    let html = `
      <table class="finance-data-table">
        <thead>
          <tr>
            <th>Person</th>
            <th>Amount</th>
            <th>Date Lent</th>
            <th>Expected Return</th>
            <th>Status</th>
            <th>Contact Note</th>
            <th style="text-align: right;">Actions</th>
          </tr>
        </thead>
        <tbody>`;

    filtered.forEach(rec => {
      const isOverdue = rec.status === 'Overdue' || (rec.overdueDays && rec.overdueDays > 0);
      const isPaid = rec.status === 'Paid';

      const statusBadge = isPaid
        ? `<span class="category-pill" style="background-color: #ecfdf5; color: #10b981;">● Paid</span>`
        : isOverdue
        ? `<span class="category-pill" style="background-color: #ffe4e6; color: #e11d48; font-weight: 700;">● ${rec.overdueDays || 14} days overdue</span>`
        : `<span class="category-pill" style="background-color: #eff6ff; color: #2563eb;">● Pending</span>`;

      html += `
        <tr>
          <td>
            <div style="font-weight: 700; color: var(--color-text-primary); font-size: 13px;">${rec.person}</div>
            <div style="font-size: 11px; color: var(--color-text-muted);">${rec.description || ''}</div>
          </td>
          <td style="font-weight: 700; color: var(--color-text-primary);">${this.formatMoney(rec.amount)}</td>
          <td style="color: var(--color-text-secondary);">${rec.dateLentDisplay || rec.dateLent}</td>
          <td style="color: var(--color-text-secondary);">${rec.returnDateDisplay || rec.returnDate}</td>
          <td>${statusBadge}</td>
          <td style="color: var(--color-text-muted); font-size: 11.5px;">${rec.contactNote || '—'}</td>
          <td style="text-align: right; white-space: nowrap;">
            ${!isPaid ? `
              <button class="btn btn-sm btn-secondary" onclick="Finance.markPaid('receivable', '${rec.id}')" style="padding: 3px 8px; font-size: 11px; margin-right: 4px;">
                <i data-lucide="check" style="width: 12px; height: 12px;"></i>
                <span>Mark Paid</span>
              </button>` : ''}
            <button class="btn-icon btn-sm" onclick="Finance.promptDelete('receivable', '${rec.id}', '${rec.person} (৳ ${rec.amount})')" title="Delete entry">
              <i data-lucide="trash-2" style="width: 14px; height: 14px; color: var(--color-text-muted);"></i>
            </button>
          </td>
        </tr>`;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
  },

  renderPayablesTable(container) {
    const list = StorageService.getPayables();
    const query = this.searchQuery;

    const filtered = list.filter(p => {
      if (!query) return true;
      return (p.recipient || '').toLowerCase().includes(query) ||
             (p.reason || '').toLowerCase().includes(query);
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="padding: 40px; text-align: center; color: var(--color-text-muted);">
          <i data-lucide="credit-card" style="width: 32px; height: 32px; margin-bottom: 8px;"></i>
          <div>No money owed records found.</div>
        </div>`;
      return;
    }

    let html = `
      <table class="finance-data-table">
        <thead>
          <tr>
            <th>To Whom / Store</th>
            <th>Amount</th>
            <th>Due Date</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Notes</th>
            <th style="text-align: right;">Actions</th>
          </tr>
        </thead>
        <tbody>`;

    filtered.forEach(pay => {
      const isPaid = pay.status === 'Paid';
      const statusBadge = isPaid
        ? `<span class="category-pill" style="background-color: #ecfdf5; color: #10b981;">● Paid</span>`
        : pay.daysLeft && pay.daysLeft <= 7
        ? `<span class="category-pill" style="background-color: #fffbeb; color: #d97706; font-weight: 700;">● Due in ${pay.daysLeft} days</span>`
        : `<span class="category-pill" style="background-color: #eff6ff; color: #2563eb;">● Pending</span>`;

      html += `
        <tr>
          <td style="font-weight: 700; color: var(--color-text-primary); font-size: 13px;">${pay.recipient}</td>
          <td style="font-weight: 700; color: #e11d48;">${this.formatMoney(pay.amount)}</td>
          <td style="color: var(--color-text-secondary);">${pay.dueDateDisplay || pay.dueDate}</td>
          <td>${pay.reason || '—'}</td>
          <td>${statusBadge}</td>
          <td style="color: var(--color-text-muted); font-size: 11.5px;">${pay.notes || '—'}</td>
          <td style="text-align: right; white-space: nowrap;">
            ${!isPaid ? `
              <button class="btn btn-sm btn-secondary" onclick="Finance.markPaid('payable', '${pay.id}')" style="padding: 3px 8px; font-size: 11px; margin-right: 4px;">
                <i data-lucide="check" style="width: 12px; height: 12px;"></i>
                <span>Mark Paid</span>
              </button>` : ''}
            <button class="btn-icon btn-sm" onclick="Finance.promptDelete('payable', '${pay.id}', '${pay.recipient} (৳ ${pay.amount})')" title="Delete entry">
              <i data-lucide="trash-2" style="width: 14px; height: 14px; color: var(--color-text-muted);"></i>
            </button>
          </td>
        </tr>`;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
  },

  openAddModal() {
    if (this.activeTab === 'transactions') {
      this.openModal('add-transaction-modal');
    } else if (this.activeTab === 'receivables') {
      this.openModal('add-receivable-modal');
    } else if (this.activeTab === 'payables') {
      this.openModal('add-payable-modal');
    }
  },

  handleAddTransaction() {
    const type = document.getElementById('new-tx-type').value;
    const amount = Number(document.getElementById('new-tx-amount').value) || 0;
    const desc = document.getElementById('new-tx-desc').value.trim();
    const category = document.getElementById('new-tx-category').value;
    const date = document.getElementById('new-tx-date').value || '2024-04-23';
    const method = document.getElementById('new-tx-method').value;
    const project = document.getElementById('new-tx-project').value.trim();
    const notes = document.getElementById('new-tx-notes').value.trim();

    if (!desc || amount <= 0) return;

    StorageService.addTransaction({
      type,
      amount,
      description: desc,
      category,
      date,
      dateDisplay: date,
      method,
      relatedProject: project,
      notes
    });

    this.closeModal('add-transaction-modal');
    document.getElementById('add-transaction-form').reset();

    if (window.showToast) {
      window.showToast(`Transaction "${desc}" added successfully!`, 'success');
    }

    this.renderAll();
  },

  handleAddReceivable() {
    const person = document.getElementById('new-rec-person').value.trim();
    const amount = Number(document.getElementById('new-rec-amount').value) || 0;
    const dateLent = document.getElementById('new-rec-date-lent').value || '2024-04-23';
    const returnDate = document.getElementById('new-rec-return-date').value || '2024-05-15';
    const desc = document.getElementById('new-rec-desc').value.trim();
    const contact = document.getElementById('new-rec-contact').value.trim();
    const reminder = document.getElementById('new-rec-reminder').value;

    if (!person || amount <= 0) return;

    StorageService.addReceivable({
      person,
      amount,
      dateLent,
      dateLentDisplay: dateLent,
      returnDate,
      returnDateDisplay: returnDate,
      description: desc,
      contactNote: contact,
      reminderFreq: reminder,
      status: 'Pending',
      overdueDays: 0
    });

    this.closeModal('add-receivable-modal');
    document.getElementById('add-receivable-form').reset();

    if (window.showToast) {
      window.showToast(`Added money lent to ${person}!`, 'success');
    }

    this.renderAll();
  },

  handleAddPayable() {
    const recipient = document.getElementById('new-pay-recipient').value.trim();
    const amount = Number(document.getElementById('new-pay-amount').value) || 0;
    const due = document.getElementById('new-pay-due').value || '2024-04-30';
    const reason = document.getElementById('new-pay-reason').value.trim();
    const notes = document.getElementById('new-pay-notes').value.trim();

    if (!recipient || amount <= 0) return;

    StorageService.addPayable({
      recipient,
      amount,
      dueDate: due,
      dueDateDisplay: due,
      reason,
      status: 'Pending',
      daysLeft: 7,
      notes
    });

    this.closeModal('add-payable-modal');
    document.getElementById('add-payable-form').reset();

    if (window.showToast) {
      window.showToast(`Added payable for ${recipient}!`, 'success');
    }

    this.renderAll();
  },

  markPaid(type, id) {
    if (type === 'receivable') {
      StorageService.markReceivablePaid(id);
      if (window.showToast) window.showToast('Receivable marked as Paid!', 'success');
    } else if (type === 'payable') {
      StorageService.markPayablePaid(id);
      if (window.showToast) window.showToast('Payable marked as Paid!', 'success');
    }
    this.renderAll();
  },

  promptDelete(type, id, title) {
    this.deleteTarget = { type, id, title };
    const placeholder = document.getElementById('delete-fin-title-placeholder');
    if (placeholder) placeholder.textContent = `"${title}"`;
    this.openModal('confirm-delete-finance-modal');
  },

  executeDelete() {
    if (!this.deleteTarget) return;

    const { type, id } = this.deleteTarget;
    if (type === 'transaction') {
      StorageService.deleteTransaction(id);
    } else if (type === 'receivable') {
      StorageService.deleteReceivable(id);
    } else if (type === 'payable') {
      StorageService.deletePayable(id);
    }

    this.closeModal('confirm-delete-finance-modal');
    this.deleteTarget = null;

    if (window.showToast) {
      window.showToast('Record deleted successfully.', 'info');
    }

    this.renderAll();
  },

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('show');
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons({ root: modal });
      }
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

window.Finance = Finance;

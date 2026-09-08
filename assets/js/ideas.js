/**
 * LifeOS — Idea Vault Module (Step 12)
 * Manages idea capture without distraction, anti-FOMO categorization (Active, Later, Someday, Archived),
 * full idea metadata, detail views, and project promotion.
 */

const Ideas = {
  currentBucket: 'Active', // 'Active' | 'Later' | 'Someday' | 'Archived'
  currentCategory: 'all',
  currentSort: 'newest',
  searchQuery: '',
  selectedIdeaId: null,
  activeDetailTab: 'details', // 'details' | 'notes' | 'related' | 'history'
  pendingDeleteId: null,

  init() {
    this.bindEvents();
    // Default selected idea to the first available idea if none selected
    const ideas = StorageService.getIdeas();
    if (!this.selectedIdeaId && ideas.length > 0) {
      this.selectedIdeaId = ideas[0].id;
    }
    this.render();
  },

  bindEvents() {
    // 1. Quick Capture Form
    const quickInput = document.getElementById('quick-idea-input');
    const quickCat = document.getElementById('quick-idea-cat');
    const quickSaveBtn = document.getElementById('quick-idea-save-btn');

    if (quickSaveBtn && !quickSaveBtn.dataset.bound) {
      quickSaveBtn.dataset.bound = 'true';
      quickSaveBtn.addEventListener('click', () => this.handleQuickCapture());
    }

    if (quickInput && !quickInput.dataset.bound) {
      quickInput.dataset.bound = 'true';
      quickInput.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
          e.preventDefault();
          this.handleQuickCapture();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          this.handleQuickCapture();
        }
      });
    }

    // 2. Filter Tabs (Active, Later, Someday, Archived)
    const tabBtns = document.querySelectorAll('.idea-tab-btn');
    tabBtns.forEach(btn => {
      if (!btn.dataset.bound) {
        btn.dataset.bound = 'true';
        btn.addEventListener('click', () => {
          tabBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.currentBucket = btn.getAttribute('data-bucket') || 'Active';
          this.renderList();
        });
      }
    });

    // 3. Search & Filters
    const searchInput = document.getElementById('ideas-search-input');
    if (searchInput && !searchInput.dataset.bound) {
      searchInput.dataset.bound = 'true';
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderList();
      });
    }

    const catFilter = document.getElementById('ideas-cat-filter');
    if (catFilter && !catFilter.dataset.bound) {
      catFilter.dataset.bound = 'true';
      catFilter.addEventListener('change', (e) => {
        this.currentCategory = e.target.value;
        this.renderList();
      });
    }

    const sortFilter = document.getElementById('ideas-sort-filter');
    if (sortFilter && !sortFilter.dataset.bound) {
      sortFilter.dataset.bound = 'true';
      sortFilter.addEventListener('change', (e) => {
        this.currentSort = e.target.value;
        this.renderList();
      });
    }

    // 4. Modal Trigger: New Full Idea
    const btnNewIdea = document.getElementById('btn-new-idea');
    if (btnNewIdea && !btnNewIdea.dataset.bound) {
      btnNewIdea.dataset.bound = 'true';
      btnNewIdea.addEventListener('click', () => {
        this.openCreateIdeaModal();
      });
    }

    // 5. Create Idea Form Submit
    const createForm = document.getElementById('create-idea-form');
    if (createForm && !createForm.dataset.bound) {
      createForm.dataset.bound = 'true';
      createForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleCreateIdeaSubmit();
      });
    }

    // 6. Edit Idea Form Submit
    const editForm = document.getElementById('edit-idea-form');
    if (editForm && !editForm.dataset.bound) {
      editForm.dataset.bound = 'true';
      editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleEditIdeaSubmit();
      });
    }

    // 7. Delete Confirmation Button (Rule 17)
    const btnConfirmDelete = document.getElementById('btn-confirm-delete-idea');
    if (btnConfirmDelete && !btnConfirmDelete.dataset.bound) {
      btnConfirmDelete.dataset.bound = 'true';
      btnConfirmDelete.addEventListener('click', () => {
        if (this.pendingDeleteId) {
          const idea = StorageService.getIdeaById(this.pendingDeleteId);
          const title = idea ? idea.title : 'Idea';
          StorageService.deleteIdea(this.pendingDeleteId);
          window.LifeOS?.showToast?.(`Deleted "${title}" permanently`, 'info');

          // Close modal
          window.LifeOS?.closeModal?.('confirm-delete-idea-modal');

          if (this.selectedIdeaId === this.pendingDeleteId) {
            const remaining = StorageService.getIdeas();
            this.selectedIdeaId = remaining.length > 0 ? remaining[0].id : null;
          }
          this.pendingDeleteId = null;
          this.render();
        }
      });
    }
  },

  handleQuickCapture() {
    const input = document.getElementById('quick-idea-input');
    const catSelect = document.getElementById('quick-idea-cat');
    if (!input || !input.value.trim()) {
      window.LifeOS?.showToast?.('Please enter an idea title', 'warning');
      return;
    }

    const title = input.value.trim();
    const category = catSelect ? catSelect.value : 'SaaS';

    const newIdea = StorageService.addIdea({
      title,
      category,
      status: 'Active',
      fomoBucket: 'Active',
      description: 'Captured via Quick Capture. Refine problem & solution in details.',
      reviewDate: '2024-05-15',
      reviewDateDisplay: 'May 15, 2024',
      priority: 'Medium'
    });

    input.value = '';
    window.LifeOS?.showToast?.(`Captured new idea: "${title}"`, 'success');

    this.selectedIdeaId = newIdea.id;
    this.render();
  },

  openCreateIdeaModal() {
    const form = document.getElementById('create-idea-form');
    if (form) form.reset();
    window.LifeOS?.openModal?.('create-idea-modal');
  },

  handleCreateIdeaSubmit() {
    const title = document.getElementById('new-idea-title')?.value.trim();
    if (!title) return;

    const category = document.getElementById('new-idea-category')?.value || 'SaaS';
    const status = document.getElementById('new-idea-status')?.value || 'Active';
    const fomoBucket = document.getElementById('new-idea-bucket')?.value || 'Active';
    const priority = document.getElementById('new-idea-priority')?.value || 'Medium';
    const reviewDate = document.getElementById('new-idea-review-date')?.value || '';
    const description = document.getElementById('new-idea-desc')?.value.trim() || '';
    const problem = document.getElementById('new-idea-problem')?.value.trim() || '';
    const targetUser = document.getElementById('new-idea-target-user')?.value.trim() || '';
    const potentialSolution = document.getElementById('new-idea-solution')?.value.trim() || '';
    const monetization = document.getElementById('new-idea-monetization')?.value.trim() || '';
    const notes = document.getElementById('new-idea-notes')?.value.trim() || '';

    // Format display date
    let reviewDateDisplay = 'Upcoming';
    if (reviewDate) {
      const d = new Date(reviewDate);
      if (!isNaN(d.getTime())) {
        reviewDateDisplay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
    }

    const created = StorageService.addIdea({
      title,
      category,
      status,
      fomoBucket,
      priority,
      reviewDate,
      reviewDateDisplay,
      description,
      problem,
      targetUser,
      potentialSolution,
      monetization,
      notes
    });

    window.LifeOS?.closeModal?.('create-idea-modal');
    window.LifeOS?.showToast?.(`Created idea: "${title}"`, 'success');

    this.selectedIdeaId = created.id;
    this.render();
  },

  openEditIdeaModal(id) {
    const idea = StorageService.getIdeaById(id);
    if (!idea) return;

    document.getElementById('edit-idea-id').value = idea.id;
    document.getElementById('edit-idea-title').value = idea.title || '';
    document.getElementById('edit-idea-category').value = idea.category || 'SaaS';
    document.getElementById('edit-idea-status').value = idea.status || 'Active';
    document.getElementById('edit-idea-bucket').value = idea.fomoBucket || 'Active';
    document.getElementById('edit-idea-priority').value = idea.priority || 'Medium';
    document.getElementById('edit-idea-review-date').value = idea.reviewDate || '';
    document.getElementById('edit-idea-desc').value = idea.description || '';
    document.getElementById('edit-idea-problem').value = idea.problem || '';
    document.getElementById('edit-idea-target-user').value = idea.targetUser || '';
    document.getElementById('edit-idea-solution').value = idea.potentialSolution || '';
    document.getElementById('edit-idea-monetization').value = idea.monetization || '';
    document.getElementById('edit-idea-notes').value = Array.isArray(idea.notes) ? idea.notes.join('\n') : (idea.notes || '');

    window.LifeOS?.openModal?.('edit-idea-modal');
  },

  handleEditIdeaSubmit() {
    const id = document.getElementById('edit-idea-id')?.value;
    if (!id) return;

    const title = document.getElementById('edit-idea-title')?.value.trim();
    const category = document.getElementById('edit-idea-category')?.value || 'SaaS';
    const status = document.getElementById('edit-idea-status')?.value || 'Active';
    const fomoBucket = document.getElementById('edit-idea-bucket')?.value || 'Active';
    const priority = document.getElementById('edit-idea-priority')?.value || 'Medium';
    const reviewDate = document.getElementById('edit-idea-review-date')?.value || '';
    const description = document.getElementById('edit-idea-desc')?.value.trim() || '';
    const problem = document.getElementById('edit-idea-problem')?.value.trim() || '';
    const targetUser = document.getElementById('edit-idea-target-user')?.value.trim() || '';
    const potentialSolution = document.getElementById('edit-idea-solution')?.value.trim() || '';
    const monetization = document.getElementById('edit-idea-monetization')?.value.trim() || '';
    const notes = document.getElementById('edit-idea-notes')?.value.trim() || '';

    let reviewDateDisplay = 'Upcoming';
    if (reviewDate) {
      const d = new Date(reviewDate);
      if (!isNaN(d.getTime())) {
        reviewDateDisplay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
    }

    StorageService.updateIdea(id, {
      title,
      category,
      status,
      fomoBucket,
      priority,
      reviewDate,
      reviewDateDisplay,
      description,
      problem,
      targetUser,
      potentialSolution,
      monetization,
      notes
    });

    window.LifeOS?.closeModal?.('edit-idea-modal');
    window.LifeOS?.showToast?.(`Updated "${title}"`, 'success');

    this.render();
  },

  confirmDeleteIdea(id) {
    const idea = StorageService.getIdeaById(id);
    if (!idea) return;

    this.pendingDeleteId = id;
    const titlePlaceholder = document.getElementById('delete-idea-title-placeholder');
    if (titlePlaceholder) {
      titlePlaceholder.textContent = `"${idea.title}"`;
    }
    window.LifeOS?.openModal?.('confirm-delete-idea-modal');
  },

  promoteToProject(id) {
    const idea = StorageService.getIdeaById(id);
    if (!idea) return;

    if (confirm(`Convert idea "${idea.title}" into an active Project in LifeOS?`)) {
      const res = StorageService.promoteIdeaToProject(id);
      if (res && res.success) {
        window.LifeOS?.showToast?.(`Promoted "${idea.title}" to active project!`, 'success');
        this.render();
      }
    }
  },

  toggleStar(id, e) {
    if (e) e.stopPropagation();
    const updated = StorageService.toggleStarIdea(id);
    if (updated) {
      this.render();
    }
  },

  toggleArchive(id, e) {
    if (e) e.stopPropagation();
    const idea = StorageService.getIdeaById(id);
    if (!idea) return;
    const updated = StorageService.archiveIdea(id);
    if (updated) {
      const action = updated.status === 'Archived' ? 'Archived' : 'Restored';
      window.LifeOS?.showToast?.(`${action} idea: "${idea.title}"`, 'info');
      this.render();
    }
  },

  selectIdea(id) {
    this.selectedIdeaId = id;
    this.renderListSelectedState();
    this.renderDetail();

    // On smaller screens, scroll to detail panel or open mobile drawer
    const detailPanel = document.getElementById('idea-detail-panel');
    if (window.innerWidth < 992 && detailPanel) {
      detailPanel.scrollIntoView({ behavior: 'smooth' });
    }
  },

  render() {
    this.renderKPIs();
    this.renderList();
    this.renderDetail();
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  },

  renderKPIs() {
    const metrics = StorageService.calculateIdeaMetrics();

    // Update KPI numbers matching mockup
    const kpiActive = document.getElementById('idea-kpi-active');
    const kpiLater = document.getElementById('idea-kpi-later');
    const kpiPromising = document.getElementById('idea-kpi-promising');
    const kpiArchived = document.getElementById('idea-kpi-archived');

    if (kpiActive) kpiActive.textContent = metrics.activeCount;
    if (kpiLater) kpiLater.textContent = metrics.laterCount;
    if (kpiPromising) kpiPromising.textContent = metrics.promisingCount;
    if (kpiArchived) kpiArchived.textContent = metrics.archivedCount;

    // Update tab badges
    const tabActiveBadge = document.getElementById('tab-badge-active');
    const tabLaterBadge = document.getElementById('tab-badge-later');
    const tabSomedayBadge = document.getElementById('tab-badge-someday');
    const tabArchivedBadge = document.getElementById('tab-badge-archived');

    if (tabActiveBadge) tabActiveBadge.textContent = metrics.activeCount;
    if (tabLaterBadge) tabLaterBadge.textContent = metrics.laterCount;
    if (tabSomedayBadge) tabSomedayBadge.textContent = metrics.promisingCount;
    if (tabArchivedBadge) tabArchivedBadge.textContent = metrics.archivedCount;
  },

  getFilteredIdeas() {
    let list = StorageService.getIdeas();

    // 1. Bucket Filter (Anti-FOMO tabs: Active, Later, Someday, Archived)
    if (this.currentBucket === 'Active') {
      list = list.filter(i => (i.fomoBucket === 'Active' || i.status === 'Active') && i.status !== 'Archived');
    } else if (this.currentBucket === 'Later') {
      list = list.filter(i => (i.fomoBucket === 'Later' || i.status === 'Research Later' || i.status === 'Inbox') && i.status !== 'Archived');
    } else if (this.currentBucket === 'Someday') {
      list = list.filter(i => (i.fomoBucket === 'Someday' || i.status === 'Promising') && i.status !== 'Archived');
    } else if (this.currentBucket === 'Archived') {
      list = list.filter(i => i.fomoBucket === 'Archived' || i.status === 'Archived');
    }

    // 2. Category Filter
    if (this.currentCategory && this.currentCategory !== 'all') {
      list = list.filter(i => (i.category || '').toLowerCase() === this.currentCategory.toLowerCase());
    }

    // 3. Search Query
    if (this.searchQuery) {
      list = list.filter(i =>
        (i.title && i.title.toLowerCase().includes(this.searchQuery)) ||
        (i.description && i.description.toLowerCase().includes(this.searchQuery)) ||
        (i.targetUser && i.targetUser.toLowerCase().includes(this.searchQuery)) ||
        (i.problem && i.problem.toLowerCase().includes(this.searchQuery))
      );
    }

    // 4. Sorting
    if (this.currentSort === 'newest') {
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (this.currentSort === 'priority') {
      const pWeights = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
      list.sort((a, b) => (pWeights[b.priority] || 0) - (pWeights[a.priority] || 0));
    } else if (this.currentSort === 'review') {
      list.sort((a, b) => new Date(a.reviewDate || '2099-12-31') - new Date(b.reviewDate || '2099-12-31'));
    } else if (this.currentSort === 'title') {
      list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    return list;
  },

  renderList() {
    const container = document.getElementById('ideas-list-container');
    if (!container) return;

    const filtered = this.getFilteredIdeas();

    // If current selected idea is not in filtered list, select first available or keep
    if (filtered.length > 0 && !filtered.some(i => i.id === this.selectedIdeaId)) {
      this.selectedIdeaId = filtered[0].id;
      this.renderDetail();
    } else if (filtered.length === 0) {
      this.selectedIdeaId = null;
      this.renderDetail();
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="padding: 48px 24px; text-align: center; background: var(--color-surface); border: 1px dashed var(--color-border); border-radius: var(--radius-lg);">
          <div class="empty-state-icon-wrap" style="width: 48px; height: 48px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; background: #eff6ff; color: #2563eb; border-radius: 50%;">
            <i data-lucide="lightbulb" style="width: 24px; height: 24px;"></i>
          </div>
          <h4 style="font-size: 16px; font-weight: 600; margin: 0 0 6px;">No ideas found</h4>
          <p style="font-size: 13px; color: var(--color-text-secondary); margin: 0 0 16px;">
            ${this.searchQuery ? `No ideas match "${this.searchQuery}".` : `No ideas in ${this.currentBucket} bucket right now.`}
          </p>
          <button class="btn btn-primary btn-sm" onclick="Ideas.openCreateIdeaModal()">
            <i data-lucide="plus"></i>
            <span>Add New Idea</span>
          </button>
        </div>
      `;
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
      return;
    }

    let html = '';
    filtered.forEach(idea => {
      const isSelected = idea.id === this.selectedIdeaId;
      const isStarred = !!idea.starred;

      // Status badge color and dot
      let statusBadgeClass = 'badge-blue';
      let statusDotColor = '#2563eb';
      if (idea.status === 'Active') {
        statusBadgeClass = 'badge-green';
        statusDotColor = '#10b981';
      } else if (idea.status === 'Research Later') {
        statusBadgeClass = 'badge-amber';
        statusDotColor = '#f59e0b';
      } else if (idea.status === 'Promising' || idea.status === 'Someday') {
        statusBadgeClass = 'badge-blue';
        statusDotColor = '#3b82f6';
      } else if (idea.status === 'Archived') {
        statusBadgeClass = 'badge-gray';
        statusDotColor = '#64748b';
      }

      // Category Icon fallback
      const catIcon = idea.icon || 'lightbulb';
      const catBg = idea.iconBg || '#eff6ff';
      const catColor = idea.iconColor || '#2563eb';

      html += `
        <div class="idea-card ${isSelected ? 'selected' : ''}" data-id="${idea.id}" onclick="Ideas.selectIdea('${idea.id}')">
          <div class="idea-card-header">
            <div class="idea-card-left">
              <input type="checkbox" class="idea-checkbox" onclick="event.stopPropagation();" aria-label="Select idea">
              <div class="idea-icon-badge" style="background-color: ${catBg}; color: ${catColor};">
                <i data-lucide="${catIcon}" style="width: 18px; height: 18px;"></i>
              </div>
              <div class="idea-title-area">
                <div class="idea-title-row">
                  <h4 class="idea-title">${this.escapeHtml(idea.title)}</h4>
                </div>
                <div class="idea-badges-row">
                  <span class="idea-category-pill">${this.escapeHtml(idea.category || 'SaaS')}</span>
                  <span class="idea-status-pill ${statusBadgeClass}">
                    <span class="status-dot" style="background-color: ${statusDotColor};"></span>
                    <span>${this.escapeHtml(idea.status || 'Active')}</span>
                  </span>
                  ${idea.promotedProjectId ? `<span class="badge badge-sm badge-purple" style="font-size: 11px; padding: 2px 6px;"><i data-lucide="check-check" style="width: 12px; height: 12px; display: inline-block; vertical-align: middle;"></i> Promoted</span>` : ''}
                </div>
              </div>
            </div>

            <button class="idea-star-btn ${isStarred ? 'starred' : ''}" onclick="Ideas.toggleStar('${idea.id}', event)" title="${isStarred ? 'Unstar' : 'Star idea'}">
              <i data-lucide="star" style="width: 18px; height: 18px; fill: ${isStarred ? '#f59e0b' : 'none'}; stroke: ${isStarred ? '#f59e0b' : '#94a3b8'};"></i>
            </button>
          </div>

          <p class="idea-desc-preview">
            ${this.escapeHtml(idea.description || idea.problem || 'No description provided yet.')}
          </p>

          <div class="idea-card-footer">
            <div class="idea-card-meta">
              ${idea.targetUser ? `
                <span class="idea-meta-item" title="Target user">
                  <i data-lucide="users" style="width: 13px; height: 13px;"></i>
                  <span>${this.escapeHtml(idea.targetUser)}</span>
                </span>
              ` : ''}
              ${idea.reviewDateDisplay ? `
                <span class="idea-meta-item" title="Review date">
                  <i data-lucide="calendar" style="width: 13px; height: 13px;"></i>
                  <span>Review ${this.escapeHtml(idea.reviewDateDisplay)}</span>
                </span>
              ` : ''}
            </div>

            <div class="idea-card-actions" onclick="event.stopPropagation();">
              <button class="btn btn-xs ${isSelected ? 'btn-primary' : 'btn-secondary'}" onclick="Ideas.selectIdea('${idea.id}')">
                <span>Open</span>
              </button>
              <button class="btn btn-xs btn-secondary" onclick="Ideas.openEditIdeaModal('${idea.id}')">
                <i data-lucide="edit-3" style="width: 12px; height: 12px;"></i>
                <span>Edit</span>
              </button>
              <button class="btn btn-xs btn-secondary" onclick="Ideas.toggleArchive('${idea.id}', event)">
                <i data-lucide="archive" style="width: 12px; height: 12px;"></i>
                <span>${idea.status === 'Archived' ? 'Restore' : 'Archive'}</span>
              </button>
              <button class="btn btn-xs btn-outline-primary" onclick="Ideas.promoteToProject('${idea.id}')" title="Promote into active LifeOS project">
                <i data-lucide="arrow-up-right" style="width: 12px; height: 12px;"></i>
                <span>Promote to Project</span>
              </button>
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

  renderListSelectedState() {
    const cards = document.querySelectorAll('.idea-card');
    cards.forEach(c => {
      if (c.getAttribute('data-id') === this.selectedIdeaId) {
        c.classList.add('selected');
      } else {
        c.classList.remove('selected');
      }
    });
  },

  renderDetail() {
    const panel = document.getElementById('idea-detail-panel');
    if (!panel) return;

    if (!this.selectedIdeaId) {
      panel.innerHTML = `
        <div class="card detail-placeholder-card" style="padding: 40px 24px; text-align: center;">
          <div style="width: 48px; height: 48px; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; background: #eff6ff; color: #2563eb; border-radius: 50%;">
            <i data-lucide="lightbulb" style="width: 24px; height: 24px;"></i>
          </div>
          <h4 style="font-size: 15px; font-weight: 600; margin-bottom: 6px;">No Idea Selected</h4>
          <p style="font-size: 13px; color: var(--color-text-secondary); margin: 0;">Click "Open" on any idea from the list to view its complete problem statement, solution, target audience, and monetization plan.</p>
        </div>
      `;
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
      return;
    }

    const idea = StorageService.getIdeaById(this.selectedIdeaId);
    if (!idea) {
      panel.innerHTML = '';
      return;
    }

    const isStarred = !!idea.starred;
    const catIcon = idea.icon || 'briefcase';
    const catBg = idea.iconBg || '#eff6ff';
    const catColor = idea.iconColor || '#2563eb';

    let statusBadgeClass = 'badge-blue';
    let statusDotColor = '#2563eb';
    if (idea.status === 'Active') {
      statusBadgeClass = 'badge-green';
      statusDotColor = '#10b981';
    } else if (idea.status === 'Research Later') {
      statusBadgeClass = 'badge-amber';
      statusDotColor = '#f59e0b';
    } else if (idea.status === 'Promising' || idea.status === 'Someday') {
      statusBadgeClass = 'badge-blue';
      statusDotColor = '#3b82f6';
    } else if (idea.status === 'Archived') {
      statusBadgeClass = 'badge-gray';
      statusDotColor = '#64748b';
    }

    // Notes list formatting
    let notesListHtml = '';
    if (Array.isArray(idea.notes) && idea.notes.length > 0) {
      notesListHtml = `<ul class="idea-detail-bullets">` +
        idea.notes.map(n => `<li>${this.escapeHtml(n)}</li>`).join('') +
        `</ul>`;
    } else if (typeof idea.notes === 'string' && idea.notes.trim()) {
      const bullets = idea.notes.split('\n').filter(Boolean);
      notesListHtml = `<ul class="idea-detail-bullets">` +
        bullets.map(n => `<li>${this.escapeHtml(n.replace(/^[-*•]\s*/, ''))}</li>`).join('') +
        `</ul>`;
    } else {
      notesListHtml = `<p style="font-size: 13px; color: var(--color-text-secondary); margin: 0; font-style: italic;">No specific notes recorded yet.</p>`;
    }

    // Render Tab Content
    let tabContentHtml = '';
    if (this.activeDetailTab === 'details') {
      tabContentHtml = `
        <div class="idea-detail-sections">
          <!-- Problem Section -->
          <div class="idea-detail-section">
            <div class="idea-section-header">
              <div class="idea-section-icon" style="background-color: #fef2f2; color: #ef4444;">
                <i data-lucide="alert-circle" style="width: 15px; height: 15px;"></i>
              </div>
              <span class="idea-section-title">Problem</span>
            </div>
            <p class="idea-section-body">
              ${this.escapeHtml(idea.problem || idea.description || 'Not defined yet.')}
            </p>
          </div>

          <!-- Target User Section -->
          <div class="idea-detail-section">
            <div class="idea-section-header">
              <div class="idea-section-icon" style="background-color: #faf5ff; color: #9333ea;">
                <i data-lucide="users" style="width: 15px; height: 15px;"></i>
              </div>
              <span class="idea-section-title">Target User</span>
            </div>
            <p class="idea-section-body">
              ${this.escapeHtml(idea.targetUser || 'Target users to be surveyed.')}
            </p>
          </div>

          <!-- Potential Solution Section -->
          <div class="idea-detail-section">
            <div class="idea-section-header">
              <div class="idea-section-icon" style="background-color: #fff7ed; color: #ea580c;">
                <i data-lucide="lightbulb" style="width: 15px; height: 15px;"></i>
              </div>
              <span class="idea-section-title">Potential Solution</span>
            </div>
            <p class="idea-section-body">
              ${this.escapeHtml(idea.potentialSolution || 'Concept exploration in progress.')}
            </p>
          </div>

          <!-- Monetization Idea Section -->
          <div class="idea-detail-section">
            <div class="idea-section-header">
              <div class="idea-section-icon" style="background-color: #f0fdf4; color: #16a34a;">
                <i data-lucide="dollar-sign" style="width: 15px; height: 15px;"></i>
              </div>
              <span class="idea-section-title">Monetization Idea</span>
            </div>
            <p class="idea-section-body">
              ${this.escapeHtml(idea.monetization || 'Pricing model to be evaluated.')}
            </p>
          </div>

          <!-- Notes Section -->
          <div class="idea-detail-section">
            <div class="idea-section-header">
              <div class="idea-section-icon" style="background-color: #eff6ff; color: #2563eb;">
                <i data-lucide="file-text" style="width: 15px; height: 15px;"></i>
              </div>
              <span class="idea-section-title">Notes</span>
            </div>
            <div class="idea-section-body">
              ${notesListHtml}
            </div>
          </div>
        </div>
      `;
    } else if (this.activeDetailTab === 'notes') {
      tabContentHtml = `
        <div class="idea-detail-sections">
          <div class="idea-detail-section">
            <h5 style="font-size: 13px; font-weight: 600; margin: 0 0 10px;">Quick Scratchpad</h5>
            <textarea id="idea-quick-notes-input" class="form-textarea" rows="5" placeholder="Add additional research notes, links, or validation thoughts...">${Array.isArray(idea.notes) ? idea.notes.join('\n') : (idea.notes || '')}</textarea>
            <button class="btn btn-sm btn-primary" style="margin-top: 8px;" onclick="Ideas.saveQuickNotes('${idea.id}')">
              <i data-lucide="save"></i>
              <span>Save Notes</span>
            </button>
          </div>
        </div>
      `;
    } else if (this.activeDetailTab === 'related') {
      tabContentHtml = `
        <div class="idea-detail-sections" style="padding: 12px 0;">
          ${idea.promotedProjectId ? `
            <div class="alert alert-info" style="margin-bottom: 12px; font-size: 13px; display: flex; align-items: center; gap: 8px;">
              <i data-lucide="check-circle" style="color: #10b981; width: 16px; height: 16px;"></i>
              <span>This idea has been converted into an active project in the <strong>Projects</strong> module.</span>
            </div>
            <a href="#projects" class="btn btn-sm btn-secondary" style="display: inline-flex; align-items: center; gap: 6px;">
              <i data-lucide="folder-kanban"></i>
              <span>Open in Projects Workspace</span>
            </a>
          ` : `
            <p style="font-size: 13px; color: var(--color-text-secondary); margin-bottom: 14px;">No projects currently linked. Ready to start building?</p>
            <button class="btn btn-sm btn-primary" onclick="Ideas.promoteToProject('${idea.id}')">
              <i data-lucide="arrow-up-right"></i>
              <span>Promote to Active Project</span>
            </button>
          `}
        </div>
      `;
    } else if (this.activeDetailTab === 'history') {
      tabContentHtml = `
        <div class="idea-detail-sections" style="font-size: 13px; color: var(--color-text-secondary); display: flex; flex-direction: column; gap: 10px;">
          <div><strong>Created:</strong> ${new Date(idea.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
          <div><strong>FOMO Bucket:</strong> ${idea.fomoBucket || 'Active'}</div>
          <div><strong>Priority:</strong> ${idea.priority || 'Medium'}</div>
          <div><strong>Status:</strong> ${idea.status || 'Active'}</div>
          <div><strong>Next Review:</strong> ${idea.reviewDateDisplay || 'Apr 30, 2024'}</div>
        </div>
      `;
    }

    panel.innerHTML = `
      <div class="card idea-detail-card">
        <!-- Detail Header -->
        <div class="idea-detail-topbar">
          <div class="idea-detail-identity">
            <div class="idea-icon-badge" style="background-color: ${catBg}; color: ${catColor}; width: 36px; height: 36px;">
              <i data-lucide="${catIcon}" style="width: 20px; height: 20px;"></i>
            </div>
            <div class="idea-detail-heading">
              <h3 class="idea-detail-title">${this.escapeHtml(idea.title)}</h3>
              <div class="idea-badges-row" style="margin-top: 4px;">
                <span class="idea-category-pill">${this.escapeHtml(idea.category || 'SaaS')}</span>
                <span class="idea-status-pill ${statusBadgeClass}">
                  <span class="status-dot" style="background-color: ${statusDotColor};"></span>
                  <span>${this.escapeHtml(idea.status || 'Active')}</span>
                </span>
              </div>
            </div>
          </div>

          <div class="idea-detail-top-actions">
            <button class="icon-btn" onclick="Ideas.toggleStar('${idea.id}', event)" title="${isStarred ? 'Unstar' : 'Star idea'}">
              <i data-lucide="star" style="width: 18px; height: 18px; fill: ${isStarred ? '#f59e0b' : 'none'}; stroke: ${isStarred ? '#f59e0b' : '#94a3b8'};"></i>
            </button>
            <div class="dropdown" style="display: inline-block; position: relative;">
              <button class="icon-btn" onclick="Ideas.toggleMenu(this)" title="More options">
                <i data-lucide="more-horizontal" style="width: 18px; height: 18px;"></i>
              </button>
              <div class="dropdown-menu idea-action-menu" style="display: none; position: absolute; right: 0; top: 100%; z-index: 20; min-width: 160px;">
                <button class="dropdown-item" onclick="Ideas.openEditIdeaModal('${idea.id}')">
                  <i data-lucide="edit-3"></i>
                  <span>Edit Idea</span>
                </button>
                <button class="dropdown-item" onclick="Ideas.promoteToProject('${idea.id}')">
                  <i data-lucide="arrow-up-right"></i>
                  <span>Promote to Project</span>
                </button>
                <button class="dropdown-item" onclick="Ideas.toggleArchive('${idea.id}', event)">
                  <i data-lucide="archive"></i>
                  <span>${idea.status === 'Archived' ? 'Restore' : 'Archive'}</span>
                </button>
                <div class="dropdown-divider"></div>
                <button class="dropdown-item text-danger" onclick="Ideas.confirmDeleteIdea('${idea.id}')">
                  <i data-lucide="trash-2"></i>
                  <span>Delete Idea</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs Row -->
        <div class="idea-detail-tabs">
          <button class="idea-detail-tab ${this.activeDetailTab === 'details' ? 'active' : ''}" onclick="Ideas.switchDetailTab('details')">Details</button>
          <button class="idea-detail-tab ${this.activeDetailTab === 'notes' ? 'active' : ''}" onclick="Ideas.switchDetailTab('notes')">Notes</button>
          <button class="idea-detail-tab ${this.activeDetailTab === 'related' ? 'active' : ''}" onclick="Ideas.switchDetailTab('related')">Related</button>
          <button class="idea-detail-tab ${this.activeDetailTab === 'history' ? 'active' : ''}" onclick="Ideas.switchDetailTab('history')">History</button>
        </div>

        <!-- Detail Content -->
        <div class="idea-detail-body">
          ${tabContentHtml}
        </div>

        <!-- Detail Footer -->
        <div class="idea-detail-footer">
          <div class="idea-review-meta">
            <i data-lucide="calendar" style="width: 16px; height: 16px; color: var(--color-text-secondary);"></i>
            <div>
              <div style="font-size: 11px; color: var(--color-text-secondary); text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">Next Review</div>
              <div style="font-size: 13px; font-weight: 600; color: var(--color-text-primary);">${this.escapeHtml(idea.reviewDateDisplay || 'Apr 30, 2024')}</div>
            </div>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="Ideas.openEditIdeaModal('${idea.id}')">
            <span>Update</span>
          </button>
        </div>
      </div>
    `;

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  },

  switchDetailTab(tabName) {
    this.activeDetailTab = tabName;
    this.renderDetail();
  },

  saveQuickNotes(id) {
    const input = document.getElementById('idea-quick-notes-input');
    if (!input) return;
    StorageService.updateIdea(id, { notes: input.value });
    window.LifeOS?.showToast?.('Notes saved successfully', 'success');
    this.renderDetail();
  },

  toggleMenu(btn) {
    const menu = btn.nextElementSibling;
    if (!menu) return;
    const isVisible = menu.style.display === 'block';
    // Hide all open dropdowns
    document.querySelectorAll('.idea-action-menu').forEach(m => m.style.display = 'none');
    menu.style.display = isVisible ? 'none' : 'block';

    // Click outside to close
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

window.Ideas = Ideas;

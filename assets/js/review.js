/**
 * LifeOS — Weekly Review Module (Step 15)
 * Manages weekly retrospective metrics, life area breakdown, wins & challenges highlights,
 * task volume charts, reflection auto-save, next week priorities, and productivity score.
 */

const WeeklyReview = {
  saveTimeout: null,

  init() {
    this.render();
    this.bindEvents();
  },

  bindEvents() {
    // Auto-save reflections on input
    const reflectionInputs = [
      'review-reflect-well',
      'review-reflect-wrong',
      'review-reflect-improve',
      'review-reflect-stop',
      'review-reflect-matters'
    ];

    reflectionInputs.forEach(id => {
      const el = document.getElementById(id);
      if (el && !el.dataset.bound) {
        el.dataset.bound = 'true';
        el.addEventListener('input', () => {
          this.handleReflectionInput();
        });
      }
    });
  },

  handleReflectionInput() {
    clearTimeout(this.saveTimeout);
    const saveIndicator = document.getElementById('review-save-indicator');
    if (saveIndicator) {
      saveIndicator.textContent = 'Saving...';
      saveIndicator.style.opacity = '1';
    }

    this.saveTimeout = setTimeout(() => {
      const reflections = {
        wentWell: document.getElementById('review-reflect-well')?.value || '',
        wentWrong: document.getElementById('review-reflect-wrong')?.value || '',
        improve: document.getElementById('review-reflect-improve')?.value || '',
        stopDoing: document.getElementById('review-reflect-stop')?.value || '',
        mattersMost: document.getElementById('review-reflect-matters')?.value || ''
      };

      StorageService.saveReflections(reflections);
      if (saveIndicator) {
        saveIndicator.textContent = '✓ Saved to storage';
        setTimeout(() => {
          if (saveIndicator) saveIndicator.style.opacity = '0.7';
        }, 1500);
      }
    }, 600);
  },

  togglePriority(id) {
    StorageService.togglePriorityItem(id);
    this.renderPriorities();
  },

  render() {
    const review = StorageService.getWeeklyReview();
    if (!review) return;

    this.renderKPIs(review.metrics);
    this.renderAreaBreakdown(review.areaBreakdown);
    this.renderHighlights(review.wins, review.challenges);
    this.renderTasksChart(review.tasksOverview);
    this.renderReflections(review.reflections);
    this.renderPriorities(review.priorities);
    this.renderWeeklyScore(review.weeklyScore);

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  },

  renderKPIs(metrics) {
    if (!metrics) return;

    const elTasks = document.getElementById('rev-kpi-tasks');
    const elMissed = document.getElementById('rev-kpi-missed');
    const elUpcoming = document.getElementById('rev-kpi-upcoming');
    const elHours = document.getElementById('rev-kpi-hours');
    const elSpent = document.getElementById('rev-kpi-spent');
    const elCollect = document.getElementById('rev-kpi-collect');

    if (elTasks) elTasks.textContent = metrics.tasksCompleted || 24;
    if (elMissed) elMissed.textContent = metrics.missedDeadlines || 3;
    if (elUpcoming) elUpcoming.textContent = metrics.upcomingDeadlines || 5;
    if (elHours) elHours.textContent = metrics.hoursFocused || 28.5;
    if (elSpent) elSpent.textContent = `৳ ${(metrics.moneySpent || 8240).toLocaleString()}`;
    if (elCollect) elCollect.textContent = `৳ ${(metrics.moneyToCollect || 25000).toLocaleString()}`;
  },

  renderAreaBreakdown(areas) {
    const container = document.getElementById('rev-area-breakdown-list');
    if (!container || !areas) return;

    let html = '';
    areas.forEach(item => {
      html += `
        <div class="rev-area-row">
          <div class="rev-area-label-col">
            <span class="rev-area-icon-wrap" style="color: ${item.color};">
              <i data-lucide="${item.icon || 'briefcase'}" style="width: 14px; height: 14px;"></i>
            </span>
            <span class="rev-area-name">${item.area}</span>
          </div>
          <div class="rev-area-bar-col">
            <div class="rev-area-bar-track">
              <div class="rev-area-bar-fill" style="width: ${item.pct}%; background-color: ${item.color};"></div>
            </div>
          </div>
          <div class="rev-area-hours-col">${item.hours}h</div>
          <div class="rev-area-pct-col">${item.pct}%</div>
        </div>
      `;
    });

    container.innerHTML = html;
  },

  renderHighlights(wins, challenges) {
    const winsContainer = document.getElementById('rev-wins-list');
    const challengesContainer = document.getElementById('rev-challenges-list');

    if (winsContainer && wins) {
      winsContainer.innerHTML = wins.map(w => `
        <div class="rev-highlight-item">
          <i data-lucide="check-circle" style="width: 15px; height: 15px; color: #10b981; flex-shrink: 0; margin-top: 1px;"></i>
          <span>${w}</span>
        </div>
      `).join('');
    }

    if (challengesContainer && challenges) {
      challengesContainer.innerHTML = challenges.map(c => `
        <div class="rev-highlight-item">
          <i data-lucide="alert-triangle" style="width: 15px; height: 15px; color: #ef4444; flex-shrink: 0; margin-top: 1px;"></i>
          <span>${c}</span>
        </div>
      `).join('');
    }
  },

  renderTasksChart(overview) {
    const chartContainer = document.getElementById('rev-tasks-chart');
    if (!chartContainer || !overview) return;

    let html = '';
    const maxTasks = 10;

    overview.forEach(dayItem => {
      const compHeight = Math.min(100, Math.round((dayItem.completed / maxTasks) * 100));
      const overHeight = Math.min(100, Math.round((dayItem.overdue / maxTasks) * 100));

      html += `
        <div class="rev-chart-col">
          <div class="rev-chart-bar-wrap">
            <div class="rev-bar-stack" style="height: ${compHeight + overHeight}%;">
              <div class="rev-bar-overdue" style="height: ${overHeight > 0 ? (overHeight / (compHeight + overHeight)) * 100 : 0}%;"></div>
              <div class="rev-bar-completed" style="height: ${compHeight > 0 ? (compHeight / (compHeight + overHeight)) * 100 : 0}%;"></div>
            </div>
          </div>
          <div class="rev-chart-day-label">${dayItem.day}</div>
        </div>
      `;
    });

    chartContainer.innerHTML = html;
  },

  renderReflections(reflections) {
    if (!reflections) return;

    const elWell = document.getElementById('review-reflect-well');
    const elWrong = document.getElementById('review-reflect-wrong');
    const elImprove = document.getElementById('review-reflect-improve');
    const elStop = document.getElementById('review-reflect-stop');
    const elMatters = document.getElementById('review-reflect-matters');

    if (elWell && !elWell.value) elWell.value = reflections.wentWell || '';
    if (elWrong && !elWrong.value) elWrong.value = reflections.wentWrong || '';
    if (elImprove && !elImprove.value) elImprove.value = reflections.improve || '';
    if (elStop && !elStop.value) elStop.value = reflections.stopDoing || '';
    if (elMatters && !elMatters.value) elMatters.value = reflections.mattersMost || '';
  },

  renderPriorities(prioritiesList) {
    const container = document.getElementById('rev-priorities-list');
    const countLabel = document.getElementById('rev-priorities-count');
    const review = StorageService.getWeeklyReview();
    const priorities = prioritiesList || (review ? review.priorities : []);

    if (!container || !priorities) return;

    const completedCount = priorities.filter(p => p.completed).length;
    if (countLabel) countLabel.textContent = `${completedCount} / ${priorities.length} completed`;

    let html = '';
    priorities.forEach((p, idx) => {
      // Area tag pill color
      let tagBg = '#eff6ff';
      let tagColor = '#2563eb';
      if (p.area === 'University') {
        tagBg = '#ecfdf5';
        tagColor = '#059669';
      } else if (p.area === 'Freelance') {
        tagBg = '#faf5ff';
        tagColor = '#7c3aed';
      } else if (p.area === 'Personal') {
        tagBg = '#fef2f2';
        tagColor = '#dc2626';
      } else if (p.area === 'Money') {
        tagBg = '#ecfdf5';
        tagColor = '#10b981';
      }

      html += `
        <div class="rev-priority-row ${p.completed ? 'completed' : ''}" onclick="WeeklyReview.togglePriority('${p.id}')">
          <div class="rev-prio-num">${idx + 1}</div>
          <input type="checkbox" class="rev-prio-checkbox" ${p.completed ? 'checked' : ''} onclick="event.stopPropagation(); WeeklyReview.togglePriority('${p.id}');">
          <span class="rev-prio-title ${p.completed ? 'strikethrough' : ''}">${p.title}</span>
          <span class="rev-prio-area" style="background-color: ${tagBg}; color: ${tagColor};">● ${p.area}</span>
          <span class="rev-prio-date">${p.date}</span>
        </div>
      `;
    });

    container.innerHTML = html;
  },

  renderWeeklyScore(score) {
    const scoreVal = document.getElementById('rev-score-val');
    const gaugeFill = document.getElementById('rev-score-gauge');

    if (scoreVal) scoreVal.textContent = `${score || 76}%`;
    if (gaugeFill) {
      // Set conic gradient or stroke dasharray based on score
      gaugeFill.style.background = `conic-gradient(#2563eb 0% ${score || 76}%, #e2e8f0 ${score || 76}% 100%)`;
    }
  }
};

window.WeeklyReview = WeeklyReview;

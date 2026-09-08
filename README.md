# LifeOS

> **A personal operating system for managing a busy life in one calm, focused place.**  
> *Capture everything. Prioritize clearly. Remember nothing manually.*

LifeOS is a lightweight, frontend-only personal operating system built with pure Vanilla HTML5, Vanilla CSS3, and Vanilla JavaScript. It requires zero backend servers, zero build steps, and zero frameworks.

---

## 🌟 Key Features

1. **Dashboard Overview**: Mountain graphic backdrop hero, Today's Focus task list, upcoming deadline indicators, life area workload distribution, and financial snapshot.
2. **Brain Dump / Inbox**: Rapid idea and task capture bar with multi-type chips (`Task`, `Reminder`, `Idea`, `Note`, `Money`, `Unsorted`), sorting, real-time search, and direct item conversion.
3. **Task Management**: Priority risk engine (`Safe`, `Attention`, `High Risk`), view tabs (`All`, `Today`, `Upcoming`, `Overdue`, `Completed`), and slide-out detail inspection drawer.
4. **Life Areas & Projects**: Grid and List views, project milestone checklists, progress meters, and right-side project drawer with Overview, Tasks, Notes, and Files tabs.
5. **Calendar & Deadlines**: Monthly interactive grid with day commitments and 14-day upcoming deadline tracking.
6. **Daily Planner**: Hourly timeblocking grid (6:00 AM – 11:00 PM) with drag/quick add and daily capacity limits (with burnout warnings).
7. **Finance & Cashflow**: Localized in Bangladeshi Taka (`৳ - BDT`), with spending category breakdown, monthly budget donut with remaining budget insights, "Should I Buy This?" impulse buy calculator, and 3 tab views: Transactions, Receivables (Money Lent), and Payables (Money Owed).
8. **Idea Vault**: Quick capture banner, mountain quote card, anti-FOMO buckets (`Active`, `Later`, `Someday`, `Archived`), star toggles, right detail panel, and "Promote to Project" action.
9. **Learning Tracker**: Active course/book tracking, hours planned progress, module checklist, backlog/week plan, and 7-day study streak widget.
10. **Reminders & Attention Center**: Live unread notification badge, attention dropdown with categorized alerts, and reminder creation modal with repeat schedules.
11. **Weekly Review**: Comprehensive weekly management report with 6 KPIs, area breakdown bars, week highlights (Wins & Challenges), Mon–Sun stacked bar chart, 5 auto-saving reflection textareas, 5 next-week priorities checkboxes, and 76% productivity donut gauge.
12. **Global Search & Command Center (`⌘K` / `Ctrl+K`)**: Floating modal searchable across all datasets with category filter chips and keyboard navigation.
13. **Settings, Life Areas & Dark Mode**: User profile customization, daily work hours, Bangladeshi Taka (`৳`) currency options, custom life areas manager, notification toggles, instant live theme switcher (`Light`, `Dark`, `System`), and JSON backup export / import / reset.

---

## ⌨️ Productivity Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + K` or `Cmd + K` | Open Global Search & Command Center |
| `Q` | Toggle Quick Add menu from anywhere |
| `Esc` | Close active modal dialog or dropdown |
| `G` then `D` | Navigate to **Dashboard** |
| `G` then `T` | Navigate to **Tasks** |
| `G` then `P` | Navigate to **Daily Planner** |
| `G` then `M` | Navigate to **Money** |
| `G` then `R` | Navigate to **Weekly Review** |
| `G` then `S` | Navigate to **Settings** |
| `G` then `I` | Navigate to **Inbox** |
| `G` then `L` | Navigate to **Learning** |
| `G` then `C` | Navigate to **Calendar** |
| `G` then `E` | Navigate to **Ideas** |
| `G` then `J` | Navigate to **Projects** |

---

## 🛠️ Tech Stack & Philosophy

- **Core:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Storage:** LocalStorage persistence across 15 structured keys
- **Typography:** Google Font *Plus Jakarta Sans*
- **Icons:** Lucide Icons CDN
- **Zero Frameworks:** No React, Vue, Angular, jQuery, Bootstrap, or Tailwind
- **Zero Build Step:** Runs directly in any modern browser

---

## 🚀 Getting Started

Simply open `index.html` in your browser or run any local HTTP server:

```bash
# Using Python
python -m http.server 8080

# Using Node.js npx
npx serve .
```

Open `http://localhost:8080` in your web browser.

---

## 📁 Project Structure

```text
/
├── index.html                 # Single page application structure & modals
├── requirement.md             # Full specification (Steps 1–32)
├── workdone.md                # Detailed implementation report & test log
├── README.md                  # Project overview & documentation
├── assets/
│   ├── css/
│   │   ├── style.css          # Main styling & design tokens
│   │   └── responsive.css     # Mobile viewport styles (down to 375px)
│   └── js/
│       ├── app.js             # Global initialization & shortcuts
│       ├── navigation.js      # Hash-based SPA router
│       ├── storage.js         # Centralized localStorage service & seeds
│       ├── dashboard.js       # Dashboard overview
│       ├── inbox.js           # Brain dump & capture
│       ├── tasks.js           # Task management & risk engine
│       ├── projects.js        # Projects & life areas
│       ├── calendar.js        # Calendar & deadlines
│       ├── planner.js         # Daily planner & timeblocking
│       ├── finance.js         # Finance & impulse calculator
│       ├── ideas.js           # Idea vault & anti-FOMO
│       ├── learning.js        # Learning tracker & streak
│       ├── review.js          # Weekly review & retrospective
│       ├── reminders.js       # Reminders & notification center
│       ├── search.js          # Global search (⌘K)
│       └── settings.js        # Settings & theme toggle
└── UI/                        # Visual mockup reference images
```

---

## 📄 License

MIT License. Designed and developed with care.

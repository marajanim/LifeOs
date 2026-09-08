# LifeOS — Frontend Requirements

## 1. Project Overview

LifeOS is a simple personal operating system for managing a busy life in one place.

The app should eventually help manage:

- Job
- University / Study
- Assignments
- Freelance Projects
- Personal Projects
- SaaS Ideas
- Learning
- Deadlines
- Daily Planning
- Income
- Expenses
- Money Lent to Others
- Money Owed to Others
- Reminders
- Weekly Reviews

The main goal is:

> Capture everything. Prioritize clearly. Remember nothing manually.

The first version should be simple, lightweight, fast, and built only with HTML, CSS, and Vanilla JavaScript.

---

# 2. Tech Stack

Use only:

- HTML5
- CSS3
- Vanilla JavaScript
- localStorage for frontend-only persistence
- Lucide Icons through CDN if icons are needed
- Google Fonts or a clean system font stack

Do not use:

- React
- Vue
- Angular
- jQuery
- Bootstrap
- Tailwind CSS
- Backend
- Database
- Authentication
- APIs unless specifically added in a later phase

---

# 3. General Development Rules

Follow these rules throughout the entire project:

1. Build one step at a time.
2. Do not implement future steps early.
3. Keep components reusable.
4. Avoid duplicating HTML, CSS, or JS.
5. Keep JavaScript modular where practical.
6. Use CSS variables for design tokens.
7. Keep the UI minimal and calm.
8. Avoid excessive gradients, glassmorphism, animation, or decoration.
9. Prioritize usability over visual effects.
10. Every page must be responsive.
11. No horizontal overflow.
12. Use semantic HTML.
13. Use accessible forms and buttons.
14. Use visible focus states.
15. Avoid console errors.
16. Store demo/user-created frontend data in localStorage.
17. Every destructive action should require confirmation.
18. Use empty states where lists have no data.
19. Use toast or inline feedback for successful actions.
20. Do not proceed automatically to the next development step.

---

# 4. Suggested Project Structure

```text
/
├── index.html
├── pages/
│   ├── dashboard.html
│   ├── inbox.html
│   ├── tasks.html
│   ├── projects.html
│   ├── calendar.html
│   ├── planner.html
│   ├── finance.html
│   ├── ideas.html
│   ├── learning.html
│   ├── review.html
│   └── settings.html
│
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   └── responsive.css
│   │
│   ├── js/
│   │   ├── app.js
│   │   ├── navigation.js
│   │   ├── storage.js
│   │   ├── utils.js
│   │   ├── tasks.js
│   │   ├── finance.js
│   │   ├── planner.js
│   │   ├── ideas.js
│   │   └── review.js
│   │
│   └── images/
│
└── requirement.md
```

The exact structure may be adjusted if necessary, but keep it simple and organized.

---

# 5. Design System

## Design Direction

The interface should feel:

- Minimal
- Modern
- Calm
- Professional
- Productivity-focused
- Lightweight
- Easy to scan
- Not overwhelming

Use:

- Plenty of whitespace
- Simple cards
- Subtle borders
- Very light shadows
- Clear typography hierarchy
- Consistent spacing
- Consistent icon style

Avoid:

- Excessive rounded corners
- Large gradients
- Glassmorphism
- Decorative 3D elements
- Heavy animation
- Complex dashboards
- Too many colors

## CSS Variables

Create variables for:

- Primary color
- Primary hover
- App background
- Surface background
- Secondary surface
- Border
- Text primary
- Text secondary
- Muted text
- Success
- Warning
- Danger
- Info
- Border radius
- Sidebar width
- Header height
- Page max width
- Spacing scale

Prepare the variable structure so dark mode can be added easily.

---

# 6. Navigation Structure

## Main

- Dashboard
- Inbox
- Tasks
- Calendar
- Daily Planner

## Workspaces

- Projects
- Learning
- Ideas

## Finance

- Money

## System

- Weekly Review
- Settings

---

# STEP 1 — Application Foundation

## Goal

Build the reusable layout and design foundation only.

## Requirements

Create:

- Desktop sidebar
- Responsive mobile sidebar
- Header
- Main content container
- Page heading component
- Reusable button styles
- Form styles
- Cards
- Badges
- Dropdowns
- Modal
- Empty state
- Toast notification style

### Sidebar

Top:

- LifeOS logo/name

Navigation:

- Dashboard
- Inbox
- Tasks
- Calendar
- Daily Planner
- Projects
- Learning
- Ideas
- Money
- Weekly Review
- Settings

Bottom:

- User avatar
- User name
- Settings shortcut

### Header

Left:

- Current page title

Right:

- Search
- Quick Add
- Notifications
- User avatar

### Quick Add Menu

Display options only:

- Task
- Expense
- Income
- Money Lent
- Reminder
- Idea

Do not implement the forms yet.

### Required Interactions

Implement:

- Sidebar open/close
- Mobile navigation
- Active navigation state
- Quick Add dropdown
- Notification dropdown placeholder
- Modal open/close
- Close modal using Escape
- Close dropdown when clicking outside

### Placeholder Pages

Create all main pages with proper title and short description.

Do not build page-specific functionality yet.

---

# STEP 2 — Dashboard

## Goal

Create the main overview screen.

## Dashboard Header

Show:

- Greeting
- Current date
- Short productivity message

Example:

> Good afternoon, Anim  
> Here's what needs your attention today.

## Dashboard Sections

### Today's Focus

Show maximum 5 important tasks.

Each item should show:

- Task title
- Area/project
- Deadline
- Priority
- Estimated time
- Checkbox

### Upcoming Deadlines

Show deadlines for:

- Today
- Tomorrow
- Next 7 days

Each should have urgency styling.

### Workload Snapshot

Show:

- Estimated work today
- Estimated work this week
- Number of overdue tasks
- Number of upcoming deadlines

### Financial Snapshot

Show:

- Income this month
- Expenses this month
- Remaining budget
- Money to collect
- Money to pay

### Waiting For

Show:

- People who owe money
- Tasks waiting for another person
- Pending approvals

### Active Projects

Show project name, progress, next deadline.

### Quick Capture

Provide one simple text input:

> What do you need to remember?

For now, save captured text into Inbox.

## localStorage

Dashboard data should read from existing frontend data sources.

---

# STEP 3 — Brain Dump / Inbox

## Goal

Make it extremely easy to capture anything before it is forgotten.

## Features

Create quick capture input.

User can add:

- Task
- Reminder
- Idea
- Note
- Money item
- Undefined item

Default type can be "Unsorted".

Each inbox item should show:

- Content
- Date created
- Type
- Processed/unprocessed status

## Actions

Allow:

- Edit
- Delete
- Mark processed
- Convert to task
- Convert to idea
- Convert to reminder

## Filters

- All
- Unprocessed
- Processed

## Search

Search inbox items by text.

## Storage

Persist all inbox items in localStorage.

---

# STEP 4 — Tasks

## Goal

Create the complete task management system.

## Task Fields

Each task should support:

- Title
- Description
- Area
- Project
- Priority
- Status
- Deadline
- Start date
- Estimated duration
- Actual duration
- Recurrence
- Tags
- Notes
- Created date
- Completed date

## Priority

- Low
- Medium
- High
- Critical

## Status

- To Do
- In Progress
- Waiting
- Completed
- Cancelled

## Views

Create:

- All Tasks
- Today
- Upcoming
- Overdue
- Completed

## Task Actions

Allow:

- Create
- Edit
- Delete
- Duplicate
- Complete
- Reopen

## Filters

Filter by:

- Area
- Project
- Priority
- Status
- Deadline
- Tags

## Sorting

Sort by:

- Deadline
- Priority
- Created date
- Estimated time

## Deadline Risk

Calculate a simple frontend risk label:

- Safe
- Attention
- High Risk
- Critical

Initial formula can consider:

- Deadline proximity
- Estimated hours remaining
- Task priority

Keep it understandable rather than mathematically complicated.

---

# STEP 5 — Life Areas & Projects

## Goal

Organize work into different parts of life.

## Default Areas

Create:

- Job
- University
- Freelance
- SaaS
- Personal
- Learning

Allow users to add custom areas.

## Area Fields

- Name
- Icon
- Optional color
- Description
- Active/inactive status

## Project Fields

- Name
- Area
- Description
- Status
- Start date
- Deadline
- Priority
- Estimated total hours
- Progress
- Notes

## Project Status

- Planned
- Active
- On Hold
- Completed
- Cancelled

## Project Detail

Show:

- Progress
- Deadline
- Related tasks
- Hours estimated
- Upcoming actions
- Notes

## Actions

Allow:

- Create
- Edit
- Archive
- Delete

---

# STEP 6 — Calendar & Deadlines

## Goal

Provide a simple visual overview of commitments.

## Views

Start with:

- Month view
- Upcoming list

Do not create an overly complex calendar.

## Calendar Items

Display:

- Tasks
- Project deadlines
- Assignment deadlines
- Reminders
- Money due dates

## Interactions

Clicking a date should show items for that date.

Clicking an item should open its detail modal.

## Styling

Use different small indicators for item types, but avoid excessive colors.

---

# STEP 7 — Daily Planner / Time Blocking

## Goal

Help decide what deserves time today.

## Day Structure

Show a daily timeline.

Default visible hours:

- 6 AM to 12 AM

Allow time blocks for:

- Job
- Study
- Freelance
- SaaS
- Learning
- Personal
- Break
- Custom

## Time Block Fields

- Title
- Type
- Start time
- End time
- Related task
- Notes

## Features

Allow:

- Create
- Edit
- Delete
- Mark complete

Show:

- Total planned hours
- Available hours
- Deep work hours
- Overbooked warning

## Capacity Warning

If total planned work is unrealistic, show warning such as:

> You have planned 11.5 hours of focused work today.

Do not automatically block user actions.

---

# STEP 8 — Finance Dashboard

## Goal

Give a simple overview of personal money.

## Summary Cards

Show:

- Total income this month
- Total expenses this month
- Current balance estimate
- Money to collect
- Money to pay
- Savings

## Spending Overview

Show expenses grouped by category.

Use simple CSS-based visual bars initially.

Avoid complex chart libraries.

## Monthly Comparison

Show:

- This month spending
- Previous month spending
- Difference

## Alerts

Examples:

- Budget nearly reached
- Unpaid receivable overdue
- Upcoming payable
- Unusually high spending category

---

# STEP 9 — Income & Expenses

## Transaction Fields

- Type
- Amount
- Category
- Date
- Account/payment method
- Description
- Related project
- Notes

## Transaction Types

- Income
- Expense

## Income Categories

Examples:

- Salary
- Freelance
- Business
- Gift
- Refund
- Other

## Expense Categories

Examples:

- Food
- Transport
- Shopping
- Education
- Family
- Entertainment
- Subscriptions
- Business
- Bills
- Other

## Features

Allow:

- Add
- Edit
- Delete
- Search
- Filter
- Sort

## Monthly Budget

Allow user to set:

- Overall monthly budget
- Optional category budgets

Show:

- Used
- Remaining
- Percentage used

---

# STEP 10 — Money Lent / Receivables

## Goal

Never forget money other people owe.

## Fields

- Person name
- Amount
- Date lent
- Expected return date
- Description
- Contact note
- Reminder frequency
- Status

## Status

- Pending
- Partially Paid
- Paid
- Written Off

## Features

Allow:

- Add payment received
- Partial repayment
- Mark paid
- Edit
- Delete
- Add reminder

## Overdue Logic

Clearly show:

- Due today
- Overdue days
- Upcoming

Example:

> Rahim owes ৳5,000 — 14 days overdue.

---

# STEP 11 — Money Owed / Payables

## Goal

Track money the user needs to pay.

## Fields

- Person/company
- Amount
- Reason
- Date created
- Due date
- Status
- Notes

## Status

- Pending
- Partially Paid
- Paid

## Features

Allow:

- Partial payment
- Mark paid
- Edit
- Delete

Show upcoming and overdue payables prominently.

---

# STEP 12 — Idea Vault

## Goal

Store ideas without letting them distract from active work.

## Idea Fields

- Title
- Description
- Category
- Problem
- Target user
- Potential solution
- Monetization idea
- Priority
- Status
- Review date
- Notes

## Status

- Inbox
- Research Later
- Promising
- Active
- Archived

## Categories

Examples:

- SaaS
- Content
- Business
- Feature
- Learning
- Personal

## Features

Allow:

- Add
- Edit
- Archive
- Delete
- Promote idea to active project

## FOMO Support

Clearly separate:

- Active
- Later
- Someday

The user should feel safe storing ideas without working on them immediately.

---

# STEP 13 — Learning Tracker

## Goal

Track coding, AI, courses, books, tutorials, and study topics.

## Learning Item Fields

- Title
- Type
- Topic
- Source
- Status
- Priority
- Start date
- Target completion date
- Progress
- Estimated hours
- Notes

## Types

- Course
- Book
- Tutorial
- Skill
- Documentation
- Research
- Other

## Status

- Planned
- Learning
- Paused
- Completed

## Features

Show:

- Active learning
- Learning backlog
- Completed items
- Hours planned
- Progress

---

# STEP 14 — Reminders

## Goal

Create a simple reminder system inside the frontend prototype.

## Reminder Fields

- Title
- Description
- Date
- Time
- Repeat
- Related item
- Status

## Repeat Options

- None
- Daily
- Weekly
- Monthly

## Reminder Types

- Task
- Deadline
- Money
- Personal
- Follow-up
- Custom

## Frontend Behavior

Since there is no backend yet:

- Show due reminders inside the app
- Show notification badges
- Optionally use browser Notification API if permission is granted

Do not build server push notifications yet.

---

# STEP 15 — Weekly Review

## Goal

Create a personal weekly management report.

## Summary

Show:

- Tasks completed
- Tasks overdue
- Missed deadlines
- Upcoming deadlines
- Hours planned
- Projects progressed
- Money earned
- Money spent
- Money to collect
- Money to pay

## Area Breakdown

Show activity for:

- Job
- University
- Freelance
- SaaS
- Learning
- Personal

## Reflection Questions

Provide editable fields:

- What went well?
- What went wrong?
- What should I improve next week?
- What should I stop doing?
- What matters most next week?

## Next Week Priorities

Allow user to select maximum 5 priorities.

Save weekly reviews in localStorage.

---

# STEP 16 — Global Search & Command Center

## Goal

Find anything quickly.

## Search Across

- Tasks
- Projects
- Inbox
- Ideas
- Learning
- Finance
- Reminders

## Search UI

Use a command-style modal.

Shortcut:

- Ctrl + K
- Cmd + K

## Commands

Allow quick actions such as:

- Add task
- Add expense
- Add income
- Add idea
- Go to planner
- Go to finance
- Go to inbox

Keep the command center simple.

---

# STEP 17 — Notifications & Attention Center

## Goal

Create one place for things needing attention.

## Types

- Overdue task
- Upcoming deadline
- Money overdue
- Upcoming payment
- Reminder
- Project deadline
- Waiting too long
- Budget warning

## Features

Allow:

- Mark as read
- Dismiss
- Open related item

## Notification Badge

Show unread count in header.

---

# STEP 18 — Settings

## Sections

### Profile

- Name
- Avatar
- Preferred greeting name

### Work Preferences

- Preferred work start time
- Preferred work end time
- Daily available hours
- Work days

### Areas

Manage life areas.

### Finance

- Currency
- Monthly budget
- Default categories

Default currency should support BDT / ৳.

### Notifications

Toggle:

- Deadline alerts
- Finance alerts
- Weekly review reminder
- Daily planning reminder

### Appearance

- Light mode
- Dark mode
- System mode

### Data

Buttons:

- Export data
- Import data
- Clear all local data

Use JSON export/import for frontend prototype.

Require confirmation before clearing data.

---

# STEP 19 — Dark Mode

## Goal

Add complete dark mode using existing CSS variables.

## Requirements

Support:

- Light
- Dark
- System

Persist preference in localStorage.

Make sure:

- Text contrast remains accessible
- Forms remain readable
- Cards and borders remain clear
- No hard-coded colors break dark mode

---

# STEP 20 — Responsive & Mobile Optimization

## Goal

Make the full application comfortable on smaller devices.

## Test Widths

At minimum test:

- 1440px
- 1200px
- 1024px
- 768px
- 480px
- 375px

## Mobile Rules

- Sidebar becomes off-canvas
- Tables can become cards where appropriate
- Forms stack vertically
- Dashboard becomes single-column
- Buttons remain touch-friendly
- Modals fit screen
- No horizontal overflow
- Finance lists stay readable
- Calendar remains usable

---

# STEP 21 — Demo Data & First-Time Experience

## Goal

Make the prototype easy to understand immediately.

## First Visit

Show a simple welcome state.

Allow:

- Start empty
- Load demo data

## Demo Data

Create realistic sample data for:

- Job
- University
- Freelance
- SaaS
- Learning
- Expenses
- Receivables
- Deadlines

Do not use excessive fake data.

---

# STEP 22 — Data Storage Layer

## Goal

Centralize all localStorage usage.

Create a reusable storage module.

Suggested functions:

```js
getData(key)
saveData(key, value)
addItem(key, item)
updateItem(key, id, updates)
deleteItem(key, id)
generateId()
exportAllData()
importAllData()
```

Do not allow each page to invent different storage patterns.

Define clear storage keys such as:

```text
lifeos_tasks
lifeos_projects
lifeos_inbox
lifeos_transactions
lifeos_receivables
lifeos_payables
lifeos_ideas
lifeos_learning
lifeos_reminders
lifeos_timeblocks
lifeos_weekly_reviews
lifeos_settings
```

---

# STEP 23 — Cross-Feature Integration

## Goal

Make the separate pages work as one system.

Implement connections such as:

- Project page shows related tasks
- Dashboard reads actual task data
- Calendar shows deadlines
- Planner can connect blocks to tasks
- Finance dashboard reads transactions
- Receivables appear in Attention Center
- Weekly Review reads actual statistics
- Inbox can convert items to other types
- Idea can become project
- Global search finds all major item types

Avoid duplicating data unnecessarily.

Use IDs to reference related records.

---

# STEP 24 — Smart Priority & Deadline Risk

## Goal

Add simple rule-based intelligence without AI.

## Priority Suggestions

Consider:

- Deadline proximity
- User priority
- Estimated time
- Overdue state
- Project importance

## Risk Levels

- Safe
- Attention
- High Risk
- Critical

## Example Logic

A task can become high risk when:

- It is due soon
- It requires several hours
- User has limited free time
- It is still not started

Keep all logic transparent.

Display a small explanation when useful.

Example:

> High Risk: 5 hours estimated, deadline tomorrow.

Do not create fake machine-learning behavior.

---

# STEP 25 — Capacity Planning

## Goal

Prevent unrealistic workloads.

## Weekly Capacity

Use settings to define:

- Work hours
- Study hours
- Freelance capacity
- Personal project capacity
- Learning capacity

## Compare

Compare:

- Available hours
- Estimated scheduled hours

## Warning

Example:

> You planned 34 hours of additional work but only have 22 hours available this week.

Suggest areas that can be delayed.

Suggestions should be informational only.

---

# STEP 26 — Spending Awareness

## Goal

Help reduce careless spending.

## Purchase Check

Create a small feature:

### Should I Buy This?

Fields:

- Item
- Price
- Category

Show:

- Current monthly spending
- Remaining budget
- Budget percentage this purchase uses
- Remaining amount after purchase

Optional warning:

> This purchase would use 62% of your remaining discretionary budget.

Do not block purchases.

---

# STEP 27 — Waiting For System

## Goal

Track things dependent on other people.

## Waiting Item Fields

- Title
- Person
- Type
- Started date
- Expected date
- Notes
- Status

## Types

- Money
- Approval
- Response
- Document
- Work
- Other

## Status

- Waiting
- Completed
- Cancelled

Show waiting duration.

Example:

> Waiting for client approval — 6 days.

Integrate waiting items with Dashboard and Notifications.

---

# STEP 28 — Quick Add System

## Goal

Make data entry fast from anywhere.

Quick Add should support:

- Task
- Expense
- Income
- Money Lent
- Money Owed
- Reminder
- Idea
- Inbox Note
- Time Block

Each form should be concise.

Do not expose every advanced field in Quick Add.

Include a link/button:

> More options

That can open the full form.

---

# STEP 29 — Keyboard & Productivity Shortcuts

## Goal

Make desktop usage faster.

Suggested shortcuts:

- Ctrl/Cmd + K → Global search
- Q → Quick Add when not typing in a field
- Esc → Close modal/dropdown
- G then D → Dashboard
- G then T → Tasks
- G then P → Planner
- G then M → Money

Ensure shortcuts do not interfere with normal typing.

---

# STEP 30 — Final UX Polish

## Review Entire Application

Check:

- Navigation consistency
- Typography
- Spacing
- Form behavior
- Empty states
- Loading-like transitions if needed
- Error messages
- Confirmation dialogs
- Toast messages
- Responsive behavior
- Keyboard navigation
- Dark mode
- localStorage persistence
- Data export/import
- Browser console

## Remove

- Unused CSS
- Unused JS
- Placeholder text that should no longer exist
- Duplicate components
- Dead links
- Broken buttons
- Console logs used for debugging

---

# STEP 31 — Final Frontend QA

Test these complete user journeys.

## Journey 1 — Task

1. Add task
2. Set deadline
3. Assign project
4. See it on Tasks
5. See it on Dashboard
6. See it in Calendar
7. Add it to Planner
8. Complete it
9. Confirm Weekly Review reflects completion

## Journey 2 — Money Lent

1. Add money lent
2. Set due date
3. See finance balance
4. See it under Waiting For
5. Let due date become overdue using test data
6. Verify alert
7. Add partial repayment
8. Mark fully paid

## Journey 3 — Expense

1. Add expense
2. Confirm finance totals update
3. Confirm category spending updates
4. Confirm monthly budget updates

## Journey 4 — Idea

1. Add idea
2. Move to Later
3. Promote to active project
4. Confirm project created

## Journey 5 — Inbox

1. Capture unsorted thought
2. Convert to task
3. Confirm task appears correctly
4. Confirm inbox item becomes processed

Fix all issues before considering the frontend complete.

---

# STEP 32 — Prepare for Future Backend Migration

Do not implement a backend yet.

Prepare the frontend code so localStorage can later be replaced by APIs.

## Requirements

Keep data operations centralized.

UI code should not directly depend heavily on localStorage.

Prefer:

```js
StorageService.getTasks()
StorageService.saveTask(task)
```

Instead of calling:

```js
localStorage.getItem(...)
```

everywhere.

## Future Stack Possibility

Later the frontend may be migrated to:

- Next.js
- TypeScript
- PostgreSQL
- Supabase or another backend
- Authentication
- Server notifications
- AI planning

Do not implement those technologies in the current HTML/CSS/JS version.

---

# Future Phase — AI Features

These features are intentionally OUTSIDE the first frontend prototype.

Do not implement them until the normal app works well.

Potential future AI features:

- Natural-language brain dump parsing
- Automatic task categorization
- Automatic priority recommendations
- Suggested daily plan
- Deadline risk explanations
- Weekly summary generation
- Spending insights
- FOMO/priority suggestions
- Workload balancing
- Natural-language search

Example future input:

> Submit CSE assignment Friday, collect 5k from Rahim, client homepage revision Thursday, learn Next.js later.

Future AI could convert it into structured records automatically.

For now, keep Brain Dump manual/simple.

---

# Definition of Done

The HTML/CSS/JS prototype is complete when:

- All pages work
- Navigation works
- User data persists in localStorage
- Tasks work
- Projects work
- Daily planner works
- Calendar shows commitments
- Finance works
- Receivables and payables work
- Ideas work
- Learning tracker works
- Weekly Review works
- Search works
- Notifications work inside the app
- Dark mode works
- Responsive design works
- Data can be exported/imported
- Important cross-feature data stays synchronized
- No major console errors exist
- No major placeholder features remain

The product should remain simple.

Do not turn LifeOS into an enterprise project-management tool.

The experience should answer four questions quickly:

1. What do I need to do?
2. What should I do first?
3. What am I forgetting?
4. Where is my money going?

---

# Instructions for Coding AI

When working from this file:

1. Read the full requirement first.
2. Identify the current requested STEP.
3. Work ONLY on that step.
4. Do not implement later steps unless required as a dependency.
5. Preserve all previously completed functionality.
6. Do not redesign previously approved UI without a reason.
7. Test the completed step.
8. Fix console errors.
9. Verify responsive behavior.
10. Report:
   - Files changed
   - Features completed
   - Bugs fixed
   - Any limitations
11. Stop after completing the requested step.
12. Wait for the next step instruction.

Recommended instruction format:

> Read requirement.md carefully. We are currently working only on STEP X. Complete STEP X according to the requirements. Preserve all existing functionality and design. Do not proceed to STEP X+1. Test your work before finishing.

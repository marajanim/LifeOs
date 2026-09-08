# LifeOS Backend Architecture & Step-by-Step Requirements

## 1. Purpose

This document defines the backend architecture for **LifeOS**, a personal operating system for managing:

- Job work
- University / Study
- Assignments
- Freelance projects
- SaaS projects
- Learning
- Ideas
- Tasks and deadlines
- Daily planning
- Income and expenses
- Money lent to others
- Money owed to others
- Reminders
- Waiting-for items
- Weekly reviews

The backend must remain:

- Simple
- Secure
- Efficient
- Free-hostable during MVP development
- Easy to maintain
- Easy to migrate later
- Suitable for relational data
- Suitable for future mobile apps
- Suitable for future AI features
- Suitable for future SaaS users

---

# 2. Recommended Stack

## Frontend

- HTML5
- CSS3
- Vanilla JavaScript

## Frontend Hosting

- Cloudflare Pages

## Backend Platform

- Supabase

## Database

- PostgreSQL

## Authentication

- Supabase Auth

## Frontend-to-Backend Communication

- Supabase JavaScript SDK
- Supabase Data API

## Authorization

- PostgreSQL Row Level Security (RLS)

## Server-Side Logic

- Supabase Edge Functions

## Scheduled Jobs

- Supabase Cron / PostgreSQL pg_cron

## File Storage

- Supabase Storage

## Future AI

- OpenAI API through Supabase Edge Functions only

## Source Control

- GitHub

---

# 3. High-Level Backend Architecture

```text
                           ┌─────────────────────┐
                           │        USER         │
                           └──────────┬──────────┘
                                      │ HTTPS
                                      ▼
                       ┌───────────────────────────┐
                       │     CLOUDFLARE PAGES      │
                       │                           │
                       │ HTML + CSS + JavaScript   │
                       │ Supabase JS SDK           │
                       └─────────────┬─────────────┘
                                     │
                                     ▼
                       ┌───────────────────────────┐
                       │      SUPABASE AUTH        │
                       │                           │
                       │ Email / Password          │
                       │ OAuth later               │
                       │ JWT / Session             │
                       └─────────────┬─────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────┐
│                            SUPABASE                                │
│                                                                    │
│   ┌────────────────────────────────────────────────────────────┐   │
│   │                    POSTGRESQL                              │   │
│   │                                                            │   │
│   │ profiles                                                   │   │
│   │ areas                                                      │   │
│   │ projects                                                   │   │
│   │ tasks                                                      │   │
│   │ inbox_items                                                │   │
│   │ time_blocks                                                │   │
│   │ transactions                                               │   │
│   │ receivables                                                │   │
│   │ receivable_payments                                       │   │
│   │ payables                                                   │   │
│   │ payable_payments                                          │   │
│   │ ideas                                                      │   │
│   │ learning_items                                             │   │
│   │ reminders                                                  │   │
│   │ waiting_items                                              │   │
│   │ weekly_reviews                                             │   │
│   │ user_settings                                              │   │
│   │ notifications                                              │   │
│   │                                                            │   │
│   │ RLS + Constraints + Foreign Keys + Indexes                 │   │
│   └────────────────────────────────────────────────────────────┘   │
│                                                                    │
│   ┌────────────────────────────────────────────────────────────┐   │
│   │                  EDGE FUNCTIONS                            │   │
│   │                                                            │   │
│   │ AI brain dump parser                                      │   │
│   │ Weekly summary generation                                 │   │
│   │ Reminder processing                                       │   │
│   │ Secure external API calls                                 │   │
│   │ Complex multi-step operations                             │   │
│   └────────────────────────────────────────────────────────────┘   │
│                                                                    │
│   ┌────────────────────────────────────────────────────────────┐   │
│   │                  CRON / PG_CRON                            │   │
│   │                                                            │   │
│   │ Reminder checks                                            │   │
│   │ Deadline checks                                            │   │
│   │ Receivable follow-up                                      │   │
│   │ Weekly review jobs                                        │   │
│   └────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────┘
```

---

# 4. Core Architecture Principles

1. Use PostgreSQL as the source of truth.
2. Use Supabase Auth for authentication.
3. Use Row Level Security on every user-owned table.
4. Never trust the frontend for authorization.
5. Never expose service-role credentials to the browser.
6. Do not use Node.js/Express initially.
7. Use direct Supabase CRUD for normal database operations.
8. Use Edge Functions only for server-only or sensitive logic.
9. Use database constraints in addition to frontend validation.
10. Use foreign keys for relationships.
11. Use indexes only where common queries need them.
12. Store timestamps using timezone-aware PostgreSQL types.
13. Store money using NUMERIC, never FLOAT.
14. Keep the data layer modular so the frontend can later migrate to Next.js.
15. Do not add Redis, queues, Docker, microservices, or Kubernetes during MVP.
16. Build one backend step at a time.
17. Keep SQL migrations in source control.

---

# 5. Core User Ownership Rule

Every private record must belong to an authenticated user.

Most user-owned tables must contain:

```sql
user_id uuid not null references auth.users(id)
```

Examples:

```text
projects.user_id
tasks.user_id
ideas.user_id
transactions.user_id
receivables.user_id
payables.user_id
learning_items.user_id
time_blocks.user_id
reminders.user_id
waiting_items.user_id
weekly_reviews.user_id
```

RLS must enforce:

```sql
user_id = auth.uid()
```

for:

- SELECT
- INSERT
- UPDATE
- DELETE

---

# 6. Core Database Tables

## 6.1 profiles

Purpose:

Store application-specific profile data.

Suggested fields:

```text
id
full_name
display_name
avatar_url
timezone
currency
created_at
updated_at
```

Rules:

- `id` should equal the Supabase Auth user ID.
- Default timezone may be `Asia/Dhaka`.
- Default currency may be `BDT`.

---

## 6.2 areas

Purpose:

Represent major life areas.

Default values:

```text
Job
University
Freelance
SaaS
Personal
Learning
```

Suggested fields:

```text
id
user_id
name
slug
icon
color
description
is_active
sort_order
created_at
updated_at
```

---

## 6.3 projects

Suggested fields:

```text
id
user_id
area_id
name
description
status
priority
start_date
deadline
estimated_total_minutes
progress_percent
notes
created_at
updated_at
archived_at
```

Statuses:

```text
planned
active
on_hold
completed
cancelled
```

Priorities:

```text
low
medium
high
critical
```

---

## 6.4 tasks

Suggested fields:

```text
id
user_id
area_id
project_id
title
description
status
priority
start_at
deadline_at
estimated_minutes
actual_minutes
recurrence_rule
notes
completed_at
created_at
updated_at
```

Statuses:

```text
todo
in_progress
waiting
completed
cancelled
```

Priorities:

```text
low
medium
high
critical
```

Important:

- `project_id` should be nullable.
- `area_id` may be nullable.
- `deadline_at` should use `timestamptz`.
- `estimated_minutes` should be integer.

---

## 6.5 inbox_items

Suggested fields:

```text
id
user_id
content
item_type
status
converted_entity_type
converted_entity_id
created_at
processed_at
updated_at
```

Item types:

```text
unsorted
task
reminder
idea
note
money
```

Statuses:

```text
unprocessed
processed
converted
```

---

## 6.6 time_blocks

Suggested fields:

```text
id
user_id
task_id
area_id
title
category
start_at
end_at
notes
is_completed
created_at
updated_at
```

Constraint:

```text
end_at > start_at
```

---

## 6.7 transactions

Suggested fields:

```text
id
user_id
project_id
transaction_type
amount
category
transaction_date
payment_method
description
notes
created_at
updated_at
```

Transaction types:

```text
income
expense
```

Money type:

```sql
numeric(14,2)
```

---

## 6.8 receivables

Suggested fields:

```text
id
user_id
person_name
original_amount
remaining_amount
date_lent
due_date
description
status
reminder_frequency_days
notes
created_at
updated_at
paid_at
```

Statuses:

```text
pending
partially_paid
paid
written_off
```

---

## 6.9 receivable_payments

Suggested fields:

```text
id
user_id
receivable_id
amount
payment_date
notes
created_at
```

Purpose:

Track partial and final repayments.

---

## 6.10 payables

Suggested fields:

```text
id
user_id
person_or_company
original_amount
remaining_amount
date_created
due_date
reason
status
notes
created_at
updated_at
paid_at
```

Statuses:

```text
pending
partially_paid
paid
```

---

## 6.11 payable_payments

Suggested fields:

```text
id
user_id
payable_id
amount
payment_date
notes
created_at
```

---

## 6.12 ideas

Suggested fields:

```text
id
user_id
title
description
category
problem
target_user
potential_solution
monetization_idea
priority
status
review_date
notes
promoted_project_id
created_at
updated_at
archived_at
```

Statuses:

```text
inbox
later
someday
promising
active
archived
```

---

## 6.13 learning_items

Suggested fields:

```text
id
user_id
title
learning_type
topic
source_url
status
priority
start_date
target_completion_date
progress_percent
estimated_minutes
actual_minutes
notes
created_at
updated_at
completed_at
```

Types:

```text
course
book
tutorial
skill
documentation
research
other
```

Statuses:

```text
planned
learning
paused
completed
```

---

## 6.14 reminders

Suggested fields:

```text
id
user_id
title
description
reminder_type
remind_at
repeat_rule
related_entity_type
related_entity_id
status
last_sent_at
next_run_at
created_at
updated_at
```

Statuses:

```text
active
completed
cancelled
```

---

## 6.15 waiting_items

Suggested fields:

```text
id
user_id
title
person_name
waiting_type
started_at
expected_at
notes
status
created_at
updated_at
completed_at
```

Types:

```text
money
approval
response
document
work
other
```

Statuses:

```text
waiting
completed
cancelled
```

---

## 6.16 weekly_reviews

Suggested fields:

```text
id
user_id
week_start
week_end
tasks_completed
tasks_overdue
missed_deadlines
focused_minutes
money_earned
money_spent
money_to_collect
money_to_pay
what_went_well
what_went_wrong
improvement_next_week
stop_doing
what_matters_most
summary_json
created_at
updated_at
```

---

## 6.17 user_settings

Suggested fields:

```text
id
user_id
preferred_work_start
preferred_work_end
daily_available_minutes
work_days
monthly_budget
currency
timezone
appearance
deadline_alerts
finance_alerts
weekly_review_reminder
daily_planning_reminder
created_at
updated_at
```

---

## 6.18 notifications

Suggested fields:

```text
id
user_id
notification_type
title
message
related_entity_type
related_entity_id
is_read
created_at
read_at
```

---

# 7. Relationship Model

```text
auth.users
    │
    └── profiles
    │
    ├── areas
    │     └── projects
    │           └── tasks
    │
    ├── inbox_items
    ├── time_blocks
    ├── transactions
    ├── receivables
    │      └── receivable_payments
    ├── payables
    │      └── payable_payments
    ├── ideas
    ├── learning_items
    ├── reminders
    ├── waiting_items
    ├── weekly_reviews
    ├── user_settings
    └── notifications
```

---

# 8. Database Data-Type Rules

## IDs

Use:

```sql
uuid
```

Prefer:

```sql
gen_random_uuid()
```

## Money

Use:

```sql
numeric(14,2)
```

Never use:

```text
float
double precision
```

for money.

## Date and Time

Use:

```sql
timestamptz
```

for:

- deadlines
- reminders
- time blocks
- created_at
- updated_at
- completed_at

Use:

```sql
date
```

for date-only values where time is irrelevant.

## Status / Type Values

Prefer:

- text fields
- CHECK constraints

Example:

```sql
check (
  priority in ('low', 'medium', 'high', 'critical')
)
```

---

# 9. Required Database Constraints

The database should reject invalid values even if frontend validation fails.

Examples:

```text
amount > 0
estimated_minutes >= 0
actual_minutes >= 0
progress_percent between 0 and 100
remaining_amount >= 0
end_at > start_at
```

Use foreign keys consistently.

Use:

- `ON DELETE CASCADE` when child data has no independent value
- `ON DELETE SET NULL` when historical records should survive

Do not accidentally delete finance history when a project is deleted.

---

# 10. RLS Architecture

Enable RLS on every private exposed table.

Example:

```sql
alter table tasks enable row level security;
```

## SELECT

```sql
using (user_id = auth.uid())
```

## INSERT

```sql
with check (user_id = auth.uid())
```

## UPDATE

```sql
using (user_id = auth.uid())
with check (user_id = auth.uid())
```

## DELETE

```sql
using (user_id = auth.uid())
```

---

# 11. Cross-User Relationship Protection

Do not allow this:

```text
User A creates a task
user_id = User A
project_id = User B's project
```

The backend must validate ownership of referenced records.

Use one or more of:

- RLS subqueries
- secure helper functions
- PostgreSQL functions
- ownership constraints
- validated RPC operations

Never assume a foreign key alone protects ownership.

---

# 12. Authentication Architecture

## MVP

Use:

- Email
- Password

Flow:

```text
Sign Up
   ↓
Supabase Auth
   ↓
Auth user created
   ↓
Profile created
   ↓
Settings created
   ↓
Default areas created
   ↓
User enters LifeOS
```

## Later

Optional:

- Google OAuth
- Apple OAuth
- Magic Link

Do not implement social authentication until email/password is stable.

---

# 13. Automatic New-User Initialization

Use a secure database trigger after a new auth user is created.

It should create:

1. profile
2. user settings
3. default areas

Default areas:

```text
Job
University
Freelance
SaaS
Personal
Learning
```

---

# 14. Frontend Data-Service Architecture

Do not scatter direct Supabase queries everywhere.

Create reusable data services.

Suggested files:

```text
/assets/js/services/auth-service.js
/assets/js/services/profile-service.js
/assets/js/services/project-service.js
/assets/js/services/task-service.js
/assets/js/services/inbox-service.js
/assets/js/services/planner-service.js
/assets/js/services/finance-service.js
/assets/js/services/idea-service.js
/assets/js/services/learning-service.js
/assets/js/services/reminder-service.js
/assets/js/services/notification-service.js
```

Example API:

```javascript
TaskService.getAll()
TaskService.getById(id)
TaskService.create(data)
TaskService.update(id, data)
TaskService.complete(id)
TaskService.delete(id)
```

The UI should call services rather than raw database methods.

---

# 15. Direct Supabase Queries vs Edge Functions

## Use Direct Supabase Queries For

- Standard task CRUD
- Project CRUD
- Inbox CRUD
- Learning CRUD
- Idea CRUD
- Time-block CRUD
- Transaction CRUD
- Waiting-item CRUD
- User settings

## Use Edge Functions For

- AI processing
- Secure external APIs
- Scheduled reminder delivery
- Secure email delivery
- Complex server-only workflows
- Future billing webhooks
- Multi-step operations that cannot safely be handled with simple CRUD

Do not create an Edge Function just to insert a task.

---

# 16. Edge Function Security Rules

Every user-specific Edge Function must:

1. Require authentication.
2. Validate the auth token.
3. Derive the user ID from authenticated context.
4. Never trust `user_id` supplied by the frontend.
5. Validate request data.
6. Return safe error messages.
7. Never return secrets.
8. Keep private keys in server-side secrets.
9. Avoid unnecessary service-role usage.
10. Be idempotent where scheduled/retry behavior exists.

---

# 17. Scheduled Jobs Architecture

## Reminder Processing

```text
Cron
  ↓
Find active reminders where next_run_at <= now()
  ↓
Process reminder
  ↓
Create notification
  ↓
Update last_sent_at
  ↓
Calculate next_run_at
```

## Deadline Risk

```text
Cron
  ↓
Find incomplete tasks with approaching deadlines
  ↓
Calculate deterministic risk
  ↓
Create notification if necessary
```

## Finance Follow-Up

```text
Cron
  ↓
Find overdue receivables/payables
  ↓
Create finance notification
```

## Weekly Review

```text
Cron
  ↓
Aggregate weekly statistics
  ↓
Store weekly review metrics
```

---

# 18. Deadline Risk Logic

Do not use AI initially.

Use deterministic rules.

Possible levels:

```text
safe
attention
high_risk
critical
```

Example:

```text
completed
→ safe

overdue
→ critical

deadline < 24h and estimated_minutes >= 180
→ high_risk

deadline < 48h
→ attention
```

Keep the rules transparent.

---

# 19. Finance Rules

Finance is highly private.

Requirements:

1. RLS on every finance table.
2. NUMERIC money fields.
3. Amount must be greater than 0.
4. Remaining balance cannot go below 0.
5. Partial payment updates must be atomic.
6. Never store bank passwords.
7. Never store full card details.
8. Future financial integrations must be server-side.

---

# 20. Partial-Payment Architecture

Example:

```text
Receivable remaining = ৳5,000

Payment received = ৳2,000
```

Atomic operation:

```text
INSERT receivable_payment 2000
UPDATE remaining_amount = 3000
UPDATE status = partially_paid
```

Final payment:

```text
remaining_amount = 0
status = paid
paid_at = now()
```

Use a secure PostgreSQL function / RPC so all changes succeed or roll back together.

Use the same approach for payables.

---

# 21. Database Transaction Use Cases

Use PostgreSQL functions/RPC for multi-step operations such as:

- Record receivable payment
- Record payable payment
- Convert inbox item to task
- Convert inbox item to reminder
- Convert inbox item to idea
- Promote idea to project

If one step fails, roll back the whole operation.

---

# 22. Index Strategy

Start with useful indexes only.

Recommended:

```sql
tasks(user_id)
tasks(user_id, status)
tasks(user_id, deadline_at)
tasks(project_id)

projects(user_id, status)
projects(user_id, area_id)

transactions(user_id, transaction_date)
transactions(user_id, transaction_type)

receivables(user_id, due_date)
receivables(user_id, status)

payables(user_id, due_date)
payables(user_id, status)

reminders(user_id, next_run_at)

time_blocks(user_id, start_at)

ideas(user_id, status)

learning_items(user_id, status)
```

Do not index every column.

---

# 23. Views / RPC for Aggregation

Possible useful views/functions later:

```text
dashboard_summary
upcoming_deadlines
monthly_finance_summary
overdue_receivables
weekly_task_metrics
active_projects_summary
```

Only add them when repeated client queries justify them.

---

# 24. Audit Fields

Most tables should contain:

```text
created_at
updated_at
```

Use:

```sql
default now()
```

Create a reusable `updated_at` trigger.

---

# 25. Environment Variables

The frontend may contain only public configuration:

```text
SUPABASE_URL
SUPABASE_PUBLISHABLE_KEY
```

Never expose:

```text
SUPABASE_SERVICE_ROLE_KEY
OPENAI_API_KEY
EMAIL_SECRET
PAYMENT_SECRET
```

Private secrets belong only in Edge Function environment variables/secrets.

---

# 26. Development vs Production

Eventually maintain separate environments:

```text
Development Supabase Project
Production Supabase Project
```

Do not test destructive schema changes directly in production.

---

# 27. SQL Migrations

All schema changes should be reproducible.

Keep migrations for:

- Tables
- Constraints
- RLS
- Policies
- Indexes
- Functions
- Triggers
- Views

Do not depend entirely on manual dashboard clicks.

---

# 28. Backup Strategy

During MVP:

- Free hosting is acceptable.
- Periodic manual export is acceptable.

Before real paying users:

- Use proper automated backups.
- Verify restore procedures.
- Do not rely indefinitely on hobby-tier infrastructure for critical finance/task data.

---

# 29. Future AI Architecture

Never call OpenAI directly from browser JavaScript.

Correct flow:

```text
Frontend
   ↓
Supabase Edge Function
   ↓
OpenAI API
   ↓
Validated structured result
   ↓
User confirms
   ↓
PostgreSQL
```

Potential AI features:

- Brain dump parser
- Automatic categorization
- Priority suggestion
- Daily-plan suggestion
- Weekly summary
- Spending insight
- Workload-balancing suggestions

AI should suggest, not silently make destructive changes.

---

# 30. Future Mobile Architecture

The backend should remain frontend-agnostic.

```text
Web App
   │
Android App
   │
iOS App
   │
   ▼
Supabase
```

This allows the same auth/database/backend to support web and mobile.

---

# 31. Backend MVP Definition of Done

The backend MVP is complete when:

- Sign up works
- Login works
- Logout works
- Session restoration works
- Profile auto-creation works
- Default areas auto-create
- Projects persist
- Tasks persist
- Inbox persists
- Planner persists
- Transactions persist
- Receivables persist
- Payables persist
- Ideas persist
- Learning persists
- Waiting items persist
- Reminders persist
- Weekly review persists
- Settings persist
- Notifications work
- RLS is enabled
- User A cannot access User B data
- No service-role key exists in frontend code
- Finance payment logic is atomic
- Persistent data no longer depends on localStorage
- SQL migrations exist
- Common queries are indexed

---

# 32. STEP-BY-STEP BACKEND IMPLEMENTATION PLAN

---

# BACKEND STEP 1 — Supabase Foundation

## Goal

Connect the existing HTML/CSS/JS application to Supabase.

## Requirements

- Create Supabase project.
- Add Supabase JS SDK.
- Create reusable Supabase client module.
- Keep the service-role key private.
- Verify connection.

Suggested file:

```text
/assets/js/supabase-client.js
```

## Coding AI Prompt

> Read `backend_requirement.md` carefully. We are working only on BACKEND STEP 1 — Supabase Foundation. Add the Supabase JavaScript client architecture to the existing HTML/CSS/JS LifeOS project. Use only the public project URL and publishable client key in browser-side configuration. Never expose the service-role key. Create a reusable client module and a small safe connection test. Do not create the full database schema, authentication, tasks, projects, or other backend features yet. Test the integration, report files changed and any manual configuration I must provide, then stop.

---

# BACKEND STEP 2 — Authentication

## Goal

Implement secure email/password authentication.

## Requirements

- Sign up
- Login
- Logout
- Session restore
- Protected pages
- Redirect unauthenticated users to login
- Redirect authenticated users away from auth pages

## Prompt

> Read `backend_requirement.md`. Complete only BACKEND STEP 2 — Authentication. Implement email/password sign up, login, logout, session persistence, protected application pages, and correct redirects using Supabase Auth. Preserve the current LifeOS frontend design. Do not create the full application database schema yet. Test signup, login, page refresh/session restoration, logout, and unauthorized access. Do not proceed to Step 3.

---

# BACKEND STEP 3 — Profile, Settings & Default Areas

## Goal

Initialize every new user automatically.

## Create

```text
profiles
user_settings
areas
```

## Requirements

After user registration:

- Create profile
- Create default settings
- Create default areas

Default areas:

```text
Job
University
Freelance
SaaS
Personal
Learning
```

Enable RLS.

## Prompt

> Read `backend_requirement.md`. Complete only BACKEND STEP 3 — Profile, Settings & Default Areas. Create reproducible PostgreSQL migration SQL for profiles, user_settings, and areas, including constraints, timestamps, indexes where useful, RLS policies, and a secure post-signup trigger that creates a profile, settings row, and default LifeOS areas. Test using a newly registered user. Do not create projects, tasks, finance, ideas, or later tables yet.

---

# BACKEND STEP 4 — Projects

## Goal

Persist projects in PostgreSQL.

## Requirements

- projects table
- RLS
- project CRUD
- ownership validation
- ProjectService
- migrate Projects UI away from localStorage

## Prompt

> Read `backend_requirement.md`. Complete only BACKEND STEP 4 — Projects. Create the projects table with correct PostgreSQL types, constraints, foreign keys, indexes, RLS, and ownership-safe area relationships. Build a reusable ProjectService and connect the current Projects UI to Supabase for create, read, update, archive, and delete operations. Preserve the existing interface. Do not implement tasks yet.

---

# BACKEND STEP 5 — Tasks

## Goal

Persist tasks.

## Requirements

- tasks table
- project relationship
- area relationship
- deadline
- priority
- status
- estimates
- CRUD
- completion/reopen
- TaskService

## Prompt

> Read `backend_requirement.md`. Complete only BACKEND STEP 5 — Tasks. Create the tasks table with proper foreign keys, constraints, timestamps, indexes, and Row Level Security. Prevent a user from linking a task to another user's project or area. Build TaskService and migrate the Tasks UI from localStorage/demo persistence to Supabase. Support create, edit, complete, reopen, duplicate if already supported, and delete. Do not implement reminders or AI.

---

# BACKEND STEP 6 — Inbox / Brain Dump

## Goal

Persist captured items.

## Requirements

- inbox_items table
- status
- item type
- edit
- delete
- processed/unprocessed
- InboxService

## Prompt

> Read `backend_requirement.md`. Complete only BACKEND STEP 6 — Inbox / Brain Dump. Create inbox_items with proper validation, timestamps, indexes, and RLS. Build InboxService and connect Quick Capture and Inbox UI to Supabase. Support unprocessed, processed, and converted states. Do not implement AI parsing yet.

---

# BACKEND STEP 7 — Atomic Inbox Conversion

## Goal

Safely convert Inbox records into structured entities.

## Supported

```text
Inbox → Task
Inbox → Idea
Inbox → Reminder
```

## Requirement

Use transactional PostgreSQL RPC/function so:

```text
new record creation
+
inbox status update
```

either both succeed or both fail.

## Prompt

> Read `backend_requirement.md`. Complete only BACKEND STEP 7 — Atomic Inbox Conversion. Implement secure transactional PostgreSQL functions/RPCs for converting user-owned inbox items into supported entities. Ensure creation of the destination record and update of the inbox item happen atomically. Derive ownership from auth.uid(), validate the original inbox item belongs to the user, and test rollback behavior. Do not add AI.

---

# BACKEND STEP 8 — Daily Planner / Time Blocks

## Goal

Persist planner data.

## Create

```text
time_blocks
```

## Requirements

- timestamptz
- start/end validation
- optional task relationship
- optional area relationship
- CRUD
- PlannerService

## Prompt

> Read `backend_requirement.md`. Complete only BACKEND STEP 8 — Daily Planner / Time Blocks. Create time_blocks using timestamptz, add `end_at > start_at` validation, RLS, useful indexes, and ownership-safe task/area relationships. Build PlannerService and connect the existing Daily Planner UI to Supabase. Support create, edit, delete, complete, and loading blocks for selected dates. Do not build automatic AI planning.

---

# BACKEND STEP 9 — Income & Expenses

## Goal

Persist finance transactions securely.

## Create

```text
transactions
```

## Requirements

- NUMERIC money
- income/expense type
- categories
- dates
- payment method
- project relationship
- FinanceService

## Prompt

> Read `backend_requirement.md`. Complete only BACKEND STEP 9 — Income & Expenses. Create transactions using NUMERIC(14,2) for money, proper constraints, indexes, timestamps, RLS, and ownership-safe project relationships. Build FinanceService methods and migrate transaction persistence to Supabase. Reject zero/negative amounts. Do not create receivables or payables yet.

---

# BACKEND STEP 10 — Receivables

## Goal

Track money others owe.

## Create

```text
receivables
receivable_payments
```

## Requirements

- partial payment
- full payment
- written off
- overdue calculation
- atomic repayment logic

## Prompt

> Read `backend_requirement.md`. Complete only BACKEND STEP 10 — Receivables. Create receivables and receivable_payments with NUMERIC fields, constraints, timestamps, indexes, ownership-safe RLS, and an atomic PostgreSQL RPC for repayments. The RPC must update remaining balance, status, and paid_at consistently. Reject overpayments and cross-user access. Connect the current UI and test partial and final repayments.

---

# BACKEND STEP 11 — Payables

## Goal

Track money the user owes.

## Create

```text
payables
payable_payments
```

## Prompt

> Read `backend_requirement.md`. Complete only BACKEND STEP 11 — Payables. Create payables and payable_payments using correct NUMERIC fields, constraints, indexes, RLS, and secure atomic payment logic. Connect the current UI. Test partial payment, full payment, overpayment rejection, invalid references, and cross-user access.

---

# BACKEND STEP 12 — Ideas

## Goal

Persist Idea Vault.

## Create

```text
ideas
```

## Prompt

> Read `backend_requirement.md`. Complete only BACKEND STEP 12 — Ideas. Create the ideas table with appropriate status constraints, review date, timestamps, indexes, RLS, and promoted_project_id support. Build IdeaService and migrate the Idea Vault to Supabase. Support create, edit, move between Active/Later/Someday/Promising/Archived, restore where relevant, and delete. Do not add AI evaluation.

---

# BACKEND STEP 13 — Promote Idea to Project

## Goal

Convert an idea safely into a project.

## Requirement

Atomic operation:

```text
create project
update idea.promoted_project_id
update idea status
```

## Prompt

> Read `backend_requirement.md`. Complete only BACKEND STEP 13 — Promote Idea to Project. Create a secure transactional PostgreSQL RPC that promotes a user-owned idea into a user-owned project. Derive user identity from auth.uid(), validate the idea belongs to the caller, create the project, update promoted_project_id and status, and roll back all changes if any step fails. Connect the existing Promote to Project action.

---

# BACKEND STEP 14 — Learning Tracker

## Goal

Persist learning data.

## Create

```text
learning_items
```

## Prompt

> Read `backend_requirement.md`. Complete only BACKEND STEP 14 — Learning Tracker. Create learning_items with type/status constraints, progress validation, timestamps, indexes, and RLS. Build LearningService and migrate the current Learning UI to Supabase. Support planned, learning, paused, and completed states. Do not add AI recommendations.

---

# BACKEND STEP 15 — Waiting For

## Goal

Track external dependencies.

## Create

```text
waiting_items
```

## Prompt

> Read `backend_requirement.md`. Complete only BACKEND STEP 15 — Waiting For. Create waiting_items with proper type/status constraints, timestamps, indexes, and RLS. Build a reusable service and connect the Dashboard/Waiting For UI to Supabase. Users must only access their own waiting items. Do not add scheduled alerts yet.

---

# BACKEND STEP 16 — User Settings

## Goal

Move preferences into backend storage.

## Support

- Timezone
- Currency
- Work hours
- Work days
- Budget
- Notification preferences
- Appearance

## Prompt

> Read `backend_requirement.md`. Complete only BACKEND STEP 16 — User Settings. Finalize user_settings and connect the existing Settings UI to Supabase. Validate timezone, currency, available-hours, budget, notification preferences, and appearance. Ensure each user can only read/update their own settings. Do not implement scheduled reminders yet.

---

# BACKEND STEP 17 — Reminders

## Goal

Persist reminders.

## Create

```text
reminders
```

## Support

- One-time
- Daily
- Weekly
- Monthly

## Prompt

> Read `backend_requirement.md`. Complete only BACKEND STEP 17 — Reminders. Create reminders with correct timestamptz fields, repeat-rule representation, `next_run_at`, `last_sent_at`, constraints, indexes, and RLS. Build ReminderService and connect create/edit/delete/status behavior to Supabase. Do not implement server-side delivery yet.

---

# BACKEND STEP 18 — Notifications

## Goal

Create in-app notification storage.

## Create

```text
notifications
```

## Prompt

> Read `backend_requirement.md`. Complete only BACKEND STEP 18 — Notifications. Create notifications with RLS, indexes, related-entity metadata, read/unread state, and timestamps. Connect the existing notification badge/dropdown to Supabase. Support mark read, mark all read, and dismissal/delete if appropriate. Do not add scheduled creation yet.

---

# BACKEND STEP 19 — Scheduled Reminder Processing

## Goal

Process reminders even when the browser is closed.

## Build

- Supabase Edge Function
- Cron schedule

## Flow

```text
Cron
↓
Find due reminders
↓
Create notification
↓
Update last_sent_at
↓
Update next_run_at
```

## Prompt

> Read `backend_requirement.md`. Complete only BACKEND STEP 19 — Scheduled Reminder Processing. Build a secure Supabase Edge Function plus Cron/pg_cron schedule that processes active reminders whose next_run_at is due. Create in-app notification records, update last_sent_at, and calculate the next recurrence safely. Support one-time, daily, weekly, and monthly reminders. Ensure the process is idempotent and does not create duplicate notifications. Do not add email or push delivery yet.

---

# BACKEND STEP 20 — Deadline Risk Notifications

## Goal

Create proactive deadline warnings.

## Prompt

> Read `backend_requirement.md`. Complete only BACKEND STEP 20 — Deadline Risk Notifications. Implement deterministic deadline-risk evaluation for incomplete tasks and create appropriate in-app notifications for attention, high-risk, and critical conditions. Run via a scheduled backend process. Prevent duplicate warnings for the same task/risk period. Keep the rules transparent and do not use AI.

---

# BACKEND STEP 21 — Finance Follow-Up Notifications

## Goal

Warn about overdue receivables/payables.

## Prompt

> Read `backend_requirement.md`. Complete only BACKEND STEP 21 — Finance Follow-Up Notifications. Add scheduled processing for overdue receivables and upcoming/overdue payables. Create in-app notifications while preventing duplicates. Respect each user's finance_alerts setting. Do not send email or push notifications yet.

---

# BACKEND STEP 22 — Weekly Reviews

## Goal

Persist weekly reflection data.

## Create

```text
weekly_reviews
```

## Prompt

> Read `backend_requirement.md`. Complete only BACKEND STEP 22 — Weekly Reviews. Create weekly_reviews with appropriate date, numeric, text, JSON, timestamps, uniqueness rules, indexes, and RLS. Connect the current Weekly Review reflection inputs and priority data to Supabase. Prevent duplicate weekly review records for the same user/week. Do not auto-generate statistics yet.

---

# BACKEND STEP 23 — Weekly Metrics Aggregation

## Goal

Compute weekly statistics efficiently.

## Aggregate

- Completed tasks
- Overdue tasks
- Missed deadlines
- Focused minutes
- Income
- Expenses
- Receivables
- Payables

## Prompt

> Read `backend_requirement.md`. Complete only BACKEND STEP 23 — Weekly Metrics Aggregation. Create efficient PostgreSQL views/functions or RPCs that calculate weekly metrics from actual LifeOS data. Prefer SQL aggregation over unnecessary Edge Functions. Keep user isolation intact and make the result easy for the Weekly Review UI to consume. Do not add AI summaries.

---

# BACKEND STEP 24 — Dashboard Aggregation

## Goal

Reduce excessive client-side queries.

## Include

- Today's Focus
- Upcoming Deadlines
- Workload
- Financial snapshot
- Waiting For
- Active Projects

## Prompt

> Read `backend_requirement.md`. Complete only BACKEND STEP 24 — Dashboard Aggregation. Review the current Dashboard's data requirements and reduce unnecessary network requests using PostgreSQL views, RPC functions, or efficient parallel queries. Preserve RLS and user isolation. Do not over-engineer. Explain why each aggregation or view is needed.

---

# BACKEND STEP 25 — Performance Index Audit

## Goal

Improve performance based on actual queries.

## Prompt

> Read `backend_requirement.md`. Complete only BACKEND STEP 25 — Performance Index Audit. Audit actual PostgreSQL/Supabase queries used by LifeOS, identify missing high-value indexes, and add only justified indexes. Review tasks, projects, transactions, reminders, receivables, payables, ideas, learning items, and time blocks. Avoid duplicate or unnecessary indexes and document each index added.

---

# BACKEND STEP 26 — Security Audit

## Goal

Verify complete user isolation.

## Test with User A and User B

- SELECT attack
- INSERT attack
- UPDATE attack
- DELETE attack
- foreign-key ownership attack
- finance access
- direct API request
- Edge Function authentication

## Prompt

> Read `backend_requirement.md`. Complete only BACKEND STEP 26 — Security Audit. Perform a two-user security audit of every user-owned table and RLS policy. Verify User A cannot select, insert, update, delete, or reference User B's private records. Review project/task relationship abuse, finance access, service-role usage, public frontend keys, Edge Function authentication, and raw database error exposure. Fix all issues and provide a concise security report.

---

# BACKEND STEP 27 — Database Constraint Audit

## Goal

Verify data integrity.

## Test invalid cases

- Negative money
- Zero money
- Invalid status
- Invalid priority
- Progress above 100
- Progress below 0
- End time before start
- Overpayment
- Invalid foreign key
- Missing required fields

## Prompt

> Read `backend_requirement.md`. Complete only BACKEND STEP 27 — Database Constraint Audit. Review every table for missing database-level constraints and foreign-key integrity. Test invalid money values, statuses, priorities, progress, time ranges, overpayments, invalid references, and missing required data. Fix constraints without breaking valid existing data.

---

# BACKEND STEP 28 — localStorage Migration

## Goal

Move existing prototype data to Supabase.

## Requirements

- One-time migration
- Validate data
- Map relationships
- Prevent accidental duplicate import
- Stop using localStorage as persistent storage afterward

## Prompt

> Read `backend_requirement.md`. Complete only BACKEND STEP 28 — localStorage Migration. Build a controlled one-time import/migration path from existing LifeOS localStorage data into the authenticated user's Supabase account. Validate and normalize data, map relationships, avoid accidental duplicate imports, and show a clear result summary. After successful migration, persistent application data must come from Supabase.

---

# BACKEND STEP 29 — JSON Export & Import

## Goal

Allow user-controlled backup.

## Do Not Export

- Passwords
- Auth tokens
- Service keys
- API keys

## Prompt

> Read `backend_requirement.md`. Complete only BACKEND STEP 29 — JSON Export & Import. Implement secure authenticated export of the user's LifeOS application data to a versioned JSON format and a validated import flow. Never export passwords, auth tokens, service-role keys, API secrets, or another user's data. Require explicit confirmation before destructive replacement behavior.

---

# BACKEND STEP 30 — AI Edge Function Foundation

## Goal

Prepare secure server-side AI architecture.

## Requirements

- Authenticated Edge Function
- Server-side OpenAI secret
- Safe JSON input/output
- Error handling
- No browser API key

## Prompt

> Read `backend_requirement.md`. Complete only BACKEND STEP 30 — AI Edge Function Foundation. Create a secure authenticated Supabase Edge Function structure that can call OpenAI later. Store the OpenAI key only in server-side secrets, validate auth and JSON input, return safe errors, and demonstrate the function with a harmless test or mock if no API key is configured. Do not build the full AI brain-dump feature yet.

---

# BACKEND STEP 31 — AI Brain Dump Parser

## Goal

Convert natural language into structured suggestions.

Example input:

```text
Submit CSE assignment Friday,
collect 5000 from Rahim,
client homepage revision Thursday,
learn Next.js later.
```

Expected suggestion types:

```text
task
receivable
task
learning
```

Important:

AI should only suggest.

The user confirms before database writes.

## Prompt

> Read `backend_requirement.md`. Complete only BACKEND STEP 31 — AI Brain Dump Parser. Build a secure authenticated Edge Function that sends brain-dump text to OpenAI and requires structured JSON output matching a strict server-validated schema. Return suggestions to the UI for user review. Do not automatically create database records from model output. Never expose the OpenAI key to browser JavaScript.

---

# BACKEND STEP 32 — AI Weekly Summary

## Goal

Generate narrative insights from verified metrics.

Important:

AI must not calculate financial totals.

It only summarizes already-verified data.

## Prompt

> Read `backend_requirement.md`. Complete only BACKEND STEP 32 — AI Weekly Summary. Use verified Weekly Review metrics and reflection fields as input to a secure authenticated Edge Function. Ask OpenAI to summarize patterns, wins, risks, and suggested priorities. Do not ask AI to recalculate financial totals, task counts, or core metrics. Validate and sanitize output before showing it.

---

# BACKEND STEP 33 — Storage / Attachments

## Goal

Add file support only when needed.

Possible file types:

- Avatar
- Project attachment
- Assignment document
- Receipt

## Prompt

> Read `backend_requirement.md`. Complete only BACKEND STEP 33 — Storage / Attachments. Add Supabase Storage only for the file types currently required. Configure secure bucket policies so users cannot read or modify another user's private files. Prefer private buckets and signed access where appropriate. Connect only the minimum necessary upload/download UI.

---

# BACKEND STEP 34 — Production Error Handling

## Goal

Make backend failures safe and understandable.

## Requirements

- Normalize frontend service errors
- Safe Edge Function errors
- Development diagnostics
- No raw SQL errors shown to user
- Handle expired sessions
- Handle network failure

## Prompt

> Read `backend_requirement.md`. Complete only BACKEND STEP 34 — Production Error Handling. Standardize errors across frontend services and Edge Functions. Show safe user-facing messages, preserve useful developer diagnostics, avoid exposing SQL/internal details, handle auth/session expiration and network failures gracefully, and avoid unnecessary automatic retries.

---

# BACKEND STEP 35 — Production Deployment

## Goal

Deploy LifeOS.

Architecture:

```text
GitHub
   ↓
Cloudflare Pages
   ↓
Supabase
```

## Requirements

- Correct frontend public config
- Auth redirect URLs
- Edge Function secrets
- No secret leaks
- Production testing

## Prompt

> Read `backend_requirement.md`. Complete only BACKEND STEP 35 — Production Deployment. Prepare and deploy the current HTML/CSS/JavaScript LifeOS frontend to Cloudflare Pages and connect it to the production Supabase project. Configure authentication redirect URLs, allowed origins where required, public frontend configuration, and Edge Function secrets. Verify no service-role or OpenAI secret exists in browser assets or repository history. Test signup, login, CRUD, session persistence, and logout in production.

---

# BACKEND STEP 36 — Final Backend QA

## Test Journey 1 — New User

```text
Sign up
↓
Profile created
↓
Settings created
↓
Default areas created
↓
Dashboard loads
```

## Test Journey 2 — Tasks

```text
Create task
↓
Assign project
↓
Dashboard reflects it
↓
Calendar reflects it
↓
Add time block
↓
Complete task
↓
Weekly metrics reflect it
```

## Test Journey 3 — Receivable

```text
Create receivable
↓
Due date passes
↓
Notification appears
↓
Partial payment
↓
Remaining balance updates
↓
Final payment
↓
Status becomes paid
```

## Test Journey 4 — Idea

```text
Create idea
↓
Move to Later/Someday
↓
Promote to project
↓
Project appears
```

## Test Journey 5 — Reminder

```text
Create reminder
↓
Cron processes it
↓
Notification appears
↓
Recurring reminder gets new next_run_at
```

## Test Journey 6 — Security

Create two users.

Confirm one user cannot access the other's data.

## Prompt

> Read `backend_requirement.md`. Complete only BACKEND STEP 36 — Final Backend QA. Test all major end-to-end LifeOS backend journeys, including new-user initialization, tasks/projects, planner, finance, partial payments, ideas, reminders, notifications, weekly review metrics, export/import, session behavior, and two-user security isolation. Fix critical issues found and provide a final QA report with passed tests, failed tests, fixes, and remaining limitations.

---

# 33. Standard Prompt Template for Every Backend Step

Use this format whenever continuing development:

```text
Read backend_requirement.md carefully.

We are currently working only on BACKEND STEP X.

Complete only that step.

Preserve all previously completed frontend and backend functionality.

Do not implement future steps early.

Use secure PostgreSQL/Supabase practices.

Generate reproducible SQL migrations whenever database changes are required.

Do not weaken existing RLS policies.

Do not expose server-side secrets.

Test the completed step before finishing.

At the end report:

1. Files changed
2. SQL migrations added
3. Backend functionality completed
4. RLS/security rules added
5. Tests performed
6. Manual configuration required from me
7. Known limitations

Stop after completing this step.
```

---

# 34. Final Architecture

The LifeOS MVP backend should remain:

```text
HTML + CSS + Vanilla JS
          │
          ▼
Cloudflare Pages
          │
          ▼
Supabase JavaScript SDK
          │
          ├──────────────► Supabase Auth
          │
          ▼
PostgreSQL
          │
          ├── Row Level Security
          ├── Constraints
          ├── Foreign Keys
          ├── Indexes
          ├── SQL Functions / RPC
          └── Views
          │
          ▼
Supabase Edge Functions
          │
          ├── Secure external APIs
          ├── Reminder processing
          └── AI features later
          │
          ▼
Supabase Cron / pg_cron
```

Do not add a dedicated Node/Express backend until there is a real architectural need.

---

# 35. When a Dedicated Backend May Be Needed Later

A dedicated backend may become worthwhile when LifeOS needs:

- Complex public APIs
- Multiple external integrations
- Large-scale background processing
- Queue workers
- Enterprise permissions
- Team/multi-tenant organizations
- Complex billing systems
- High-volume event processing
- Advanced WebSockets
- Custom infrastructure

Possible future stack:

```text
Next.js
   ↓
Node.js / Fastify / Hono
   ↓
PostgreSQL
   ↓
Redis
   ↓
Queue Workers
   ↓
Object Storage
```

Do not build this during MVP.

---

# 36. Security Checklist

Before inviting real users:

- [ ] Supabase Auth is enabled
- [ ] RLS is enabled on every private table
- [ ] Every user-owned record has user ownership
- [ ] Cross-user foreign-key attacks are prevented
- [ ] Service-role key is never exposed
- [ ] OpenAI key is never exposed
- [ ] Money fields use NUMERIC
- [ ] Invalid data is blocked by constraints
- [ ] Edge Functions validate authentication
- [ ] Edge Functions derive user identity from auth context
- [ ] Finance operations are atomic
- [ ] Scheduled jobs are idempotent
- [ ] HTTPS is used
- [ ] Auth redirect URLs are correct
- [ ] Storage policies are private where needed
- [ ] Raw SQL/database errors are not shown to users
- [ ] Two-user RLS tests pass
- [ ] SQL migrations are stored in Git
- [ ] Production backup strategy exists before paid users

---

# 37. Performance Checklist

- [ ] Common task queries indexed
- [ ] Deadline queries indexed
- [ ] Transaction-date queries indexed
- [ ] Reminder next_run_at indexed
- [ ] Finance due-date queries indexed
- [ ] Dashboard avoids excessive round trips
- [ ] Large lists use pagination
- [ ] Only required columns are selected
- [ ] No unnecessary realtime subscriptions
- [ ] No N+1 query patterns
- [ ] Aggregations use SQL views/RPC only when justified

---

# 38. Backend Philosophy

> Keep normal CRUD simple. Put authorization in the database. Put secrets and scheduled logic on the server. Add complexity only when real usage requires it.

LifeOS should be easy to maintain while still being secure and scalable enough for a serious MVP.

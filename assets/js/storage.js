/**
 * LifeOS — Storage Service
 * Centralized data persistence layer using localStorage.
 * Initializes default demo data if empty.
 */

const STORAGE_KEYS = {
  TASKS: 'lifeos_tasks',
  PROJECTS: 'lifeos_projects',
  AREAS: 'lifeos_areas',
  CALENDAR_EVENTS: 'lifeos_calendar_events',
  INBOX: 'lifeos_inbox',
  TRANSACTIONS: 'lifeos_transactions',
  RECEIVABLES: 'lifeos_receivables',
  PAYABLES: 'lifeos_payables',
  IDEAS: 'lifeos_ideas',
  LEARNING: 'lifeos_learning',
  REMINDERS: 'lifeos_reminders',
  TIMEBLOCKS: 'lifeos_timeblocks',
  WEEKLY_REVIEWS: 'lifeos_weekly_reviews',
  SETTINGS: 'lifeos_settings',
  WAITING_FOR: 'lifeos_waiting_for',
  FINANCE_SNAPSHOT: 'lifeos_finance_snapshot',
  WORKLOAD_SNAPSHOT: 'lifeos_workload_snapshot'
};

// Realistic default seed data matching the UI mockups
const DEFAULT_SEED_DATA = {
  [STORAGE_KEYS.TASKS]: [
    {
      id: 'task_1',
      title: 'Frontend homepage revisions',
      area: 'Job',
      project: 'Website',
      deadline: 'Today, 5:00 PM',
      priority: 'High',
      estimatedTime: '3h',
      status: 'In Progress',
      completed: false,
      isFocus: true,
      risk: 'Attention',
      description: 'Implement the new design changes for the homepage based on the latest Figma file. Focus on hero section, features grid, and mobile responsiveness.',
      nextAction: 'Start implementing the hero section',
      notes: 'Use the updated Figma file (v2.1). Check with client about the CTA text.',
      tags: ['frontend', 'design', 'website'],
      createdAt: '2024-04-22T09:00:00Z'
    },
    {
      id: 'task_2',
      title: 'CSE assignment submission',
      area: 'University',
      project: 'CSE 302',
      deadline: 'Today, 11:59 PM',
      priority: 'High',
      estimatedTime: '4h',
      status: 'To Do',
      completed: false,
      isFocus: true,
      risk: 'High Risk',
      description: 'Complete database normalization lab questions and ER diagram implementation.',
      nextAction: 'Finish section 3 query optimization',
      notes: 'Submit on university portal before deadline.',
      tags: ['study', 'assignment', 'university'],
      createdAt: '2024-04-22T10:30:00Z'
    },
    {
      id: 'task_3',
      title: 'Client proposal deck',
      area: 'Freelance',
      project: 'Brand site',
      deadline: 'Tomorrow',
      priority: 'Medium',
      estimatedTime: '2h',
      status: 'In Progress',
      completed: false,
      isFocus: true,
      risk: 'Safe',
      description: 'Build presentation deck for new brand identity client.',
      nextAction: 'Design price tier slides',
      notes: 'Discuss payment schedule with client.',
      tags: ['client', 'proposal', 'freelance'],
      createdAt: '2024-04-22T11:00:00Z'
    },
    {
      id: 'task_4',
      title: 'LifeOS MVP wireframe',
      area: 'SaaS',
      project: 'LifeOS (MVP)',
      deadline: 'Apr 25, 2024',
      priority: 'Medium',
      estimatedTime: '5h',
      status: 'To Do',
      completed: false,
      isFocus: true,
      risk: 'Attention',
      description: 'Finalize core interaction architecture and layout tokens for LifeOS prototype.',
      nextAction: 'Map navigation states',
      notes: 'Keep it calm, minimal, and lightweight.',
      tags: ['saas', 'wireframe', 'product'],
      createdAt: '2024-04-21T14:00:00Z'
    },
    {
      id: 'task_5',
      title: 'AI course lesson 4',
      area: 'Learning',
      project: 'AI Productivity',
      deadline: 'Apr 25, 2024',
      priority: 'Low',
      estimatedTime: '1.5h',
      status: 'To Do',
      completed: false,
      isFocus: true,
      risk: 'Safe',
      description: 'Complete prompt engineering module and code examples.',
      nextAction: 'Review lesson notes and coding examples',
      notes: 'Practice with actual coding agent workflows.',
      tags: ['learning', 'ai', 'study'],
      createdAt: '2024-04-22T15:00:00Z'
    },
    {
      id: 'task_6',
      title: 'Client landing page feedback',
      area: 'Freelance',
      project: 'Client Website',
      deadline: 'Apr 26, 2024',
      priority: 'Medium',
      estimatedTime: '1h',
      status: 'Waiting',
      completed: false,
      isFocus: false,
      risk: 'Attention',
      description: 'Waiting for marketing team to review draft copy and layout changes.',
      nextAction: 'Follow up via email if no reply by Thursday',
      notes: 'Shared staging preview link.',
      tags: ['client', 'feedback'],
      createdAt: '2024-04-20T10:00:00Z'
    },
    {
      id: 'task_7',
      title: 'Monthly expense report',
      area: 'Personal',
      project: 'Finance',
      deadline: 'Apr 26, 2024',
      priority: 'Low',
      estimatedTime: '1h',
      status: 'To Do',
      completed: false,
      isFocus: false,
      risk: 'Safe',
      description: 'Categorize April receipts and check budget variance against targets.',
      nextAction: 'Export bank statements',
      notes: 'Keep an eye on dining and transport expenses.',
      tags: ['finance', 'budget'],
      createdAt: '2024-04-19T10:00:00Z'
    },
    {
      id: 'task_8',
      title: 'University lab marks',
      area: 'University',
      project: 'CSE 302',
      deadline: 'Apr 27, 2024',
      priority: 'Medium',
      estimatedTime: '2h',
      status: 'To Do',
      completed: false,
      isFocus: false,
      risk: 'Safe',
      description: 'Check lab assignment grades and follow up with TA.',
      nextAction: 'Email TA regarding lab 4 marks',
      notes: 'Office hours on Thursday 2 PM.',
      tags: ['university', 'study'],
      createdAt: '2024-04-18T10:00:00Z'
    },
    {
      id: 'task_9',
      title: 'Plan marketing strategy',
      area: 'SaaS',
      project: 'LifeOS (MVP)',
      deadline: 'Apr 28, 2024',
      priority: 'Low',
      estimatedTime: '2h',
      status: 'To Do',
      completed: false,
      isFocus: false,
      risk: 'Safe',
      description: 'Outline launch content and distribution schedule.',
      nextAction: 'Write teaser thread',
      notes: 'Target indie hackers and solo founders.',
      tags: ['saas', 'marketing'],
      createdAt: '2024-04-17T10:00:00Z'
    },
    {
      id: 'task_10',
      title: 'Read research paper',
      area: 'Learning',
      project: 'AI Productivity',
      deadline: 'Apr 28, 2024',
      priority: 'Low',
      estimatedTime: '1h',
      status: 'Completed',
      completed: true,
      isFocus: false,
      risk: 'Safe',
      description: 'Read agentic coding architecture whitepaper.',
      nextAction: 'Take summary notes',
      notes: 'Highlighted sections on planning vs execution.',
      tags: ['learning', 'research'],
      createdAt: '2024-04-16T10:00:00Z'
    },
    {
      id: 'task_11',
      title: 'Update resume',
      area: 'Personal',
      project: 'Career',
      deadline: 'Apr 29, 2024',
      priority: 'Low',
      estimatedTime: '1h',
      status: 'To Do',
      completed: false,
      isFocus: false,
      risk: 'Safe',
      description: 'Add recent freelance projects and frontend skills.',
      nextAction: 'Draft bullet points for latest clients',
      notes: 'Export PDF version.',
      tags: ['career', 'portfolio'],
      createdAt: '2024-04-15T10:00:00Z'
    },
    {
      id: 'task_12',
      title: 'Create content plan',
      area: 'SaaS',
      project: 'Marketing',
      deadline: 'Apr 30, 2024',
      priority: 'Medium',
      estimatedTime: '2h',
      status: 'To Do',
      completed: false,
      isFocus: false,
      risk: 'Attention',
      description: 'Brainstorm 10 short-form video topics for YouTube/LinkedIn.',
      nextAction: 'Write hooks for top 3 videos',
      notes: 'Focus on personal productivity workflows.',
      tags: ['content', 'saas'],
      createdAt: '2024-04-14T10:00:00Z'
    }
  ],

  [STORAGE_KEYS.AREAS]: [
    {
      id: 'area_job',
      name: 'Job',
      icon: 'briefcase',
      color: '#2563eb',
      description: 'Professional career, company work & employment',
      active: true
    },
    {
      id: 'area_uni',
      name: 'University',
      icon: 'graduation-cap',
      color: '#059669',
      description: 'Academic studies, courses & assignments',
      active: true
    },
    {
      id: 'area_freelance',
      name: 'Freelance',
      icon: 'laptop',
      color: '#7c3aed',
      description: 'Client work, contracts & side gigs',
      active: true
    },
    {
      id: 'area_saas',
      name: 'SaaS',
      icon: 'box',
      color: '#3b82f6',
      description: 'Products, web apps & software ventures',
      active: true
    },
    {
      id: 'area_personal',
      name: 'Personal',
      icon: 'heart',
      color: '#ec4899',
      description: 'Health, home, relationships & life admin',
      active: true
    },
    {
      id: 'area_learning',
      name: 'Learning',
      icon: 'book-open',
      color: '#0d9488',
      description: 'Self-education, reading & skill development',
      active: true
    }
  ],

  [STORAGE_KEYS.PROJECTS]: [
    {
      id: 'proj_1',
      name: 'Company website revamp',
      area: 'Job',
      status: 'Active',
      description: 'Redesign and develop the new company website with modern UI/UX and improved performance.',
      detailedDescription: 'Redesign and develop the new company website with modern UI/UX, improved performance, and better conversion. Focus on clean design, clear messaging, and mobile responsiveness.',
      progress: 70,
      deadline: 'Apr 30, 2024',
      startDate: 'Mar 01, 2024',
      priority: 'High',
      estimatedHours: 60,
      tasksDone: 8,
      tasksTotal: 12,
      nextTask: 'Implement homepage hero section',
      nextTaskDue: 'Today',
      milestones: [
        { id: 'm1', title: 'Design exploration', date: 'Mar 15, 2024', status: 'completed' },
        { id: 'm2', title: 'Homepage development', date: 'Mar 30, 2024', status: 'completed' },
        { id: 'm3', title: 'Integrate with CMS', date: 'Apr 15, 2024', status: 'in-progress' },
        { id: 'm4', title: 'Testing & optimization', date: 'Apr 25, 2024', status: 'pending' },
        { id: 'm5', title: 'Launch', date: 'Apr 30, 2024', status: 'pending' }
      ],
      notes: 'Focus on clean design, clear messaging, and mobile responsiveness. Keep lighthouse performance above 95.',
      files: [
        { name: 'Wireframes_v2.fig', size: '4.2 MB', date: 'Mar 12, 2024' },
        { name: 'Brand_Guidelines.pdf', size: '1.8 MB', date: 'Mar 14, 2024' }
      ],
      color: '#2563eb',
      icon: 'briefcase'
    },
    {
      id: 'proj_2',
      name: 'CSE Final Year Project',
      area: 'University',
      status: 'Active',
      description: 'Final year project on AI-powered study assistant for personalized learning.',
      detailedDescription: 'Final year thesis and prototype on AI-powered study assistant for personalized learning and automated question generation.',
      progress: 60,
      deadline: 'May 15, 2024',
      startDate: 'Jan 15, 2024',
      priority: 'High',
      estimatedHours: 80,
      tasksDone: 9,
      tasksTotal: 15,
      nextTask: 'Write methodology section',
      nextTaskDue: 'May 02, 2024',
      milestones: [
        { id: 'm21', title: 'Proposal submission', date: 'Feb 10, 2024', status: 'completed' },
        { id: 'm22', title: 'Literature review', date: 'Mar 01, 2024', status: 'completed' },
        { id: 'm23', title: 'Core model training', date: 'Apr 10, 2024', status: 'completed' },
        { id: 'm24', title: 'Methodology documentation', date: 'Apr 30, 2024', status: 'in-progress' },
        { id: 'm25', title: 'Defense presentation', date: 'May 15, 2024', status: 'pending' }
      ],
      notes: 'Meet supervisor Prof. Rahman every Thursday. Ensure dataset citations are properly referenced in BibTeX.',
      files: [
        { name: 'Thesis_Draft_v1.pdf', size: '3.1 MB', date: 'Mar 28, 2024' }
      ],
      color: '#059669',
      icon: 'graduation-cap'
    },
    {
      id: 'proj_3',
      name: 'Client Brand Website',
      area: 'Freelance',
      status: 'On Hold',
      description: 'Design and develop a marketing website for a lifestyle brand.',
      detailedDescription: 'Design and develop a marketing website for a lifestyle boutique brand with product showcase and inquiry form.',
      progress: 40,
      deadline: 'Apr 25, 2024',
      startDate: 'Mar 15, 2024',
      priority: 'Medium',
      estimatedHours: 45,
      tasksDone: 6,
      tasksTotal: 10,
      nextTask: 'Waiting for client feedback',
      nextTaskDue: 'Apr 24, 2024',
      milestones: [
        { id: 'm31', title: 'Client briefing & moodboard', date: 'Mar 20, 2024', status: 'completed' },
        { id: 'm32', title: 'Figma prototype approval', date: 'Apr 05, 2024', status: 'completed' },
        { id: 'm33', title: 'Landing page coding', date: 'Apr 18, 2024', status: 'completed' },
        { id: 'm34', title: 'Product catalog feedback', date: 'Apr 25, 2024', status: 'in-progress' }
      ],
      notes: 'Waiting for client feedback on brand photos and revised color scheme.',
      files: [],
      color: '#7c3aed',
      icon: 'laptop'
    },
    {
      id: 'proj_4',
      name: 'LifeOS MVP',
      area: 'SaaS',
      status: 'Planned',
      description: 'Build a minimal yet powerful life operating system for personal productivity.',
      detailedDescription: 'A personal operating system for solo creators and developers to capture everything, prioritize clearly, and execute without cognitive overload.',
      progress: 30,
      deadline: 'Jun 30, 2024',
      startDate: 'Apr 01, 2024',
      priority: 'High',
      estimatedHours: 100,
      tasksDone: 3,
      tasksTotal: 14,
      nextTask: 'Set up development environment',
      nextTaskDue: 'Apr 28, 2024',
      milestones: [
        { id: 'm41', title: 'Concept & Wireframes', date: 'Apr 01, 2024', status: 'completed' },
        { id: 'm42', title: 'Core Architecture & Storage', date: 'Apr 15, 2024', status: 'completed' },
        { id: 'm43', title: 'Module development', date: 'May 20, 2024', status: 'in-progress' },
        { id: 'm44', title: 'Beta launch & feedback', date: 'Jun 30, 2024', status: 'pending' }
      ],
      notes: 'Strictly vanilla tech stack, zero framework bloat, instant responsive interactions.',
      files: [],
      color: '#3b82f6',
      icon: 'box'
    },
    {
      id: 'proj_5',
      name: 'AI Productivity Learning',
      area: 'Learning',
      status: 'Active',
      description: 'Learn and practice AI tools to improve personal and professional productivity.',
      detailedDescription: 'Hands-on practice with AI coding assistants, agentic patterns, and workflow integration for everyday software building.',
      progress: 80,
      deadline: 'Apr 20, 2024',
      startDate: 'Mar 01, 2024',
      priority: 'Medium',
      estimatedHours: 40,
      tasksDone: 12,
      tasksTotal: 15,
      nextTask: 'Complete online course module 4',
      nextTaskDue: 'Apr 26, 2024',
      milestones: [
        { id: 'm51', title: 'Prompt engineering foundations', date: 'Mar 05, 2024', status: 'completed' },
        { id: 'm52', title: 'Autonomous agents architecture', date: 'Mar 25, 2024', status: 'completed' },
        { id: 'm53', title: 'Automated workflow project', date: 'Apr 12, 2024', status: 'completed' },
        { id: 'm54', title: 'Publish case study', date: 'Apr 20, 2024', status: 'in-progress' }
      ],
      notes: 'Module 4 covers advanced evaluation and tool calls.',
      files: [],
      color: '#0d9488',
      icon: 'book-open'
    },
    {
      id: 'proj_6',
      name: 'Home Organization',
      area: 'Personal',
      status: 'Completed',
      description: 'Declutter and organize living space for a more focused and peaceful environment.',
      detailedDescription: 'Complete physical organization of workspace, documents archive, bookshelf categorization, and cable routing.',
      progress: 100,
      deadline: 'Mar 10, 2024',
      startDate: 'Feb 01, 2024',
      priority: 'Low',
      estimatedHours: 20,
      tasksDone: 8,
      tasksTotal: 8,
      nextTask: 'All tasks completed!',
      nextTaskDue: 'Completed',
      milestones: [
        { id: 'm61', title: 'Workspace desk setup', date: 'Feb 15, 2024', status: 'completed' },
        { id: 'm62', title: 'Bookshelf & cable management', date: 'Feb 25, 2024', status: 'completed' },
        { id: 'm63', title: 'Wardrobe declutter', date: 'Mar 05, 2024', status: 'completed' },
        { id: 'm64', title: 'Final room deep clean', date: 'Mar 10, 2024', status: 'completed' }
      ],
      notes: 'Completed in March. High impact on daily focus and mental clarity.',
      files: [],
      color: '#ec4899',
      icon: 'heart'
    }
  ],

  [STORAGE_KEYS.WAITING_FOR]: [
    {
      id: 'wait_1',
      title: 'Rahim — ৳ 5,000',
      context: 'Freelance project payment',
      sinceDate: 'Since Apr 18',
      type: 'money',
      status: 'pending'
    },
    {
      id: 'wait_2',
      title: 'Client approval',
      context: 'Landing page design revisions',
      sinceDate: 'Since Apr 20',
      type: 'approval',
      status: 'pending'
    },
    {
      id: 'wait_3',
      title: 'University lab marks',
      context: 'CSE department evaluation',
      sinceDate: 'Since Apr 19',
      type: 'approval',
      status: 'pending'
    }
  ],

  [STORAGE_KEYS.FINANCE_SNAPSHOT]: {
    incomeThisMonth: 68000,
    expensesThisMonth: 42300,
    receivables: 25000,
    payables: 8200,
    remainingBudget: 12500,
    totalBudget: 64000,
    currency: '৳'
  },

  [STORAGE_KEYS.WORKLOAD_SNAPSHOT]: {
    estimatedTodayHours: '5.6h',
    estimatedWeekHours: '28.5h',
    overdueTasksCount: 0,
    upcomingDeadlinesCount: 3,
    focusHoursToday: 3.5,
    focusTargetToday: 6.0,
    days: [
      { day: 'Mon', focus: 5.5, other: 1.5, active: false },
      { day: 'Tue', focus: 3.5, other: 2.1, active: true },
      { day: 'Wed', focus: 2.0, other: 1.2, active: false },
      { day: 'Thu', focus: 4.0, other: 1.8, active: false },
      { day: 'Fri', focus: 3.2, other: 1.5, active: false },
      { day: 'Sat', focus: 4.5, other: 0.8, active: false },
      { day: 'Sun', focus: 1.5, other: 0.5, active: false }
    ]
  },

  [STORAGE_KEYS.INBOX]: [
    {
      id: 'inbox_1',
      title: 'Submit CSE assignment Friday',
      details: 'Check the requirements and submit before 11:59 PM.',
      type: 'Task',
      status: 'Unprocessed',
      createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      createdDisplay: '2 hours ago'
    },
    {
      id: 'inbox_2',
      title: 'Collect ৳5,000 from Rahim',
      details: 'For the freelance project payment.',
      type: 'Money',
      status: 'Unprocessed',
      createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      createdDisplay: '4 hours ago'
    },
    {
      id: 'inbox_3',
      title: 'Client wants homepage revision',
      details: 'Update hero section and fix mobile spacing.',
      type: 'Note',
      status: 'Processed',
      createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
      createdDisplay: '5 hours ago'
    },
    {
      id: 'inbox_4',
      title: 'Need to learn Next.js later',
      details: 'Go through the official docs and build a small project.',
      type: 'Idea',
      status: 'Unprocessed',
      createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
      createdDisplay: '8 hours ago'
    },
    {
      id: 'inbox_5',
      title: 'Buy domain next month',
      details: 'Consider lifeos.app or animdev.co',
      type: 'Money',
      status: 'Unprocessed',
      createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      createdDisplay: '1 day ago'
    },
    {
      id: 'inbox_6',
      title: 'Read "Atomic Habits"',
      details: 'Make time this weekend.',
      type: 'Note',
      status: 'Converted',
      convertedTo: 'Task',
      createdAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
      createdDisplay: '1 day ago'
    },
    {
      id: 'inbox_7',
      title: 'Plan content for YouTube',
      details: 'Weekly ideas and scripting.',
      type: 'Task',
      status: 'Processed',
      createdAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
      createdDisplay: '1 day ago'
    },
    {
      id: 'inbox_8',
      title: 'Look into co-working spaces',
      details: 'Check prices near Dhanmondi.',
      type: 'Unsorted',
      status: 'Unprocessed',
      createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      createdDisplay: '2 days ago'
    }
  ],

  [STORAGE_KEYS.CALENDAR_EVENTS]: [
    // Tuesday, Apr 23, 2024 (Mockup selected day)
    {
      id: 'cal_1',
      title: 'CSE assignment submission',
      date: '2024-04-23',
      dateDisplay: 'Apr 23',
      time: '9:00 AM',
      type: 'Task',
      priority: 'High',
      area: 'University',
      context: 'CSE Final Year Project',
      completed: false
    },
    {
      id: 'cal_2',
      title: 'Client proposal deadline',
      date: '2024-04-23',
      dateDisplay: 'Apr 23',
      time: '11:00 AM',
      type: 'Project',
      priority: 'High',
      area: 'Freelance',
      context: 'Brand website',
      completed: false
    },
    {
      id: 'cal_3',
      title: 'Salary received',
      date: '2024-04-23',
      dateDisplay: 'Apr 23',
      time: '1:00 PM',
      type: 'Money',
      priority: 'Low',
      area: 'Money',
      context: 'Monthly stipend / salary',
      completed: false
    },
    {
      id: 'cal_4',
      title: 'Rahim payment follow-up',
      date: '2024-04-23',
      dateDisplay: 'Apr 23',
      time: '3:00 PM',
      type: 'Reminder',
      priority: 'Medium',
      area: 'Personal',
      context: 'Freelance receivable',
      completed: false
    },
    {
      id: 'cal_5',
      title: 'AI course lesson 4',
      date: '2024-04-23',
      dateDisplay: 'Apr 23',
      time: '5:00 PM',
      type: 'Learning',
      priority: 'Low',
      area: 'Learning',
      context: 'AI & Productivity',
      completed: false
    },
    {
      id: 'cal_6',
      title: 'Project milestone review',
      date: '2024-04-23',
      dateDisplay: 'Apr 23',
      time: '8:00 PM',
      type: 'Project',
      priority: 'Medium',
      area: 'SaaS',
      context: 'LifeOS (MVP)',
      completed: false
    },

    // Wednesday, Apr 24, 2024 (Tomorrow)
    {
      id: 'cal_7',
      title: 'Client landing page feedback',
      date: '2024-04-24',
      dateDisplay: 'Apr 24',
      time: '10:00 AM',
      type: 'Task',
      priority: 'Medium',
      area: 'Freelance',
      context: 'Brand website',
      completed: false
    },
    {
      id: 'cal_8',
      title: 'University lab marks',
      date: '2024-04-24',
      dateDisplay: 'Apr 24',
      time: '2:00 PM',
      type: 'Learning',
      priority: 'Medium',
      area: 'University',
      context: 'CSE 302',
      completed: false
    },
    {
      id: 'cal_9',
      title: 'Gym session',
      date: '2024-04-24',
      dateDisplay: 'Apr 24',
      time: '7:00 PM',
      type: 'Other',
      priority: 'Low',
      area: 'Personal',
      context: 'Fitness',
      completed: false
    },

    // This Week (Next 7 days)
    {
      id: 'cal_10',
      title: 'LifeOS prototype wireframe',
      date: '2024-04-25',
      dateDisplay: 'Apr 25',
      time: '11:00 AM',
      type: 'Project',
      priority: 'Medium',
      area: 'SaaS',
      context: 'LifeOS (MVP)',
      completed: false
    },
    {
      id: 'cal_11',
      title: 'AI course lesson 5',
      date: '2024-04-26',
      dateDisplay: 'Apr 26',
      time: '4:00 PM',
      type: 'Learning',
      priority: 'Low',
      area: 'Learning',
      context: 'AI & Productivity',
      completed: false
    },
    {
      id: 'cal_12',
      title: 'Rent payment due',
      date: '2024-04-28',
      dateDisplay: 'Apr 28',
      time: '10:00 AM',
      type: 'Money',
      priority: 'High',
      area: 'Personal',
      context: 'Apartment rent',
      completed: false
    },
    {
      id: 'cal_13',
      title: 'Monthly expense review',
      date: '2024-04-29',
      dateDisplay: 'Apr 29',
      time: '6:00 PM',
      type: 'Reminder',
      priority: 'Medium',
      area: 'Finance',
      context: 'Monthly budget',
      completed: false
    },

    // Additional month events matching the mockup dots
    { id: 'cal_14', title: 'Q2 Planning', date: '2024-04-01', time: '10:00 AM', type: 'Task', priority: 'Medium', area: 'Job', completed: true },
    { id: 'cal_15', title: 'Website kickoff', date: '2024-04-01', time: '2:00 PM', type: 'Project', priority: 'High', area: 'Job', completed: true },
    { id: 'cal_16', title: 'Team retrospective', date: '2024-04-03', time: '4:00 PM', type: 'Other', priority: 'Low', area: 'Job', completed: true },
    { id: 'cal_17', title: 'Study group session', date: '2024-04-05', time: '11:00 AM', type: 'Learning', priority: 'Low', area: 'University', completed: true },
    { id: 'cal_18', title: 'Freelance milestone', date: '2024-04-05', time: '3:00 PM', type: 'Project', priority: 'Medium', area: 'Freelance', completed: true },
    { id: 'cal_19', title: 'Family dinner', date: '2024-04-05', time: '7:30 PM', type: 'Reminder', priority: 'Low', area: 'Personal', completed: true },
    { id: 'cal_20', title: 'Code review sprint', date: '2024-04-08', time: '10:00 AM', type: 'Task', priority: 'High', area: 'Job', completed: true },
    { id: 'cal_21', title: 'Call with accountant', date: '2024-04-08', time: '2:00 PM', type: 'Reminder', priority: 'Medium', area: 'Finance', completed: true },
    { id: 'cal_22', title: 'Online tutorial', date: '2024-04-10', time: '6:00 PM', type: 'Learning', priority: 'Low', area: 'Learning', completed: true },
    { id: 'cal_23', title: 'Database backup audit', date: '2024-04-12', time: '11:00 AM', type: 'Project', priority: 'Medium', area: 'SaaS', completed: true },
    { id: 'cal_24', title: 'Machine learning paper', date: '2024-04-15', time: '9:00 AM', type: 'Learning', priority: 'Low', area: 'University', completed: true },
    { id: 'cal_25', title: 'Deploy staging build', date: '2024-04-15', time: '2:00 PM', type: 'Project', priority: 'High', area: 'Job', completed: true },
    { id: 'cal_26', title: 'Update project board', date: '2024-04-15', time: '4:30 PM', type: 'Task', priority: 'Low', area: 'Job', completed: true },
    { id: 'cal_27', title: 'Client check-in call', date: '2024-04-17', time: '10:00 AM', type: 'Task', priority: 'Medium', area: 'Freelance', completed: true },
    { id: 'cal_28', title: 'Doctor appointment', date: '2024-04-17', time: '5:00 PM', type: 'Other', priority: 'Low', area: 'Personal', completed: true },
    { id: 'cal_29', title: 'Research presentation', date: '2024-04-19', time: '11:00 AM', type: 'Learning', priority: 'High', area: 'University', completed: true },
    { id: 'cal_30', title: 'Pay internet bill', date: '2024-04-19', time: '1:00 PM', type: 'Reminder', priority: 'Low', area: 'Finance', completed: true },
    { id: 'cal_31', title: 'Homepage demo', date: '2024-04-22', time: '3:00 PM', type: 'Project', priority: 'High', area: 'Job', completed: true },
    { id: 'cal_32', title: 'Submit thesis draft', date: '2024-04-30', time: '5:00 PM', type: 'Task', priority: 'High', area: 'University', completed: false }
  ],

  [STORAGE_KEYS.TIMEBLOCKS]: [
    {
      id: 'tb_1',
      date: '2024-04-23',
      title: 'Morning Routine',
      category: 'Personal',
      startTime: '06:00',
      endTime: '07:00',
      timeDisplay: '6:00 – 7:00 AM',
      notes: 'Exercise, meditation, breakfast',
      icon: 'heart',
      isDeepWork: false,
      completed: false
    },
    {
      id: 'tb_2',
      date: '2024-04-23',
      title: 'AI Course Learning',
      category: 'Learning',
      startTime: '07:00',
      endTime: '09:00',
      timeDisplay: '7:00 – 9:00 AM',
      notes: 'Complete Module 3',
      icon: 'book-open',
      isDeepWork: true,
      completed: false
    },
    {
      id: 'tb_3',
      date: '2024-04-23',
      title: 'CSE Assignment Work',
      category: 'Study',
      startTime: '09:00',
      endTime: '11:00',
      timeDisplay: '9:00 – 11:00 AM',
      notes: 'Work on database design',
      icon: 'code',
      isDeepWork: true,
      completed: false
    },
    {
      id: 'tb_4',
      date: '2024-04-23',
      title: 'Client Revision',
      category: 'Freelance',
      startTime: '11:00',
      endTime: '12:30',
      timeDisplay: '11:00 AM – 12:30 PM',
      notes: 'Update landing page',
      icon: 'briefcase',
      isDeepWork: true,
      completed: false
    },
    {
      id: 'tb_5',
      date: '2024-04-23',
      title: 'Lunch Break',
      category: 'Break',
      startTime: '12:30',
      endTime: '13:30',
      timeDisplay: '12:30 – 1:30 PM',
      notes: 'Away from screen',
      icon: 'coffee',
      isDeepWork: false,
      completed: false
    },
    {
      id: 'tb_6',
      date: '2024-04-23',
      title: 'LifeOS Planning',
      category: 'SaaS',
      startTime: '13:30',
      endTime: '14:30',
      timeDisplay: '1:30 – 2:30 PM',
      notes: 'Product & content planning',
      icon: 'file-text',
      isDeepWork: true,
      completed: false
    },
    {
      id: 'tb_7',
      date: '2024-04-23',
      title: 'Company Work',
      category: 'Job',
      startTime: '15:00',
      endTime: '18:30',
      timeDisplay: '3:00 – 7:00 PM',
      notes: 'Team sync, development, reviews',
      icon: 'building',
      isDeepWork: false,
      completed: false
    },
    {
      id: 'tb_8',
      date: '2024-04-23',
      title: 'Dinner & Personal Time',
      category: 'Personal',
      startTime: '19:00',
      endTime: '20:00',
      timeDisplay: '7:00 – 8:00 PM',
      notes: 'Dinner, family time',
      icon: 'heart',
      isDeepWork: false,
      completed: false
    },
    {
      id: 'tb_9',
      date: '2024-04-23',
      title: 'Read & Learn',
      category: 'Learning',
      startTime: '20:00',
      endTime: '21:30',
      timeDisplay: '8:00 – 9:30 PM',
      notes: 'Book reading / skill development',
      icon: 'graduation-cap',
      isDeepWork: false,
      completed: false
    },
    {
      id: 'tb_10',
      date: '2024-04-23',
      title: 'Plan Tomorrow',
      category: 'SaaS',
      startTime: '21:30',
      endTime: '22:30',
      timeDisplay: '9:30 – 10:30 PM',
      notes: 'Review day, set priorities',
      icon: 'calendar',
      isDeepWork: false,
      completed: false
    }
  ],

  [STORAGE_KEYS.TRANSACTIONS]: [
    {
      id: 'tx_1',
      type: 'income',
      amount: 15000,
      category: 'Income',
      subcategory: 'Freelance',
      date: '2024-04-23',
      dateDisplay: 'Apr 23, 2024',
      description: 'Client payment - Brand website',
      method: 'Bank Transfer',
      relatedProject: 'Brand website',
      notes: 'Final milestone payment for brand revamp'
    },
    {
      id: 'tx_2',
      type: 'expense',
      amount: 3200,
      category: 'Food & Dining',
      date: '2024-04-22',
      dateDisplay: 'Apr 22, 2024',
      description: 'Groceries at Shwapno',
      method: 'bKash',
      relatedProject: '',
      notes: 'Weekly household supplies'
    },
    {
      id: 'tx_3',
      type: 'expense',
      amount: 450,
      category: 'Transport',
      date: '2024-04-21',
      dateDisplay: 'Apr 21, 2024',
      description: 'Uber ride',
      method: 'Card',
      relatedProject: 'Job',
      notes: 'Commute to client office'
    },
    {
      id: 'tx_4',
      type: 'expense',
      amount: 1200,
      category: 'Subscriptions',
      date: '2024-04-20',
      dateDisplay: 'Apr 20, 2024',
      description: 'Monthly internet bill',
      method: 'Card',
      relatedProject: '',
      notes: 'Fiber broadband 50 Mbps'
    },
    {
      id: 'tx_5',
      type: 'expense',
      amount: 5200,
      category: 'Education',
      date: '2024-04-19',
      dateDisplay: 'Apr 19, 2024',
      description: 'Course payment - UI Design',
      method: 'bKash',
      relatedProject: 'Learning',
      notes: 'Advanced interaction design certification'
    },
    {
      id: 'tx_6',
      type: 'income',
      amount: 50000,
      category: 'Income',
      subcategory: 'Salary',
      date: '2024-04-18',
      dateDisplay: 'Apr 18, 2024',
      description: 'Salary from ABC Ltd',
      method: 'Bank Transfer',
      relatedProject: 'Job',
      notes: 'Regular monthly salary direct deposit'
    },
    {
      id: 'tx_7',
      type: 'expense',
      amount: 8700,
      category: 'Business',
      date: '2024-04-15',
      dateDisplay: 'Apr 15, 2024',
      description: 'Server hosting & domain',
      method: 'Card',
      relatedProject: 'LifeOS',
      notes: 'Cloud server renewal & lifeos.app domain'
    },
    {
      id: 'tx_8',
      type: 'expense',
      amount: 4800,
      category: 'Family & Personal',
      date: '2024-04-12',
      dateDisplay: 'Apr 12, 2024',
      description: 'Family dinner & medicines',
      method: 'Cash',
      relatedProject: '',
      notes: 'Weekend dinner with family'
    },
    {
      id: 'tx_9',
      type: 'expense',
      amount: 9300,
      category: 'Food & Dining',
      date: '2024-04-08',
      dateDisplay: 'Apr 08, 2024',
      description: 'Monthly grocery bulk',
      method: 'Card',
      relatedProject: '',
      notes: 'Pantry restocking'
    },
    {
      id: 'tx_10',
      type: 'expense',
      amount: 6350,
      category: 'Transport',
      date: '2024-04-05',
      dateDisplay: 'Apr 05, 2024',
      description: 'Monthly fuel & rides',
      method: 'bKash',
      relatedProject: '',
      notes: 'Rideshare and transport pass'
    },
    {
      id: 'tx_11',
      type: 'income',
      amount: 3000,
      category: 'Income',
      subcategory: 'Consulting',
      date: '2024-04-03',
      dateDisplay: 'Apr 03, 2024',
      description: 'Quick code review consult',
      method: 'bKash',
      relatedProject: 'Freelance',
      notes: 'Frontend performance audit'
    },
    {
      id: 'tx_12',
      type: 'expense',
      amount: 3100,
      category: 'Subscriptions',
      date: '2024-04-01',
      dateDisplay: 'Apr 01, 2024',
      description: 'Software tool licenses',
      method: 'Card',
      relatedProject: '',
      notes: 'Figma, GitHub, Notion subscriptions'
    }
  ],

  [STORAGE_KEYS.RECEIVABLES]: [
    {
      id: 'rec_1',
      person: 'Rahim',
      amount: 5000,
      dateLent: '2024-04-05',
      dateLentDisplay: 'Apr 05, 2024',
      returnDate: '2024-04-15',
      returnDateDisplay: 'Apr 15, 2024',
      description: 'Freelance project payment advance',
      contactNote: 'WhatsApp / 01711-XXXXXX',
      status: 'Overdue',
      overdueDays: 8,
      reminderFreq: 'Weekly'
    },
    {
      id: 'rec_2',
      person: 'Tanvir',
      amount: 12000,
      dateLent: '2024-04-10',
      dateLentDisplay: 'Apr 10, 2024',
      returnDate: '2024-04-30',
      returnDateDisplay: 'Apr 30, 2024',
      description: 'Laptop repair borrow',
      contactNote: 'University friend',
      status: 'Pending',
      overdueDays: 0,
      reminderFreq: 'Before due date'
    },
    {
      id: 'rec_3',
      person: 'Karim',
      amount: 8000,
      dateLent: '2024-04-12',
      dateLentDisplay: 'Apr 12, 2024',
      returnDate: '2024-05-10',
      returnDateDisplay: 'May 10, 2024',
      description: 'Office rent share',
      contactNote: 'Coworker',
      status: 'Pending',
      overdueDays: 0,
      reminderFreq: 'Monthly'
    }
  ],

  [STORAGE_KEYS.PAYABLES]: [
    {
      id: 'pay_1',
      recipient: 'Shwapno Grocery Credit',
      amount: 3200,
      dueDate: '2024-04-28',
      dueDateDisplay: 'Apr 28, 2024',
      reason: 'Grocery store monthly tab',
      status: 'Pending',
      daysLeft: 5,
      notes: 'Pay via bKash by month end'
    },
    {
      id: 'pay_2',
      recipient: 'Coworking Desk Deposit',
      amount: 5000,
      dueDate: '2024-05-01',
      dueDateDisplay: 'May 01, 2024',
      reason: 'Dhanmondi Hub workspace renewal',
      status: 'Pending',
      daysLeft: 8,
      notes: 'Renewal due next week'
    }
  ],

  [STORAGE_KEYS.IDEAS]: [
    {
      id: 'idea_1',
      title: 'AI bookkeeping assistant for Bangladesh SMEs',
      category: 'SaaS',
      status: 'Active',
      fomoBucket: 'Active',
      starred: false,
      description: 'Small businesses struggle with manual bookkeeping and lack affordable tools.',
      problem: 'Small and medium businesses in Bangladesh manage finances manually using spreadsheets or notebooks, leading to errors, missed tax deadlines, and lack of insights.',
      targetUser: 'SME owners in Bangladesh (retail stores, small manufacturers, service businesses) with 1–50 employees.',
      potentialSolution: 'An AI-powered bookkeeping assistant that automatically categorizes transactions, generates reports, and reminds about tax deadlines in simple Bengali and English.',
      monetization: 'Subscription-based (e.g., BDT 1,000–3,000/month) with tiered plans. Partner with accounting firms for referrals.',
      notes: [
        'Look into bKash/Nagad transaction integration',
        'Check compliance requirements',
        'Talk to 3–5 SME owners for validation',
        'Potential pilot with a local CA firm'
      ],
      priority: 'High',
      reviewDate: '2024-04-30',
      reviewDateDisplay: 'Apr 30, 2024',
      icon: 'briefcase',
      iconBg: '#eff6ff',
      iconColor: '#2563eb',
      createdAt: '2024-04-20T10:00:00Z'
    },
    {
      id: 'idea_2',
      title: 'Tutor marketplace growth idea',
      category: 'Marketplace',
      status: 'Research Later',
      fomoBucket: 'Later',
      starred: false,
      description: 'Hard to find qualified tutors with verified reviews in local markets.',
      problem: 'Parents spend weeks asking acquaintances for tutor recommendations without background checks, reviews, or subject matter verification.',
      targetUser: 'Students & parents in Dhaka looking for verified tutors.',
      potentialSolution: 'A vetted tutor marketplace with student ratings, verified background profiles, and escrow payment protection.',
      monetization: '10% commission on the first month tuition + featured tutor listing fees.',
      notes: [
        'Interview 10 university students who offer tutoring',
        'Study Chorki / Shikkhok platform business models',
        'Verify identity requirements via NID'
      ],
      priority: 'Medium',
      reviewDate: '2024-05-05',
      reviewDateDisplay: 'May 5, 2024',
      icon: 'graduation-cap',
      iconBg: '#fff7ed',
      iconColor: '#ea580c',
      createdAt: '2024-04-18T14:30:00Z'
    },
    {
      id: 'idea_3',
      title: 'LifeOS brain dump parser',
      category: 'Productivity',
      status: 'Active',
      fomoBucket: 'Active',
      starred: true,
      description: 'Turn messy thoughts into organized tasks, notes, and projects automatically.',
      problem: 'Users dump raw unorganized thoughts into apps but dread manually triaging and categorizing them into projects and tasks.',
      targetUser: 'Knowledge workers, solo founders, and busy developers.',
      potentialSolution: 'Lightweight on-device regex and AI heuristic classifier to turn bullet lists into prioritized actionable entities.',
      monetization: 'Built into LifeOS Pro subscription tiers.',
      notes: [
        'Design natural language quick-parser syntax',
        'Support markdown task checklist import',
        'Test with 100 sample brain dump lines'
      ],
      priority: 'Critical',
      reviewDate: '2024-04-28',
      reviewDateDisplay: 'Apr 28, 2024',
      icon: 'feather',
      iconBg: '#f0fdf4',
      iconColor: '#16a34a',
      createdAt: '2024-04-19T11:00:00Z'
    },
    {
      id: 'idea_4',
      title: 'BizFindly local discovery feature',
      category: 'SaaS',
      status: 'Promising',
      fomoBucket: 'Someday',
      starred: false,
      description: 'People struggle to find trusted local businesses with real reviews.',
      problem: 'Google Maps and Facebook Pages often have inaccurate opening hours and fake reviews in secondary cities.',
      targetUser: 'Local consumers looking for verified neighborhood service providers.',
      potentialSolution: 'Hyperlocal verified directory with real consumer photo reviews and direct WhatsApp messaging.',
      monetization: 'Verified business badge subscription ৳990/month.',
      notes: [
        'Pilot in Dhanmondi and Banani areas first',
        'Create merchant onboarding checklist'
      ],
      priority: 'Medium',
      reviewDate: '2024-06-01',
      reviewDateDisplay: 'Jun 1, 2024',
      icon: 'map-pin',
      iconBg: '#fef2f2',
      iconColor: '#dc2626',
      createdAt: '2024-04-12T09:00:00Z'
    },
    {
      id: 'idea_5',
      title: 'Content automation workflow',
      category: 'Content',
      status: 'Active',
      fomoBucket: 'Active',
      starred: false,
      description: 'Creators waste time on repetitive content tasks across multiple platforms.',
      problem: 'Cross-posting YouTube videos, LinkedIn carousels, and X threads requires 2+ hours of manual reformatting.',
      targetUser: 'Creators & marketers.',
      potentialSolution: 'Markdown to multi-channel publisher webhook script with template formatting.',
      monetization: 'Open-source core with hosted cloud scheduler $12/month.',
      notes: [
        'Explore headless browser screenshot automation',
        'Test LinkedIn API rate limits'
      ],
      priority: 'High',
      reviewDate: '2024-04-26',
      reviewDateDisplay: 'Apr 26, 2024',
      icon: 'file-text',
      iconBg: '#eff6ff',
      iconColor: '#2563eb',
      createdAt: '2024-04-17T16:20:00Z'
    },
    {
      id: 'idea_6',
      title: 'Freelance invoice generator with bKash QR',
      category: 'Business',
      status: 'Active',
      fomoBucket: 'Active',
      starred: true,
      description: 'Quick modern invoice builder tailored for Bangladeshi freelance developers and designers.',
      problem: 'Foreign invoicing tools do not support BDT or local payment QR codes nicely.',
      targetUser: 'Bangladeshi freelance software engineers and creative designers.',
      potentialSolution: 'One-click PDF invoice generator with dynamic bKash merchant QR and bank routing details.',
      monetization: 'Free 5 invoices/month, ৳499/year for unlimited invoices & client portal.',
      notes: [
        'Generate standard EMVCo compliant QR',
        'Add tax deduction calculation'
      ],
      priority: 'High',
      reviewDate: '2024-05-10',
      reviewDateDisplay: 'May 10, 2024',
      icon: 'receipt',
      iconBg: '#fdf2f8',
      iconColor: '#db2777',
      createdAt: '2024-04-15T12:00:00Z'
    },
    {
      id: 'idea_7',
      title: 'Bangla speech-to-text meeting summarizer',
      category: 'Learning',
      status: 'Research Later',
      fomoBucket: 'Later',
      starred: false,
      description: 'Fine-tuned Whisper model for Bengali audio transcription with action item extraction.',
      problem: 'Teams speaking Banglish/Bengali in Zoom meetings have no automated minutes-of-meeting generator.',
      targetUser: 'Bangladeshi corporate remote teams and agencies.',
      potentialSolution: 'Desktop app that records system audio and transcribes locally or via private API.',
      monetization: 'Pay per audio minute or monthly team seats.',
      notes: [
        'Evaluate OpenAI Whisper small vs medium Bengali accuracy',
        'Test with Zoom audio recordings'
      ],
      priority: 'Medium',
      reviewDate: '2024-05-15',
      reviewDateDisplay: 'May 15, 2024',
      icon: 'mic',
      iconBg: '#fff7ed',
      iconColor: '#ea580c',
      createdAt: '2024-04-14T10:00:00Z'
    },
    {
      id: 'idea_8',
      title: 'Gym progress & calorie budget companion',
      category: 'Personal',
      status: 'Inbox',
      fomoBucket: 'Later',
      starred: false,
      description: 'Minimalist mobile-friendly workout logger without bloated social feeds.',
      problem: 'Fitness apps like MyFitnessPal are filled with ads and complex food databases.',
      targetUser: 'People wanting simple weight and daily workout logging.',
      potentialSolution: 'Single-screen PWA with quick tap set completion and daily calorie deficit check.',
      monetization: 'One-time purchase $9.',
      notes: [
        'Build wireframe during weekend',
        'Compare with Strong app'
      ],
      priority: 'Low',
      reviewDate: '2024-05-20',
      reviewDateDisplay: 'May 20, 2024',
      icon: 'activity',
      iconBg: '#f0fdf4',
      iconColor: '#16a34a',
      createdAt: '2024-04-11T18:00:00Z'
    },
    {
      id: 'idea_9',
      title: 'Micro-SaaS analytics dashboard boilerplate',
      category: 'Feature',
      status: 'Promising',
      fomoBucket: 'Someday',
      starred: false,
      description: 'Ready-to-use pluggable vanilla JS analytics widget for developer tools.',
      problem: 'Developers build the same metrics charts repeatedly for internal admin dashboards.',
      targetUser: 'Indie hackers building web apps.',
      potentialSolution: 'Drop-in web component with zero external chart library overhead.',
      monetization: 'Digital download on Gumroad for $29.',
      notes: [
        'Draft component API specs',
        'Include dark mode themes'
      ],
      priority: 'Medium',
      reviewDate: '2024-06-15',
      reviewDateDisplay: 'Jun 15, 2024',
      icon: 'bar-chart-2',
      iconBg: '#faf5ff',
      iconColor: '#9333ea',
      createdAt: '2024-04-10T14:00:00Z'
    },
    {
      id: 'idea_10',
      title: 'Old domain marketplace crawler',
      category: 'SaaS',
      status: 'Archived',
      fomoBucket: 'Archived',
      starred: false,
      description: 'Scraper to find expired .bd and .com domains with good SEO backlink profiles.',
      problem: 'Manual domain hunting on registrars is tedious and repetitive.',
      targetUser: 'SEO specialists and affiliate site builders.',
      potentialSolution: 'Daily automated report of dropped domains with Moz and Ahrefs metrics.',
      monetization: 'Monthly newsletter subscription $19/mo.',
      notes: [
        'Archived: BTCL registrar API is not public, manual renewal process is too slow.'
      ],
      priority: 'Low',
      reviewDate: '2024-03-10',
      reviewDateDisplay: 'Mar 10, 2024',
      icon: 'globe',
      iconBg: '#f1f5f9',
      iconColor: '#64748b',
      createdAt: '2024-03-01T09:00:00Z'
    },
    {
      id: 'idea_11',
      title: 'Remote developer job board for South Asia',
      category: 'Business',
      status: 'Archived',
      fomoBucket: 'Archived',
      starred: false,
      description: 'Curated tech job listings paying in USD for Bangladesh, India, and Pakistan talent.',
      problem: 'Standard boards mix low-paying local jobs with US-only remote jobs.',
      targetUser: 'Senior South Asian engineers seeking global compensation.',
      potentialSolution: 'Verified remote-first company directory with salary transparency.',
      monetization: 'Featured job posting fee $99.',
      notes: [
        'Archived: Market crowded with Wellfound and Remotive.'
      ],
      priority: 'Low',
      reviewDate: '2024-02-15',
      reviewDateDisplay: 'Feb 15, 2024',
      icon: 'briefcase',
      iconBg: '#f1f5f9',
      iconColor: '#64748b',
      createdAt: '2024-02-01T12:00:00Z'
    },
    {
      id: 'idea_12',
      title: 'University exam preparation flashcard deck',
      category: 'Learning',
      status: 'Someday',
      fomoBucket: 'Someday',
      starred: false,
      description: 'Interactive spaced repetition decks for CS core subjects (Algorithms, OS, Networks).',
      problem: 'Students cram before semester finals without retaining foundational knowledge.',
      targetUser: 'Undergrad Computer Science students.',
      potentialSolution: 'Web-based Anki-style deck with visual algorithm diagrams.',
      monetization: 'Free open community decks, ৳250 for premium exam question banks.',
      notes: [
        'Collate 100 questions per subject',
        'Add markdown math formula rendering'
      ],
      priority: 'Medium',
      reviewDate: '2024-06-30',
      reviewDateDisplay: 'Jun 30, 2024',
      icon: 'book-open',
      iconBg: '#faf5ff',
      iconColor: '#9333ea',
      createdAt: '2024-04-05T15:00:00Z'
    }
  ],

  [STORAGE_KEYS.LEARNING]: [
    {
      id: 'learn_1',
      title: 'Next.js Fundamentals',
      type: 'Course',
      topic: 'Web Development',
      source: 'Official Next.js Learn & Docs',
      status: 'Learning',
      priority: 'High',
      startDate: '2024-04-01',
      targetDate: '2024-04-30',
      targetDateDisplay: 'Apr 30, 2024',
      progress: 60,
      hoursSpent: 12,
      estimatedHours: 20,
      description: 'Learn Next.js 14, App Router, Server Components, and build a full-stack project from scratch.',
      badgeText: 'N',
      badgeBg: '#000000',
      badgeColor: '#ffffff',
      modules: [
        { id: 'm1', title: 'Introduction to Next.js', completed: true },
        { id: 'm2', title: 'App Router & File System', completed: true },
        { id: 'm3', title: 'Data Fetching & Caching', completed: false, isCurrent: true },
        { id: 'm4', title: 'Server Components', completed: false },
        { id: 'm5', title: 'API Routes & Server Actions', completed: false },
        { id: 'm6', title: 'Final Project', completed: false }
      ],
      nextAction: 'Continue: Data Fetching & Caching',
      nextActionSub: 'Watch lesson 3 and complete the exercise.',
      isBacklog: false,
      createdAt: '2024-04-01T10:00:00Z'
    },
    {
      id: 'learn_2',
      title: 'AI Agents Course',
      type: 'Course',
      topic: 'AI',
      source: 'DeepLearning.AI',
      status: 'Planned',
      priority: 'High',
      startDate: '2024-04-15',
      targetDate: '2024-05-05',
      targetDateDisplay: 'May 5, 2024',
      progress: 30,
      hoursSpent: 6,
      estimatedHours: 20,
      description: 'Learn to build AI agents with real-world examples and multi-agent coordination.',
      badgeText: 'AI',
      badgeBg: '#10a37f',
      badgeColor: '#ffffff',
      modules: [
        { id: 'm1', title: 'Agent Architecture Basics', completed: true },
        { id: 'm2', title: 'Tool Use & Function Calling', completed: false, isCurrent: true },
        { id: 'm3', title: 'Multi-Agent Collaboration', completed: false },
        { id: 'm4', title: 'Evaluation & Benchmarks', completed: false }
      ],
      nextAction: 'Watch Tool Use & Function Calling',
      nextActionSub: 'Implement custom weather and search tools.',
      isBacklog: false,
      createdAt: '2024-04-05T12:00:00Z'
    },
    {
      id: 'learn_3',
      title: 'JavaScript Interview Prep',
      type: 'Tutorial',
      topic: 'Programming',
      source: 'Frontend Masters & LeetCode',
      status: 'Learning',
      priority: 'High',
      startDate: '2024-04-05',
      targetDate: '2024-04-28',
      targetDateDisplay: 'Apr 28, 2024',
      progress: 75,
      hoursSpent: 15,
      estimatedHours: 20,
      description: 'Practice common JS interview questions, closures, event loop, and design patterns.',
      badgeText: 'JS',
      badgeBg: '#f7df1e',
      badgeColor: '#000000',
      modules: [
        { id: 'm1', title: 'Prototypes & Inheritance', completed: true },
        { id: 'm2', title: 'Event Loop & Promises', completed: true },
        { id: 'm3', title: 'DOM Manipulation & Events', completed: true },
        { id: 'm4', title: 'Polyfills & Coding Challenges', completed: false, isCurrent: true }
      ],
      nextAction: 'Practice Promise polyfills',
      nextActionSub: 'Solve 5 asynchronous coding questions.',
      isBacklog: false,
      createdAt: '2024-04-08T09:00:00Z'
    },
    {
      id: 'learn_4',
      title: 'Research Paper Reading',
      type: 'Research',
      topic: 'Productivity',
      source: 'ArXiv & ACM Digital Library',
      status: 'Paused',
      priority: 'Medium',
      startDate: '2024-04-10',
      targetDate: '2024-05-10',
      targetDateDisplay: 'May 10, 2024',
      progress: 20,
      hoursSpent: 4,
      estimatedHours: 20,
      description: 'Read and summarize key papers on AI and human productivity.',
      badgeText: 'RP',
      badgeBg: '#eff6ff',
      badgeColor: '#2563eb',
      modules: [
        { id: 'm1', title: 'Attention Is All You Need', completed: true },
        { id: 'm2', title: 'CoT & Reasoning Models', completed: false, isCurrent: true },
        { id: 'm3', title: 'Human-AI Collaboration Studies', completed: false }
      ],
      nextAction: 'Summarize CoT paper',
      nextActionSub: 'Write 1-page takeaway note.',
      isBacklog: false,
      createdAt: '2024-04-10T14:00:00Z'
    },
    {
      id: 'learn_5',
      title: 'UI/UX Practice',
      type: 'Skill',
      topic: 'Design',
      source: 'Figma Community & DailyUI',
      status: 'Learning',
      priority: 'Medium',
      startDate: '2024-04-08',
      targetDate: '2024-05-01',
      targetDateDisplay: 'May 1, 2024',
      progress: 50,
      hoursSpent: 10,
      estimatedHours: 20,
      description: 'Improve design skills with daily practice and mobile interface challenges.',
      badgeText: 'UI',
      badgeBg: '#f24e1e',
      badgeColor: '#ffffff',
      modules: [
        { id: 'm1', title: 'Design System Tokens', completed: true },
        { id: 'm2', title: 'Mobile Navigation Patterns', completed: true },
        { id: 'm3', title: 'Dashboard Data Density', completed: false, isCurrent: true },
        { id: 'm4', title: 'Micro-animations & Transitions', completed: false }
      ],
      nextAction: 'Design analytics widget',
      nextActionSub: 'Create 3 responsive chart card layouts.',
      isBacklog: false,
      createdAt: '2024-04-12T16:00:00Z'
    },

    // Backlog Items matching mockup
    {
      id: 'learn_6',
      title: 'System Design Basics',
      type: 'Course',
      topic: 'Backend',
      source: 'ByteByteGo',
      status: 'Planned',
      priority: 'Medium',
      estimatedHours: 15,
      hoursSpent: 0,
      progress: 0,
      isBacklog: true,
      description: 'Core concepts of high availability, horizontal scaling, and message queues.',
      createdAt: '2024-04-15T11:00:00Z'
    },
    {
      id: 'learn_7',
      title: 'Product Management',
      type: 'Course',
      topic: 'Career',
      source: 'Reforge',
      status: 'Planned',
      priority: 'Low',
      estimatedHours: 10,
      hoursSpent: 0,
      progress: 0,
      isBacklog: true,
      description: 'User interviews, feature prioritization matrix, and North Star metrics.',
      createdAt: '2024-04-16T14:00:00Z'
    },
    {
      id: 'learn_8',
      title: 'Machine Learning Basics',
      type: 'Course',
      topic: 'AI',
      source: 'Coursera (Andrew Ng)',
      status: 'Planned',
      priority: 'Medium',
      estimatedHours: 20,
      hoursSpent: 0,
      progress: 0,
      isBacklog: true,
      description: 'Linear regression, loss functions, and neural network foundations.',
      createdAt: '2024-04-17T09:00:00Z'
    },

    // Completed Items this month
    {
      id: 'learn_9',
      title: 'Git & GitHub Mastery',
      type: 'Skill',
      topic: 'Programming',
      source: 'Pro Git Book',
      status: 'Completed',
      priority: 'High',
      estimatedHours: 8,
      hoursSpent: 8,
      progress: 100,
      isBacklog: false,
      description: 'Interactive rebase, bisect, worktrees, and merge conflicts resolution.',
      createdAt: '2024-03-25T10:00:00Z'
    },
    {
      id: 'learn_10',
      title: 'CSS Grid & Flexbox Deep Dive',
      type: 'Tutorial',
      topic: 'Web Development',
      source: 'CSS Tricks & MDN',
      status: 'Completed',
      priority: 'Medium',
      estimatedHours: 6,
      hoursSpent: 6,
      progress: 100,
      isBacklog: false,
      description: 'Modern layout techniques, subgrid, and fluid responsive typography.',
      createdAt: '2024-03-28T14:00:00Z'
    },
    {
      id: 'learn_11',
      title: 'Atomic Habits Audio Book',
      type: 'Book',
      topic: 'Productivity',
      source: 'Audible',
      status: 'Completed',
      priority: 'Low',
      estimatedHours: 6,
      hoursSpent: 6,
      progress: 100,
      isBacklog: false,
      description: 'Identity-based habits and systems over goals.',
      createdAt: '2024-04-02T16:00:00Z'
    }
  ],

  [STORAGE_KEYS.REMINDERS]: [
    {
      id: 'rem_1',
      title: 'Pay rent for Dhanmondi apartment',
      description: '৳18,500 due before month end to landlord.',
      date: '2024-04-28',
      dateDisplay: 'Apr 28, 2024',
      time: '10:00 AM',
      repeat: 'Monthly',
      type: 'Money',
      priority: 'High',
      status: 'Active',
      unread: true,
      relatedItem: 'Personal'
    },
    {
      id: 'rem_2',
      title: 'Follow up with Rahim on freelance payment',
      description: 'Pending ৳5,000 receivable for logo design work.',
      date: '2024-04-24',
      dateDisplay: 'Apr 24, 2024',
      time: '2:00 PM',
      repeat: 'None',
      type: 'Follow-up',
      priority: 'High',
      status: 'Active',
      unread: true,
      relatedItem: 'Rahim'
    },
    {
      id: 'rem_3',
      title: 'CSE final project presentation dry run',
      description: 'Rehearse slide deck and demo local server setup.',
      date: '2024-04-25',
      dateDisplay: 'Apr 25, 2024',
      time: '4:00 PM',
      repeat: 'None',
      type: 'Deadline',
      priority: 'Critical',
      status: 'Active',
      unread: true,
      relatedItem: 'University'
    },
    {
      id: 'rem_4',
      title: 'Weekly backup export',
      description: 'Download JSON backup from Settings.',
      date: '2024-04-29',
      dateDisplay: 'Apr 29, 2024',
      time: '9:00 PM',
      repeat: 'Weekly',
      type: 'Custom',
      priority: 'Low',
      status: 'Active',
      unread: false,
      relatedItem: 'Settings'
    }
  ],

  [STORAGE_KEYS.WEEKLY_REVIEWS]: {
    weekRange: 'Apr 15 – Apr 21, 2024',
    metrics: {
      tasksCompleted: 24,
      tasksCompletedChange: '+20%',
      missedDeadlines: 3,
      missedDeadlinesChange: '-50%',
      upcomingDeadlines: 5,
      hoursFocused: 28.5,
      hoursFocusedChange: '+12%',
      moneySpent: 8240,
      moneySpentChange: '+6%',
      moneyToCollect: 25000
    },
    areaBreakdown: [
      { area: 'Job', hours: 10.5, pct: 32, color: '#2563eb', icon: 'briefcase' },
      { area: 'University', hours: 8.0, pct: 24, color: '#059669', icon: 'graduation-cap' },
      { area: 'Freelance', hours: 6.5, pct: 20, color: '#7c3aed', icon: 'laptop' },
      { area: 'SaaS', hours: 4.0, pct: 12, color: '#3b82f6', icon: 'box' },
      { area: 'Learning', hours: 2.5, pct: 8, color: '#0d9488', icon: 'book-open' },
      { area: 'Personal', hours: 1.5, pct: 5, color: '#ef4444', icon: 'heart' }
    ],
    wins: [
      'Launched new homepage design v2',
      'Completed 5 university assignments',
      'Got positive feedback from a freelance client',
      'Maintained 28.5 hours of focused work',
      'Read 2 chapters of Atomic Habits'
    ],
    challenges: [
      'Missed 3 deadlines due to scope creep',
      'Felt distracted on Thu and Fri',
      'Spent more than planned on dining out',
      'Didn\'t make time for exercise',
      'Felt overwhelmed with too many open loops'
    ],
    tasksOverview: [
      { day: 'Mon', completed: 5, overdue: 1 },
      { day: 'Tue', completed: 8, overdue: 1 },
      { day: 'Wed', completed: 4, overdue: 0 },
      { day: 'Thu', completed: 4, overdue: 1 },
      { day: 'Fri', completed: 2, overdue: 0 },
      { day: 'Sat', completed: 4, overdue: 1 },
      { day: 'Sun', completed: 2, overdue: 0 }
    ],
    reflections: {
      wentWell: 'I was consistent with my deep work hours and made real progress on my projects.',
      wentWrong: 'I underestimated the time for the client project and missed a few deadlines.',
      improve: 'Plan my work better and block time for non-negotiables like exercise and reading.',
      stopDoing: 'Stop checking social media during work hours.',
      mattersMost: 'Finish the client website, stay on top of university work, and keep my focus and energy high.'
    },
    priorities: [
      { id: 'p1', title: 'Finish client website and handover', area: 'Freelance', date: 'Apr 26', completed: false },
      { id: 'p2', title: 'Submit machine learning assignment', area: 'University', date: 'Apr 24', completed: false },
      { id: 'p3', title: 'Plan and write LifeOS blog post', area: 'SaaS', date: 'Apr 25', completed: false },
      { id: 'p4', title: 'Exercise at least 4 times', area: 'Personal', date: 'Apr 28', completed: false },
      { id: 'p5', title: 'Review monthly budget and expenses', area: 'Money', date: 'Apr 27', completed: false }
    ],
    weeklyScore: 76
  },

  [STORAGE_KEYS.SETTINGS]: {
    profile: {
      name: 'Anim',
      greetingName: 'Anim',
      avatarInitial: 'A',
      tagline: 'Build a calmer, better you.'
    },
    work: {
      startTime: '09:00',
      endTime: '18:00',
      dailyHours: 8,
      workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    },
    finance: {
      currency: 'BDT',
      currencySymbol: '৳',
      monthlyBudget: 45000,
      savingsTarget: 15000
    },
    notifications: {
      deadlines: true,
      finance: true,
      weeklyReview: true,
      dailyPlanner: true
    },
    appearance: {
      theme: 'light'
    }
  }
};

const StorageService = {
  KEYS: STORAGE_KEYS,

  init() {
    // Seed initial demo data if absent or if datasets are minimal
    Object.keys(DEFAULT_SEED_DATA).forEach(key => {
      const existing = localStorage.getItem(key);
      if (existing === null ||
          (key === STORAGE_KEYS.INBOX && JSON.parse(existing).length <= 2) ||
          (key === STORAGE_KEYS.TASKS && JSON.parse(existing).length < 12) ||
          (key === STORAGE_KEYS.PROJECTS && JSON.parse(existing).length < 6) ||
          (key === STORAGE_KEYS.AREAS && JSON.parse(existing).length < 6) ||
          (key === STORAGE_KEYS.CALENDAR_EVENTS && JSON.parse(existing).length < 10) ||
          (key === STORAGE_KEYS.TIMEBLOCKS && JSON.parse(existing).length < 8) ||
          (key === STORAGE_KEYS.TRANSACTIONS && JSON.parse(existing).length < 6) ||
          (key === STORAGE_KEYS.RECEIVABLES && JSON.parse(existing).length < 3) ||
          (key === STORAGE_KEYS.PAYABLES && JSON.parse(existing).length < 2) ||
          (key === STORAGE_KEYS.IDEAS && JSON.parse(existing).length < 5) ||
          (key === STORAGE_KEYS.LEARNING && JSON.parse(existing).length < 5) ||
          (key === STORAGE_KEYS.REMINDERS && JSON.parse(existing).length < 2) ||
          (key === STORAGE_KEYS.WEEKLY_REVIEWS && !existing)) {
        this.saveData(key, DEFAULT_SEED_DATA[key]);
      }
    });
  },

  generateId(prefix = 'item') {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
  },

  getData(key, defaultValue = []) {
    try {
      const serialized = localStorage.getItem(key);
      if (serialized === null) return defaultValue;
      return JSON.parse(serialized);
    } catch (err) {
      console.error(`Error reading ${key} from storage:`, err);
      return defaultValue;
    }
  },

  saveData(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`Error writing ${key} to storage:`, err);
      return false;
    }
  },

  // --- Task Methods ---
  getTasks() {
    return this.getData(STORAGE_KEYS.TASKS, DEFAULT_SEED_DATA[STORAGE_KEYS.TASKS]);
  },

  addTask(task) {
    const tasks = this.getTasks();
    if (!task.id) task.id = this.generateId('task');
    tasks.unshift(task);
    this.saveData(STORAGE_KEYS.TASKS, tasks);
    return task;
  },

  updateTask(taskId, updates) {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === taskId);
    if (index === -1) return null;
    tasks[index] = { ...tasks[index], ...updates, updatedAt: new Date().toISOString() };
    this.saveData(STORAGE_KEYS.TASKS, tasks);
    return tasks[index];
  },

  deleteTask(taskId) {
    const tasks = this.getTasks();
    const filtered = tasks.filter(t => t.id !== taskId);
    this.saveData(STORAGE_KEYS.TASKS, filtered);
    return filtered.length < tasks.length;
  },

  duplicateTask(taskId) {
    const tasks = this.getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return null;
    const cloned = {
      ...task,
      id: this.generateId('task'),
      title: `${task.title} (Copy)`,
      completed: false,
      status: 'To Do',
      createdAt: new Date().toISOString()
    };
    tasks.unshift(cloned);
    this.saveData(STORAGE_KEYS.TASKS, tasks);
    return cloned;
  },

  toggleTask(taskId) {
    const tasks = this.getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      task.status = task.completed ? 'Completed' : 'To Do';
      this.saveData(STORAGE_KEYS.TASKS, tasks);
    }
    return task;
  },

  // --- Areas Methods ---
  getAreas() {
    return this.getData(STORAGE_KEYS.AREAS, DEFAULT_SEED_DATA[STORAGE_KEYS.AREAS]);
  },

  addArea(areaData) {
    const areas = this.getAreas();
    const newArea = {
      id: this.generateId('area'),
      name: areaData.name,
      icon: areaData.icon || 'folder',
      color: areaData.color || '#2563eb',
      description: areaData.description || '',
      active: areaData.active !== false,
      createdAt: new Date().toISOString()
    };
    areas.push(newArea);
    this.saveData(STORAGE_KEYS.AREAS, areas);
    return newArea;
  },

  updateArea(id, updates) {
    const areas = this.getAreas();
    const index = areas.findIndex(a => a.id === id);
    if (index === -1) return null;
    areas[index] = { ...areas[index], ...updates };
    this.saveData(STORAGE_KEYS.AREAS, areas);
    return areas[index];
  },

  deleteArea(id) {
    const areas = this.getAreas();
    const filtered = areas.filter(a => a.id !== id);
    this.saveData(STORAGE_KEYS.AREAS, filtered);
    return filtered.length < areas.length;
  },

  // --- Projects Methods ---
  getProjects() {
    return this.getData(STORAGE_KEYS.PROJECTS, DEFAULT_SEED_DATA[STORAGE_KEYS.PROJECTS]);
  },

  getProjectById(id) {
    const projects = this.getProjects();
    return projects.find(p => p.id === id) || null;
  },

  addProject(projectData) {
    const projects = this.getProjects();
    const newProject = {
      id: this.generateId('proj'),
      name: projectData.name,
      area: projectData.area || 'Job',
      description: projectData.description || '',
      detailedDescription: projectData.detailedDescription || projectData.description || '',
      status: projectData.status || 'Active',
      priority: projectData.priority || 'Medium',
      deadline: projectData.deadline || 'Upcoming',
      startDate: projectData.startDate || 'Today',
      estimatedHours: Number(projectData.estimatedHours) || 10,
      progress: Number(projectData.progress) || 0,
      tasksDone: Number(projectData.tasksDone) || 0,
      tasksTotal: Number(projectData.tasksTotal) || 0,
      nextTask: projectData.nextTask || 'Plan next step',
      nextTaskDue: projectData.nextTaskDue || 'Upcoming',
      milestones: projectData.milestones || [],
      notes: projectData.notes || '',
      files: projectData.files || [],
      color: projectData.color || '#2563eb',
      icon: projectData.icon || 'folder',
      createdAt: new Date().toISOString()
    };
    projects.unshift(newProject);
    this.saveData(STORAGE_KEYS.PROJECTS, projects);
    return newProject;
  },

  updateProject(id, updates) {
    const projects = this.getProjects();
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) return null;
    projects[index] = { ...projects[index], ...updates, updatedAt: new Date().toISOString() };
    this.saveData(STORAGE_KEYS.PROJECTS, projects);
    return projects[index];
  },

  deleteProject(id) {
    const projects = this.getProjects();
    const filtered = projects.filter(p => p.id !== id);
    this.saveData(STORAGE_KEYS.PROJECTS, filtered);
    return filtered.length < projects.length;
  },

  archiveProject(id) {
    return this.updateProject(id, { status: 'Archived' });
  },

  toggleProjectMilestone(projectId, milestoneIndex) {
    const project = this.getProjectById(projectId);
    if (!project || !project.milestones || !project.milestones[milestoneIndex]) return null;
    const ms = project.milestones[milestoneIndex];
    if (ms.status === 'completed') {
      ms.status = 'pending';
    } else if (ms.status === 'pending') {
      ms.status = 'in-progress';
    } else {
      ms.status = 'completed';
    }
    const completedMs = project.milestones.filter(m => m.status === 'completed').length;
    if (project.milestones.length > 0) {
      project.progress = Math.round((completedMs / project.milestones.length) * 100);
    }
    this.updateProject(projectId, { milestones: project.milestones, progress: project.progress });
    return project;
  },

  // --- Calendar Methods ---
  getCalendarEvents() {
    return this.getData(STORAGE_KEYS.CALENDAR_EVENTS, DEFAULT_SEED_DATA[STORAGE_KEYS.CALENDAR_EVENTS]);
  },

  getCalendarEventsByDate(dateStr) {
    const events = this.getCalendarEvents();
    return events.filter(e => e.date === dateStr);
  },

  addCalendarEvent(eventData) {
    const events = this.getCalendarEvents();
    const newEvent = {
      id: this.generateId('cal'),
      title: eventData.title,
      date: eventData.date || '2024-04-23',
      dateDisplay: eventData.dateDisplay || 'Apr 23',
      time: eventData.time || '10:00 AM',
      type: eventData.type || 'Task',
      priority: eventData.priority || 'Medium',
      area: eventData.area || 'Personal',
      context: eventData.context || '',
      completed: false,
      createdAt: new Date().toISOString()
    };
    events.push(newEvent);
    this.saveData(STORAGE_KEYS.CALENDAR_EVENTS, events);
    return newEvent;
  },

  updateCalendarEvent(id, updates) {
    const events = this.getCalendarEvents();
    const index = events.findIndex(e => e.id === id);
    if (index === -1) return null;
    events[index] = { ...events[index], ...updates };
    this.saveData(STORAGE_KEYS.CALENDAR_EVENTS, events);
    return events[index];
  },

  deleteCalendarEvent(id) {
    const events = this.getCalendarEvents();
    const filtered = events.filter(e => e.id !== id);
    this.saveData(STORAGE_KEYS.CALENDAR_EVENTS, filtered);
    return filtered.length < events.length;
  },

  toggleCalendarEvent(id) {
    const events = this.getCalendarEvents();
    const item = events.find(e => e.id === id);
    if (item) {
      item.completed = !item.completed;
      this.saveData(STORAGE_KEYS.CALENDAR_EVENTS, events);
    }
    return item;
  },

  // --- Waiting For Methods ---
  getWaitingFor() {
    return this.getData(STORAGE_KEYS.WAITING_FOR, DEFAULT_SEED_DATA[STORAGE_KEYS.WAITING_FOR]);
  },

  // --- Finance Overview ---
  getFinanceSnapshot() {
    return this.getData(STORAGE_KEYS.FINANCE_SNAPSHOT, DEFAULT_SEED_DATA[STORAGE_KEYS.FINANCE_SNAPSHOT]);
  },

  // --- Workload Snapshot ---
  getWorkloadSnapshot() {
    return this.getData(STORAGE_KEYS.WORKLOAD_SNAPSHOT, DEFAULT_SEED_DATA[STORAGE_KEYS.WORKLOAD_SNAPSHOT]);
  },

  // --- Inbox Methods ---
  getInbox() {
    return this.getData(STORAGE_KEYS.INBOX, DEFAULT_SEED_DATA[STORAGE_KEYS.INBOX]);
  },

  addInboxItem(title, type = 'Unsorted', details = '') {
    const list = this.getInbox();
    const item = {
      id: this.generateId('inbox'),
      title,
      details,
      type,
      status: 'Unprocessed',
      createdAt: new Date().toISOString(),
      createdDisplay: 'Just now'
    };
    list.unshift(item);
    this.saveData(STORAGE_KEYS.INBOX, list);
    return item;
  },

  updateInboxItem(id, updates) {
    const list = this.getInbox();
    const index = list.findIndex(i => i.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() };
    this.saveData(STORAGE_KEYS.INBOX, list);
    return list[index];
  },

  deleteInboxItem(id) {
    const list = this.getInbox();
    const filtered = list.filter(i => i.id !== id);
    this.saveData(STORAGE_KEYS.INBOX, filtered);
    return filtered.length < list.length;
  },

  markInboxStatus(id, status) {
    return this.updateInboxItem(id, { status });
  },

  convertInboxItem(id, targetType) {
    const list = this.getInbox();
    const item = list.find(i => i.id === id);
    if (!item) return null;

    if (targetType === 'Task') {
      this.addTask({
        id: this.generateId('task'),
        title: item.title,
        area: 'Personal',
        project: 'Inbox item',
        deadline: 'Upcoming',
        priority: 'Medium',
        estimatedTime: '1h',
        status: 'To Do',
        completed: false,
        isFocus: false,
        createdAt: new Date().toISOString()
      });
    } else if (targetType === 'Idea') {
      const ideas = this.getData(STORAGE_KEYS.IDEAS, []);
      ideas.unshift({
        id: this.generateId('idea'),
        title: item.title,
        description: item.details || item.title,
        category: 'Personal',
        status: 'Inbox',
        createdAt: new Date().toISOString()
      });
      this.saveData(STORAGE_KEYS.IDEAS, ideas);
    } else if (targetType === 'Reminder') {
      const reminders = this.getData(STORAGE_KEYS.REMINDERS, []);
      reminders.unshift({
        id: this.generateId('rem'),
        title: item.title,
        description: item.details,
        date: 'Today',
        time: '18:00',
        status: 'Active',
        createdAt: new Date().toISOString()
      });
      this.saveData(STORAGE_KEYS.REMINDERS, reminders);
    }

    item.status = 'Converted';
    item.convertedTo = targetType;
    this.saveData(STORAGE_KEYS.INBOX, list);
    return item;
  },

  // --- Timeblock Methods ---
  getTimeblocks() {
    return this.getData(STORAGE_KEYS.TIMEBLOCKS, DEFAULT_SEED_DATA[STORAGE_KEYS.TIMEBLOCKS]);
  },

  getTimeblocksForDate(date) {
    const blocks = this.getTimeblocks();
    return blocks.filter(b => b.date === date);
  },

  addTimeblock(block) {
    const blocks = this.getTimeblocks();
    if (!block.id) block.id = this.generateId('tb');
    if (!block.date) block.date = '2024-04-23';
    blocks.push(block);
    blocks.sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
    this.saveData(STORAGE_KEYS.TIMEBLOCKS, blocks);
    return block;
  },

  updateTimeblock(id, updates) {
    const blocks = this.getTimeblocks();
    const index = blocks.findIndex(b => b.id === id);
    if (index === -1) return null;
    blocks[index] = { ...blocks[index], ...updates, updatedAt: new Date().toISOString() };
    blocks.sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
    this.saveData(STORAGE_KEYS.TIMEBLOCKS, blocks);
    return blocks[index];
  },

  deleteTimeblock(id) {
    const blocks = this.getTimeblocks();
    const filtered = blocks.filter(b => b.id !== id);
    this.saveData(STORAGE_KEYS.TIMEBLOCKS, filtered);
    return filtered.length < blocks.length;
  },

  toggleTimeblockComplete(id) {
    const blocks = this.getTimeblocks();
    const block = blocks.find(b => b.id === id);
    if (block) {
      block.completed = !block.completed;
      this.saveData(STORAGE_KEYS.TIMEBLOCKS, blocks);
    }
    return block;
  },

  calculateDayCapacity(date = '2024-04-23') {
    const blocks = this.getTimeblocksForDate(date);
    let totalPlannedHours = 0;
    let focusHours = 0;

    blocks.forEach(b => {
      let duration = 1.0;
      if (b.startTime && b.endTime) {
        const [sh, sm] = b.startTime.split(':').map(Number);
        const [eh, em] = b.endTime.split(':').map(Number);
        const startMinutes = sh * 60 + (sm || 0);
        const endMinutes = eh * 60 + (em || 0);
        if (endMinutes > startMinutes) {
          duration = (endMinutes - startMinutes) / 60;
        }
      }
      totalPlannedHours += duration;
      if (b.isDeepWork) {
        focusHours += duration;
      }
    });

    const dayCapacityHours = 16.0; // 6 AM to 10 PM
    const maxFocusCapacity = 8.0;
    const freeHours = Math.max(0, dayCapacityHours - totalPlannedHours);
    const isOverbooked = focusHours > maxFocusCapacity || totalPlannedHours > 14.0;

    return {
      totalPlannedHours: Math.round(totalPlannedHours * 10) / 10,
      focusHours: Math.round(focusHours * 10) / 10,
      freeHours: Math.round(freeHours * 10) / 10,
      dayCapacityHours,
      maxFocusCapacity,
      plannedRatio: Math.min(100, Math.round((totalPlannedHours / dayCapacityHours) * 100)),
      focusRatio: Math.min(100, Math.round((focusHours / maxFocusCapacity) * 100)),
      freeRatio: Math.min(100, Math.round((freeHours / dayCapacityHours) * 100)),
      isOverbooked,
      overbookedMessage: isOverbooked
        ? `You have planned ${focusHours} hours of focused work today.`
        : 'You have a healthy balance today.'
    };
  },

  // --- Finance & Transactions Methods ---
  getTransactions() {
    return this.getData(STORAGE_KEYS.TRANSACTIONS, DEFAULT_SEED_DATA[STORAGE_KEYS.TRANSACTIONS]);
  },

  addTransaction(tx) {
    const list = this.getTransactions();
    if (!tx.id) tx.id = this.generateId('tx');
    if (!tx.date) tx.date = new Date().toISOString().split('T')[0];
    list.unshift(tx);
    this.saveData(STORAGE_KEYS.TRANSACTIONS, list);
    return tx;
  },

  updateTransaction(id, updates) {
    const list = this.getTransactions();
    const index = list.findIndex(t => t.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() };
    this.saveData(STORAGE_KEYS.TRANSACTIONS, list);
    return list[index];
  },

  deleteTransaction(id) {
    const list = this.getTransactions();
    const filtered = list.filter(t => t.id !== id);
    this.saveData(STORAGE_KEYS.TRANSACTIONS, filtered);
    return filtered.length < list.length;
  },

  // --- Receivables (Money Lent) Methods ---
  getReceivables() {
    return this.getData(STORAGE_KEYS.RECEIVABLES, DEFAULT_SEED_DATA[STORAGE_KEYS.RECEIVABLES]);
  },

  addReceivable(rec) {
    const list = this.getReceivables();
    if (!rec.id) rec.id = this.generateId('rec');
    if (!rec.dateLent) rec.dateLent = new Date().toISOString().split('T')[0];
    list.unshift(rec);
    this.saveData(STORAGE_KEYS.RECEIVABLES, list);
    return rec;
  },

  updateReceivable(id, updates) {
    const list = this.getReceivables();
    const index = list.findIndex(r => r.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() };
    this.saveData(STORAGE_KEYS.RECEIVABLES, list);
    return list[index];
  },

  deleteReceivable(id) {
    const list = this.getReceivables();
    const filtered = list.filter(r => r.id !== id);
    this.saveData(STORAGE_KEYS.RECEIVABLES, filtered);
    return filtered.length < list.length;
  },

  markReceivablePaid(id) {
    return this.updateReceivable(id, { status: 'Paid', returnDate: new Date().toISOString().split('T')[0] });
  },

  // --- Payables (Money Owed) Methods ---
  getPayables() {
    return this.getData(STORAGE_KEYS.PAYABLES, DEFAULT_SEED_DATA[STORAGE_KEYS.PAYABLES]);
  },

  addPayable(pay) {
    const list = this.getPayables();
    if (!pay.id) pay.id = this.generateId('pay');
    list.unshift(pay);
    this.saveData(STORAGE_KEYS.PAYABLES, list);
    return pay;
  },

  updatePayable(id, updates) {
    const list = this.getPayables();
    const index = list.findIndex(p => p.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() };
    this.saveData(STORAGE_KEYS.PAYABLES, list);
    return list[index];
  },

  deletePayable(id) {
    const list = this.getPayables();
    const filtered = list.filter(p => p.id !== id);
    this.saveData(STORAGE_KEYS.PAYABLES, filtered);
    return filtered.length < list.length;
  },

  markPayablePaid(id) {
    return this.updatePayable(id, { status: 'Paid' });
  },

  // --- Ideas Methods (Step 12) ---
  getIdeas() {
    return this.getData(STORAGE_KEYS.IDEAS, DEFAULT_SEED_DATA[STORAGE_KEYS.IDEAS] || []);
  },

  getIdeaById(id) {
    const list = this.getIdeas();
    return list.find(item => item.id === id) || null;
  },

  addIdea(ideaData) {
    const list = this.getIdeas();
    const newId = this.generateId('idea');

    const catIcons = {
      'SaaS': { icon: 'briefcase', bg: '#eff6ff', color: '#2563eb' },
      'Marketplace': { icon: 'graduation-cap', bg: '#fff7ed', color: '#ea580c' },
      'Productivity': { icon: 'feather', bg: '#f0fdf4', color: '#16a34a' },
      'Content': { icon: 'file-text', bg: '#eff6ff', color: '#2563eb' },
      'Business': { icon: 'receipt', bg: '#fdf2f8', color: '#db2777' },
      'Learning': { icon: 'book-open', bg: '#faf5ff', color: '#9333ea' },
      'Personal': { icon: 'heart', bg: '#fef2f2', color: '#dc2626' },
      'Feature': { icon: 'layers', bg: '#faf5ff', color: '#9333ea' }
    };
    const catStyle = catIcons[ideaData.category] || { icon: 'lightbulb', bg: '#eff6ff', color: '#2563eb' };

    let notesArr = [];
    if (Array.isArray(ideaData.notes)) {
      notesArr = ideaData.notes;
    } else if (typeof ideaData.notes === 'string' && ideaData.notes.trim()) {
      notesArr = ideaData.notes.split('\n').map(s => s.trim().replace(/^[-*•]\s*/, '')).filter(Boolean);
    }

    const newIdea = {
      id: newId,
      title: ideaData.title || 'Untitled Idea',
      category: ideaData.category || 'SaaS',
      status: ideaData.status || 'Active',
      fomoBucket: ideaData.fomoBucket || (ideaData.status === 'Archived' ? 'Archived' : (ideaData.status === 'Research Later' ? 'Later' : (ideaData.status === 'Someday' ? 'Someday' : 'Active'))),
      starred: !!ideaData.starred,
      description: ideaData.description || '',
      problem: ideaData.problem || '',
      targetUser: ideaData.targetUser || '',
      potentialSolution: ideaData.potentialSolution || '',
      monetization: ideaData.monetization || '',
      notes: notesArr,
      priority: ideaData.priority || 'Medium',
      reviewDate: ideaData.reviewDate || '',
      reviewDateDisplay: ideaData.reviewDateDisplay || (ideaData.reviewDate ? ideaData.reviewDate : 'Upcoming'),
      icon: ideaData.icon || catStyle.icon,
      iconBg: catStyle.bg,
      iconColor: catStyle.color,
      createdAt: new Date().toISOString()
    };

    list.unshift(newIdea);
    this.saveData(STORAGE_KEYS.IDEAS, list);
    return newIdea;
  },

  updateIdea(id, updates) {
    const list = this.getIdeas();
    const index = list.findIndex(item => item.id === id);
    if (index === -1) return null;

    if (updates.notes && typeof updates.notes === 'string') {
      updates.notes = updates.notes.split('\n').map(s => s.trim().replace(/^[-*•]\s*/, '')).filter(Boolean);
    }

    list[index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() };
    this.saveData(STORAGE_KEYS.IDEAS, list);
    return list[index];
  },

  deleteIdea(id) {
    const list = this.getIdeas();
    const filtered = list.filter(item => item.id !== id);
    this.saveData(STORAGE_KEYS.IDEAS, filtered);
    return filtered.length < list.length;
  },

  toggleStarIdea(id) {
    const item = this.getIdeaById(id);
    if (!item) return null;
    return this.updateIdea(id, { starred: !item.starred });
  },

  archiveIdea(id) {
    const item = this.getIdeaById(id);
    if (!item) return null;
    const newStatus = item.status === 'Archived' ? 'Active' : 'Archived';
    const newBucket = newStatus === 'Archived' ? 'Archived' : 'Active';
    return this.updateIdea(id, { status: newStatus, fomoBucket: newBucket });
  },

  promoteIdeaToProject(id) {
    const idea = this.getIdeaById(id);
    if (!idea) return null;

    let area = 'SaaS';
    if (idea.category === 'Learning') area = 'Learning';
    else if (idea.category === 'Personal') area = 'Personal';
    else if (idea.category === 'Business') area = 'Job';
    else if (idea.category === 'Content') area = 'Freelance';

    const projectData = {
      name: idea.title,
      description: (idea.description || '') + (idea.problem ? `\n\nProblem: ${idea.problem}` : '') + (idea.potentialSolution ? `\nSolution: ${idea.potentialSolution}` : ''),
      area: area,
      status: 'Active',
      priority: idea.priority || 'Medium',
      deadline: idea.reviewDateDisplay || 'May 30, 2024',
      startDate: 'Today',
      estimatedHours: 25,
      progress: 0,
      tasksDone: 0,
      tasksTotal: 2,
      nextTask: 'Set up project roadmap & initial architecture',
      nextTaskDue: 'Tomorrow, 5:00 PM',
      milestones: [
        { id: 'm1', title: 'Validate problem with target users', status: 'pending' },
        { id: 'm2', title: 'Build MVP wireframes & core flow', status: 'pending' }
      ],
      notes: (idea.monetization ? `Monetization Idea: ${idea.monetization}\n` : '') + (idea.notes && idea.notes.length ? `Notes:\n- ${idea.notes.join('\n- ')}` : ''),
      files: [],
      color: '#2563eb',
      icon: 'folder'
    };

    const newProject = this.addProject(projectData);
    this.updateIdea(id, { promotedProjectId: newProject.id, status: 'Active', fomoBucket: 'Active' });
    return { success: true, project: newProject, idea };
  },

  calculateIdeaMetrics() {
    const list = this.getIdeas();
    const active = list.filter(i => i.fomoBucket === 'Active' || i.status === 'Active');
    const later = list.filter(i => i.fomoBucket === 'Later' || i.status === 'Research Later');
    const promising = list.filter(i => i.status === 'Promising' || i.fomoBucket === 'Someday');
    const archived = list.filter(i => i.fomoBucket === 'Archived' || i.status === 'Archived');

    return {
      activeCount: active.length,
      laterCount: later.length,
      promisingCount: promising.length,
      archivedCount: archived.length,
      totalCount: list.length
    };
  },

  // --- Learning Tracker Methods (Step 13) ---
  getLearningItems() {
    return this.getData(STORAGE_KEYS.LEARNING, DEFAULT_SEED_DATA[STORAGE_KEYS.LEARNING] || []);
  },

  getLearningItemById(id) {
    const list = this.getLearningItems();
    return list.find(item => item.id === id) || null;
  },

  addLearningItem(itemData) {
    const list = this.getLearningItems();
    const newId = this.generateId('learn');

    let badgeText = (itemData.title || 'L').substring(0, 2).toUpperCase();
    let badgeBg = '#2563eb';
    let badgeColor = '#ffffff';

    if (itemData.topic === 'Web Development') {
      badgeText = 'N';
      badgeBg = '#000000';
    } else if (itemData.topic === 'AI') {
      badgeText = 'AI';
      badgeBg = '#10a37f';
    } else if (itemData.topic === 'Programming') {
      badgeText = 'JS';
      badgeBg = '#f7df1e';
      badgeColor = '#000000';
    } else if (itemData.topic === 'Design') {
      badgeText = 'UI';
      badgeBg = '#f24e1e';
    }

    const newItem = {
      id: newId,
      title: itemData.title || 'Untitled Learning Item',
      type: itemData.type || 'Course',
      topic: itemData.topic || 'Web Development',
      source: itemData.source || '',
      status: itemData.status || 'Learning',
      priority: itemData.priority || 'Medium',
      startDate: itemData.startDate || new Date().toISOString().split('T')[0],
      targetDate: itemData.targetDate || '',
      targetDateDisplay: itemData.targetDateDisplay || (itemData.targetDate ? itemData.targetDate : 'Upcoming'),
      progress: Number(itemData.progress) || 0,
      hoursSpent: Number(itemData.hoursSpent) || 0,
      estimatedHours: Number(itemData.estimatedHours) || 10,
      description: itemData.description || '',
      badgeText: itemData.badgeText || badgeText,
      badgeBg: itemData.badgeBg || badgeBg,
      badgeColor: itemData.badgeColor || badgeColor,
      modules: itemData.modules || [
        { id: 'm1', title: 'Module 1: Foundations', completed: false, isCurrent: true },
        { id: 'm2', title: 'Module 2: Practice & Projects', completed: false }
      ],
      nextAction: itemData.nextAction || 'Start Module 1',
      nextActionSub: itemData.nextActionSub || 'Begin first lesson and take notes.',
      isBacklog: !!itemData.isBacklog,
      createdAt: new Date().toISOString()
    };

    list.unshift(newItem);
    this.saveData(STORAGE_KEYS.LEARNING, list);
    return newItem;
  },

  updateLearningItem(id, updates) {
    const list = this.getLearningItems();
    const index = list.findIndex(item => item.id === id);
    if (index === -1) return null;

    list[index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() };
    this.saveData(STORAGE_KEYS.LEARNING, list);
    return list[index];
  },

  deleteLearningItem(id) {
    const list = this.getLearningItems();
    const filtered = list.filter(item => item.id !== id);
    this.saveData(STORAGE_KEYS.LEARNING, filtered);
    return filtered.length < list.length;
  },

  toggleLearningModule(itemId, moduleIndex) {
    const item = this.getLearningItemById(itemId);
    if (!item || !item.modules || !item.modules[moduleIndex]) return null;

    const mod = item.modules[moduleIndex];
    mod.completed = !mod.completed;

    const completedCount = item.modules.filter(m => m.completed).length;
    item.progress = Math.round((completedCount / item.modules.length) * 100);

    let firstIncomplete = null;
    item.modules.forEach(m => {
      m.isCurrent = false;
      if (!m.completed && !firstIncomplete) {
        m.isCurrent = true;
        firstIncomplete = m;
      }
    });

    if (firstIncomplete) {
      item.nextAction = `Continue: ${firstIncomplete.title}`;
    } else if (completedCount === item.modules.length) {
      item.status = 'Completed';
      item.nextAction = 'Course completed!';
      item.nextActionSub = 'Review key notes or build a capstone project.';
    }

    this.updateLearningItem(itemId, {
      modules: item.modules,
      progress: item.progress,
      status: item.status,
      nextAction: item.nextAction,
      nextActionSub: item.nextActionSub
    });

    return item;
  },

  calculateLearningMetrics() {
    const list = this.getLearningItems();
    const active = list.filter(i => (i.status === 'Learning' || i.status === 'Planned') && !i.isBacklog);
    const learningNow = list.filter(i => i.status === 'Learning' && !i.isBacklog);
    const completed = list.filter(i => i.status === 'Completed');
    const backlog = list.filter(i => i.isBacklog);

    return {
      activeCount: active.length,
      learningNowCount: learningNow.length,
      hoursPlannedThisWeek: 8,
      hoursGoalThisWeek: 12,
      hoursPct: 67,
      completedThisMonth: 3,
      completedGoal: 5,
      completedPct: 60,
      currentFocus: 'AI & Productivity',
      streakDays: 7,
      backlogCount: backlog.length
    };
  },

  // --- Finance Calculations ---
  calculateFinanceMetrics() {
    const txs = this.getTransactions();
    const recs = this.getReceivables();
    const pays = this.getPayables();

    let totalIncome = 0;
    let totalExpenses = 0;
    const categoryTotals = {
      'Food & Dining': 0,
      'Transport': 0,
      'Education': 0,
      'Subscriptions': 0,
      'Business': 0,
      'Family & Personal': 0
    };

    txs.forEach(t => {
      const amt = Number(t.amount) || 0;
      if (t.type === 'income') {
        totalIncome += amt;
      } else {
        totalExpenses += amt;
        const cat = t.category || 'Other';
        if (categoryTotals[cat] !== undefined) {
          categoryTotals[cat] += amt;
        } else {
          categoryTotals[cat] = (categoryTotals[cat] || 0) + amt;
        }
      }
    });

    // Money to Collect (pending receivables)
    const pendingRecs = recs.filter(r => r.status !== 'Paid');
    const moneyToCollect = pendingRecs.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

    // Money to Pay (pending payables)
    const pendingPays = pays.filter(p => p.status !== 'Paid');
    const moneyToPay = pendingPays.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const totalBudget = 64000;
    const remainingBudget = Math.max(0, totalBudget - totalExpenses);
    const budgetUsedPct = totalBudget > 0 ? Math.min(100, Math.round((totalExpenses / totalBudget) * 100)) : 0;
    const currentBalance = 125500;
    const savings = 26500;

    return {
      totalIncome,
      totalExpenses,
      currentBalance,
      moneyToCollect,
      receivablesCount: pendingRecs.length,
      moneyToPay,
      payablesCount: pendingPays.length,
      savings,
      totalBudget,
      remainingBudget,
      budgetUsedPct,
      categoryTotals
    };
  },

  // --- Reminders Methods (Step 14) ---
  getReminders() {
    return this.getData(STORAGE_KEYS.REMINDERS, DEFAULT_SEED_DATA[STORAGE_KEYS.REMINDERS] || []);
  },

  getReminderById(id) {
    const list = this.getReminders();
    return list.find(r => r.id === id) || null;
  },

  addReminder(rem) {
    const list = this.getReminders();
    if (!rem.id) rem.id = this.generateId('rem');
    rem.unread = true;
    rem.createdAt = new Date().toISOString();
    list.unshift(rem);
    this.saveData(STORAGE_KEYS.REMINDERS, list);
    return rem;
  },

  updateReminder(id, updates) {
    const list = this.getReminders();
    const index = list.findIndex(r => r.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() };
    this.saveData(STORAGE_KEYS.REMINDERS, list);
    return list[index];
  },

  deleteReminder(id) {
    const list = this.getReminders();
    const filtered = list.filter(r => r.id !== id);
    this.saveData(STORAGE_KEYS.REMINDERS, filtered);
    return filtered.length < list.length;
  },

  markReminderRead(id) {
    return this.updateReminder(id, { unread: false });
  },

  markAllRemindersRead() {
    const list = this.getReminders().map(r => ({ ...r, unread: false }));
    this.saveData(STORAGE_KEYS.REMINDERS, list);
    return list;
  },

  getUnreadRemindersCount() {
    return this.getReminders().filter(r => r.unread).length;
  },

  // --- Weekly Review Methods (Step 15) ---
  getWeeklyReview() {
    return this.getData(STORAGE_KEYS.WEEKLY_REVIEWS, DEFAULT_SEED_DATA[STORAGE_KEYS.WEEKLY_REVIEWS]);
  },

  saveWeeklyReview(data) {
    this.saveData(STORAGE_KEYS.WEEKLY_REVIEWS, data);
    return data;
  },

  saveReflections(reflectionsObj) {
    const review = this.getWeeklyReview();
    review.reflections = { ...review.reflections, ...reflectionsObj };
    return this.saveWeeklyReview(review);
  },

  togglePriorityItem(priorityId) {
    const review = this.getWeeklyReview();
    const item = review.priorities.find(p => p.id === priorityId);
    if (item) {
      item.completed = !item.completed;
      this.saveWeeklyReview(review);
    }
    return item;
  },

  addPriorityItem(title, area, date) {
    const review = this.getWeeklyReview();
    if (!review.priorities) review.priorities = [];
    if (review.priorities.length >= 5) {
      return { success: false, message: 'Maximum 5 priorities allowed' };
    }
    const newItem = {
      id: this.generateId('prio'),
      title,
      area: area || 'Personal',
      date: date || 'Apr 30',
      completed: false
    };
    review.priorities.push(newItem);
    this.saveWeeklyReview(review);
    return { success: true, item: newItem };
  },

  // --- Areas Methods ---
  getAreas() {
    return this.getData(STORAGE_KEYS.AREAS, DEFAULT_SEED_DATA[STORAGE_KEYS.AREAS]);
  },

  addArea(area) {
    const areas = this.getAreas();
    const newArea = {
      id: this.generateId('area'),
      name: area.name,
      icon: area.icon || 'tag',
      color: area.color || '#2563eb',
      description: area.description || '',
      active: true
    };
    areas.push(newArea);
    this.saveData(STORAGE_KEYS.AREAS, areas);
    return newArea;
  },

  deleteArea(id) {
    const areas = this.getAreas();
    const filtered = areas.filter(a => a.id !== id);
    this.saveData(STORAGE_KEYS.AREAS, filtered);
    return filtered.length < areas.length;
  },

  // --- Settings & Preferences Methods (Step 18) ---
  getSettings() {
    return this.getData(STORAGE_KEYS.SETTINGS, DEFAULT_SEED_DATA[STORAGE_KEYS.SETTINGS]);
  },

  saveSettings(settings) {
    this.saveData(STORAGE_KEYS.SETTINGS, settings);
    return settings;
  },

  updateSettings(partial) {
    const current = this.getSettings();
    const updated = {
      ...current,
      ...partial,
      profile: { ...current.profile, ...(partial.profile || {}) },
      work: { ...current.work, ...(partial.work || {}) },
      finance: { ...current.finance, ...(partial.finance || {}) },
      notifications: { ...current.notifications, ...(partial.notifications || {}) },
      appearance: { ...current.appearance, ...(partial.appearance || {}) }
    };
    this.saveSettings(updated);
    return updated;
  },

  exportAllData() {
    const backup = {};
    Object.values(STORAGE_KEYS).forEach(key => {
      backup[key] = this.getData(key, null);
    });
    backup.exportedAt = new Date().toISOString();
    return JSON.stringify(backup, null, 2);
  },

  importAllData(jsonData) {
    try {
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      Object.values(STORAGE_KEYS).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          this.saveData(key, data[key]);
        }
      });
      return true;
    } catch (err) {
      console.error('Failed to import data:', err);
      return false;
    }
  },

  clearAllData() {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};

// Initialize seed data on load
StorageService.init();

window.StorageService = StorageService;

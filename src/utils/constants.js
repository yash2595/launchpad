export const STATUSES = {
  APPLIED: 'Applied',
  SCREENING: 'Screening',
  INTERVIEW: 'Interview',
  OFFER: 'Offer',
  REJECTED: 'Rejected',
};

export const STATUS_LIST = [
  STATUSES.APPLIED,
  STATUSES.SCREENING,
  STATUSES.INTERVIEW,
  STATUSES.OFFER,
  STATUSES.REJECTED,
];

export const PRIORITIES = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
};

export const PRIORITY_LIST = [
  PRIORITIES.HIGH,
  PRIORITIES.MEDIUM,
  PRIORITIES.LOW,
];

export const NAV_LINKS = [
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/internships', label: 'Internships', icon: 'Briefcase' },
  { path: '/learning', label: 'Learning Log', icon: 'BookOpen' },
];

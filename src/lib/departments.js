export const DEPARTMENTS = [
  {
    slug: 'roads-public-works',
    label: 'Roads & Public Works',
    apiValue: 'Roads & Public Works',
  },
  {
    slug: 'sanitation',
    label: 'Sanitation',
    apiValue: 'Sanitation',
  },
  {
    slug: 'utilities',
    label: 'Utilities',
    apiValue: 'Electrical|Water Supply',
  },
  {
    slug: 'parks-rec',
    label: 'Parks & Rec',
    apiValue: 'Parks',
  },
  {
    slug: 'public-safety',
    label: 'Public Safety',
    apiValue: 'Public Safety',
  },
]

export function getDepartmentBySlug(slug) {
  return DEPARTMENTS.find((d) => d.slug === slug)
}

export function getDepartmentPath(slug) {
  return slug ? `/admin/departments/${slug}` : '/admin'
}

function isPending(status = '') {
  return /submitted|ai verified|pending/i.test(status)
}

function isInProgress(status = '') {
  return /assigned|in progress/i.test(status)
}

function isResolved(status = '') {
  return /resolved|closed/i.test(status)
}

function isHighPriority(priority = '') {
  return /critical|high/i.test(priority)
}

export function computeStatsFromComplaints(complaints = []) {
  return {
    total: complaints.length,
    pending: complaints.filter((c) => isPending(c.status)).length,
    inProgress: complaints.filter((c) => isInProgress(c.status)).length,
    resolved: complaints.filter((c) => isResolved(c.status)).length,
    highPriority: complaints.filter((c) => isHighPriority(c.priority)).length,
  }
}

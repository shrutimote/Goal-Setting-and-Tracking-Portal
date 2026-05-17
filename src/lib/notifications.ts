export interface Notification {
  id: string
  employeeId: string
  goalTitle: string
  message: string
  isRead: boolean
  createdAt: string
}

export function addNotification(employeeId: string, goalTitle: string, message: string) {
  if (typeof window === 'undefined') return
  const key = `notifications_${employeeId}`
  const existing = getNotifications(employeeId)
  const newNotif: Notification = {
    id: Math.random().toString(36).substr(2, 9),
    employeeId,
    goalTitle,
    message,
    isRead: false,
    createdAt: new Date().toISOString()
  }
  localStorage.setItem(key, JSON.stringify([newNotif, ...existing]))
  
  // Trigger a global custom event so the header bell icon updates instantly
  window.dispatchEvent(new Event('notifications-updated'))
}

export function getNotifications(employeeId: string): Notification[] {
  if (typeof window === 'undefined') return []
  const key = `notifications_${employeeId}`
  try {
    return JSON.parse(localStorage.getItem(key) || '[]')
  } catch {
    return []
  }
}

export function markNotificationsAsRead(employeeId: string) {
  if (typeof window === 'undefined') return
  const key = `notifications_${employeeId}`
  const existing = getNotifications(employeeId)
  const updated = existing.map(n => ({ ...n, isRead: true }))
  localStorage.setItem(key, JSON.stringify(updated))
  window.dispatchEvent(new Event('notifications-updated'))
}

// Custom Goal Progress Persistent Helpers
export function getGoalProgress(goalId: string, defaultPercent: number): number {
  if (typeof window === 'undefined') return defaultPercent
  const key = `goal_progress_${goalId}`
  const val = localStorage.getItem(key)
  return val !== null ? Number(val) : defaultPercent
}

export function setGoalProgress(goalId: string, progress: number) {
  if (typeof window === 'undefined') return
  const key = `goal_progress_${goalId}`
  localStorage.setItem(key, String(progress))
  window.dispatchEvent(new Event('progress-updated'))
}

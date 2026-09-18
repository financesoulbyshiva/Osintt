import { delay } from './api'
import { activity, activitySeries, dashboardStats, investigations, systemStatus, watchlists } from './demoData'
import type { ActivityEntry, InvestigationStatus, Watchlist } from './types'

export function listInvestigations(status?: InvestigationStatus | 'all') {
  const items = status && status !== 'all' ? investigations.filter((i) => i.status === status) : investigations
  return delay(items)
}

export function getInvestigation(id: string) {
  return delay(investigations.find((i) => i.id === id) ?? null)
}

export function getDashboardStats() {
  return delay(dashboardStats)
}

export function getActivitySeries() {
  return delay(activitySeries)
}

export function getSystemStatus() {
  return delay(systemStatus)
}

export function getRecentInvestigations(limit = 4) {
  return delay([...investigations].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, limit))
}

export function listWatchlists(): Promise<Watchlist[]> {
  return delay(watchlists)
}

export function listActivity(): Promise<ActivityEntry[]> {
  return delay(activity)
}

// Simulated investigation run — resolves demo results for any identifier.
export function runInvestigation(identifier: string, type: string) {
  return delay(
    {
      identifier,
      type,
      entitiesFound: 4 + (identifier.length % 5),
      relationshipsFound: 3 + (identifier.length % 4),
      sources: 2 + (identifier.length % 3),
      confidence: (identifier.length % 2 === 0 ? 'medium' : 'high') as 'medium' | 'high',
    },
    1400,
  )
}

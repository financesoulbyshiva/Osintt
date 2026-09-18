import type { EntityType, Confidence } from '@/services/types'
import type { IconName } from '@/components/Icon'

interface Meta {
  label: string
  plural: string
  icon: IconName
  color: string
  glyph: string
}

export const entityMeta: Record<EntityType, Meta> = {
  person: { label: 'Person', plural: 'People', icon: 'person', color: '#00e5ff', glyph: 'P' },
  username: { label: 'Username', plural: 'Usernames', icon: 'username', color: '#2563eb', glyph: '@' },
  email: { label: 'Email', plural: 'Emails', icon: 'email', color: '#22c55e', glyph: 'E' },
  domain: { label: 'Domain', plural: 'Domains', icon: 'domain', color: '#f59e0b', glyph: 'D' },
  ip: { label: 'IP Address', plural: 'IP Addresses', icon: 'ip', color: '#ef4444', glyph: '#' },
  social: { label: 'Social', plural: 'Social', icon: 'social', color: '#a78bfa', glyph: 'S' },
  organization: { label: 'Organization', plural: 'Organizations', icon: 'org', color: '#38bdf8', glyph: 'O' },
}

export const confidenceMeta: Record<Confidence, { label: string; tone: string; pct: number }> = {
  high: { label: 'High', tone: 'ok', pct: 88 },
  medium: { label: 'Medium', tone: 'warn', pct: 58 },
  low: { label: 'Low', tone: 'crit', pct: 28 },
}

export function entityColor(type: EntityType) {
  return entityMeta[type].color
}

import { listEntities, type EntityQuery } from './entities'
import type { EntityType } from './types'

// Typed convenience views over the shared entity service. Each keeps the same
// query contract so a real per-resource backend can be dropped in later.
const byType = (type: EntityType) => (query: Omit<EntityQuery, 'type'> = {}) =>
  listEntities({ ...query, type })

export const people = { list: byType('person') }
export const usernames = { list: byType('username') }
export const emails = { list: byType('email') }
export const domains = { list: byType('domain') }
export const ips = { list: byType('ip') }
export const social = { list: byType('social') }
export const organizations = { list: byType('organization') }

export const entityTypes: { value: EntityType; label: string; plural: string }[] = [
  { value: 'person', label: 'Person', plural: 'People' },
  { value: 'username', label: 'Username', plural: 'Usernames' },
  { value: 'email', label: 'Email', plural: 'Emails' },
  { value: 'domain', label: 'Domain', plural: 'Domains' },
  { value: 'ip', label: 'IP Address', plural: 'IP Addresses' },
  { value: 'social', label: 'Social Profile', plural: 'Social' },
  { value: 'organization', label: 'Organization', plural: 'Organizations' },
]

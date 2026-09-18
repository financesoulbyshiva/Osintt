import { delay } from './api'
import { entities, relationships, timeline } from './demoData'
import type { Entity, EntityType, Relationship, TimelineEvent } from './types'

export interface EntityQuery {
  type?: EntityType | 'all'
  search?: string
  confidence?: Entity['confidence'] | 'all'
  sourceId?: string
}

function matches(e: Entity, q: EntityQuery): boolean {
  if (q.type && q.type !== 'all' && e.type !== q.type) return false
  if (q.confidence && q.confidence !== 'all' && e.confidence !== q.confidence) return false
  if (q.sourceId && q.sourceId !== 'all' && !e.sources.some((s) => s.id === q.sourceId)) return false
  if (q.search) {
    const t = q.search.trim().toLowerCase()
    const hay = `${e.label} ${e.identifier} ${e.type} ${e.summary ?? ''}`.toLowerCase()
    if (!hay.includes(t)) return false
  }
  return true
}

export function listEntities(query: EntityQuery = {}) {
  return delay(entities.filter((e) => matches(e, query)))
}

export function getEntity(id: string) {
  return delay(entities.find((e) => e.id === id) ?? null)
}

export function getRelationshipsFor(entityId: string): Promise<Relationship[]> {
  return delay(relationships.filter((r) => r.from === entityId || r.to === entityId))
}

export function getRelatedEntities(entityId: string): Promise<Entity[]> {
  const entity = entities.find((e) => e.id === entityId)
  if (!entity) return delay([])
  return delay(entities.filter((e) => entity.relatedIds.includes(e.id)))
}

export function getEntityTimeline(_entityId: string): Promise<TimelineEvent[]> {
  return delay(timeline)
}

export function searchAll(term: string): Promise<Entity[]> {
  return delay(
    entities.filter((e) =>
      `${e.label} ${e.identifier} ${e.type}`.toLowerCase().includes(term.trim().toLowerCase()),
    ),
  )
}

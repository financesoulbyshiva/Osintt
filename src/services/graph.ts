import { delay } from './api'
import { entities, relationships } from './demoData'
import type { GraphData } from './types'

export function getGraphData(): Promise<GraphData> {
  return delay({
    nodes: entities.map((e) => ({
      id: e.id,
      type: e.type,
      label: e.label,
      confidence: e.confidence,
    })),
    edges: relationships.map((r) => ({
      id: r.id,
      source: r.from,
      target: r.to,
      label: r.label,
    })),
  })
}

// Subgraph rooted at one entity, expanding through its relationships.
export function getSubgraph(rootId: string, depth = 2): Promise<GraphData> {
  const nodeIds = new Set<string>([rootId])
  let frontier = [rootId]
  for (let d = 0; d < depth; d++) {
    const next: string[] = []
    for (const r of relationships) {
      if (frontier.includes(r.from) && !nodeIds.has(r.to)) {
        nodeIds.add(r.to)
        next.push(r.to)
      }
      if (frontier.includes(r.to) && !nodeIds.has(r.from)) {
        nodeIds.add(r.from)
        next.push(r.from)
      }
    }
    frontier = next
  }
  return delay({
    nodes: entities.filter((e) => nodeIds.has(e.id)).map((e) => ({ id: e.id, type: e.type, label: e.label, confidence: e.confidence })),
    edges: relationships.filter((r) => nodeIds.has(r.from) && nodeIds.has(r.to)).map((r) => ({ id: r.id, source: r.from, target: r.to, label: r.label })),
  })
}

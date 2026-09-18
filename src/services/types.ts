export type EntityType =
  | 'person'
  | 'username'
  | 'email'
  | 'domain'
  | 'ip'
  | 'social'
  | 'organization'

export type Confidence = 'high' | 'medium' | 'low'

export interface Source {
  id: string
  name: string
  url: string
  type: string
  observedAt: string
  reliability: Confidence
}

export interface Entity {
  id: string
  type: EntityType
  identifier: string
  label: string
  confidence: Confidence
  firstObserved: string
  lastObserved: string
  sources: Source[]
  attributes?: Record<string, string>
  relatedIds: string[]
  summary?: string
}

export interface Relationship {
  id: string
  from: string
  to: string
  label: string
  confidence: Confidence
}

export type InvestigationStatus = 'active' | 'monitoring' | 'closed' | 'draft'

export interface Investigation {
  id: string
  name: string
  subject: string
  status: InvestigationStatus
  createdAt: string
  updatedAt: string
  entityCount: number
  relationshipCount: number
  analyst: string
  tags: string[]
  description: string
}

export interface TimelineEvent {
  id: string
  timestamp: string
  title: string
  description?: string
  entityType?: EntityType
  level: 'info' | 'success' | 'warning' | 'critical'
}

export interface Watchlist {
  id: string
  name: string
  entityIds: string[]
  lastChecked: string
  changes: number
  status: 'monitoring' | 'paused' | 'alert'
}

export interface ActivityEntry {
  id: string
  timestamp: string
  message: string
  level: 'info' | 'success' | 'warning' | 'critical'
}

export interface ReportSection {
  id: string
  title: string
  body: string
}

export interface Report {
  id: string
  title: string
  investigationId: string
  createdAt: string
  author: string
  classification: string
  sections: ReportSection[]
}

export interface GraphNode {
  id: string
  type: EntityType
  label: string
  confidence: Confidence
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  label: string
}

export interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export interface DashboardStats {
  activeInvestigations: number
  entitiesDiscovered: number
  relationships: number
  reports: number
  deltas: { investigations: number; entities: number; relationships: number; reports: number }
}

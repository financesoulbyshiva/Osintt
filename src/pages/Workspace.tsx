import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Graph } from '@/components/domain/Graph'
import { EntityGlyph } from '@/components/domain/EntityCard'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { ConfidenceBar } from '@/components/ui/Confidence'
import { EmptyState } from '@/components/ui/EmptyState'
import { Icon } from '@/components/Icon'
import { useToast } from '@/components/ui/Toast'
import { entityMeta } from '@/lib/entityMeta'
import { getGraphData } from '@/services/graph'
import { getEntity } from '@/services/entities'
import { runInvestigation } from '@/services/investigations'
import type { Entity, EntityType, GraphData, GraphNode } from '@/services/types'

const inputTypes: { value: EntityType; label: string }[] = [
  { value: 'person', label: 'Person' },
  { value: 'username', label: 'Username' },
  { value: 'email', label: 'Email' },
  { value: 'domain', label: 'Domain' },
  { value: 'ip', label: 'IP' },
  { value: 'organization', label: 'Organization' },
]

export default function Workspace() {
  const { id } = useParams()
  const toast = useToast()
  const [type, setType] = useState<EntityType>('username')
  const [identifier, setIdentifier] = useState('')
  const [graph, setGraph] = useState<GraphData | null>(null)
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)
  const [selected, setSelected] = useState<GraphNode | null>(null)
  const [detail, setDetail] = useState<Entity | null>(null)

  // Load initial graph (scoped to an investigation when opened from one)
  useEffect(() => {
    let active = true
    setLoading(true)
    getGraphData().then((g) => {
      if (!active) return
      setGraph(g)
      const root = g.nodes.find((n) => n.id === 'ent-u1') ?? g.nodes[0] ?? null
      setSelected(root)
      setLoading(false)
    })
    return () => { active = false }
  }, [id])

  // Load full entity detail for the selected node
  useEffect(() => {
    if (!selected) { setDetail(null); return }
    let active = true
    getEntity(selected.id).then((e) => active && setDetail(e))
    return () => { active = false }
  }, [selected])

  async function onRun(e: React.FormEvent) {
    e.preventDefault()
    if (!identifier.trim()) {
      toast.push({ tone: 'warn', title: 'Enter an identifier', message: 'Provide a value to investigate.' })
      return
    }
    setRunning(true)
    try {
      await runInvestigation(identifier.trim(), type)
      const g = await getGraphData()
      setGraph(g)
      const match = g.nodes.find((n) => n.label.toLowerCase().includes(identifier.trim().toLowerCase())) ?? g.nodes[0]
      setSelected(match ?? null)
      toast.push({ tone: 'ok', title: 'Investigation complete', message: `${identifier.trim()} · demo results loaded.` })
    } finally {
      setRunning(false)
    }
  }

  const relatedEntities = useMemo(() => {
    if (!detail || !graph) return []
    return graph.nodes.filter((n) => detail.relatedIds.includes(n.id))
  }, [detail, graph])

  return (
    <div className="page" style={{ maxWidth: 'none' }}>
      <div className="page-head">
        <div>
          <div className="row" style={{ gap: 10 }}>
            <h1 className="page-title">Investigation Workspace</h1>
            <span className="demo-tag">Demo Data</span>
          </div>
          <p className="page-sub">Enter an identifier, run the investigation, and explore the resulting relationship graph.</p>
        </div>
      </div>

      <div className="workspace">
        {/* LEFT — inputs */}
        <div className="ws-panel ws-panel--scroll">
          <Card title="Investigation Input">
            <form className="stack" onSubmit={onRun}>
              <div className="field">
                <span className="label">Entity type</span>
                <div className="grid grid--2" style={{ gap: 6 }}>
                  {inputTypes.map((t) => (
                    <button
                      type="button"
                      key={t.value}
                      className={`entity-chip${type === t.value ? ' entity-chip--active' : ''}`}
                      onClick={() => setType(t.value)}
                      style={{ padding: '7px 9px' }}
                    >
                      <span style={{ color: entityMeta[t.value].color, display: 'flex' }}>
                        <Icon name={entityMeta[t.value].icon} size={15} />
                      </span>
                      <span className="entity-chip__id" style={{ fontSize: 12 }}>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="field">
                <span className="label">Identifier</span>
                <Input
                  mono
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter identifier..."
                  aria-label="Identifier"
                />
              </div>
              <Button type="submit" icon="play" loading={running} block>
                {running ? 'Scanning...' : 'Run Investigation'}
              </Button>
              {running && <div className="scanline" />}
            </form>
          </Card>

          <Card title="Legend">
            <div className="stack" style={{ gap: 8 }}>
              {Object.values(entityMeta).map((m) => (
                <div className="row" key={m.label} style={{ gap: 9 }}>
                  <span className="legend-dot" style={{ background: m.color }} />
                  <span style={{ fontSize: 12.5 }}>{m.label}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* CENTER — graph */}
        <div className="ws-center">
          <div className="ws-graph">
            {loading || !graph ? (
              <div style={{ display: 'grid', placeItems: 'center', height: '100%' }}>
                <div className="stack" style={{ alignItems: 'center', gap: 12 }}>
                  <span className="spinner" style={{ color: 'var(--accent-cyan)' }} />
                  <span className="text-muted mono" style={{ fontSize: 12 }}>building graph…</span>
                </div>
              </div>
            ) : (
              <Graph data={graph} selectedId={selected?.id} onSelect={setSelected} />
            )}
          </div>
        </div>

        {/* RIGHT — intelligence panel */}
        <div className="ws-panel ws-panel--scroll ws-panel--right">
          <Card title="Intelligence Panel">
            {!detail ? (
              <EmptyState icon="target" title="No entity selected" description="Select a node in the graph to inspect its intelligence." />
            ) : (
              <div className="stack" style={{ gap: 14 }}>
                <div className="entity-hero" style={{ gap: 12 }}>
                  <EntityGlyph type={detail.type} size={44} />
                  <div style={{ minWidth: 0 }}>
                    <div className="eyebrow" style={{ color: entityMeta[detail.type].color }}>{entityMeta[detail.type].label}</div>
                    <div className="mono" style={{ fontWeight: 700, fontSize: 14, overflowWrap: 'anywhere' }}>{detail.identifier}</div>
                  </div>
                </div>

                <div className="row spread">
                  <span className="text-muted" style={{ fontSize: 12 }}>Confidence</span>
                  <ConfidenceBar value={detail.confidence} />
                </div>

                {detail.confidence !== 'high' && (
                  <div className="muted-panel" style={{ borderColor: 'rgba(245,158,11,.3)' }}>
                    <span className="row" style={{ gap: 7, fontSize: 12, color: 'var(--status-warn)' }}>
                      <Icon name="alert" size={14} /> Unverified — do not treat as confirmed fact.
                    </span>
                  </div>
                )}

                <dl className="kv">
                  <dt>Entity type</dt><dd>{entityMeta[detail.type].label}</dd>
                  <dt>Identifier</dt><dd className="mono">{detail.identifier}</dd>
                  <dt>First observed</dt><dd className="mono">{detail.firstObserved}</dd>
                  <dt>Last observed</dt><dd className="mono">{detail.lastObserved}</dd>
                  <dt>Sources</dt><dd>{detail.sources.length} public</dd>
                </dl>

                {detail.attributes && Object.keys(detail.attributes).length > 0 && (
                  <div>
                    <div className="section-title" style={{ marginBottom: 8 }}>Attributes</div>
                    <dl className="kv">
                      {Object.entries(detail.attributes).map(([k, v]) => (
                        <div key={k} style={{ display: 'contents' }}>
                          <dt>{k}</dt><dd className="mono">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}

                <div>
                  <div className="section-title" style={{ marginBottom: 8 }}>Related Entities</div>
                  {relatedEntities.length === 0 ? (
                    <span className="text-muted" style={{ fontSize: 12.5 }}>None in current graph.</span>
                  ) : (
                    <div className="stack" style={{ gap: 6 }}>
                      {relatedEntities.map((r) => (
                        <button key={r.id} className="entity-chip" onClick={() => setSelected(r)} style={{ width: '100%' }}>
                          <EntityGlyph type={r.type} size={24} />
                          <span className="entity-chip__body">
                            <span className="entity-chip__type">{entityMeta[r.type].label}</span>
                            <span className="entity-chip__id mono">{r.label}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <div className="section-title" style={{ marginBottom: 8 }}>Sources</div>
                  <div className="row wrap" style={{ gap: 6 }}>
                    {detail.sources.map((src) => (
                      <Badge key={src.id} tone={src.reliability === 'high' ? 'ok' : src.reliability === 'medium' ? 'warn' : 'crit'}>
                        {src.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Link to={`/entity/${detail.id}`}>
                  <Button variant="ghost" size="sm" iconRight="chevronRight" block>
                    Open full entity
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

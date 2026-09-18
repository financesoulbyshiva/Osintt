import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Graph } from '@/components/domain/Graph'
import { Card } from '@/components/ui/Card'
import { SearchBar } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Icon } from '@/components/Icon'
import { entityColor, entityMeta } from '@/lib/entityMeta'
import { useAsync } from '@/hooks/useAsync'
import { getGraphData } from '@/services/graph'
import type { EntityType, GraphNode } from '@/services/types'

export default function NetworkGraph() {
  const { data, loading } = useAsync(() => getGraphData(), [])
  const [selected, setSelected] = useState<GraphNode | null>(null)
  const [q, setQ] = useState('')
  const [hidden, setHidden] = useState<Set<EntityType>>(new Set())

  const hiddenTypes = useMemo(() => hidden, [hidden])

  const matches = useMemo(() => {
    if (!data || !q.trim()) return []
    const t = q.trim().toLowerCase()
    return data.nodes.filter((n) => n.label.toLowerCase().includes(t)).slice(0, 6)
  }, [data, q])

  function toggleType(t: EntityType) {
    setHidden((prev) => {
      const next = new Set(prev)
      if (next.has(t)) next.delete(t)
      else next.add(t)
      return next
    })
  }

  const counts = useMemo(() => {
    const m = new Map<EntityType, number>()
    data?.nodes.forEach((n) => m.set(n.type, (m.get(n.type) ?? 0) + 1))
    return m
  }, [data])

  return (
    <div className="page" style={{ maxWidth: 'none' }}>
      <div className="page-head">
        <div>
          <div className="row" style={{ gap: 10 }}>
            <h1 className="page-title">Network Graph</h1>
            <span className="demo-tag">Demo Data</span>
          </div>
          <p className="page-sub">Explore relationships across all discovered entities. Drag to pan, scroll to zoom, click a node to inspect.</p>
        </div>
        <div className="row">
          <span className="text-muted mono" style={{ fontSize: 12 }}>
            {data ? `${data.nodes.length} nodes · ${data.edges.length} edges` : '—'}
          </span>
          <Link to="/workspace"><Button variant="ghost" size="sm" icon="investigation">Open workspace</Button></Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, alignItems: 'start' }} className="graph-page-grid">
        <div className="ws-graph" style={{ height: 'calc(100vh - 220px)', minHeight: 460 }}>
          {loading || !data ? (
            <div style={{ display: 'grid', placeItems: 'center', height: '100%' }}>
              <span className="spinner" style={{ color: 'var(--accent-cyan)' }} />
            </div>
          ) : (
            <>
              <Graph data={data} selectedId={selected?.id} onSelect={setSelected} hiddenTypes={hiddenTypes} />
              <div className="graph-legend">
                {Object.entries(entityMeta).map(([t, m]) => {
                  const type = t as EntityType
                  const off = hidden.has(type)
                  return (
                    <button key={t} className={`legend-item${off ? ' legend-item--off' : ''}`} onClick={() => toggleType(type)} title={`Toggle ${m.label}`}>
                      <span className="legend-dot" style={{ background: m.color }} />
                      {m.label}
                      <span className="text-muted">({counts.get(type) ?? 0})</span>
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </div>

        <div className="stack">
          <Card title="Find Node">
            <SearchBar value={q} onValueChange={setQ} placeholder="Search node..." mono />
            {q.trim() && (
              <div className="stack" style={{ gap: 6, marginTop: 10 }}>
                {matches.length === 0 ? (
                  <span className="text-muted" style={{ fontSize: 12.5 }}>No nodes match.</span>
                ) : (
                  matches.map((n) => (
                    <button key={n.id} className="entity-chip" onClick={() => setSelected(n)} style={{ width: '100%' }}>
                      <span className="legend-dot" style={{ background: entityColor(n.type) }} />
                      <span className="entity-chip__body">
                        <span className="entity-chip__type">{entityMeta[n.type].label}</span>
                        <span className="entity-chip__id mono">{n.label}</span>
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </Card>

          <Card title="Inspector">
            {!selected ? (
              <EmptyState icon="network" title="No node selected" description="Click a node in the graph to inspect it here." />
            ) : (
              <div className="stack" style={{ gap: 12 }}>
                <div className="row" style={{ gap: 10 }}>
                  <span className="legend-dot" style={{ background: entityColor(selected.type), width: 12, height: 12 }} />
                  <div style={{ minWidth: 0 }}>
                    <div className="eyebrow" style={{ color: entityMeta[selected.type].color }}>{entityMeta[selected.type].label}</div>
                    <div className="mono" style={{ fontWeight: 700, overflowWrap: 'anywhere' }}>{selected.label}</div>
                  </div>
                </div>
                <div className="row wrap" style={{ gap: 6 }}>
                  <Badge tone={selected.confidence === 'high' ? 'ok' : selected.confidence === 'medium' ? 'warn' : 'crit'}>
                    {selected.confidence} confidence
                  </Badge>
                </div>
                <Link to={`/entity/${selected.id}`}>
                  <Button size="sm" variant="ghost" block iconRight="chevronRight">Open entity</Button>
                </Link>
              </div>
            )}
          </Card>

          <Card title="Filters">
            <div className="stack" style={{ gap: 8 }}>
              {Object.entries(entityMeta).map(([t, m]) => {
                const type = t as EntityType
                const off = hidden.has(type)
                return (
                  <label className="row spread" key={t} style={{ cursor: 'pointer', fontSize: 13 }}>
                    <span className="row" style={{ gap: 9 }}>
                      <Icon name={m.icon} size={15} style={{ color: off ? 'var(--text-muted)' : m.color }} />
                      <span style={{ color: off ? 'var(--text-muted)' : undefined }}>{m.label}</span>
                    </span>
                    <span className="switch">
                      <input type="checkbox" checked={!off} onChange={() => toggleType(type)} />
                      <span className="switch__track"><span className="switch__thumb" /></span>
                    </span>
                  </label>
                )
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

import { Link, useParams } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ConfidenceBar } from '@/components/ui/Confidence'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonRows } from '@/components/ui/Skeleton'
import { Tabs } from '@/components/ui/Tabs'
import { EntityGlyph } from '@/components/domain/EntityCard'
import { Timeline } from '@/components/domain/Timeline'
import { SourceCard } from '@/components/domain/SourceCard'
import { Graph } from '@/components/domain/Graph'
import { Icon } from '@/components/Icon'
import { entityMeta } from '@/lib/entityMeta'
import { useAsync } from '@/hooks/useAsync'
import { getEntity, getRelatedEntities, getRelationshipsFor, getEntityTimeline } from '@/services/entities'
import { getSubgraph } from '@/services/graph'
import { entities as allEntities, relationships as allRels } from '@/services/demoData'
import { useState } from 'react'

type DetailTab = 'overview' | 'relationships' | 'timeline' | 'sources'

export default function EntityDetail() {
  const { id = '' } = useParams()
  const [tab, setTab] = useState<DetailTab>('overview')

  const entity = useAsync(() => getEntity(id), [id])
  const related = useAsync(() => getRelatedEntities(id), [id])
  const rels = useAsync(() => getRelationshipsFor(id), [id])
  const timeline = useAsync(() => getEntityTimeline(id), [id])
  const subgraph = useAsync(() => getSubgraph(id, 2), [id])

  if (entity.loading) {
    return (
      <div className="page">
        <Card><SkeletonRows rows={6} /></Card>
      </div>
    )
  }

  const e = entity.data
  if (!e) {
    return (
      <div className="page">
        <Card>
          <EmptyState
            icon="alert"
            title="Entity not found"
            description="This entity does not exist in the current demo dataset."
            action={<Link to="/search"><Button variant="ghost" size="sm">Back to search</Button></Link>}
          />
        </Card>
      </div>
    )
  }

  const meta = entityMeta[e.type]
  const nameOf = (eid: string) => allEntities.find((x) => x.id === eid)?.identifier ?? eid

  return (
    <div className="page">
      <div className="page-head">
        <div className="entity-hero">
          <EntityGlyph type={e.type} size={56} />
          <div>
            <div className="row" style={{ gap: 10 }}>
              <span className="eyebrow" style={{ color: meta.color }}>{meta.label}</span>
              <span className="demo-tag">Demo Data</span>
            </div>
            <h1 className="page-title mono" style={{ overflowWrap: 'anywhere' }}>{e.identifier}</h1>
          </div>
        </div>
        <div className="row">
          <ConfidenceBar value={e.confidence} />
          <Link to="/graph"><Button variant="ghost" size="sm" icon="network">View in graph</Button></Link>
        </div>
      </div>

      {e.confidence !== 'high' && (
        <div className="muted-panel" style={{ borderColor: 'rgba(245,158,11,.3)', marginBottom: 16 }}>
          <span className="row" style={{ gap: 8, fontSize: 12.5, color: 'var(--status-warn)' }}>
            <Icon name="alert" size={15} />
            This entity carries {e.confidence} confidence. Treat associations as unverified leads, not confirmed facts.
          </span>
        </div>
      )}

      <div className="detail-grid">
        <div className="stack">
          <Card flush>
            <div style={{ padding: '4px 16px 0' }}>
              <Tabs
                tabs={[
                  { value: 'overview', label: 'Overview' },
                  { value: 'relationships', label: 'Relationships', count: rels.data?.length },
                  { value: 'timeline', label: 'Timeline' },
                  { value: 'sources', label: 'Sources', count: e.sources.length },
                ]}
                value={tab}
                onChange={setTab}
              />
            </div>
            <div style={{ padding: 16 }}>
              {tab === 'overview' && (
                <div className="stack">
                  {e.summary && <p className="text-secondary" style={{ fontSize: 13.5, lineHeight: 1.6 }}>{e.summary}</p>}
                  <div className="section-title" style={{ marginBottom: 8 }}>Identifiers & Attributes</div>
                  <dl className="kv">
                    <dt>Type</dt><dd>{meta.label}</dd>
                    <dt>Identifier</dt><dd className="mono">{e.identifier}</dd>
                    <dt>First observed</dt><dd className="mono">{e.firstObserved}</dd>
                    <dt>Last observed</dt><dd className="mono">{e.lastObserved}</dd>
                    {e.attributes && Object.entries(e.attributes).map(([k, v]) => (
                      <div key={k} style={{ display: 'contents' }}><dt>{k}</dt><dd className="mono">{v}</dd></div>
                    ))}
                  </dl>
                </div>
              )}

              {tab === 'relationships' && (
                rels.loading || !rels.data ? <SkeletonRows rows={4} /> :
                rels.data.length === 0 ? <EmptyState icon="link" title="No relationships" description="No links recorded for this entity." /> :
                <div className="stack" style={{ gap: 8 }}>
                  {rels.data.map((r) => {
                    const otherId = r.from === e.id ? r.to : r.from
                    const outgoing = r.from === e.id
                    return (
                      <Link key={r.id} to={`/entity/${otherId}`} className="entity-chip" style={{ textDecoration: 'none' }}>
                        <span className="text-muted" style={{ display: 'flex' }}>
                          <Icon name={outgoing ? 'chevronRight' : 'chevronRight'} size={15} style={{ transform: outgoing ? 'none' : 'rotate(180deg)' }} />
                        </span>
                        <span className="entity-chip__body">
                          <span className="entity-chip__type">{r.label}</span>
                          <span className="entity-chip__id mono">{nameOf(otherId)}</span>
                        </span>
                        <Badge tone={r.confidence === 'high' ? 'ok' : r.confidence === 'medium' ? 'warn' : 'crit'}>{r.confidence}</Badge>
                      </Link>
                    )
                  })}
                </div>
              )}

              {tab === 'timeline' && (
                timeline.loading || !timeline.data ? <SkeletonRows rows={5} /> : <Timeline events={timeline.data} />
              )}

              {tab === 'sources' && (
                <div className="stack" style={{ gap: 8 }}>
                  {e.sources.map((s) => <SourceCard key={s.id} source={s} />)}
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="stack">
          <Card title="Local Relationship Graph">
            <div style={{ height: 260, borderRadius: 10, overflow: 'hidden', background: 'rgba(5,7,13,.4)' }}>
              {subgraph.loading || !subgraph.data ? (
                <div style={{ display: 'grid', placeItems: 'center', height: '100%' }}>
                  <span className="spinner" style={{ color: 'var(--accent-cyan)' }} />
                </div>
              ) : (
                <Graph data={subgraph.data} selectedId={e.id} compact />
              )}
            </div>
          </Card>

          <Card title="Related Entities">
            {related.loading || !related.data ? (
              <SkeletonRows rows={3} />
            ) : related.data.length === 0 ? (
              <span className="text-muted" style={{ fontSize: 12.5 }}>None recorded.</span>
            ) : (
              <div className="stack" style={{ gap: 6 }}>
                {related.data.map((r) => (
                  <Link key={r.id} to={`/entity/${r.id}`} className="entity-chip" style={{ textDecoration: 'none' }}>
                    <EntityGlyph type={r.type} size={26} />
                    <span className="entity-chip__body">
                      <span className="entity-chip__type">{entityMeta[r.type].label}</span>
                      <span className="entity-chip__id mono">{r.identifier}</span>
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </Card>

          <Card title="Link Evidence">
            <div className="stack" style={{ gap: 6 }}>
              {allRels.filter((r) => r.from === e.id || r.to === e.id).slice(0, 4).map((r) => (
                <div key={r.id} className="text-secondary mono" style={{ fontSize: 11.5 }}>
                  {nameOf(r.from)} <span className="text-cyan">—{r.label}→</span> {nameOf(r.to)}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

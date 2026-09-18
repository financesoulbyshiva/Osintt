import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatCard } from '@/components/domain/StatCard'
import { AreaChart } from '@/components/domain/Charts'
import { InvestigationCard } from '@/components/domain/InvestigationCard'
import { EntityGlyph } from '@/components/domain/EntityCard'
import { StatusIndicator } from '@/components/ui/StatusIndicator'
import { Badge } from '@/components/ui/Badge'
import { Skeleton, SkeletonCard, SkeletonRows } from '@/components/ui/Skeleton'
import { Icon } from '@/components/Icon'
import { entityMeta } from '@/lib/entityMeta'
import { useAsync } from '@/hooks/useAsync'
import {
  getActivitySeries,
  getDashboardStats,
  getRecentInvestigations,
  getSystemStatus,
} from '@/services/investigations'
import { listEntities } from '@/services/entities'

export default function Dashboard() {
  const stats = useAsync(() => getDashboardStats())
  const series = useAsync(() => getActivitySeries())
  const recent = useAsync(() => getRecentInvestigations(4))
  const status = useAsync(() => getSystemStatus())
  const entities = useAsync(() => listEntities())

  const s = stats.data

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="row" style={{ gap: 10 }}>
            <h1 className="page-title">Command Center</h1>
            <span className="demo-tag">Demo Data</span>
          </div>
          <p className="page-sub">Operational overview of active investigations, discovered entities and system health.</p>
        </div>
        <Link to="/workspace"><Button icon="play">New Investigation</Button></Link>
      </div>

      <div className="grid grid--4" style={{ marginBottom: 16 }}>
        {stats.loading || !s ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard label="Active Investigations" value={s.activeInvestigations} icon="investigation" delta={s.deltas.investigations} />
            <StatCard label="Entities Discovered" value={s.entitiesDiscovered} icon="network" delta={s.deltas.entities} />
            <StatCard label="Relationships" value={s.relationships} icon="link" delta={s.deltas.relationships} />
            <StatCard label="Reports" value={s.reports} icon="report" delta={s.deltas.reports} />
          </>
        )}
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.6fr 1fr', marginBottom: 16 }}>
        <Card title="Investigation Activity" actions={<Badge tone="cyan">last 14 days</Badge>}>
          {series.loading || !series.data ? <Skeleton variant="card" style={{ height: 180 }} /> : <AreaChart data={series.data} />}
        </Card>
        <Card title="System Status">
          {status.loading || !status.data ? (
            <SkeletonRows rows={4} />
          ) : (
            <div className="stack" style={{ gap: 2 }}>
              {status.data.map((st) => (
                <div className="row spread" key={st.name} style={{ padding: '9px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span className="row" style={{ gap: 9 }}>
                    <StatusIndicator status={st.status} pulse={st.status === 'ok'} />
                    <span style={{ fontSize: 13 }}>{st.name}</span>
                  </span>
                  <span className="text-muted" style={{ fontSize: 12 }}>{st.detail}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.6fr 1fr' }}>
        <div>
          <div className="section-title">Recent Investigations</div>
          <div className="grid grid--2">
            {recent.loading || !recent.data
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : recent.data.map((inv) => <InvestigationCard key={inv.id} inv={inv} />)}
          </div>
        </div>
        <div>
          <div className="section-title">Recent Entities</div>
          <Card flush>
            {entities.loading || !entities.data ? (
              <div style={{ padding: 16 }}><SkeletonRows rows={5} /></div>
            ) : (
              <div>
                {entities.data.slice(0, 6).map((e) => (
                  <Link
                    key={e.id}
                    to={`/entity/${e.id}`}
                    className="row"
                    style={{ gap: 11, padding: '11px 16px', borderBottom: '1px solid var(--border-subtle)', textDecoration: 'none' }}
                  >
                    <EntityGlyph type={e.type} size={30} />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div className="mono" style={{ fontSize: 12.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {e.identifier}
                      </div>
                      <div className="eyebrow" style={{ color: entityMeta[e.type].color }}>{entityMeta[e.type].label}</div>
                    </div>
                    <Icon name="chevronRight" size={15} style={{ color: 'var(--text-muted)' }} />
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

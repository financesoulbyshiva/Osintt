import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonRows } from '@/components/ui/Skeleton'
import { EntityGlyph } from '@/components/domain/EntityCard'
import { useAsync } from '@/hooks/useAsync'
import { listWatchlists } from '@/services/investigations'
import { entities } from '@/services/demoData'
import type { Watchlist } from '@/services/types'

const statusTone = { monitoring: 'ok', paused: 'neutral', alert: 'crit' } as const

export default function Watchlists() {
  const { data, loading } = useAsync(() => listWatchlists(), [])

  const columns: Column<Watchlist>[] = [
    {
      key: 'name',
      header: 'Watchlist',
      render: (w) => (
        <div>
          <div style={{ fontWeight: 600 }}>{w.name}</div>
          <div className="row" style={{ gap: 5, marginTop: 5 }}>
            {w.entityIds.slice(0, 4).map((id) => {
              const e = entities.find((x) => x.id === id)
              return e ? <EntityGlyph key={id} type={e.type} size={22} /> : null
            })}
            {w.entityIds.length > 4 && <span className="text-muted mono" style={{ fontSize: 11 }}>+{w.entityIds.length - 4}</span>}
          </div>
        </div>
      ),
    },
    { key: 'entities', header: 'Entities', render: (w) => <Badge tone="neutral">{w.entityIds.length}</Badge>, width: '100px' },
    { key: 'last', header: 'Last checked', render: (w) => <span className="mono text-muted">{w.lastChecked}</span>, width: '160px' },
    {
      key: 'changes',
      header: 'Changes',
      render: (w) => (w.changes > 0 ? <Badge tone="warn">{w.changes} new</Badge> : <span className="text-muted">—</span>),
      width: '100px',
    },
    { key: 'status', header: 'Status', render: (w) => <Badge tone={statusTone[w.status]} dot>{w.status}</Badge>, width: '130px' },
  ]

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="row" style={{ gap: 10 }}>
            <h1 className="page-title">Watchlists</h1>
            <span className="demo-tag">Demo Data</span>
          </div>
          <p className="page-sub">Passively monitor entity sets for observable changes. Monitoring is simulated in demo mode.</p>
        </div>
      </div>

      <Card flush>
        {loading || !data ? (
          <div style={{ padding: 20 }}><SkeletonRows rows={5} /></div>
        ) : data.length === 0 ? (
          <EmptyState icon="watchlist" title="No watchlists" description="Create a watchlist to monitor entities over time." />
        ) : (
          <DataTable
            columns={columns}
            rows={data}
            rowKey={(w) => w.id}
          />
        )}
      </Card>

      <p className="text-muted" style={{ fontSize: 12, marginTop: 14 }}>
        Tip: open an entity from <Link to="/search" className="text-cyan">Search</Link> to inspect what a watchlist tracks.
      </p>
    </div>
  )
}

import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { SearchBar } from '@/components/ui/Input'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { Badge } from '@/components/ui/Badge'
import { ConfidenceBar } from '@/components/ui/Confidence'
import { EntityGlyph } from '@/components/domain/EntityCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonRows } from '@/components/ui/Skeleton'
import { Icon } from '@/components/Icon'
import { useAsync } from '@/hooks/useAsync'
import { listEntities } from '@/services/entities'
import { entityMeta } from '@/lib/entityMeta'
import type { Entity, EntityType } from '@/services/types'

const kindToType: Record<string, EntityType> = {
  people: 'person',
  usernames: 'username',
  emails: 'email',
  domains: 'domain',
  ips: 'ip',
  social: 'social',
}

export default function EntityList() {
  const { kind = 'people' } = useParams()
  const type = kindToType[kind] ?? 'person'
  const meta = entityMeta[type]
  const [q, setQ] = useState('')

  const { data, loading } = useAsync(() => listEntities({ type }), [type])

  const rows = useMemo(() => {
    if (!data) return []
    const t = q.trim().toLowerCase()
    if (!t) return data
    return data.filter((e) => `${e.label} ${e.identifier}`.toLowerCase().includes(t))
  }, [data, q])

  const columns: Column<Entity>[] = [
    {
      key: 'id',
      header: 'Identifier',
      render: (e) => (
        <Link to={`/entity/${e.id}`} className="row" style={{ gap: 10, textDecoration: 'none' }}>
          <EntityGlyph type={e.type} size={28} />
          <span className="mono" style={{ fontWeight: 600 }}>{e.identifier}</span>
        </Link>
      ),
    },
    { key: 'conf', header: 'Confidence', render: (e) => <ConfidenceBar value={e.confidence} />, width: '150px' },
    { key: 'src', header: 'Sources', render: (e) => <Badge tone="neutral">{e.sources.length}</Badge>, width: '90px' },
    { key: 'rel', header: 'Related', render: (e) => <Badge tone="neutral">{e.relatedIds.length}</Badge>, width: '90px' },
    { key: 'last', header: 'Last observed', render: (e) => <span className="mono text-muted">{e.lastObserved}</span>, width: '140px' },
  ]

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="row" style={{ gap: 10 }}>
            <h1 className="page-title">{meta.plural}</h1>
            <span className="demo-tag">Demo Data</span>
          </div>
          <p className="page-sub">All {meta.plural.toLowerCase()} discovered across active investigations.</p>
        </div>
        <div style={{ width: 280 }}>
          <SearchBar value={q} onValueChange={setQ} placeholder={`Filter ${meta.plural.toLowerCase()}...`} mono />
        </div>
      </div>

      <Card flush>
        {loading ? (
          <div style={{ padding: 20 }}><SkeletonRows rows={6} /></div>
        ) : (
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(e) => e.id}
            empty={
              <EmptyState
                icon={meta.icon}
                title={`No ${meta.plural.toLowerCase()} found`}
                description={q ? 'No entities match your filter.' : 'Run an investigation to discover entities.'}
                action={!q ? <Link to="/workspace"><span className="row text-cyan" style={{ gap: 6, fontSize: 13 }}><Icon name="play" size={14} /> Start investigation</span></Link> : undefined}
              />
            }
          />
        )}
      </Card>
    </div>
  )
}

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Tabs } from '@/components/ui/Tabs'
import { SearchBar } from '@/components/ui/Input'
import { InvestigationCard } from '@/components/domain/InvestigationCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { useAsync } from '@/hooks/useAsync'
import { listInvestigations } from '@/services/investigations'
import type { InvestigationStatus } from '@/services/types'

type Filter = 'all' | InvestigationStatus

const tabs: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'monitoring', label: 'Monitoring' },
  { value: 'draft', label: 'Drafts' },
  { value: 'closed', label: 'Closed' },
]

export default function Investigations() {
  const [filter, setFilter] = useState<Filter>('all')
  const [q, setQ] = useState('')
  const { data, loading } = useAsync(() => listInvestigations(), [])

  const rows = useMemo(() => {
    if (!data) return []
    const t = q.trim().toLowerCase()
    return data.filter((i) => {
      if (filter !== 'all' && i.status !== filter) return false
      if (t && !`${i.name} ${i.subject} ${i.analyst} ${i.tags.join(' ')}`.toLowerCase().includes(t)) return false
      return true
    })
  }, [data, filter, q])

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="row" style={{ gap: 10 }}>
            <h1 className="page-title">Investigations</h1>
            <span className="demo-tag">Demo Data</span>
          </div>
          <p className="page-sub">Organize work into investigations. Open one to enter its workspace.</p>
        </div>
        <Link to="/workspace"><Button icon="plus">New Investigation</Button></Link>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 12 }}>
          <SearchBar value={q} onValueChange={setQ} placeholder="Filter investigations..." />
        </div>
        <Tabs tabs={tabs} value={filter} onChange={setFilter} />
      </Card>

      {loading ? (
        <div className="grid grid--auto">{Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : rows.length === 0 ? (
        <Card>
          <EmptyState icon="investigation" title="No investigations" description="Nothing matches the current filter." />
        </Card>
      ) : (
        <div className="grid grid--auto">
          {rows.map((inv) => <InvestigationCard key={inv.id} inv={inv} />)}
        </div>
      )}
    </div>
  )
}

import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonRows } from '@/components/ui/Skeleton'
import { Icon } from '@/components/Icon'
import { useAsync } from '@/hooks/useAsync'
import { listReports } from '@/services/reports'
import { investigations } from '@/services/demoData'

export default function Reports() {
  const { data, loading } = useAsync(() => listReports(), [])

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="row" style={{ gap: 10 }}>
            <h1 className="page-title">Reports</h1>
            <span className="demo-tag">Demo Data</span>
          </div>
          <p className="page-sub">Structured, confidence-rated intelligence summaries. Export is simulated in demo mode.</p>
        </div>
        <Link to="/reports/new"><Button icon="plus">New Report</Button></Link>
      </div>

      {loading ? (
        <Card><SkeletonRows rows={4} /></Card>
      ) : !data || data.length === 0 ? (
        <Card><EmptyState icon="report" title="No reports yet" description="Create a report to summarize an investigation." /></Card>
      ) : (
        <div className="grid grid--2">
          {data.map((r) => {
            const inv = investigations.find((i) => i.id === r.investigationId)
            return (
              <Link key={r.id} to={`/reports/${r.id}`} className="card card--hover" style={{ textDecoration: 'none' }}>
                <div className="row spread" style={{ gap: 8 }}>
                  <span className="eyebrow">{r.classification}</span>
                  <Badge tone="cyan">{r.sections.length} sections</Badge>
                </div>
                <h3 style={{ fontSize: 16, margin: '10px 0 6px' }}>{r.title}</h3>
                <div className="row wrap" style={{ gap: 12, fontSize: 12, color: 'var(--text-muted)' }}>
                  <span className="row" style={{ gap: 5 }}><Icon name="investigation" size={13} /> {inv?.name ?? r.investigationId}</span>
                  <span className="row" style={{ gap: 5 }}><Icon name="person" size={13} /> {r.author}</span>
                  <span className="row mono" style={{ gap: 5 }}><Icon name="clock" size={13} /> {r.createdAt}</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

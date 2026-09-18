import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Icon } from '@/components/Icon'
import type { Investigation } from '@/services/types'

const statusTone = { active: 'ok', monitoring: 'cyan', closed: 'neutral', draft: 'warn' } as const

export function InvestigationCard({ inv }: { inv: Investigation }) {
  return (
    <Link to={`/investigations/${inv.id}`} className="card card--hover" style={{ display: 'block', textDecoration: 'none' }}>
      <div className="row spread" style={{ gap: 8 }}>
        <span className="eyebrow">{inv.id.toUpperCase()}</span>
        <Badge tone={statusTone[inv.status]} dot>{inv.status}</Badge>
      </div>
      <h3 style={{ fontSize: 16, margin: '8px 0 4px' }}>{inv.name}</h3>
      <p className="text-secondary" style={{ fontSize: 12.5, lineHeight: 1.5, minHeight: 38 }}>
        {inv.description}
      </p>
      <div className="row wrap" style={{ gap: 12, marginTop: 12, fontSize: 12 }}>
        <span className="row text-muted" style={{ gap: 5 }}><Icon name="target" size={13} /> <span className="mono">{inv.subject}</span></span>
        <span className="row text-muted" style={{ gap: 5 }}><Icon name="network" size={13} /> {inv.entityCount} entities</span>
        <span className="row text-muted" style={{ gap: 5 }}><Icon name="link" size={13} /> {inv.relationshipCount} links</span>
      </div>
      <hr className="divider" style={{ margin: '12px 0 10px' }} />
      <div className="row spread text-muted" style={{ fontSize: 11.5 }}>
        <span className="row" style={{ gap: 6 }}><Icon name="person" size={13} /> {inv.analyst}</span>
        <span className="mono">Updated {inv.updatedAt}</span>
      </div>
    </Link>
  )
}

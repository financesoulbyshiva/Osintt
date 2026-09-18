import { Icon } from '@/components/Icon'
import { Badge } from '@/components/ui/Badge'
import type { Source } from '@/services/types'

const tone = { high: 'ok', medium: 'warn', low: 'crit' } as const

export function SourceCard({ source }: { source: Source }) {
  const initials = source.name.slice(0, 2).toUpperCase()
  return (
    <div className="source">
      <span className="source__icon">{initials}</span>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div className="row spread" style={{ gap: 8 }}>
          <span className="source__name">{source.name}</span>
          <Badge tone={tone[source.reliability]}>{source.reliability}</Badge>
        </div>
        <div className="source__meta" style={{ marginTop: 3 }}>
          {source.type} · observed {source.observedAt}
        </div>
        <a
          className="row text-cyan mono"
          style={{ gap: 5, fontSize: 11.5, marginTop: 5 }}
          href={source.url}
          target="_blank"
          rel="noreferrer noopener"
          onClick={(e) => e.preventDefault()}
          title="Demo link — no external navigation in demo mode"
        >
          <Icon name="external" size={12} /> {source.url}
        </a>
      </div>
    </div>
  )
}

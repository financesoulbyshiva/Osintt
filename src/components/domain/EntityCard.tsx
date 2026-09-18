import { Link } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { Badge } from '@/components/ui/Badge'
import { ConfidenceBar } from '@/components/ui/Confidence'
import { entityMeta } from '@/lib/entityMeta'
import type { Entity } from '@/services/types'

export function EntityGlyph({ type, size = 34 }: { type: Entity['type']; size?: number }) {
  const meta = entityMeta[type]
  return (
    <span
      className="entity-chip__icon"
      style={{ width: size, height: size, color: meta.color, background: `${meta.color}1f`, border: `1px solid ${meta.color}44`, fontSize: size * 0.4 }}
    >
      <Icon name={meta.icon} size={size * 0.52} />
    </span>
  )
}

export function EntityCard({ entity }: { entity: Entity }) {
  const meta = entityMeta[entity.type]
  return (
    <Link to={`/entity/${entity.id}`} className="card card--hover" style={{ display: 'flex', gap: 14, textDecoration: 'none' }}>
      <EntityGlyph type={entity.type} size={42} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div className="row spread" style={{ gap: 8 }}>
          <span className="eyebrow" style={{ color: meta.color }}>{meta.label}</span>
          <ConfidenceBar value={entity.confidence} showLabel={false} />
        </div>
        <div className="mono" style={{ fontWeight: 600, fontSize: 14, marginTop: 2, overflowWrap: 'anywhere' }}>
          {entity.identifier}
        </div>
        {entity.summary && (
          <p className="text-secondary" style={{ fontSize: 12.5, marginTop: 6, lineHeight: 1.5 }}>
            {entity.summary}
          </p>
        )}
        <div className="row wrap" style={{ gap: 6, marginTop: 10 }}>
          <Badge tone="neutral">{entity.sources.length} sources</Badge>
          <Badge tone="neutral">{entity.relatedIds.length} related</Badge>
          <Badge tone={entity.confidence === 'high' ? 'ok' : entity.confidence === 'medium' ? 'warn' : 'crit'}>
            {entity.confidence} confidence
          </Badge>
        </div>
      </div>
    </Link>
  )
}

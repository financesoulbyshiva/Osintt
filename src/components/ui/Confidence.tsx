import { confidenceMeta } from '@/lib/entityMeta'
import type { Confidence } from '@/services/types'

export function ConfidenceBar({ value, showLabel = true }: { value: Confidence; showLabel?: boolean }) {
  const meta = confidenceMeta[value]
  return (
    <span className={`conf conf--${value === 'high' ? 'high' : value === 'medium' ? 'med' : 'low'}`} title={`${meta.label} confidence`}>
      <span className="conf__bar">
        <span className="conf__fill" style={{ width: `${meta.pct}%` }} />
      </span>
      {showLabel && <span className="text-secondary" style={{ fontSize: 11.5 }}>{meta.label}</span>}
    </span>
  )
}

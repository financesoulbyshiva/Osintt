import type { TimelineEvent } from '@/services/types'

const levelColor = {
  info: 'var(--accent-cyan)',
  success: 'var(--status-ok)',
  warning: 'var(--status-warn)',
  critical: 'var(--status-crit)',
} as const

export function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="timeline">
      {events.map((e) => (
        <div className="tl-item" key={e.id}>
          <span className="tl-dot" style={{ borderColor: levelColor[e.level] }} />
          <div className="tl-time">{e.timestamp}</div>
          <div className="tl-title">{e.title}</div>
          {e.description && <div className="tl-desc">{e.description}</div>}
        </div>
      ))}
    </div>
  )
}

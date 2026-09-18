import { Icon, type IconName } from '@/components/Icon'

interface StatCardProps {
  label: string
  value: number | string
  icon: IconName
  delta?: number
  suffix?: string
}

export function StatCard({ label, value, icon, delta, suffix }: StatCardProps) {
  return (
    <div className="card stat">
      <div className="stat__top">
        <span className="stat__icon"><Icon name={icon} size={18} /></span>
        {typeof delta === 'number' && delta !== 0 && (
          <span className={`stat__delta ${delta > 0 ? 'stat__delta--up' : 'stat__delta--down'}`}>
            {delta > 0 ? '▲' : '▼'} {Math.abs(delta)}
          </span>
        )}
      </div>
      <div className="stat__value">
        {value}
        {suffix && <span style={{ fontSize: 16, color: 'var(--text-muted)', marginLeft: 4 }}>{suffix}</span>}
      </div>
      <div className="stat__label">{label}</div>
    </div>
  )
}

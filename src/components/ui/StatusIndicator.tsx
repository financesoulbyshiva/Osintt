interface StatusIndicatorProps {
  status: 'ok' | 'warn' | 'crit' | 'idle'
  label?: string
  pulse?: boolean
}

export function StatusIndicator({ status, label, pulse = true }: StatusIndicatorProps) {
  return (
    <span className={`status status--${status}${pulse && status !== 'idle' ? ' status--pulse' : ''}`}>
      <span className="status__dot" />
      {label && <span>{label}</span>}
    </span>
  )
}

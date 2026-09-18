import type { ReactNode } from 'react'

type Tone = 'neutral' | 'cyan' | 'blue' | 'ok' | 'warn' | 'crit'

interface BadgeProps {
  tone?: Tone
  mono?: boolean
  children: ReactNode
  dot?: boolean
}

export function Badge({ tone = 'neutral', mono, children, dot }: BadgeProps) {
  return (
    <span className={`badge badge--${tone}${mono ? ' badge--mono' : ''}`}>
      {dot && <span className="status__dot" style={{ background: 'currentColor', width: 6, height: 6 }} />}
      {children}
    </span>
  )
}

import { useEffect, useRef, useState } from 'react'
import type { ActivityEntry } from '@/services/types'

const levelClass = {
  info: 'term-msg--info',
  success: 'term-msg--ok',
  warning: 'term-msg--warn',
  critical: 'term-msg--crit',
} as const

interface TerminalLogProps {
  entries: ActivityEntry[]
  animate?: boolean
  title?: string
}

export function TerminalLog({ entries, animate = true, title = 'activity.log' }: TerminalLogProps) {
  const [shown, setShown] = useState(animate ? 0 : entries.length)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!animate) {
      setShown(entries.length)
      return
    }
    setShown(0)
    let i = 0
    const timer = window.setInterval(() => {
      i += 1
      setShown(i)
      if (i >= entries.length) window.clearInterval(timer)
    }, 240)
    return () => window.clearInterval(timer)
  }, [entries, animate])

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' })
  }, [shown])

  const visible = entries.slice(0, shown)

  return (
    <div className="terminal" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="terminal__bar">
        <span className="terminal__dot" style={{ background: '#ef4444' }} />
        <span className="terminal__dot" style={{ background: '#f59e0b' }} />
        <span className="terminal__dot" style={{ background: '#22c55e' }} />
        <span className="mono text-muted" style={{ fontSize: 11.5, marginLeft: 8 }}>{title}</span>
      </div>
      <div className="terminal__body" ref={bodyRef}>
        {visible.map((e) => (
          <div className="term-line" key={e.id}>
            <span className="term-time">[{e.timestamp}]</span>
            <span className={`term-msg ${levelClass[e.level]}`}>{e.message}</span>
          </div>
        ))}
        {shown < entries.length && (
          <div className="term-line">
            <span className="term-time">[--:--:--]</span>
            <span className="term-cursor" />
          </div>
        )}
      </div>
    </div>
  )
}

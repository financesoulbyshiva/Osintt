import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  hover?: boolean
  flush?: boolean
  className?: string
  title?: ReactNode
  actions?: ReactNode
  style?: React.CSSProperties
}

export function Card({ children, hover, flush, className = '', title, actions, style }: CardProps) {
  const classes = ['card', hover ? 'card--hover' : '', flush ? 'card--flush' : '', className].filter(Boolean).join(' ')
  return (
    <div className={classes} style={style}>
      {(title || actions) && (
        <div className="card-head">
          {title && <div className="card-title">{title}</div>}
          {actions && <div className="row">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  )
}

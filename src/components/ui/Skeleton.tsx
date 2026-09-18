export function Skeleton({ variant = 'text', style }: { variant?: 'text' | 'title' | 'card'; style?: React.CSSProperties }) {
  return <div className={`skeleton skeleton--${variant}`} style={style} />
}

export function SkeletonCard() {
  return (
    <div className="card stack" style={{ gap: 10 }}>
      <Skeleton variant="title" />
      <Skeleton variant="text" style={{ width: '80%' }} />
      <Skeleton variant="text" style={{ width: '60%' }} />
    </div>
  )
}

export function SkeletonRows({ rows = 4 }: { rows?: number }) {
  return (
    <div className="stack" style={{ gap: 10 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} variant="text" style={{ width: `${70 + ((i * 7) % 30)}%`, height: 14 }} />
      ))}
    </div>
  )
}

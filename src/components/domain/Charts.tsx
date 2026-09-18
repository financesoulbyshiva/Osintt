interface Series {
  label: string
  value: number
}

export function AreaChart({ data, height = 180 }: { data: Series[]; height?: number }) {
  const W = 640
  const H = height
  const pad = { l: 28, r: 12, t: 14, b: 24 }
  const max = Math.max(...data.map((d) => d.value), 1)
  const step = (W - pad.l - pad.r) / Math.max(1, data.length - 1)
  const pts = data.map((d, i) => {
    const x = pad.l + i * step
    const y = pad.t + (1 - d.value / max) * (H - pad.t - pad.b)
    return { x, y, ...d }
  })
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const area = `${line} L${pts[pts.length - 1].x},${H - pad.b} L${pts[0].x},${H - pad.b} Z`
  const gridLines = 4

  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} style={{ height }} preserveAspectRatio="none" role="img" aria-label="Investigation activity">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(0,229,255,.32)" />
          <stop offset="100%" stopColor="rgba(0,229,255,0)" />
        </linearGradient>
      </defs>
      {Array.from({ length: gridLines + 1 }).map((_, i) => {
        const y = pad.t + (i * (H - pad.t - pad.b)) / gridLines
        const val = Math.round(max - (i * max) / gridLines)
        return (
          <g key={i}>
            <line className="chart-grid-line" x1={pad.l} y1={y} x2={W - pad.r} y2={y} />
            <text className="chart-axis" x={4} y={y + 3}>{val}</text>
          </g>
        )
      })}
      <path className="chart-area" d={area} />
      <path className="chart-line" d={line} />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={2.6} fill="#00e5ff" />
          {i % 2 === 0 && (
            <text className="chart-axis" x={p.x} y={H - 7} textAnchor="middle">{p.label.replace('Sep ', '')}</text>
          )}
        </g>
      ))}
    </svg>
  )
}

export function BarChart({ data, height = 180 }: { data: Series[]; height?: number }) {
  const W = 640
  const H = height
  const pad = { l: 8, r: 8, t: 14, b: 24 }
  const max = Math.max(...data.map((d) => d.value), 1)
  const bw = (W - pad.l - pad.r) / data.length
  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} style={{ height }} preserveAspectRatio="none" role="img" aria-label="Distribution">
      {data.map((d, i) => {
        const h = (d.value / max) * (H - pad.t - pad.b)
        const x = pad.l + i * bw + bw * 0.18
        const y = H - pad.b - h
        return (
          <g key={i}>
            <rect className="chart-bar" x={x} y={y} width={bw * 0.64} height={h} rx={3} style={{ animationDelay: `${i * 40}ms` }} />
            <text className="chart-axis" x={x + bw * 0.32} y={H - 7} textAnchor="middle">{d.label}</text>
          </g>
        )
      })}
    </svg>
  )
}

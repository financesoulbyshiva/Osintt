import { useEffect, useMemo, useRef, useState } from 'react'
import { entityColor, entityMeta } from '@/lib/entityMeta'
import type { EntityType, GraphData, GraphNode } from '@/services/types'
import { Icon } from '@/components/Icon'

interface GraphProps {
  data: GraphData
  selectedId?: string | null
  onSelect?: (node: GraphNode | null) => void
  hiddenTypes?: Set<EntityType>
  className?: string
  compact?: boolean
}

interface LaidOut extends GraphNode {
  x: number
  y: number
}

const W = 800
const H = 600

// Deterministic lightweight force layout — runs once, cheap for small graphs.
function layout(data: GraphData): LaidOut[] {
  const nodes: LaidOut[] = data.nodes.map((n, i) => {
    const angle = (i / Math.max(1, data.nodes.length)) * Math.PI * 2
    return { ...n, x: W / 2 + Math.cos(angle) * 180, y: H / 2 + Math.sin(angle) * 160 }
  })
  const index = new Map(nodes.map((n, i) => [n.id, i]))
  const iterations = 220
  for (let it = 0; it < iterations; it++) {
    const disp = nodes.map(() => ({ x: 0, y: 0 }))
    // repulsion
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        let dx = nodes[i].x - nodes[j].x
        let dy = nodes[i].y - nodes[j].y
        let dist = Math.sqrt(dx * dx + dy * dy) || 0.01
        const force = 26000 / (dist * dist)
        dx /= dist
        dy /= dist
        disp[i].x += dx * force
        disp[i].y += dy * force
        disp[j].x -= dx * force
        disp[j].y -= dy * force
      }
    }
    // springs
    for (const e of data.edges) {
      const a = index.get(e.source)
      const b = index.get(e.target)
      if (a === undefined || b === undefined) continue
      let dx = nodes[a].x - nodes[b].x
      let dy = nodes[a].y - nodes[b].y
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.01
      const force = (dist - 150) * 0.06
      dx /= dist
      dy /= dist
      disp[a].x -= dx * force
      disp[a].y -= dy * force
      disp[b].x += dx * force
      disp[b].y += dy * force
    }
    // gravity to center
    for (let i = 0; i < nodes.length; i++) {
      disp[i].x += (W / 2 - nodes[i].x) * 0.012
      disp[i].y += (H / 2 - nodes[i].y) * 0.012
    }
    const cooling = 1 - it / iterations
    for (let i = 0; i < nodes.length; i++) {
      const d = Math.sqrt(disp[i].x ** 2 + disp[i].y ** 2) || 0.01
      const limit = 12 * cooling + 0.4
      nodes[i].x += (disp[i].x / d) * Math.min(d, limit)
      nodes[i].y += (disp[i].y / d) * Math.min(d, limit)
      nodes[i].x = Math.max(50, Math.min(W - 50, nodes[i].x))
      nodes[i].y = Math.max(46, Math.min(H - 46, nodes[i].y))
    }
  }
  return nodes
}

export function Graph({ data, selectedId, onSelect, hiddenTypes, className = '', compact }: GraphProps) {
  const nodes = useMemo(() => layout(data), [data])
  const nodeById = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes])
  const [view, setView] = useState({ x: 0, y: 0, k: 1 })
  const [hover, setHover] = useState<{ node: LaidOut; px: number; py: number } | null>(null)
  const [panning, setPanning] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)
  const drag = useRef<{ x: number; y: number; vx: number; vy: number } | null>(null)

  useEffect(() => setView({ x: 0, y: 0, k: 1 }), [data])

  // React's onWheel is passive, so preventDefault there throws. Attach a
  // non-passive native listener to allow zoom-without-page-scroll.
  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    const handler = (ev: WheelEvent) => {
      ev.preventDefault()
      const factor = ev.deltaY > 0 ? 0.9 : 1.1
      setView((v) => ({ ...v, k: Math.max(0.4, Math.min(3, v.k * factor)) }))
    }
    el.addEventListener('wheel', handler, { passive: false })
    return () => el.removeEventListener('wheel', handler)
  }, [])

  const visibleEdges = data.edges.filter(
    (e) => nodeById.has(e.source) && nodeById.has(e.target),
  )

  function onPointerDown(ev: React.PointerEvent) {
    ;(ev.target as Element).setPointerCapture?.(ev.pointerId)
    drag.current = { x: ev.clientX, y: ev.clientY, vx: view.x, vy: view.y }
    setPanning(true)
  }
  function onPointerMove(ev: React.PointerEvent) {
    if (!drag.current || !svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const scale = W / rect.width
    setView((v) => ({
      ...v,
      x: drag.current!.vx + (ev.clientX - drag.current!.x) * scale,
      y: drag.current!.vy + (ev.clientY - drag.current!.y) * scale,
    }))
  }
  function onPointerUp() {
    drag.current = null
    setPanning(false)
  }

  function zoom(by: number) {
    setView((v) => ({ ...v, k: Math.max(0.4, Math.min(3, v.k * by)) }))
  }

  const isHidden = (t: EntityType) => hiddenTypes?.has(t) ?? false

  return (
    <div className={className} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg
        ref={svgRef}
        className={`graph-svg${panning ? ' graph-svg--panning' : ''}`}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        role="img"
        aria-label="Relationship graph"
      >
        <g transform={`translate(${view.x} ${view.y}) scale(${view.k})`}>
          {visibleEdges.map((e) => {
            const a = nodeById.get(e.source)!
            const b = nodeById.get(e.target)!
            if (isHidden(a.type) || isHidden(b.type)) return null
            const active = selectedId && (e.source === selectedId || e.target === selectedId)
            return (
              <g key={e.id}>
                <line
                  className={`g-link${active ? ' g-link--active' : ''}`}
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                />
                {!compact && active && (
                  <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 4} textAnchor="middle" className="g-node">
                    <tspan style={{ fontSize: 9, fill: 'var(--accent-cyan)' }}>{e.label}</tspan>
                  </text>
                )}
              </g>
            )
          })}
          {nodes.map((n) => {
            if (isHidden(n.type)) return null
            const color = entityColor(n.type)
            const selected = n.id === selectedId
            const r = selected ? 16 : 13
            return (
              <g
                key={n.id}
                className={`g-node${selected ? ' g-node--selected' : ''}`}
                style={{ color }}
                transform={`translate(${n.x} ${n.y})`}
                onClick={(ev) => { ev.stopPropagation(); onSelect?.(n) }}
                onMouseEnter={(ev) => {
                  const rect = svgRef.current!.getBoundingClientRect()
                  setHover({ node: n, px: ev.clientX - rect.left, py: ev.clientY - rect.top })
                }}
                onMouseLeave={() => setHover(null)}
              >
                <circle className="g-pulse" r={r + 9} fill={color} opacity={0.2} />
                <circle className="body" r={r} fill={`${color}22`} stroke={color} strokeWidth={1.6} />
                <text textAnchor="middle" dy={4} style={{ fontSize: 11, fill: color, fontWeight: 700 }}>
                  {entityMeta[n.type].glyph}
                </text>
                {!compact && (
                  <text textAnchor="middle" dy={r + 15} style={{ fontSize: 9.5 }}>
                    {n.label.length > 18 ? n.label.slice(0, 17) + '…' : n.label}
                  </text>
                )}
              </g>
            )
          })}
        </g>
      </svg>

      {!compact && (
        <div className="graph-zoom">
          <button className="icon-btn" onClick={() => zoom(1.15)} aria-label="Zoom in"><Icon name="zoomIn" size={16} /></button>
          <button className="icon-btn" onClick={() => zoom(0.87)} aria-label="Zoom out"><Icon name="zoomOut" size={16} /></button>
          <button className="icon-btn" onClick={() => setView({ x: 0, y: 0, k: 1 })} aria-label="Reset view"><Icon name="refresh" size={16} /></button>
        </div>
      )}

      {hover && (
        <div className="graph-tooltip" style={{ left: hover.px + 14, top: hover.py + 14 }}>
          <div className="row" style={{ gap: 6, marginBottom: 3 }}>
            <span className="legend-dot" style={{ background: entityColor(hover.node.type) }} />
            <strong style={{ fontSize: 12 }}>{hover.node.label}</strong>
          </div>
          <div className="text-muted" style={{ fontSize: 11 }}>
            {entityMeta[hover.node.type].label} · {hover.node.confidence} confidence
          </div>
        </div>
      )}
    </div>
  )
}

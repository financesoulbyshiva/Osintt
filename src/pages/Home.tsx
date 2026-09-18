import { Link } from 'react-router-dom'
import { Icon, type IconName } from '@/components/Icon'
import { Button } from '@/components/ui/Button'
import { StatusIndicator } from '@/components/ui/StatusIndicator'

const capabilities: { icon: IconName; title: string; desc: string }[] = [
  { icon: 'person', title: 'People', desc: 'Correlate public identities and aliases across sources.' },
  { icon: 'username', title: 'Usernames', desc: 'Detect handle reuse and platform footprints.' },
  { icon: 'email', title: 'Emails', desc: 'Map addresses to domains and public registrations.' },
  { icon: 'domain', title: 'Domains', desc: 'DNS, WHOIS and certificate transparency history.' },
  { icon: 'ip', title: 'IP Intelligence', desc: 'ASN, allocation ranges and resolution context.' },
  { icon: 'social', title: 'Social Intelligence', desc: 'Public profiles and their observable connections.' },
  { icon: 'network', title: 'Network Analysis', desc: 'Interactive relationship graphs across entities.' },
  { icon: 'report', title: 'Reports', desc: 'Structured, confidence-rated intelligence summaries.' },
]

// Hero network: Person -> Username -> Social -> Domain -> IP -> Organization
const heroNodes = [
  { id: 'person', label: 'Person', icon: 'person' as IconName, x: 50, y: 150, color: '#00e5ff' },
  { id: 'username', label: 'Username', icon: 'username' as IconName, x: 165, y: 78, color: '#2563eb' },
  { id: 'social', label: 'Social', icon: 'social' as IconName, x: 165, y: 222, color: '#a78bfa' },
  { id: 'domain', label: 'Domain', icon: 'domain' as IconName, x: 285, y: 150, color: '#f59e0b' },
  { id: 'ip', label: 'IP', icon: 'ip' as IconName, x: 400, y: 82, color: '#ef4444' },
  { id: 'org', label: 'Organization', icon: 'org' as IconName, x: 400, y: 224, color: '#38bdf8' },
]
const heroEdges = [
  ['person', 'username'],
  ['person', 'social'],
  ['username', 'domain'],
  ['social', 'domain'],
  ['domain', 'ip'],
  ['domain', 'org'],
]

function HeroNetwork() {
  const pos = Object.fromEntries(heroNodes.map((n) => [n.id, n]))
  return (
    <svg className="net-svg" viewBox="0 0 460 300" role="img" aria-label="Animated intelligence network">
      <defs>
        <radialGradient id="nodeGlow">
          <stop offset="0%" stopColor="rgba(0,229,255,.5)" />
          <stop offset="100%" stopColor="rgba(0,229,255,0)" />
        </radialGradient>
      </defs>
      {heroEdges.map(([a, b], i) => (
        <line
          key={i}
          className="net-link"
          x1={pos[a].x} y1={pos[a].y} x2={pos[b].x} y2={pos[b].y}
          stroke="rgba(0,229,255,.4)" strokeWidth={1.4}
          style={{ animationDelay: `${i * 0.22}s` }}
        />
      ))}
      {heroNodes.map((n, i) => (
        <g key={n.id} className="net-node" transform={`translate(${n.x} ${n.y})`}>
          <circle className="net-halo" r={26} fill="url(#nodeGlow)" style={{ animationDelay: `${i * 0.4}s` }} />
          <circle r={17} fill="#0a0f1c" stroke={n.color} strokeWidth={1.5} />
          <circle className="core" r={5} fill={n.color} />
          <text className="net-label" textAnchor="middle" y={34}>{n.label}</text>
        </g>
      ))}
    </svg>
  )
}

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="topbar" style={{ position: 'sticky', background: 'var(--bg-overlay)' }}>
        <div className="row" style={{ gap: 10 }}>
          <span className="sidebar__logo"><Icon name="logo" size={18} style={{ color: 'var(--accent-cyan)' }} /></span>
          <div>
            <div className="sidebar__name">OSINT <span>Intel</span></div>
          </div>
        </div>
        <nav className="row" style={{ marginLeft: 'auto', gap: 6 }}>
          <Link to="/dashboard"><Button variant="ghost" size="sm">Sign in</Button></Link>
          <Link to="/workspace"><Button size="sm" icon="play">Launch</Button></Link>
        </nav>
      </header>

      <main className="page" style={{ flex: 1 }}>
        <section className="hero">
          <div>
            <div className="row" style={{ gap: 8, marginBottom: 18 }}>
              <StatusIndicator status="ok" pulse />
              <span className="eyebrow" style={{ color: 'var(--status-ok)' }}>Intelligence Engine • Online</span>
            </div>
            <h1 className="hero__title">
              TURN OPEN DATA<br />INTO <span className="accent">INTELLIGENCE.</span>
            </h1>
            <p className="hero__desc">
              Investigate publicly available information, connect entities, uncover relationships,
              and transform fragmented data into structured intelligence.
            </p>
            <div className="hero__cta">
              <Link to="/workspace"><Button size="lg" icon="target">Start Investigation</Button></Link>
              <Link to="/dashboard"><Button size="lg" variant="ghost" iconRight="chevronRight">Explore Platform</Button></Link>
            </div>
            <div className="hero__status">
              <span className="demo-tag">Demo data · no real intelligence</span>
            </div>
          </div>
          <div className="hero__visual">
            <HeroNetwork />
          </div>
        </section>

        <section style={{ marginTop: 40 }}>
          <div className="section-title">Intelligence Capabilities</div>
          <div className="cap-grid">
            {capabilities.map((c) => (
              <div className="cap" key={c.title}>
                <span className="cap__icon"><Icon name={c.icon} size={19} /></span>
                <span className="cap__title">{c.title}</span>
                <span className="cap__desc">{c.desc}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <span className="privacy">
          <Icon name="shield" size={15} style={{ color: 'var(--accent-cyan)', flex: 'none' }} />
          Use only lawful, publicly available information. Respect privacy, applicable laws, and platform terms.
        </span>
        <span className="mono" style={{ fontSize: 11 }}>OSINT Intelligence Platform</span>
      </footer>
    </div>
  )
}

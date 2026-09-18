import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { Icon } from '@/components/Icon'

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className={`app${collapsed ? ' app--collapsed' : ''}`}>
      <Sidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div className="app__main">
        <Navbar onMenu={() => setDrawerOpen(true)} onToggleCollapse={() => setCollapsed((c) => !c)} />
        <main className="app__content">
          <Outlet />
        </main>
        <footer className="app-footer">
          <span className="privacy">
            <Icon name="shield" size={15} style={{ color: 'var(--accent-cyan)', flex: 'none' }} />
            Use only lawful, publicly available information. Respect privacy, applicable laws, and platform terms.
          </span>
          <span className="mono" style={{ fontSize: 11 }}>OSINT Intelligence Platform · DEMO DATA</span>
        </footer>
      </div>
    </div>
  )
}

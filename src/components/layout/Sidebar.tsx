import { NavLink } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { navSections } from '@/lib/nav'
import { StatusIndicator } from '@/components/ui/StatusIndicator'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open && <div className="drawer-backdrop" onClick={onClose} />}
      <aside className={`sidebar${open ? ' sidebar--open' : ''}`}>
        <div className="sidebar__brand">
          <span className="sidebar__logo"><Icon name="logo" size={18} style={{ color: 'var(--accent-cyan)' }} /></span>
          <div style={{ minWidth: 0 }}>
            <div className="sidebar__name">OSINT <span>Intel</span></div>
            <div className="sidebar__sub">PLATFORM v1.0</div>
          </div>
        </div>

        <nav className="sidebar__nav">
          {navSections.map((section) => (
            <div className="nav-section" key={section.label}>
              <div className="nav-section__label">{section.label}</div>
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
                  title={item.label}
                >
                  <span className="nav-link__icon"><Icon name={item.icon} size={17} /></span>
                  <span className="nav-link__label">{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar__foot">
          <div className="muted-panel row spread" style={{ padding: '10px 12px' }}>
            <StatusIndicator status="ok" pulse />
            <span className="text-secondary" style={{ fontSize: 11.5 }}>Engine online</span>
          </div>
        </div>
      </aside>
    </>
  )
}

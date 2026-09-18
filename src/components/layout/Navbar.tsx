import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { SearchBar } from '@/components/ui/Input'

interface NavbarProps {
  onMenu: () => void
  onToggleCollapse: () => void
}

export function Navbar({ onMenu, onToggleCollapse }: NavbarProps) {
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!q.trim()) return
    navigate(`/search?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <header className="topbar">
      <button className="icon-btn topbar__menu" onClick={onMenu} aria-label="Open navigation">
        <Icon name="menu" size={18} />
      </button>
      <button className="icon-btn collapse-btn" onClick={onToggleCollapse} aria-label="Toggle sidebar">
        <Icon name="chevronRight" size={18} />
      </button>

      <form className="topbar__search" onSubmit={submit} role="search">
        <SearchBar
          value={q}
          onValueChange={setQ}
          placeholder="Search people, usernames, emails, domains, IPs..."
          aria-label="Global search"
        />
      </form>

      <div className="topbar__actions">
        <button className="icon-btn" aria-label="Notifications">
          <Icon name="bell" size={18} />
          <span className="icon-btn__dot" />
        </button>
        <div className="avatar" title="A. Reyes · Analyst">AR</div>
      </div>
    </header>
  )
}

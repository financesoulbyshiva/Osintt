import type { IconName } from '@/components/Icon'

export interface NavItem {
  to: string
  label: string
  icon: IconName
  end?: boolean
}

export interface NavSection {
  label: string
  items: NavItem[]
}

export const navSections: NavSection[] = [
  {
    label: 'Overview',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
      { to: '/investigations', label: 'Investigations', icon: 'investigation' },
      { to: '/search', label: 'Search', icon: 'search' },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { to: '/entities/people', label: 'People', icon: 'person' },
      { to: '/entities/usernames', label: 'Usernames', icon: 'username' },
      { to: '/entities/emails', label: 'Emails', icon: 'email' },
      { to: '/entities/domains', label: 'Domains', icon: 'domain' },
      { to: '/entities/ips', label: 'IP Intelligence', icon: 'ip' },
      { to: '/entities/social', label: 'Social', icon: 'social' },
      { to: '/graph', label: 'Network Graph', icon: 'network' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/reports', label: 'Reports', icon: 'report' },
      { to: '/watchlists', label: 'Watchlists', icon: 'watchlist' },
      { to: '/activity', label: 'Activity', icon: 'activity' },
      { to: '/settings', label: 'Settings', icon: 'settings' },
    ],
  },
]

export const allNavItems = navSections.flatMap((s) => s.items)

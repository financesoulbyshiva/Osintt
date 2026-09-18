import type { SVGProps } from 'react'

export type IconName =
  | 'dashboard' | 'investigation' | 'search' | 'person' | 'username' | 'email'
  | 'domain' | 'ip' | 'social' | 'network' | 'report' | 'watchlist' | 'activity'
  | 'settings' | 'org' | 'bell' | 'menu' | 'close' | 'chevronRight' | 'chevronDown'
  | 'plus' | 'check' | 'alert' | 'info' | 'external' | 'download' | 'filter'
  | 'zoomIn' | 'zoomOut' | 'maximize' | 'play' | 'shield' | 'link' | 'clock'
  | 'source' | 'trash' | 'eye' | 'refresh' | 'logo' | 'target' | 'spark'

const paths: Record<IconName, JSX.Element> = {
  dashboard: <><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></>,
  investigation: <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/><path d="M11 8v6M8 11h6"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
  person: <><circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/></>,
  username: <><path d="M12 3a9 9 0 1 0 9 9"/><circle cx="12" cy="12" r="3.2"/><path d="M15.5 12a3.5 3.5 0 0 1 5.5 0"/></>,
  email: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/></>,
  domain: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18"/></>,
  ip: <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 9v6M11 9v6M8 12h3M15 9v6M15 9h2a1.5 1.5 0 0 1 0 3h-2"/></>,
  social: <><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.3 10.8 7.4-3.6M8.3 13.2l7.4 3.6"/></>,
  network: <><circle cx="5" cy="6" r="2.2"/><circle cx="19" cy="6" r="2.2"/><circle cx="12" cy="18" r="2.2"/><path d="M7 7.2 10.5 16M17 7.2 13.5 16M7.2 6h9.6"/></>,
  report: <><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><path d="M9 12h6M9 16h6"/></>,
  watchlist: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="2.6"/></>,
  activity: <><path d="M3 12h4l2.5-7 4 14L16 12h5"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/></>,
  org: <><rect x="4" y="8" width="16" height="13" rx="1.5"/><path d="M9 8V4h6v4M9 12h2M13 12h2M9 16h2M13 16h2"/></>,
  bell: <><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6"/><path d="M10 20a2 2 0 0 0 4 0"/></>,
  menu: <><path d="M3 6h18M3 12h18M3 18h18"/></>,
  close: <><path d="M6 6l12 12M18 6 6 18"/></>,
  chevronRight: <><path d="m9 6 6 6-6 6"/></>,
  chevronDown: <><path d="m6 9 6 6 6-6"/></>,
  plus: <><path d="M12 5v14M5 12h14"/></>,
  check: <><path d="m5 12 5 5L20 7"/></>,
  alert: <><path d="M12 3 2 20h20L12 3Z"/><path d="M12 9v5M12 17.5v.5"/></>,
  info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.5"/></>,
  external: <><path d="M14 4h6v6"/><path d="M20 4 11 13"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></>,
  download: <><path d="M12 3v12"/><path d="m7 11 5 5 5-5"/><path d="M4 20h16"/></>,
  filter: <><path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z"/></>,
  zoomIn: <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M11 8v6M8 11h6"/></>,
  zoomOut: <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M8 11h6"/></>,
  maximize: <><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></>,
  play: <><path d="M7 4.5v15l13-7.5-13-7.5Z"/></>,
  shield: <><path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></>,
  link: <><path d="M10 13a4 4 0 0 0 6 .5l2-2a4 4 0 0 0-6-6l-1 1"/><path d="M14 11a4 4 0 0 0-6-.5l-2 2a4 4 0 0 0 6 6l1-1"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  source: <><path d="M4 6c0-1.5 3.5-2.5 8-2.5S20 4.5 20 6v12c0 1.5-3.5 2.5-8 2.5S4 19.5 4 18Z"/><path d="M4 6c0 1.5 3.5 2.5 8 2.5S20 7.5 20 6"/></>,
  trash: <><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></>,
  eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="2.6"/></>,
  refresh: <><path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v4h-4"/></>,
  target: <><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></>,
  spark: <><path d="M12 3v5M12 16v5M3 12h5M16 12h5M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3"/></>,
  logo: <><circle cx="12" cy="12" r="2.5"/><circle cx="12" cy="12" r="6.5"/><circle cx="12" cy="12" r="10"/></>,
}

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName
  size?: number
}

export function Icon({ name, size = 18, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {paths[name]}
    </svg>
  )
}

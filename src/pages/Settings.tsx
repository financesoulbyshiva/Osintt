import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Select, Field } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'
import { sources as allSources } from '@/services/demoData'

type SectionKey = 'profile' | 'security' | 'notifications' | 'appearance' | 'sources' | 'privacy' | 'audit'

const sections: { key: SectionKey; label: string }[] = [
  { key: 'profile', label: 'Profile' },
  { key: 'security', label: 'Security' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'appearance', label: 'Appearance' },
  { key: 'sources', label: 'Data Sources' },
  { key: 'privacy', label: 'Privacy' },
  { key: 'audit', label: 'Audit Logs' },
]

function Toggle({ checked, onChange, label, desc }: { checked: boolean; onChange: (v: boolean) => void; label: string; desc?: string }) {
  return (
    <div className="setting-row">
      <div>
        <div className="setting-row__label">{label}</div>
        {desc && <div className="setting-row__desc">{desc}</div>}
      </div>
      <label className="switch">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="switch__track"><span className="switch__thumb" /></span>
      </label>
    </div>
  )
}

export default function Settings() {
  const toast = useToast()
  const [active, setActive] = useState<SectionKey>('profile')
  const [theme, setTheme] = useState('dark')
  const [density, setDensity] = useState('comfortable')
  const [toggles, setToggles] = useState({
    mfa: true, sessionLock: true, emailAlerts: false, digest: true,
    watchlistAlerts: true, minimizeData: true, redactLowConfidence: true, auditTrail: true,
  })
  const set = (k: keyof typeof toggles) => (v: boolean) => setToggles((t) => ({ ...t, [k]: v }))

  function save() {
    toast.push({ tone: 'ok', title: 'Settings saved', message: 'Preferences updated locally (demo).' })
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="row" style={{ gap: 10 }}>
            <h1 className="page-title">Settings</h1>
            <span className="demo-tag">Demo Data</span>
          </div>
          <p className="page-sub">Configure your analyst profile, security, notifications and data-handling preferences.</p>
        </div>
        <Button icon="check" onClick={save}>Save changes</Button>
      </div>

      <div className="settings-layout">
        <nav className="settings-nav">
          {sections.map((s) => (
            <button key={s.key} className={active === s.key ? 'active' : ''} onClick={() => setActive(s.key)}>
              {s.label}
            </button>
          ))}
        </nav>

        <div>
          {active === 'profile' && (
            <Card title="Profile">
              <div className="grid grid--2">
                <Field label="Display name"><Input defaultValue="A. Reyes" /></Field>
                <Field label="Role"><Input defaultValue="Senior Analyst" /></Field>
                <Field label="Email"><Input defaultValue="a.reyes@example.org" mono /></Field>
                <Field label="Team">
                  <Select options={[{ value: 'osint', label: 'OSINT' }, { value: 'threat', label: 'Threat Intel' }, { value: 'compliance', label: 'Compliance' }]} defaultValue="osint" />
                </Field>
              </div>
            </Card>
          )}

          {active === 'security' && (
            <Card title="Security">
              <Toggle checked={toggles.mfa} onChange={set('mfa')} label="Multi-factor authentication" desc="Require a second factor for sign-in." />
              <Toggle checked={toggles.sessionLock} onChange={set('sessionLock')} label="Auto-lock session" desc="Lock the workspace after 15 minutes of inactivity." />
              <div className="setting-row">
                <div>
                  <div className="setting-row__label">Session timeout</div>
                  <div className="setting-row__desc">Automatically sign out after a period of inactivity.</div>
                </div>
                <Select options={[{ value: '30', label: '30 minutes' }, { value: '60', label: '1 hour' }, { value: '240', label: '4 hours' }]} defaultValue="60" />
              </div>
            </Card>
          )}

          {active === 'notifications' && (
            <Card title="Notifications">
              <Toggle checked={toggles.emailAlerts} onChange={set('emailAlerts')} label="Email alerts" desc="Send critical alerts by email." />
              <Toggle checked={toggles.digest} onChange={set('digest')} label="Daily digest" desc="A summary of investigation activity each morning." />
              <Toggle checked={toggles.watchlistAlerts} onChange={set('watchlistAlerts')} label="Watchlist changes" desc="Notify when a monitored entity changes." />
            </Card>
          )}

          {active === 'appearance' && (
            <Card title="Appearance">
              <div className="setting-row">
                <div>
                  <div className="setting-row__label">Theme</div>
                  <div className="setting-row__desc">Dark is the default and recommended theme.</div>
                </div>
                <Select options={[{ value: 'dark', label: 'Dark (default)' }, { value: 'dim', label: 'Dim' }]} value={theme} onChange={(e) => setTheme(e.target.value)} />
              </div>
              <div className="setting-row">
                <div>
                  <div className="setting-row__label">Density</div>
                  <div className="setting-row__desc">Adjust spacing across tables and panels.</div>
                </div>
                <Select options={[{ value: 'comfortable', label: 'Comfortable' }, { value: 'compact', label: 'Compact' }]} value={density} onChange={(e) => setDensity(e.target.value)} />
              </div>
              <Toggle checked label="Reduce motion" desc="Honors your system's reduced-motion preference automatically." onChange={() => {}} />
            </Card>
          )}

          {active === 'sources' && (
            <Card title="Data Sources">
              <div className="stack" style={{ gap: 8 }}>
                {allSources.map((s) => (
                  <div className="row spread" key={s.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13.5 }}>{s.name}</div>
                      <div className="text-muted mono" style={{ fontSize: 11.5 }}>{s.type} · {s.url}</div>
                    </div>
                    <Badge tone={s.reliability === 'high' ? 'ok' : s.reliability === 'medium' ? 'warn' : 'crit'}>{s.reliability}</Badge>
                  </div>
                ))}
              </div>
              <p className="text-muted" style={{ fontSize: 12, marginTop: 12 }}>
                Connectors are illustrative. Wire real, lawful public APIs into the service layer to activate collection.
              </p>
            </Card>
          )}

          {active === 'privacy' && (
            <Card title="Privacy & Responsible Use">
              <Toggle checked={toggles.minimizeData} onChange={set('minimizeData')} label="Data minimization" desc="Collect only what is necessary for the investigation." />
              <Toggle checked={toggles.redactLowConfidence} onChange={set('redactLowConfidence')} label="Flag low-confidence links" desc="Visually mark unverified associations everywhere." />
              <div className="muted-panel" style={{ marginTop: 12 }}>
                <p className="text-secondary" style={{ fontSize: 12.5, lineHeight: 1.6 }}>
                  Use only lawful, publicly available information. Respect privacy, applicable laws, and platform terms.
                  This platform must not be used to access private accounts, collect credentials, bypass authentication,
                  or covertly track individuals.
                </p>
              </div>
            </Card>
          )}

          {active === 'audit' && (
            <Card title="Audit Logs">
              <Toggle checked={toggles.auditTrail} onChange={set('auditTrail')} label="Record audit trail" desc="Log analyst actions for accountability." />
              <div className="terminal" style={{ marginTop: 12 }}>
                <div className="terminal__bar">
                  <span className="terminal__dot" style={{ background: '#22c55e' }} />
                  <span className="mono text-muted" style={{ fontSize: 11.5, marginLeft: 6 }}>audit.log</span>
                </div>
                <div className="terminal__body" style={{ maxHeight: 240 }}>
                  {[
                    ['09:12:04', 'Signed in · A. Reyes', 'info'],
                    ['09:14:22', 'Opened investigation inv-1', 'info'],
                    ['09:16:51', 'Exported report rep-1 (JSON)', 'ok'],
                    ['09:20:03', 'Modified watchlist wl-3', 'warn'],
                    ['09:31:47', 'Ran investigation: amercer_dev', 'info'],
                  ].map(([t, m, lvl], i) => (
                    <div className="term-line" key={i}>
                      <span className="term-time">[{t}]</span>
                      <span className={`term-msg term-msg--${lvl === 'ok' ? 'ok' : lvl === 'warn' ? 'warn' : 'info'}`}>{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

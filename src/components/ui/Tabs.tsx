interface Tab<T extends string> {
  value: T
  label: string
  count?: number
}

interface TabsProps<T extends string> {
  tabs: Tab<T>[]
  value: T
  onChange: (v: T) => void
}

export function Tabs<T extends string>({ tabs, value, onChange }: TabsProps<T>) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.value}
          role="tab"
          aria-selected={value === t.value}
          className={`tab${value === t.value ? ' tab--active' : ''}`}
          onClick={() => onChange(t.value)}
        >
          {t.label}
          {typeof t.count === 'number' && (
            <span className="text-muted" style={{ marginLeft: 6, fontSize: 11 }}>{t.count}</span>
          )}
        </button>
      ))}
    </div>
  )
}

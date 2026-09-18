import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { SearchBar, Select } from '@/components/ui/Input'
import { Tabs } from '@/components/ui/Tabs'
import { EntityCard } from '@/components/domain/EntityCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { useAsync } from '@/hooks/useAsync'
import { listEntities } from '@/services/entities'
import { sources as allSources } from '@/services/demoData'
import type { EntityType } from '@/services/types'

type TabKey = 'all' | EntityType

const tabs: { value: TabKey; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'person', label: 'People' },
  { value: 'username', label: 'Usernames' },
  { value: 'email', label: 'Emails' },
  { value: 'domain', label: 'Domains' },
  { value: 'ip', label: 'IPs' },
  { value: 'social', label: 'Social' },
]

export default function Search() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const [tab, setTab] = useState<TabKey>('all')
  const [confidence, setConfidence] = useState('all')
  const [source, setSource] = useState('all')
  const [since, setSince] = useState('')

  const { data, loading } = useAsync(
    () => listEntities({ search: q, type: tab, confidence: confidence as never, sourceId: source }),
    [q, tab, confidence, source],
  )

  const results = useMemo(() => {
    if (!data) return []
    if (!since) return data
    return data.filter((e) => e.lastObserved >= since)
  }, [data, since])

  function setQ(v: string) {
    const next = new URLSearchParams(params)
    if (v) next.set('q', v)
    else next.delete('q')
    setParams(next, { replace: true })
  }

  const sourceOptions = [{ value: 'all', label: 'All sources' }, ...allSources.map((s) => ({ value: s.id, label: s.name }))]

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="row" style={{ gap: 10 }}>
            <h1 className="page-title">Unified Search</h1>
            <span className="demo-tag">Demo Data</span>
          </div>
          <p className="page-sub">Query across every entity type. Results are drawn from bundled demo data.</p>
        </div>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 14 }}>
          <SearchBar
            value={q}
            onValueChange={setQ}
            mono
            placeholder="Search an identifier..."
            aria-label="Search an identifier"
          />
        </div>
        <Tabs tabs={tabs} value={tab} onChange={setTab} />
        <div className="filter-bar" style={{ marginTop: 14 }}>
          <div className="field">
            <span className="label">Source</span>
            <Select options={sourceOptions} value={source} onChange={(e) => setSource(e.target.value)} />
          </div>
          <div className="field">
            <span className="label">Confidence</span>
            <Select
              options={[
                { value: 'all', label: 'Any confidence' },
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' },
              ]}
              value={confidence}
              onChange={(e) => setConfidence(e.target.value)}
            />
          </div>
          <div className="field">
            <span className="label">Observed since</span>
            <input className="input" type="date" value={since} onChange={(e) => setSince(e.target.value)} />
          </div>
        </div>
      </Card>

      <div className="row spread" style={{ marginBottom: 12 }}>
        <span className="text-secondary" style={{ fontSize: 13 }}>
          {loading ? 'Searching…' : `${results.length} result${results.length === 1 ? '' : 's'}`}
          {q && <> for <span className="mono text-cyan">{q}</span></>}
        </span>
      </div>

      {loading ? (
        <div className="grid grid--auto">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : results.length === 0 ? (
        <Card>
          <EmptyState
            icon="search"
            title="No matches found"
            description={q ? `Nothing matched "${q}" with the current filters. Try broadening your query.` : 'Enter an identifier above to begin searching.'}
          />
        </Card>
      ) : (
        <div className="grid grid--auto">
          {results.map((e) => <EntityCard key={e.id} entity={e} />)}
        </div>
      )}
    </div>
  )
}

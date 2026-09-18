import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Textarea, Input, Select } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import { Icon } from '@/components/Icon'
import { getReport, exportJSON, exportCSV, exportPDF } from '@/services/reports'
import { investigations } from '@/services/demoData'
import type { Report, ReportSection } from '@/services/types'

const sectionTemplates = [
  'Investigation Overview',
  'Target',
  'Key Findings',
  'Entities',
  'Relationships',
  'Timeline',
  'Sources',
  'Confidence',
  'Analyst Notes',
]

function blankReport(): Report {
  return {
    id: 'draft',
    title: 'Untitled Report',
    investigationId: investigations[0]?.id ?? '',
    createdAt: new Date().toISOString().slice(0, 10),
    author: 'A. Reyes',
    classification: 'Internal · Lawful Use Only',
    sections: sectionTemplates.map((t, i) => ({ id: `sec-${i}`, title: t, body: '' })),
  }
}

export default function ReportDetail() {
  const { id } = useParams()
  const isNew = !id || id === 'new'
  const toast = useToast()
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(!isNew)
  const [preview, setPreview] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)

  useEffect(() => {
    if (isNew) {
      setReport(blankReport())
      setLoading(false)
      return
    }
    let active = true
    setLoading(true)
    getReport(id!).then((r) => {
      if (!active) return
      setReport(r ?? blankReport())
      setLoading(false)
    })
    return () => { active = false }
  }, [id, isNew])

  if (loading || !report) {
    return (
      <div className="page">
        <Card><div className="stack" style={{ alignItems: 'center', padding: 40 }}><span className="spinner" style={{ color: 'var(--accent-cyan)' }} /></div></Card>
      </div>
    )
  }

  function update(patch: Partial<Report>) {
    setReport((r) => (r ? { ...r, ...patch } : r))
  }
  function updateSection(sid: string, body: string) {
    setReport((r) => r && { ...r, sections: r.sections.map((s) => (s.id === sid ? { ...s, body } : s)) })
  }

  async function onExport(kind: 'json' | 'csv' | 'pdf') {
    if (!report) return
    setBusy(kind)
    try {
      if (kind === 'json') await exportJSON(report)
      else if (kind === 'csv') await exportCSV(report)
      else {
        await exportPDF(report)
        window.print()
      }
      toast.push({ tone: 'ok', title: `Export ${kind.toUpperCase()} ready`, message: kind === 'pdf' ? 'Print dialog opened (demo).' : 'File downloaded (demo).' })
    } finally {
      setBusy(null)
    }
  }

  const inv = investigations.find((i) => i.id === report.investigationId)

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="row" style={{ gap: 10 }}>
            <h1 className="page-title">Report Builder</h1>
            <span className="demo-tag">Demo Data</span>
            {isNew && <Badge tone="warn">unsaved draft</Badge>}
          </div>
          <p className="page-sub">{report.classification}</p>
        </div>
        <div className="row wrap">
          <Button variant="ghost" icon="eye" onClick={() => setPreview(true)}>Preview</Button>
          <Button variant="secondary" icon="download" loading={busy === 'pdf'} onClick={() => onExport('pdf')}>Export PDF</Button>
          <Button variant="secondary" icon="download" loading={busy === 'json'} onClick={() => onExport('json')}>Export JSON</Button>
          <Button variant="secondary" icon="download" loading={busy === 'csv'} onClick={() => onExport('csv')}>Export CSV</Button>
        </div>
      </div>

      <div className="detail-grid">
        <div className="stack">
          <Card title="Report Metadata">
            <div className="grid grid--2">
              <div className="field">
                <span className="label">Title</span>
                <Input value={report.title} onChange={(e) => update({ title: e.target.value })} />
              </div>
              <div className="field">
                <span className="label">Investigation</span>
                <Select
                  options={investigations.map((i) => ({ value: i.id, label: i.name }))}
                  value={report.investigationId}
                  onChange={(e) => update({ investigationId: e.target.value })}
                />
              </div>
              <div className="field">
                <span className="label">Author</span>
                <Input value={report.author} onChange={(e) => update({ author: e.target.value })} />
              </div>
              <div className="field">
                <span className="label">Classification</span>
                <Input value={report.classification} onChange={(e) => update({ classification: e.target.value })} />
              </div>
            </div>
          </Card>

          {report.sections.map((s: ReportSection) => (
            <Card key={s.id} title={s.title}>
              <Textarea
                value={s.body}
                onChange={(e) => updateSection(s.id, e.target.value)}
                placeholder={`Write the ${s.title.toLowerCase()} section...`}
              />
            </Card>
          ))}
        </div>

        <div className="stack">
          <Card title="Summary">
            <dl className="kv">
              <dt>Investigation</dt><dd>{inv?.name ?? '—'}</dd>
              <dt>Subject</dt><dd className="mono">{inv?.subject ?? '—'}</dd>
              <dt>Sections</dt><dd>{report.sections.filter((s) => s.body.trim()).length} / {report.sections.length} written</dd>
              <dt>Created</dt><dd className="mono">{report.createdAt}</dd>
            </dl>
          </Card>
          <Card title="Responsible Use">
            <p className="text-secondary" style={{ fontSize: 12.5, lineHeight: 1.6 }}>
              Reports must only reference lawful, publicly available information. Clearly separate verified
              findings from low-confidence leads and never present uncertain data as confirmed fact.
            </p>
          </Card>
        </div>
      </div>

      <Modal open={preview} title="Report Preview" onClose={() => setPreview(false)}
        footer={<Button variant="ghost" onClick={() => setPreview(false)}>Close</Button>}>
        <div className="report-doc" style={{ maxHeight: '52vh', overflowY: 'auto' }}>
          <h2 style={{ fontSize: 18, marginBottom: 4 }}>{report.title}</h2>
          <div className="row wrap" style={{ gap: 8, marginBottom: 12 }}>
            <Badge tone="cyan">{report.classification}</Badge>
            <Badge tone="neutral">{inv?.name ?? 'No investigation'}</Badge>
            <Badge tone="neutral">by {report.author}</Badge>
          </div>
          {report.sections.filter((s) => s.body.trim()).length === 0 ? (
            <p className="text-muted" style={{ fontSize: 13 }}>No content yet — add text to at least one section.</p>
          ) : (
            report.sections.filter((s) => s.body.trim()).map((s) => (
              <div key={s.id}>
                <h3><Icon name="report" size={12} style={{ marginRight: 6 }} />{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  )
}

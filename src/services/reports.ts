import { delay } from './api'
import { reports } from './demoData'
import type { Report } from './types'

export function listReports(): Promise<Report[]> {
  return delay(reports)
}

export function getReport(id: string) {
  return delay(reports.find((r) => r.id === id) ?? null)
}

// Export helpers. No backend yet, so these generate client-side downloads
// from the in-memory report. Clearly demo implementations.
export function exportJSON(report: Report) {
  return download(`${slug(report.title)}.json`, JSON.stringify(report, null, 2), 'application/json')
}

export function exportCSV(report: Report) {
  const rows = [['section', 'content'], ...report.sections.map((s) => [s.title, `"${s.body.replace(/"/g, '""')}"`])]
  return download(`${slug(report.title)}.csv`, rows.map((r) => r.join(',')).join('\n'), 'text/csv')
}

export function exportPDF(report: Report) {
  // Demo: opens a print-ready view. A real PDF service can replace this.
  return delay({ ok: true, mode: 'print', title: report.title } as const, 600)
}

function slug(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
  return delay({ ok: true, filename } as const, 300)
}

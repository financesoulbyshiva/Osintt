import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { TerminalLog } from '@/components/domain/TerminalLog'
import { SkeletonRows } from '@/components/ui/Skeleton'
import { useAsync } from '@/hooks/useAsync'
import { listActivity } from '@/services/investigations'

export default function Activity() {
  const { data, loading } = useAsync(() => listActivity(), [])
  const [animate, setAnimate] = useState(true)
  const [nonce, setNonce] = useState(0)

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="row" style={{ gap: 10 }}>
            <h1 className="page-title">Activity</h1>
            <span className="demo-tag">Demo Data</span>
          </div>
          <p className="page-sub">Live-style engine log. Entries stream in as the collection pipeline processes work.</p>
        </div>
        <div className="row">
          <Badge tone={animate ? 'ok' : 'neutral'} dot>{animate ? 'streaming' : 'paused'}</Badge>
          <Button variant="ghost" size="sm" icon="refresh" onClick={() => { setNonce((n) => n + 1); setAnimate(true) }}>
            Replay
          </Button>
        </div>
      </div>

      <div style={{ height: 'calc(100vh - 230px)', minHeight: 380 }}>
        <Card flush style={{ height: '100%' }}>
          {loading || !data ? (
            <div style={{ padding: 20 }}><SkeletonRows rows={8} /></div>
          ) : (
            <TerminalLog key={nonce} entries={data} animate={animate} title="engine · activity.log" />
          )}
        </Card>
      </div>
    </div>
  )
}

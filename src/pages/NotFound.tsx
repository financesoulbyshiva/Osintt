import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'

export default function NotFound() {
  return (
    <div className="page">
      <Card>
        <EmptyState
          icon="alert"
          title="Page not found"
          description="The route you requested does not exist. It may have been moved or removed."
          action={
            <div className="row">
              <Link to="/dashboard"><Button size="sm">Go to dashboard</Button></Link>
              <Link to="/search"><Button size="sm" variant="ghost">Search</Button></Link>
            </div>
          }
        />
      </Card>
    </div>
  )
}

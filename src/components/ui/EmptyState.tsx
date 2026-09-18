import type { ReactNode } from 'react'
import { Icon, type IconName } from '@/components/Icon'

interface EmptyStateProps {
  icon?: IconName
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon = 'search', title, description, action }: EmptyStateProps) {
  return (
    <div className="empty">
      <div className="empty__icon">
        <Icon name={icon} size={24} />
      </div>
      <div className="empty__title">{title}</div>
      {description && <div className="empty__desc">{description}</div>}
      {action}
    </div>
  )
}

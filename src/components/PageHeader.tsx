import type { ReactNode } from 'react'
import { Eyebrow } from './Controls'
import './PageHeader.css'

export interface PageHeaderProps {
  /** Small uppercase line above the title. */
  kicker?: ReactNode
  title: ReactNode
  subtitle?: ReactNode
  /** Controls aligned to the opposite edge, baseline-matched to the title. */
  actions?: ReactNode
  className?: string
}

/** Page-level title block with a control cluster on the far edge. */
export function PageHeader({ kicker, title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <div className={['ny-page-header', className].filter(Boolean).join(' ')}>
      <div className="ny-page-header__titles">
        {kicker != null && <Eyebrow>{kicker}</Eyebrow>}
        <div className="ny-page-header__title">{title}</div>
        {subtitle != null && <div className="ny-page-header__subtitle">{subtitle}</div>}
      </div>
      {actions != null && <div className="ny-page-header__actions">{actions}</div>}
    </div>
  )
}

import { type RefObject } from 'react'
import { type ImperativePanelHandle } from 'react-resizable-panels'

import { cn } from '~/libs/utils/cn'
import { ResizablePanel } from '~/components/ui/resizable'

const panelProjectsAttr = {
  id: 'projects-panel',
  minSize: 6,
  maxSize: 12,
  defaultSize: 3,
  collapsedSize: 3,
  collapsible: true
}

type Props = {
  ref: RefObject<ImperativePanelHandle>
  children: React.ReactNode
  onChange: (v: boolean) => void
  className?: string
}

export function ProjectsPanel({ ref, children, onChange, className }: Props) {
  return (
    <ResizablePanel
      ref={ref}
      onExpand={() => onChange(true)}
      onCollapse={() => onChange(false)}
      {...panelProjectsAttr}
    >
      <div className={cn('flex h-full w-full items-start justify-center', className)}>
        {children}
      </div>
    </ResizablePanel>
  )
}

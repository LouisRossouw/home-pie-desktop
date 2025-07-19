import { type RefObject } from 'react'
import { type ImperativePanelHandle } from 'react-resizable-panels'
import { ResizablePanel } from '~/components/ui/resizable'

const panelOutletAttr = {
  id: 'outlet-panel',
  minSize: 92,
  maxSize: 97,
  defaultSize: 97,
  collapsible: true
}

type Props = {
  ref: RefObject<ImperativePanelHandle>
  children: React.ReactNode
}

export function OutletPanel({ ref, children }: Props) {
  return (
    <ResizablePanel ref={ref} {...panelOutletAttr}>
      {children}
    </ResizablePanel>
  )
}

import { forwardRef } from 'react'
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
  // ref: RefObject<ImperativePanelHandle>
  children: React.ReactNode
  className?: string
}

// export function OutletPanel({ ref, children }: Props) {
//   return (
//     <ResizablePanel ref={ref} {...panelOutletAttr}>
//       {children}
//     </ResizablePanel>
//   )
// }

// * SideNote: forwardRef is deprecated in React v19 - https://react.dev/reference/react/forwardRef
// TODO; Upgrade to v19
export const OutletPanel = forwardRef<ImperativePanelHandle, Props>(
  ({ children, className }, ref) => {
    return (
      <ResizablePanel className={className} ref={ref} {...panelOutletAttr}>
        {children}
      </ResizablePanel>
    )
  }
)

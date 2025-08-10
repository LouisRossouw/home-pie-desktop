import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip'

type ToolbarTooltipProps = {
  content: React.ReactNode | string // Or could be another React.ReactNode.
  children: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
}

export function TooltipInfo({
  content,
  children,
  side = 'top',
  sideOffset = 0
}: ToolbarTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>{children}</div>
      </TooltipTrigger>
      <TooltipContent side={side} sideOffset={sideOffset}>
        {content}
      </TooltipContent>
    </Tooltip>
  )
}

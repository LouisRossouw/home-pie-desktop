import { useNavigate } from 'react-router'
import { format, isValid, parse } from 'date-fns'
import { Ghost } from 'lucide-react'

import { Button } from './ui/button'
import { TooltipInfo } from './tooltip-info'
import { PingSVG, SpinSVG } from './svg-icons'

export function MrPingPingIndicator({
  lastPingedRaw,
  resTime,
  isOnline
}: {
  lastPingedRaw?: string
  resTime?: number
  isOnline?: boolean
}) {
  if (!isOnline) return <SpinSVG />

  const navigateTo = useNavigate()

  const parsedDate = lastPingedRaw ? parse(lastPingedRaw, 'dd-MM-yyyy HH:mm', new Date()) : null
  const formattedPinged =
    parsedDate && isValid(parsedDate) ? format(parsedDate, 'yyyy-MM-dd HH:mm') : ''

  const { iconColor, bgColor } = indicatorColor(resTime ?? 999999)

  return (
    <TooltipInfo
      content={`MrPingPing - Last Pinged: ${formattedPinged} with a response time of: ${resTime?.toFixed(2)}ms`}
      children={
        <Button
          size={'sm'}
          className="h-6"
          variant={'ghost'}
          onClick={() => navigateTo('/ping-ping')}
        >
          <PingSVG
            bgColor={bgColor}
            toPing={bgColor ? true : false}
            children={
              <Ghost size={14} color={iconColor} className={!isOnline ? 'animate-pulse' : ''} />
            }
          />
        </Button>
      }
    />
  )
}

type ColorIndicator = {
  iconColor: string | undefined
  bgColor: string | undefined
}

function indicatorColor(diff: number) {
  let data = { iconColor: undefined, bgColor: undefined } as ColorIndicator

  switch (true) {
    case diff >= 3 && diff < 4:
      data = { iconColor: 'yellow', bgColor: undefined }
      break
    case diff >= 5 && diff < 5:
      data = { iconColor: 'red', bgColor: undefined }
      break
    case diff >= 5:
      data = { iconColor: 'red', bgColor: 'bg-red-500' }
      break
  }

  return data
}

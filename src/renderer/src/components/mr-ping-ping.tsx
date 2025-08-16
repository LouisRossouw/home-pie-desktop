import { addHours, differenceInMinutes, format } from 'date-fns'
import { Ghost } from 'lucide-react'
import { Button } from './ui/button'
import { TooltipInfo } from './tooltip-info'
import { PingSVG, SpinSVG } from './svg-icons'

export function MrPingPingIndicator({
  lastPingedRaw,
  resTime,
  isLoading
}: {
  lastPingedRaw?: string
  resTime?: number
  isLoading: boolean
}) {
  if (isLoading) return <SpinSVG />

  const lastPinged = addHours(new Date(lastPingedRaw!), 2)
  const pinged = lastPinged ? format(lastPinged, 'HH:mm') : ''
  const formattedPinged = lastPinged ? format(lastPinged, 'yyyy-MM-dd HH:mm') : ''

  const diff = differenceInMinutes(new Date(), lastPinged)

  const { iconColor, bgColor } = indicatorColor(diff)

  return (
    <TooltipInfo
      content={`MrPingPing - Last Pinged: ${formattedPinged} with a response time of: ${resTime?.toFixed(2)}ms`}
      children={
        <Button
          size={'sm'}
          className="h-6"
          variant={'ghost'}
          onClick={() => alert('TODO; Nav to MrPingPing routes')}
        >
          <PingSVG
            bgColor={bgColor}
            toPing={bgColor ? true : false}
            children={
              <Ghost
                size={14}
                color={iconColor}
                className={diff >= 2 && diff <= 3 ? 'animate-pulse' : ''}
              />
            }
          />
          {diff > 10 && (
            <p className="text-xs animate-pulse">
              MrPingPing needs attention 🙃 Last res: {pinged}
            </p>
          )}
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
    case diff === 2:
      data = { iconColor: 'yellow', bgColor: undefined }
      break
    case diff === 3:
      data = { iconColor: 'red', bgColor: undefined }
      break
    case diff >= 4:
      data = { iconColor: 'red', bgColor: 'bg-red-500' }
      break
  }

  return data
}

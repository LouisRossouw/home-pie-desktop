import { addHours, differenceInMinutes, format } from 'date-fns'
import { Droplet, Ghost, Thermometer } from 'lucide-react'
import { Button } from './ui/button'
import { TooltipInfo } from './tooltip-info'
import { PingSVG, SpinSVG } from './svg-icons'
import { useNavigate } from 'react-router'
import { useMemo } from 'react'

export function TemperatureHumidity({
  tempData,
  isLoading
}: {
  tempData?: any[]
  isLoading: boolean
}) {
  const navigateTo = useNavigate()
  if (isLoading) return <SpinSVG />

  // const lastPinged = addHours(new Date(lastPingedRaw!), 2)
  // const pinged = lastPinged ? format(lastPinged, 'HH:mm') : ''
  // const formattedPinged = lastPinged ? format(lastPinged, 'yyyy-MM-dd HH:mm') : ''

  // const diff = differenceInMinutes(new Date(), lastPinged)

  // const { iconColor, bgColor } = indicatorColor(diff)

  const tempHumidity = (() => {
    if (!tempData) return undefined
    const item = tempData[0] // get first element
    const tempEndpoint = item.endpoints_res.find((e) => e.endpoint === 'temperature')
    const humidityEndpoint = item.endpoints_res.find((e) => e.endpoint === 'humidity')

    return {
      temperature: tempEndpoint?.response?.data?.temperature,
      humidity: humidityEndpoint?.response?.data?.humidity,
      date_time: item.date_time
    }
  })()

  const formattedPinged = tempHumidity?.date_time
    ? format(tempHumidity?.date_time, 'yyyy-MM-dd HH:mm')
    : ''

  return (
    <TooltipInfo
      content={`Recorded: ${formattedPinged}`}
      children={
        <Button
          size={'sm'}
          className="h-6"
          variant={'ghost'}
          onClick={() => navigateTo('/smart-home')}
        >
          <PingSVG
            bgColor={undefined}
            toPing={false}
            children={
              <Thermometer
                size={14}
                // color={iconColor}
                // className={}
              />
            }
          />
          <p className="text-xs">{tempHumidity?.temperature?.toFixed(1)} °C</p>
          <PingSVG
            bgColor={undefined}
            toPing={false}
            children={
              <Droplet
                size={14}
                // color={iconColor}
                // className={}
              />
            }
          />
          <p className="text-xs">{tempHumidity?.humidity?.toFixed(0)} %</p>
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

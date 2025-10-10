import { format } from 'date-fns'
import { Droplet, Thermometer } from 'lucide-react'
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

  const tempHumidity = useMemo(() => {
    if (!tempData) return undefined

    const item = tempData[0]
    const tempEndpoint = item.endpoints_res.find((e: any) => e.endpoint === 'temperature')
    const humidityEndpoint = item.endpoints_res.find((e: any) => e.endpoint === 'humidity')

    return {
      temperature: tempEndpoint?.response?.data?.temperature,
      humidity: humidityEndpoint?.response?.data?.humidity,
      date_time: item.date_time
    }
  }, [tempData])

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

import { useNavigate } from 'react-router'
import { format } from 'date-fns'
import { ArrowDown, ArrowRightLeft, ArrowUp, Droplet, Thermometer } from 'lucide-react'
import { TooltipInfo } from './tooltip-info'
import { PingSVG, SpinSVG } from './svg-icons'
import { Button } from './ui/button'

export function TemperatureHumidity({
  label,
  data,
  isLoading
}: {
  label?: string
  data?: any
  isLoading: boolean
}) {
  const navigateTo = useNavigate()
  if (isLoading) return <SpinSVG />

  const formattedPinged = data?.dateTime ? format(data?.dateTime, 'yyyy-MM-dd HH:mm') : ''

  const isHot = data?.temperature >= 35

  return (
    <TooltipInfo
      content={`Recorded: ${formattedPinged}`}
      children={
        <Button
          size={'sm'}
          className="h-6 gap-0"
          variant={'ghost'}
          onClick={() => navigateTo('/smart-home/temperature')}
        >
          <p className="text-xs">{label}</p>
          <PingSVG
            bgColor={isHot ? 'bg-orange-500' : undefined}
            toPing={false}
            children={
              <Thermometer
                size={12}
                color={isHot ? 'orange' : undefined}
                // className={}
              />
            }
          />
          <p className="text-xs">{data?.temperature?.toFixed(1)} °C</p>
          <TrendIndicator trend={data?.temperatureTrend} />
          /
          <PingSVG
            bgColor={undefined}
            toPing={false}
            children={
              <Droplet
                size={12}
                // color={iconColor}
                // className={}
              />
            }
          />
          <p className="text-xs">{data?.humidity?.toFixed(0)} %</p>
          <TrendIndicator trend={data?.humidityTrend} />
        </Button>
      }
    />
  )
}

function TrendIndicator({
  trend,
  className
}: {
  trend: 'up' | 'down' | 'stable'
  className?: string
}) {
  return (
    <span className={className}>
      {trend === 'up' && <ArrowUp color="lime" size={12} />}
      {trend === 'down' && <ArrowDown color="red" size={12} />}
      {trend === 'stable' && <ArrowRightLeft color="yellow" size={12} />}
    </span>
  )
}

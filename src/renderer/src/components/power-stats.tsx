import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { useMrPingPingService } from '~/libs/hooks/use-mr-ping-ping-service'
import { formatDMeterReadHistoricData, calcKwhAnalytics } from '~/libs/utils/meter-reader'
import { format } from 'date-fns'
import { TooltipInfo } from './tooltip-info'
import { Button } from './ui/button'
import { PingSVG } from './svg-icons'
import { Dot } from 'lucide-react'
import { useNavigate } from 'react-router'

const tenMin = 1000 * 60 * 10
const range = 'hour'
const interval = 24

export function PowerStats() {
  const navigateTo = useNavigate()
  const { getAppRecordedData } = useMrPingPingService()

  const { data: meterReadRaw, isPending } = useQuery({
    queryKey: ['meter-read-stat'],
    queryFn: async () => {
      return await getAppRecordedData({
        appNames: ['meter_reader_api'],
        interval,
        range
      })
    },
    refetchInterval: tenMin,
    staleTime: tenMin
  })

  const { calc: calculatedElectricityData, formattedDate } = useMemo(() => {
    const electricityData = formatDMeterReadHistoricData({ data: meterReadRaw })

    const formattedDate = electricityData?.dateTime
      ? format(electricityData?.dateTime, 'yyyy-MM-dd HH:mm')
      : ''
    const calc = calcKwhAnalytics({
      kwh: electricityData?.kwh,
      kwhHistory: electricityData?.kwhHistory,
      dateTime: formattedDate
    })
    return { calc, formattedDate }
  }, [meterReadRaw])

  if (isPending) return null

  return (
    <TooltipInfo
      content={`Recorded: ${formattedDate}`}
      children={
        <Button
          size={'sm'}
          className="h-6 gap-0"
          variant={'ghost'}
          onClick={() => navigateTo('/smart-home/energy')}
        >
          <p className="text-xs">⚡kWh:</p>
          <p className="text-xs">{calculatedElectricityData?.remainingKwh}</p>
          <PingSVG
            bgColor={true ? 'bg-orange-500' : undefined}
            toPing={false}
            children={
              <Dot
                size={12}
                color={true ? 'orange' : undefined}
                // className={}
              />
            }
          />
          <p className="text-xs">⏳</p>
          <p className="text-xs">{calculatedElectricityData?.daysLeft}</p>
        </Button>
      }
    />
  )
}

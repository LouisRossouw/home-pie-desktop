import { useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { useMrPingPingService } from '~/libs/hooks/use-mr-ping-ping-service'
import { formatDHT11SensorHistoricData } from '~/libs/utils/mr-ping-ping'

import { TemperatureHumidity } from './temperature-humidity'
import { AppRecordedData } from '@shared/types'

const tenMin = 1000 * 60 * 10

export function TempHumStats() {
  const queryClient = useQueryClient()
  const { getAppRecordedData } = useMrPingPingService()

  const interval = 3
  const range = 'hour'

  const cachedTempDataUpstairsRaw = queryClient.getQueryData([
    'temperature-humidity-detail'
  ]) as AppRecordedData[]

  const { data: tempDataUpstairsRaw, isPending } = useQuery({
    queryKey: ['temperature-humidity'],
    queryFn: async () => {
      return await getAppRecordedData({
        appNames: ['temperature_humidity'],
        interval,
        range
      })
    },
    refetchInterval: tenMin,
    staleTime: tenMin,
    initialData: cachedTempDataUpstairsRaw,
    enabled: !cachedTempDataUpstairsRaw
  })

  const cachedTempDataDownStairsRaw = queryClient.getQueryData([
    'temperature-humidity-down-stairs'
  ]) as AppRecordedData[]

  const { data: tempDataDownStairsRaw, isPending: isTempDownStairsPending } = useQuery({
    queryKey: ['temperature-humidity-down-stairs'],
    queryFn: async () => {
      return await getAppRecordedData({
        appNames: ['temperature_humidity_02'],
        interval,
        range
      })
    },
    refetchInterval: tenMin,
    staleTime: tenMin,
    initialData: cachedTempDataDownStairsRaw,
    enabled: !cachedTempDataDownStairsRaw
  })

  const { tempDataUpstairs, tempDataDownstairs } = useMemo(() => {
    return {
      tempDataUpstairs: formatDHT11SensorHistoricData({ data: tempDataUpstairsRaw }),
      tempDataDownstairs: formatDHT11SensorHistoricData({ data: tempDataDownStairsRaw })
    }
  }, [tempDataUpstairsRaw, tempDataDownStairsRaw])

  const diffTemp = (tempDataUpstairs?.temperature - tempDataDownstairs?.temperature)
    .toFixed(1)
    .replace('-', '')

  const diffHumid = (tempDataUpstairs?.humidity - tempDataDownstairs?.humidity)
    .toFixed(1)
    .replace('-', '')

  return (
    <div className="flex items-center justify-center gap-2">
      <>
        {tempDataDownstairs && (
          <TemperatureHumidity
            label="TV:"
            data={tempDataDownstairs}
            isLoading={isTempDownStairsPending}
          />
        )}

        {tempDataUpstairs && (
          <TemperatureHumidity label="PC:" data={tempDataUpstairs} isLoading={isPending} />
        )}

        {tempDataDownstairs && tempDataUpstairs && (
          <div className="flex items-center gap-1">
            <p className="text-xs">Diff:</p>
            <p className="text-xs">{diffTemp} °C /</p>
            <p className="text-xs">{diffHumid} %</p>
          </div>
        )}
      </>
    </div>
  )
}

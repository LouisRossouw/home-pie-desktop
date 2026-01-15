import { useSearchParams } from 'react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { AppRecordedData } from '@shared/types'

import { useMrPingPingService } from '~/libs/hooks/use-mr-ping-ping-service'
import { getAllSearchParams } from '~/libs/utils/search-params'

import { SmartHomeLayout } from './layout'

const tenMin = 1000 * 60 * 10

export function SmartHome() {
  const queryClient = useQueryClient()
  const { getAppRecordedData } = useMrPingPingService()

  const [searchParams] = useSearchParams()
  const SP = getAllSearchParams(searchParams)

  const range = SP.range ?? 'hour'
  const interval = SP.interval ?? 100

  const cachedTemperatureData = queryClient.getQueryData([
    'temperature-humidity-detail'
  ]) as AppRecordedData[]

  const {
    data: temperatureData,
    isPending,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['temperature-humidity-detail'],
    queryFn: async () => {
      return await getAppRecordedData({
        appNames: ['temperature_humidity'],
        range,
        interval
      })
    },
    refetchInterval: tenMin,
    staleTime: tenMin,
    initialData: cachedTemperatureData,
    enabled: !cachedTemperatureData
  })

  const cachedMeterReadRaw = queryClient.getQueryData(['meter_reader_api']) as AppRecordedData[]

  const { data: meterReadRaw, isPending: meterReadIsPending } = useQuery({
    queryKey: ['meter-read-stat', { interval, range }],
    queryFn: async () =>
      await getAppRecordedData({
        appNames: ['meter_reader_api'],
        interval,
        range
      }),
    staleTime: tenMin,
    refetchInterval: tenMin,
    initialData: cachedMeterReadRaw,
    enabled: !cachedMeterReadRaw
  })

  return (
    <SmartHomeLayout
      temperatureData={temperatureData ?? []}
      meterReadRaw={meterReadRaw ?? []}
      isLoading={isPending || isFetching || meterReadIsPending}
      refetch={refetch}
    />
  )
}

import { useQuery } from '@tanstack/react-query'
import { SmartHomeLayout } from './layout'
import { useMrPingPingService } from '~/libs/hooks/use-mr-ping-ping-service'
import { getAllSearchParams } from '~/libs/utils/search-params'
import { useSearchParams } from 'react-router'

const tenMin = 1000 * 60 * 10

export function SmartHome() {
  const { getAppRecordedData } = useMrPingPingService()

  const [searchParams] = useSearchParams()
  const SP = getAllSearchParams(searchParams)

  const range = SP.range ?? 'hour'
  const interval = SP.interval ?? 100

  const { data, isPending, refetch, isFetching } = useQuery({
    queryKey: ['temperature-humidity-detail'],
    queryFn: async () => {
      return await getAppRecordedData({
        appNames: ['temperature_humidity'],
        range,
        interval
      })
    },
    refetchInterval: tenMin,
    staleTime: tenMin
  })

  return <SmartHomeLayout data={data} isLoading={isPending || isFetching} refetch={refetch} />
}

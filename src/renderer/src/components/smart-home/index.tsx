import { useQuery } from '@tanstack/react-query'
import { SmartHomeLayout } from './layout'
import { useMrPingPingService } from '~/libs/hooks/use-mr-ping-ping-service'

const tenMin = 1000 * 60 * 10

export function SmartHome() {
  const { getAppRecordedData } = useMrPingPingService()

  const { data, isPending, refetch } = useQuery({
    queryKey: ['temperature-humidity-detail'],
    queryFn: async () => {
      return await getAppRecordedData({
        appNames: ['temperature_humidity'],
        range: 'hour',
        interval: 100
      })
    },
    refetchInterval: tenMin,
    staleTime: tenMin
  })

  return <SmartHomeLayout data={data} isLoading={isPending} refetch={refetch} />
}

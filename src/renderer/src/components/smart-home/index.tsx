import { useQuery } from '@tanstack/react-query'
import { SmartHomeLayout } from './layout'
import { useMrPingPingService } from '~/libs/hooks/use-mr-ping-ping-service'

const tenMin = 1000 * 60 * 10

export function SmartHome() {
  const { getAppRecordedData } = useMrPingPingService()

  const {
    data: tempData,
    isPending,
    refetch
  } = useQuery({
    queryKey: ['temperature-humidity-detail'],
    queryFn: async () => {
      return await getAppRecordedData({
        appNames: ['temperature_humidity'],
        range: 'hour',
        interval: 1
      })
    },
    refetchInterval: tenMin,
    staleTime: tenMin
  })

  console.log(tempData)

  return <SmartHomeLayout data={tempData} refetch={refetch} />
}

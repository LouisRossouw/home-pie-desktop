import { useQuery } from '@tanstack/react-query'
import { PingPingLayout } from './layout'

const fiveMin = 1000 * 60 * 5

export function PingPing() {
  const { data } = useQuery({
    queryKey: ['mr-ping-ping'],
    queryFn: () => console.log('todo`'),
    refetchInterval: fiveMin,
    staleTime: fiveMin
  })

  console.log(data)

  return <PingPingLayout data={data} />
}

import { useQuery } from '@tanstack/react-query'

import { useMrPingPing } from '~/libs/context/mr-ping-ping'

import { TailNetLayout } from './layout'

const tenMin = 1000 * 60 * 1

export function TailNet() {
  const { getAppStatus } = useMrPingPing()

  const { data, isPending } = useQuery({
    queryKey: ['tailnet-nodes'],
    queryFn: async () => {
      return await getAppStatus({
        appNames: ['headscale']
      })
    },
    refetchInterval: tenMin
  })

  return (
    <TailNetLayout
      data={data ?? []}
      isLoading={isPending}
      refetch={() => console.log('TODO; Refetch')}
    />
  )
}

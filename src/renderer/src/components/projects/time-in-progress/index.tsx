import { useSearchParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'

import { ApiTimeInProgressOverview } from '@shared/types'

import { getAllSearchParams } from '~/libs/utils/search-params'
import { useMrPingPingService } from '~/libs/hooks/use-mr-ping-ping-service'

import { LoadingIndicator } from '~/components/loading-indicator'

import { TimeInProgressLayout } from './layout'

const fiveMin = 1000 * 60 * 5
const tenMin = 1000 * 60 * 10

export function TimeInProgress() {
  const [searchParams] = useSearchParams()
  const { getAppStatus } = useMrPingPingService()

  const SP = getAllSearchParams(searchParams)

  const range = SP.range ?? 'hour'
  const interval = SP.interval ?? 1 // 1 Hour

  const { data, isPending, isFetching, refetch } = useQuery({
    queryKey: ['time-in-progress-overview'],
    queryFn: () => getTimeInProgressOverview({ account: 'time.in.progress', range, interval }),
    refetchInterval: fiveMin,
    staleTime: fiveMin
  })

  // Return the status of the client, and API for time in progress.
  const { data: systemData } = useQuery({
    queryKey: ['system-status', 'time-in-progress'],
    queryFn: async () => {
      return await getAppStatus({ appNames: ['timeinprogress_client', 'timeinprogress_api'] })
    },
    refetchInterval: tenMin,
    staleTime: tenMin
  })

  if (isPending) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <LoadingIndicator />
      </div>
    )
  }

  if (!isPending && !data) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <p>Something went wrong..</p>
      </div>
    )
  }

  const dbTime = data?.dbElapsedTime

  return (
    <TimeInProgressLayout
      data={data}
      systemData={systemData}
      isFetching={isFetching}
      isPending={isPending}
      interval={interval}
      refetch={refetch}
      dbTime={dbTime}
      range={range}
    />
  )
}

async function getTimeInProgressOverview({ account, range, interval }: ApiTimeInProgressOverview) {
  return await window.api.external.apiTimeInProgressOverview({ account, range, interval })
}

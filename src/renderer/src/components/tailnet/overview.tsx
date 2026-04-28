// import { useMemo } from 'react'
import { useMemo } from 'react'
import { useOutletContext } from 'react-router'
import { format, formatDistanceToNow } from 'date-fns'
import { FlattenedAppRecordedData } from '@shared/types'

import { OnlineIndicator } from '~/components/online-indicator'
import { LoadingIndicator } from '~/components/loading-indicator'
// import { getAllSearchParams } from '~/libs/utils/search-params'

// TODO; Get all the cloud servers and the local services from the API, and then fetch all their data
// TODO; Update the backend API to get the data from mr ping ping API; that means we need to add an API to mr ping ping!

export function TailNetOverview() {
  const { data, isLoading, refetch } = useOutletContext<{
    data: FlattenedAppRecordedData[]
    isLoading: Boolean
    refetch: () => void
  }>()

  const tailNetNodes = useMemo(() => {
    const endpoint = data[0]?.endpointsRes?.find((e) => e.endpoint === 'api/v1/node')
    return endpoint?.response?.data.nodes
  }, [data])

  const headScaleHealth = useMemo(() => {
    const endpoint = data[0]?.endpointsRes?.find((e) => e.endpoint === 'api/v1/health')
    return endpoint?.response?.data
  }, [data])

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-96px)] items-center justify-center">
        <LoadingIndicator />
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-96px)] items-center justify-center">
      <div className="flex items-center justify-center text-center w-full">
        <div className="space-y-4 w-150">
          <div>
            <h2>Overview</h2>
            <p className="text-xs">* To show an overview of tailnet network *</p>
          </div>

          <div className="flex items-center gap-2 border-b">
            <OnlineIndicator isOnline={headScaleHealth?.databaseConnectivity} />
            HeadScale VPS Pane
          </div>

          {tailNetNodes.map((d) => {
            const lastSeenFormatted = formatDistanceToNow(d.lastSeen, { addSuffix: true })

            return (
              <div className="flex justify-between gap-4">
                <div className="flex items-center gap-2">
                  <OnlineIndicator isOnline={d.online} />
                  <p>{d.name}</p>
                </div>

                <div className="flex gap-2">
                  <p>{lastSeenFormatted}</p>
                  <p className="px-2">-</p>
                  <p>{format(new Date(d.lastSeen), 'HH:mm')}</p>
                  <p className="px-2">-</p>
                  <p>{format(new Date(d.lastSeen), 'yyyy-MM-dd')}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

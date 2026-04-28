// import { useMemo } from 'react'
import { FlattenedAppRecordedData } from '@shared/types'
import { useOutletContext } from 'react-router'
import { LoadingIndicator } from '~/components/loading-indicator'
// import { getAllSearchParams } from '~/libs/utils/search-params'

// TODO; Get all the cloud servers and the local services from the API, and then fetch all their data
// TODO; Update the backend API to get the data from mr ping ping API; that means we need to add an API to mr ping ping!

export function ServersAndServicesOverview() {
  const { data, isLoading } = useOutletContext<{
    data: FlattenedAppRecordedData[]
    isLoading: Boolean
    refetch: () => void
  }>()

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-96px)] items-center justify-center">
        <LoadingIndicator />
      </div>
    )
  }
  // console.log(data)
  return (
    <div className="flex h-[calc(100vh-96px)] items-center justify-center">
      <div className="flex items-center justify-center text-center w-full">
        <div className="space-y-4">
          <div>
            <h2>Overview</h2>
            <p className="text-xs">* To show an overview of servers & services *</p>
            {/* {JSON.stringify(data, null, 2)} */}
          </div>

          {data.map((d) => {
            return (
              <div className="flex justify-between gap-4">
                <p>{d.appName}</p>
                <p>---</p>
                {/* <p>{JSON.stringify(d.endpointsRes, null, 2)} ++ </p> */}
                <p>{String(d.success)}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

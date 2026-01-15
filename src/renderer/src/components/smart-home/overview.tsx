// import { useMemo } from 'react'
import { useOutletContext, useSearchParams } from 'react-router'

import { AppRecordedData } from '@shared/types'

import { Label } from '~/components/ui/label'
import { LoadingIndicator } from '~/components/loading-indicator'
// import { getAllSearchParams } from '~/libs/utils/search-params'

export function SmartHomeOverview() {
  const { temperatureData, isLoading, refetch } = useOutletContext<{
    temperatureData: AppRecordedData
    meterReadRaw: AppRecordedData[]
    isLoading: Boolean
    refetch: () => void
  }>()

  const [searchParams] = useSearchParams()
  // const SP = getAllSearchParams(searchParams)

  // const range = SP.range ?? 'hour'
  // const interval = SP.interval ?? 100

  // const reshapeData = useMemo(() => {
  //   if (!data) return []

  //   return handleReshapeData({ data })
  // }, [data])

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-96px)] items-center justify-center">
        <LoadingIndicator />
      </div>
    )
  }

  // Temp; wip
  const dataNow = temperatureData[0]?.appStatus[temperatureData[0]?.appStatus.length - 1]
  const tempEndpoint = dataNow.endpointsRes.find((e: any) => e.endpoint === 'temperature')

  return (
    <div className="flex h-[calc(100vh-96px)] items-center justify-center">
      <div className="flex items-center justify-center text-center w-full">
        <div className="space-y-4">
          <div>
            <h2>Overview</h2>
            <p className="text-xs">* To show an overview of smarthome *</p>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-lg text-bold text-foreground">
              Temperature {tempEndpoint?.response?.data?.temperature} °C
            </Label>
          </div>
        </div>
      </div>
    </div>
  )
}

// function handleReshapeData({ data }: { data: any }) {
//   return data[0].appStatus.map((status) => ({
//     date: status.date,
//     temperature:
//       status.endpointsRes.find((e) => e.endpoint === 'temperature')?.response.data?.temperature ??
//       null,
//     humidity:
//       status.endpointsRes.find((e) => e.endpoint === 'humidity')?.response.data?.humidity ?? null
//   }))
// }

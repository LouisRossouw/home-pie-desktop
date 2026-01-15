import { useMemo } from 'react'
import { useOutletContext, useSearchParams } from 'react-router'
import { RefreshCcw } from 'lucide-react'

import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { RangeSelector } from '~/components/range-selector'
import { LoadingIndicator } from '~/components/loading-indicator'
import TemperatureChart from '~/components/charts/temperature-chart'
import { IntervalSelector } from '~/components/interval-selector'
import { getAllSearchParams } from '~/libs/utils/search-params'
import { AppRecordedData } from '@shared/types'

// TODO; Show an overview of all on mr ping pings status, and the status of the projects it monitors.

export function Temperature() {
  const { temperatureData, isLoading, refetch } = useOutletContext<{
    temperatureData: AppRecordedData
    isLoading: Boolean
    refetch: () => void
  }>()

  const [searchParams] = useSearchParams()
  const SP = getAllSearchParams(searchParams)

  const range = SP.range ?? 'hour'
  const interval = SP.interval ?? 100

  const reshapeData = useMemo(() => {
    if (!temperatureData) return []

    return handleReshapeData({ data: temperatureData })
  }, [temperatureData])

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
      <div className="text-center gap-4 w-full h-full px-4">
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center gap-2">
            <Label className="text-lg text-bold text-foreground">
              Temperature {tempEndpoint?.response?.data?.temperature} °C
            </Label>
          </div>

          <div className="flex gap-4 items-center">
            <RangeSelector selected={range} />
            <IntervalSelector currentValue={interval} className="w-32" />
            <Button variant={'outline'} size={'icon'} onClick={refetch}>
              {isLoading ? <LoadingIndicator /> : <RefreshCcw />}
            </Button>
          </div>
        </div>

        <div className="w-full h-full p-4 pb-12">
          <TemperatureChart data={reshapeData} />
        </div>
      </div>
    </div>
  )
}

function handleReshapeData({ data }: { data: AppRecordedData }) {
  return data[0].appStatus.map((status: any) => ({
    date: status.date,
    temperature:
      status.endpointsRes.find((e) => e.endpoint === 'temperature')?.response.data?.temperature ??
      null,
    humidity:
      status.endpointsRes.find((e) => e.endpoint === 'humidity')?.response.data?.humidity ?? null
  }))
}

import { useOutletContext, useSearchParams } from 'react-router'
import { Button } from '../ui/button'
import { LoadingIndicator } from '../loading-indicator'
import { useMemo } from 'react'
import TemperatureChart from '../charts/temperature-chart'
import { RangeSelector } from '../range-selector'
import { IntervalSelector } from '../interval-selector'
import { getAllSearchParams } from '~/libs/utils/search-params'
import { Label } from '../ui/label'
import { RefreshCcw } from 'lucide-react'

// TODO; Show an overview of all on mr ping pings status, and the status of the projects it monitors.

export function SmartHomeOverview() {
  const { data, isLoading, refetch } = useOutletContext<any>()

  const [searchParams] = useSearchParams()
  const SP = getAllSearchParams(searchParams)

  const range = SP.range ?? 'hour'
  const interval = SP.interval ?? 100

  const reshapeData = useMemo(() => {
    if (!data) return []

    return handleReshapeData({ data })
  }, [data])

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-96px)] items-center justify-center">
        <LoadingIndicator />
      </div>
    )
  }

  // Temp; wip
  const dataNow = data[0]?.app_status[data[0]?.app_status.length - 1]
  const tempEndpoint = dataNow.endpoints_res.find((e: any) => e.endpoint === 'temperature')

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

function handleReshapeData({ data }: { data: any }) {
  return data[0].app_status.map((status) => ({
    date: status.date,
    temperature:
      status.endpoints_res.find((e) => e.endpoint === 'temperature')?.response.data?.temperature ??
      null,
    humidity:
      status.endpoints_res.find((e) => e.endpoint === 'humidity')?.response.data?.humidity ?? null
  }))
}

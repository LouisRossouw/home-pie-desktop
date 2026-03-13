import { ReactNode, useMemo } from 'react'
import { Range, AppRecordedData } from '@shared/types'
import { useOutletContext, useSearchParams } from 'react-router'
import { RefreshCcw, Thermometer, Droplets, ThermometerSun, ArrowUp, ArrowDown, Minus } from 'lucide-react'

import { getAllSearchParams } from '~/libs/utils/search-params'

import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { RangeSelector } from '~/components/range-selector'
import { LoadingIndicator } from '~/components/loading-indicator'
import TemperatureChart from '~/components/charts/temperature-chart'
import { IntervalSelector } from '~/components/interval-selector'


// TODO; Show an overview of all on mr ping pings status, and the status of the projects it monitors.

export function Temperature() {
  const { temperatureData, isLoading, refetch } = useOutletContext<{
    temperatureData: AppRecordedData[]
    isLoading: boolean
    refetch: () => void
  }>()

  const [searchParams, setSearchParams] = useSearchParams()
  const SP = getAllSearchParams(searchParams)

  const range = (SP.range as Range) ?? 'hour'
  const interval = Number(SP.interval ?? 100)
  const room = SP.room ?? 'pc'

  const reshapeData = useMemo(() => {
    if (!temperatureData || temperatureData.length === 0) return []

    return handleReshapeData({ data: temperatureData })
  }, [temperatureData])

  const stats = useMemo(() => {
    if (!temperatureData || temperatureData.length === 0) return null

    let allReadings: { date: number; temp: number | null; hum: number | null }[] = []

    temperatureData.forEach((roomData) => {
      roomData.appStatus.forEach((s) => {
        const t = (s.endpointsRes.find((e: any) => e.endpoint === 'temperature')?.response?.data as any)
          ?.temperature
        const h = (s.endpointsRes.find((e: any) => e.endpoint === 'humidity')?.response?.data as any)
          ?.humidity
        allReadings.push({ date: new Date(s.date).getTime(), temp: typeof t === 'number' ? t : null, hum: typeof h === 'number' ? h : null })
      })
    })

    allReadings.sort((a, b) => a.date - b.date)

    const validTemps = allReadings.map((r) => r.temp).filter((t) => t !== null) as number[]
    const validHums = allReadings.map((r) => r.hum).filter((h) => h !== null) as number[]

    if (validTemps.length === 0) return null

    const minTemp = Math.min(...validTemps)
    const maxTemp = Math.max(...validTemps)
    const avgTemp = validTemps.reduce((a, b) => a + b, 0) / validTemps.length

    const minHum = Math.min(...validHums)
    const maxHum = Math.max(...validHums)
    const avgHum = validHums.reduce((a, b) => a + b, 0) / validHums.length

    let comfort = 'Optimal'
    let comfortDesc = 'Conditions are perfect.'
    let comfortColor = 'text-green-500'

    const latestTempArray = validTemps.slice(-Math.min(5, validTemps.length))
    const latestHumArray = validHums.slice(-Math.min(5, validHums.length))
    const currentTemp = latestTempArray.reduce((a, b) => a + b, 0) / latestTempArray.length
    const currentHum = latestHumArray.reduce((a, b) => a + b, 0) / latestHumArray.length

    if (currentTemp > 28) {
      comfort = 'Too Warm'
      comfortDesc = 'Consider turning on a fan or AC.'
      comfortColor = 'text-red-500'
    } else if (currentTemp < 19) {
      comfort = 'Too Cold'
      comfortDesc = 'Might want to turn up the heat.'
      comfortColor = 'text-blue-500'
    } else if (currentHum > 65) {
      comfort = 'Too Humid'
      comfortDesc = 'Air is feeling muggy.'
      comfortColor = 'text-blue-500'
    } else if (currentHum < 30) {
      comfort = 'Too Dry'
      comfortDesc = 'Consider using a humidifier.'
      comfortColor = 'text-orange-500'
    }

    let tempColor = 'text-green-500'
    if (avgTemp > 28) tempColor = 'text-red-500'
    else if (avgTemp > 24) tempColor = 'text-orange-500'
    else if (avgTemp < 19) tempColor = 'text-blue-500'

    let humColor = 'text-green-500'
    if (avgHum > 65) humColor = 'text-blue-500'
    else if (avgHum < 30) humColor = 'text-orange-500'

    const sliceSize = Math.max(1, Math.floor(validTemps.length * 0.1))
    const firstTemps = validTemps.slice(0, sliceSize)
    const lastTemps = validTemps.slice(-sliceSize)
    const firstAvg = firstTemps.reduce((a, b) => a + b, 0) / firstTemps.length
    const lastAvg = lastTemps.reduce((a, b) => a + b, 0) / lastTemps.length

    const tempDiff = lastAvg - firstAvg

    let trendColor = 'text-green-500'
    if (tempDiff > 0.5) trendColor = 'text-red-500'
    else if (tempDiff < -0.5) trendColor = 'text-blue-500'

    return {
      minTemp,
      maxTemp,
      avgTemp,
      minHum,
      maxHum,
      avgHum,
      comfort,
      comfortDesc,
      comfortColor,
      tempColor,
      humColor,
      trendColor,
      tempDiff
    }
  }, [temperatureData])

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-96px)] items-center justify-center">
        <LoadingIndicator />
      </div>
    )
  }

  const roomDisplayName = room === 'both' ? 'Comparison' : room === 'tv' ? 'TV Room' : 'PC Room'

  // Get latest data for display
  const latestData = temperatureData?.map(roomData => {
    const lastStatus = roomData.appStatus[roomData.appStatus.length - 1];
    return {
      appName: roomData.appName,
      temp: (lastStatus?.endpointsRes.find((e: any) => e.endpoint === 'temperature')?.response?.data as any)?.temperature,
      hum: (lastStatus?.endpointsRes.find((e: any) => e.endpoint === 'humidity')?.response?.data as any)?.humidity
    }
  })

  return (
    <div className="flex flex-col h-[calc(100vh-96px)] w-full overflow-y-auto scrollbar-hide pb-12">
      <div className="flex flex-col w-full px-4 pt-2 min-h-max">
        <div className="flex w-full justify-between items-center py-2">
          <div className="flex items-center gap-4">
            <Label className="text-3xl font-bold tracking-tight text-foreground">
              {roomDisplayName}
            </Label>
            <div className="flex gap-4">
              {latestData?.map(d => (
                <div key={d.appName} className="flex flex-col items-start border-l pl-3 border-muted-foreground/30">
                  <span className="text-[10px] uppercase opacity-50 font-bold tracking-wider">{d.appName.includes('02') ? 'TV Room' : 'PC Room'}</span>
                  <span className="text-sm font-bold opacity-80">{d.temp ?? '--'} °C / {d.hum ?? '--'} %</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <div className="flex bg-muted rounded-md p-1">
              <Button
                variant={room === 'pc' ? 'default' : 'ghost'}
                size="sm"
                className="h-7 px-3 text-xs"
                onClick={() => setSearchParams({ ...SP, room: 'pc' })}
              >
                PC
              </Button>
              <Button
                variant={room === 'tv' ? 'default' : 'ghost'}
                size="sm"
                className="h-7 px-3 text-xs"
                onClick={() => setSearchParams({ ...SP, room: 'tv' })}
              >
                TV
              </Button>
              <Button
                variant={room === 'both' ? 'default' : 'ghost'}
                size="sm"
                className="h-7 px-3 text-xs"
                onClick={() => setSearchParams({ ...SP, room: 'both' })}
              >
                Both
              </Button>
            </div>
            <RangeSelector selected={range} />
            <IntervalSelector currentValue={interval} className="w-32" />
            <Button variant={'outline'} size={'icon'} onClick={refetch}>
              {isLoading ? <LoadingIndicator /> : <RefreshCcw />}
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 mb-4">
            <StatCard
              title="Comfort Index"
              value={stats.comfort}
              unit=""
              subtitle={stats.comfortDesc}
              icon={<ThermometerSun className={`size-5 m-1.5 ${stats.comfortColor}`} />}
            />
            <StatCard
              title="Avg Temperature"
              value={stats.avgTemp.toFixed(1)}
              unit="°C"
              subtitle={`Range: ${stats.minTemp.toFixed(1)} - ${stats.maxTemp.toFixed(1)} °C`}
              icon={<Thermometer className={`size-5 m-1.5 ${stats.tempColor}`} />}
            />
            <StatCard
              title="Avg Humidity"
              value={stats.avgHum.toFixed(1)}
              unit="%"
              subtitle={`Range: ${stats.minHum.toFixed(1)} - ${stats.maxHum.toFixed(1)} %`}
              icon={<Droplets className={`size-5 m-1.5 ${stats.humColor}`} />}
            />
            <StatCard
              title="Time Range Trend"
              value={Math.abs(stats.tempDiff).toFixed(1)}
              unit="°C"
              subtitle={stats.tempDiff > 0.5 ? 'Warming up' : stats.tempDiff < -0.5 ? 'Cooling down' : 'Stable temperature'}
              icon={
                stats.tempDiff > 0.5 ? (
                  <ArrowUp className={`size-5 m-1.5 ${stats.trendColor}`} />
                ) : stats.tempDiff < -0.5 ? (
                  <ArrowDown className={`size-5 m-1.5 ${stats.trendColor}`} />
                ) : (
                  <Minus className={`size-5 m-1.5 ${stats.trendColor}`} />
                )
              }
            />
          </div>
        )}

        <div className="w-full min-h-[400px] flex-grow pt-4">
          <TemperatureChart data={reshapeData} range={range} />
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  unit,
  subtitle,
  icon
}: {
  title: string
  value: string | number
  unit: string
  subtitle: string
  icon: ReactNode
}) {
  return (
    <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md flex flex-col gap-1 relative overflow-hidden text-left">
      <div className="flex justify-between items-start z-10">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</span>
        <div className=" rounded-md bg-muted/50 border shadow-sm">
          {icon}
        </div>
      </div>
      <div className="mt-1 flex items-baseline gap-1 z-10">
        <span className="text-3xl font-bold tracking-tight">{value}</span>
        {unit && <span className="text-sm font-medium text-muted-foreground">{unit}</span>}
      </div>
      <span className="text-xs text-muted-foreground z-10 mt-1">{subtitle}</span>
      <div className="absolute -right-4 -bottom-4 opacity-[0.03] transform scale-[1.5] pointer-events-none z-0">
        {icon}
      </div>
    </div>
  )
}

function handleReshapeData({ data }: { data: AppRecordedData[] }) {
  if (data.length === 1) {
    return data[0].appStatus.map((status: any) => ({
      date: status.date,
      temperature:
        (status.endpointsRes.find((e: any) => e.endpoint === 'temperature')?.response.data as any)?.temperature ??
        null,
      humidity:
        (status.endpointsRes.find((e: any) => e.endpoint === 'humidity')?.response.data as any)?.humidity ?? null
    }))
  }

  // Handle multiple rooms (both)
  const combinedMap = new Map<string, any>();

  data.forEach((roomData) => {
    const isTV = roomData.appName.includes('02');
    roomData.appStatus.forEach((status: any) => {
      // Round to nearest minute to help align data points from different apps
      const date = new Date(status.date);
      date.setSeconds(0, 0);
      const dateKey = date.toISOString();

      if (!combinedMap.has(dateKey)) {
        combinedMap.set(dateKey, { date: dateKey, temperature_pc: null, temperature_tv: null });
      }
      const entry = combinedMap.get(dateKey);
      const temp = (status.endpointsRes.find((e: any) => e.endpoint === 'temperature')?.response.data as any)?.temperature;

      if (isTV) {
        entry.temperature_tv = temp;
      } else {
        entry.temperature_pc = temp;
      }
    });
  });

  return Array.from(combinedMap.values()).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

import { format } from 'date-fns'
import { ReactNode, useMemo } from 'react'
import { useOutletContext } from 'react-router'
import { ArrowUp, Zap, Clock, AlertTriangle, Battery } from 'lucide-react'

import { AppRecordedData } from '@shared/types'

import {
  formatDMeterReadHistoricData,
  calcKwhAnalytics,
  HourlyUsage
} from '~/libs/utils/meter-reader'
import { cn } from '~/libs/utils/cn'

import {
  EnergyBurnKwhChart,
  EnerygyRemainingKwhChart
} from '~/components/charts/energy-line-chart-compact'
import { Badge } from '~/components/ui/badge'
import { LoadingIndicator } from '~/components/loading-indicator'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

const tenMin = 1000 * 60 * 10
const range = 'hour'
const interval = 24

export function Energy() {
  const { meterReadRaw, isLoading } = useOutletContext<{
    meterReadRaw: AppRecordedData[]
    isLoading: boolean
  }>()

  const calculatedElectricityData = useMemo(() => {
    const electricityData = formatDMeterReadHistoricData({ data: meterReadRaw, interval })
    return calcKwhAnalytics({
      kwh: electricityData?.kwh,
      kwhHistory: electricityData?.kwhHistory
    })
  }, [meterReadRaw])

  const reversedAnomalies = useMemo(
    () => [...calculatedElectricityData.anomalies].reverse(),
    [calculatedElectricityData.anomalies]
  )

  const reversedHourlyUsage = useMemo(
    () => [...calculatedElectricityData.hourlyUsage].reverse(),
    [calculatedElectricityData.hourlyUsage]
  )

  if (isLoading || !calculatedElectricityData)
    return (
      <div className="flex w-full h-[400px] items-center justify-center">
        <LoadingIndicator />
      </div>
    )

  return (
    <div className="flex flex-col gap-4 p-4 mx-auto w-full h-[calc(100%-100px)] overflow-y-scroll scrollbar-hide">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Energy Dashboard</h1>
          <p className="text-muted-foreground ">
            Real-time monitoring and analytics for your electricity consumption.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-yellow-400/10 text-yellow-600 px-4 py-2 rounded-full border border-yellow-400/20 text-sm font-medium">
          <Zap className="size-4 animate-pulse" />
          System Active: {format(new Date(), 'HH:mm')}
        </div>
      </div>

      {/* NATURAL LANGUAGE SUMMARY */}
      <Card className="bg-transparent border-primary/20  relative">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Zap className="size-32 text-primary" />
        </div>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4 relative">
            <div className="flex-1">
              <h2 className="text-lg font-semibold flex items-center gap-2  text-primary">
                <Clock className="size-5" /> Usage Projection
              </h2>
              <p className="text-2xl font-medium leading-tight">
                Your electricity is estimated to last for approximately{' '}
                <span className="text-primary font-bold">
                  {calculatedElectricityData.daysLeft.toFixed(1)} days
                </span>
                .
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                Based on your current burn rate of {calculatedElectricityData.burnRateKwhPerHour.toFixed(3)} kWh/h.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="text-center p-3 rounded-xl bg-primary/5 border border-primary/10   min-w-[120px]">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Remaining</p>
                <p className="text-2xl font-bold">{calculatedElectricityData.remainingKwh.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">kWh</span></p>
              </div>
              <div className="text-center p-3 rounded-xl bg-primary/5 border border-primary/10  min-w-[120px]">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Average</p>
                <p className="text-2xl font-bold">{calculatedElectricityData.projectedDailyUse.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">/day</span></p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ModernStatCard
          title="Current Reserve"
          icon={<Battery className="size-5" />}
          value={calculatedElectricityData.remainingKwh}
          unit="kWh"
          description="Available units"
          color="yellow"
          chart={<EnerygyRemainingKwhChart data={calculatedElectricityData.cleanedHistory} />}
        />

        <ModernStatCard
          title="Consumption Rate"
          icon={<Zap className="size-5" />}
          value={calculatedElectricityData.burnRateKwhPerHour}
          unit="kWh/h"
          description="Average hourly burn"
          color="red"
          chart={<EnergyBurnKwhChart data={calculatedElectricityData.hourlyUsage} />}
        />

        <ModernStatCard
          title="Time Remaining"
          icon={<Clock className="size-5" />}
          value={calculatedElectricityData.hoursLeft}
          unit="hours"
          description={`${calculatedElectricityData.daysLeft.toFixed(2)} days left`}
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
        {/* HOURLY USAGE */}
        <Card className="lg:col-span-2 border-primary/10 bg-transparent shadow-md">
          <CardHeader className="bg-primary/5 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg text-primary">
              <Clock className="size-5" /> Hourly Consumption Log
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <HourlyUsageBreakdown
              hourlyUsage={reversedHourlyUsage}
              medianTypicalUsage={calculatedElectricityData.medianTypicalUsage}
            />
          </CardContent>
        </Card>

        {/* ANOMALIES */}
        <div className="space-y-6">
          {reversedAnomalies?.length > 0 ? (
            <Card className="border-red-500/20 bg-transparent   shadow-lg shadow-red-500/5 overflow-hidden">
              <CardHeader className="bg-red-500/5 pb-4 border-b border-red-500/10">
                <CardTitle className="flex items-center gap-2 text-red-600 text-lg">
                  <AlertTriangle className="size-5" />
                  {reversedAnomalies?.length} Anomalies
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 max-h-[500px] overflow-y-auto">
                <div className="space-y-3">
                  {reversedAnomalies.map((a, i) => (
                    <div key={i} className="bg-red-500/5 border border-red-500/10 p-3 rounded-xl transition-all hover:bg-red-500/20">
                      <p className="font-semibold text-red-700 text-sm leading-tight">{a.reason}</p>
                      {a.reading && (
                        <p className="text-xs text-red-600/70 mt-1 font-mono">
                          {a.reading.kwh} kWh at {format(new Date(a.reading.date), 'MMM d, HH:mm')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-green-500/20 bg-transparent   h-full min-h-[200px]">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                <div className="size-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4 border border-green-500/20">
                  <Zap className="size-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-green-800">No Anomalies Found</h3>
                <p className="text-sm text-green-700/60 mt-1">
                  Your energy usage patterns look stable and consistent.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function HourlyUsageBreakdown({
  hourlyUsage,
  medianTypicalUsage
}: {
  hourlyUsage: HourlyUsage[]
  medianTypicalUsage: number
}): JSX.Element {
  return (
    <div className="max-h-[600px] overflow-y-auto divide-y divide-primary/10">
      {hourlyUsage.map((entry, index) => {
        const isHigh = entry.kwhPerHour > medianTypicalUsage * 1.5

        return (
          <div
            key={index}
            className={cn(
              'p-4 flex items-center justify-between transition-colors hover:bg-primary/5 group',
              isHigh && 'bg-red-500/[0.03]'
            )}
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "size-10 rounded-full flex items-center justify-center shrink-0 border transition-transform group-hover:scale-110",
                isHigh ? "bg-red-100/50 border-red-200 text-red-600" : "bg-primary/10 border-primary/20 text-primary"
              )}>
                {isHigh ? <ArrowUp className="size-5" /> : <Clock className="size-5" />}
              </div>
              <div>
                <p className="font-bold text-sm">
                  {format(new Date(entry.from), 'HH:mm')} <span className="text-muted-foreground font-normal mx-1">→</span> {format(new Date(entry.to), 'HH:mm')}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  Duration: {entry.hours.toFixed(2)} hours
                </p>
              </div>
            </div>

            <div className="text-right flex flex-col items-end gap-1">
              <p className="font-mono font-bold text-lg leading-none">
                {entry.kwhPerHour.toFixed(3)} <span className="text-[10px] font-normal text-muted-foreground tracking-tight uppercase">kWh/h</span>
              </p>
              {isHigh ? (
                <Badge variant="destructive" className="h-5 px-1.5 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  High Usage
                </Badge>
              ) : (
                <Badge variant="outline" className="h-5 px-1.5 text-[10px] uppercase tracking-wider bg-green-500/10 text-green-700 border-green-500/20 shadow-sm">
                  Normal
                </Badge>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ModernStatCard({
  title,
  icon,
  value,
  unit,
  description,
  color,
  chart
}: {
  title: string
  icon: ReactNode
  value: number
  unit: string
  description?: string
  color: 'yellow' | 'red' | 'blue'
  chart?: ReactNode
}): JSX.Element {
  const colorMap = {
    yellow: 'border-yellow-500/20 text-yellow-500 hover:border-yellow-500/40 shadow-yellow-500/5',
    red: 'border-red-500/20 text-red-500 hover:border-red-500/40 shadow-red-500/5',
    blue: 'border-blue-500/20 text-blue-500 hover:border-blue-500/40 shadow-blue-500/5'
  }

  const iconBgMap = {
    yellow: 'bg-yellow-500/10',
    red: 'bg-red-500/10',
    blue: 'bg-blue-500/10'
  }

  return (
    <Card className={cn("rounded-2xl border bg-transparent   transition-all hover:shadow-xl overflow-hidden shadow-sm", colorMap[color])}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xs font-bold uppercase tracking-[0.1em] opacity-70 leading-none">{title}</CardTitle>
        <div className={cn("p-2 rounded-xl border border-white/10 shadow-inner", iconBgMap[color])}>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-black tracking-tighter">
              {isFinite(value) ? value.toFixed(2) : '--'}
            </span>
            <span className="text-sm font-bold opacity-60 uppercase tracking-tight">{unit}</span>
          </div>
          {description && <p className="text-[10px] font-bold opacity-50 uppercase tracking-wide flex items-center gap-1">
            {description}
          </p>}
        </div>
        {chart && <div className="mt-5 -mx-6 -mb-6 bg-white/[0.03] border-t border-white/10 h-24">
          {chart}
        </div>}
      </CardContent>
    </Card>
  )
}



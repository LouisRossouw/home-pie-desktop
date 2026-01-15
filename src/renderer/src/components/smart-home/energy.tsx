import { format } from 'date-fns'
import { ReactNode, useMemo } from 'react'
import { useOutletContext } from 'react-router'
import { ArrowDown, ArrowUp, Zap, Clock, AlertTriangle, Battery } from 'lucide-react'

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
} from '~/components/charts/test-line-chart-compact'
import { Badge } from '~/components/ui/badge'
import { LoadingIndicator } from '~/components/loading-indicator'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

const tenMin = 1000 * 60 * 10
const range = 'hour'
const interval = 24

export function Energy() {
  const { meterReadRaw, isLoading } = useOutletContext<{
    meterReadRaw: AppRecordedData[]
    isLoading: Boolean
  }>()

  // const queryClient = useQueryClient()
  // const { getAppRecordedData } = useMrPingPingService()

  // TODO; Might have to move this up to index.
  const calculatedElectricityData = useMemo(() => {
    const electricityData = formatDMeterReadHistoricData({ data: meterReadRaw, interval })
    const calc = calcKwhAnalytics({
      kwh: electricityData?.kwh,
      kwhHistory: electricityData?.kwhHistory
    })
    return calc
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
      <div className="flex w-full h-full items-center justify-center">
        <LoadingIndicator />
      </div>
    )

  return (
    <div className="grid gap-4 p-4">
      <h1 className="text-2xl font-semibold flex items-center gap-2">
        <Zap className="size-5 text-yellow-400" /> Electricity Usage Overview
      </h1>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <EnergyStatDisplay
          title={
            <>
              <Battery className="size-5 text-green-500" />
              Remaining Units
            </>
          }
          subTitle="kWh available"
          value={calculatedElectricityData.remainingKwh}
          chart={<EnerygyRemainingKwhChart data={calculatedElectricityData.cleanedHistory} />}
        />

        <EnergyStatDisplay
          title={
            <>
              <Zap className="size-5 text-red-400" />
              Burn Rate
            </>
          }
          subTitle={'kWh per hour'}
          value={calculatedElectricityData.burnRateKwhPerHour}
          chart={<EnergyBurnKwhChart data={calculatedElectricityData.hourlyUsage} />}
        />

        <EnergyStatDisplay
          title={
            <>
              <Clock className="size-5 text-blue-400" />
              Time Left
            </>
          }
          subTitle={`${calculatedElectricityData.daysLeft.toFixed(2)} days left`}
          value={calculatedElectricityData.hoursLeft}
        />
      </div>

      {/* HOURLY USAGE */}
      <Card className="rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="size-5 text-purple-400" /> Hourly Usage Breakdown
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <HourlyUsageBreakdown
              hourlyUsage={reversedHourlyUsage}
              medianTypicalUsage={calculatedElectricityData.medianTypicalUsage}
            />
            {/* ANOMALIES */}
            <div className="h-70 overflow-y-auto">
              {reversedAnomalies?.length > 0 && (
                <Card className="rounded-lg shadow ">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                      <AlertTriangle className="size-5" />
                      {reversedAnomalies?.length} Anomalies Detected
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      {reversedAnomalies.map((a, i) => (
                        <div key={i} className="border p-4 rounded-xl">
                          <p className="font-medium text-destructive">{a.reason}</p>
                          {a.reading && (
                            <p className="text-sm text-muted-foreground">
                              Reading:{' '}
                              {`${a.reading.kwh} kWh at ${format(new Date(a.reading.date), 'yyyy-MM-dd HH:mm')}`}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function HourlyUsageBreakdown({
  hourlyUsage,
  medianTypicalUsage
}: {
  hourlyUsage: HourlyUsage[]
  medianTypicalUsage: number
}) {
  return (
    <div className="h-70 grid gap-4 overflow-y-auto">
      {hourlyUsage.map((entry, index) => {
        const isHigh = entry.kwhPerHour > medianTypicalUsage * 1.5

        return (
          <div
            key={index}
            className={cn(
              'p-3 border rounded-xl flex items-center justify-between',
              isHigh && ' border-destructive'
            )}
          >
            <div>
              <p className="font-semibold text-sm">
                {format(new Date(entry.from), 'HH:mm')} → {format(new Date(entry.to), 'HH:mm')}
              </p>
              <p className="text-xs text-muted-foreground">{entry.hours.toFixed(2)} hours</p>
            </div>

            <div className="text-right">
              <p className="font-semibold">{entry.kwhPerHour.toFixed(2)} kWh/h</p>
              {isHigh ? (
                <Badge variant="destructive" className="text-xs flex items-center gap-1">
                  <ArrowUp className="size-3" /> High
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  <ArrowDown className="size-3" /> Normal
                </Badge>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function EnergyStatDisplay({
  title,
  subTitle,
  value,
  chart
}: {
  title: ReactNode
  subTitle: string
  value: number
  chart?: ReactNode
}) {
  return (
    <Card className="rounded-lg shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <div>
          <p className="text-4xl font-bold">{value.toFixed(2)}</p>
          {subTitle && <p className="text-muted-foreground text-sm">{subTitle}</p>}
        </div>
        {chart && chart}
      </CardContent>
    </Card>
  )
}

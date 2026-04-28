import { useMemo } from 'react'
import { useOutletContext, useSearchParams } from 'react-router'
import { AppRecordedData } from '@shared/types'
import { EnergyDetailView } from '~/components/smart-home/energy-detail-view'
import { EnergyTimeRemainingChartDetailed } from '~/components/charts/energy-line-chart-detailed'
import { formatDMeterReadHistoricData, calcKwhAnalytics } from '~/libs/utils/meter-reader'
import { getAllSearchParams } from '~/libs/utils/search-params'

export default function EnergyTimeRemainingDetailRoute() {
  const { meterReadRaw, isLoading, refetch } = useOutletContext<{
    meterReadRaw: AppRecordedData[]
    isLoading: boolean
    refetch: () => void
  }>()

  const [searchParams] = useSearchParams()
  const SP = getAllSearchParams(searchParams)
  const interval = Number(SP.interval ?? 24)

  const analytics = useMemo(() => {
    const electricityData = formatDMeterReadHistoricData({ data: meterReadRaw, interval })
    return calcKwhAnalytics({
      kwh: electricityData?.kwh,
      kwhHistory: electricityData?.kwhHistory
    })
  }, [meterReadRaw, interval])

  // Map cleanup history to a trend of projected time remaining
  // This is a bit estimated as burnRate changes over time.
  // For a detail view, showing the trend of remaining units over time is usually what's meant by "Time Remaining" chart
  // but if we want actual "hours left" history, we'd need to calculate it for each point in history.

  const timeTrend = useMemo(() => {
    // For simplicity and detail, we show the same trend as reserve but labeled as time
    // Or we can try to compute a rolling hoursLeft.
    // Let's just show the history of cleaned readings but with units in hours based on CURRENT burn rate.
    const currentBurnRate = analytics.burnRateKwhPerHour || 1
    return analytics.cleanedHistory.map((h) => ({
      date: h.date,
      hoursLeft: h.kwh / currentBurnRate
    }))
  }, [analytics.cleanedHistory, analytics.burnRateKwhPerHour])

  return (
    <EnergyDetailView
      title="Time Remaining"
      isLoading={isLoading}
      refetch={refetch}
      currentValue={analytics.hoursLeft}
      unit="hours"
      description={`${analytics.daysLeft.toFixed(2)} days left`}
    >
      <EnergyTimeRemainingChartDetailed data={timeTrend} />
    </EnergyDetailView>
  )
}

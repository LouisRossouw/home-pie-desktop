import { useMemo } from 'react'
import { useOutletContext, useSearchParams } from 'react-router'
import { AppRecordedData } from '@shared/types'
import { EnergyDetailView } from '~/components/smart-home/energy-detail-view'
import { EnerygyRemainingKwhChartDetailed } from '~/components/charts/energy-line-chart-detailed'
import { formatDMeterReadHistoricData, calcKwhAnalytics } from '~/libs/utils/meter-reader'
import { getAllSearchParams } from '~/libs/utils/search-params'

export default function EnergyReserveDetailRoute() {
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

  return (
    <EnergyDetailView
      title="Current Reserve"
      isLoading={isLoading}
      refetch={refetch}
      currentValue={analytics.remainingKwh}
      unit="kWh"
      description="Available units"
    >
      <EnerygyRemainingKwhChartDetailed data={analytics.cleanedHistory} />
    </EnergyDetailView>
  )
}

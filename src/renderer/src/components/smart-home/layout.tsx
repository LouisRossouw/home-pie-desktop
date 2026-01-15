import { Outlet } from 'react-router'

import { AppRecordedData } from '@shared/types'

// TODO; Layout

export function SmartHomeLayout({
  temperatureData,
  meterReadRaw,
  isLoading,
  refetch
}: {
  temperatureData: AppRecordedData[]
  meterReadRaw: AppRecordedData[]
  isLoading: boolean
  refetch: () => void
}) {
  return <Outlet context={{ temperatureData, meterReadRaw, isLoading, refetch }} />
}

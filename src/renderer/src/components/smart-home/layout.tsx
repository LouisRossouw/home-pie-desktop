import { Outlet } from 'react-router'

import { AppRecordedData } from '@shared/types'

// TODO; Layout

export function SmartHomeLayout({
  temperatureData,
  meterReadRaw,
  isLoading,
  isFetching,
  refetch
}: {
  temperatureData: AppRecordedData[]
  meterReadRaw: AppRecordedData[]
  isLoading: boolean
  isFetching?: boolean
  refetch: () => void
}) {
  return (
    <div className="w-full h-[calc(100vh-100px)]">
      <Outlet context={{ temperatureData, meterReadRaw, isLoading, isFetching, refetch }} />
    </div>
  )
}

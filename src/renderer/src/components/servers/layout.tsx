import { FlattenedAppRecordedData } from '@shared/types'
import { Outlet } from 'react-router'

// TODO; Layout

export function ServersAndServicesLayout({
  data,
  isLoading,
  refetch
}: {
  data: FlattenedAppRecordedData[]
  isLoading: boolean
  refetch: () => void
}) {
  return <Outlet context={{ data, isLoading, refetch }} />
}

import { useContext, createContext, PropsWithChildren } from 'react'
import { ApiMrPingPingStatus, FlattenedAppRecordedData, Range } from '@shared/types'

import { useMrPingPingService } from '~/libs/hooks/use-mr-ping-ping-service'
import { components } from '@shared/lib/generated/api'

type MrPingPing = {
  status?: ApiMrPingPingStatus
  handleGetStatus: () => Promise<void>
  getAppStatus: ({ appNames }: { appNames: string[] }) => Promise<FlattenedAppRecordedData[]>
  getAppRecordedData: ({
    appNames,
    range,
    interval
  }: {
    appNames: string[]
    range: Range
    interval: number
  }) => Promise<
    {
      appName: string
      appStatus: components['schemas']['AppStatus'][]
    }[]
  >
  getPingPingAppsConfig: () => Promise<void>
}

export const MrPingPingContext = createContext<MrPingPing>({
  status: undefined,
  handleGetStatus: async () => {},
  getAppStatus: async () => [],
  getAppRecordedData: async () => [],
  getPingPingAppsConfig: async () => []
})

export const MrPingPingContextProvider = ({ children }: PropsWithChildren) => {
  const pingService = useMrPingPingService()

  return (
    <MrPingPingContext.Provider
      value={{
        ...pingService
      }}
    >
      {children}
    </MrPingPingContext.Provider>
  )
}

export const useMrPingPing = () => useContext(MrPingPingContext)

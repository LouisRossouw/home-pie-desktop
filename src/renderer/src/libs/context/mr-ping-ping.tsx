import { useContext, createContext, PropsWithChildren } from 'react'
import { useMrPingPingService } from '../hooks/use-mr-ping-ping-service'
import { ApiMrPingPingStatus } from '@shared/types'

type MrPingPing = {
  status?: ApiMrPingPingStatus
  handleGetStatus: () => Promise<void>
}

export const MrPingPingContext = createContext<MrPingPing>({
  status: undefined,
  handleGetStatus: async () => {}
})

export const MrPingPingContextProvider = ({ children }: PropsWithChildren) => {
  const { status, handleGetStatus } = useMrPingPingService()

  return (
    <MrPingPingContext.Provider
      value={{
        status,
        handleGetStatus
      }}
    >
      {children}
    </MrPingPingContext.Provider>
  )
}

export const useMrPingPing = () => useContext(MrPingPingContext)

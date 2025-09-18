import { useContext, createContext, PropsWithChildren } from 'react'
import { UseSession, useSession } from '../hooks/use-session'
import { generatedUserId } from '@shared/constants'

const sessionInit: UseSession = {
  session: undefined,
  setSession: () => undefined,
  getSession: async () => undefined,
  getAllExistingSessionIds: async () => ({ ids: [], nextAvailableId: generatedUserId }),
  getSessionByUserEmail: async () => undefined,
  updateAccessSession: async () => false,
  updateUserSession: async () => false,
  loadUserSession: async () => undefined,
  switchUserSession: async () => undefined,
  deleteUserSessions: async () => false
}

type SessionContextType = {} & UseSession

export const SessionContext = createContext<SessionContextType>({
  ...sessionInit
})

export const SessionContextProvider = ({ children }: PropsWithChildren) => {
  const session = useSession()

  return (
    <SessionContext.Provider
      value={{
        ...session
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export const useAppSession = () => useContext(SessionContext)

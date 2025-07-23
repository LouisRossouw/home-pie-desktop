import { createContext, PropsWithChildren, useContext, useState } from 'react'

import { defaultDotSquadColour } from '@shared/dot-squad/constants'

import { useDotSquad, UseDotSquadType } from '~/libs/hooks/use-dot-squad'
import { type UseAppSettings, type AppSetting, useAppSettings } from '~/libs/hooks/use-app-settings'

const appSettingsInit: UseAppSettings = {
  appSettings: undefined,
  setAppSettings: () => {},
  getAppSetting: async () => '',
  updateAppSettings: async () => false,
  getAllAppSettings: async () => ({}) as AppSetting
}

const dotSquadInit = {
  dotA: defaultDotSquadColour,
  dotB: defaultDotSquadColour,
  dotC: defaultDotSquadColour,
  handleUpdateDotSquad: () => ({})
}

type AppExtensions = UseAppSettings & UseDotSquadType

type AppContextType = {
  isAuth: boolean
  setIsAuth: (v: boolean) => void
} & AppExtensions

export const AppContext = createContext<AppContextType>({
  isAuth: false,
  setIsAuth: () => {},
  ...dotSquadInit,
  ...appSettingsInit
})

export const AppContextProvider = ({ children }: PropsWithChildren) => {
  const appSettings = useAppSettings()
  const dotSquad = useDotSquad()

  const [isAuth, setIsAuth] = useState(false)

  return (
    <AppContext.Provider
      value={{
        isAuth,
        setIsAuth,
        ...dotSquad,
        ...appSettings
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)

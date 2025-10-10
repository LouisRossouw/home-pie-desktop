import {
  useRef,
  useState,
  createRef,
  useContext,
  createContext,
  PropsWithChildren,
  MutableRefObject
} from 'react'

import {
  useAppSettings,
  type AppSettings,
  type UseAppSettings
} from '~/libs/hooks/use-app-settings'
import { UseAppWindow, useAppWindow } from '~/libs/hooks/use-app-window'
import { UserSettings, UseUserSettings, useUserSettings } from '~/libs/hooks/use-user-settings'

const appWindowInit: UseAppWindow = {
  windowControl: () => undefined,
  resizeApp: () => undefined,
  resetWindow: () => undefined
}

const appSettingsInit: UseAppSettings = {
  appSettings: undefined,
  setAppSettings: () => {},
  getAppSetting: async () => '',
  updateAppSettings: async () => false,
  getAllAppSettings: async () => ({}) as AppSettings
}

const userSettingsInit: UseUserSettings = {
  userSettings: undefined,
  setUserSettings: () => {},
  getUserSetting: async () => '',
  updateUserSettings: async () => false,
  getAllUserSettings: async () => ({}) as UserSettings,
  applyUserSettingsToApp: async () => false,
  deleteUserSettings: async () => false
}

type AppExtensions = UseAppWindow & UseAppSettings & UseUserSettings

type AppContextType = {
  isAuth: boolean
  setIsAuth: (v: boolean) => void
  startRenderTime: MutableRefObject<number | null>
} & AppExtensions

export const AppContext = createContext<AppContextType>({
  isAuth: false,
  setIsAuth: () => {},
  startRenderTime: createRef(),
  ...appWindowInit,
  ...appSettingsInit,
  ...userSettingsInit
})

export const AppContextProvider = ({ children }: PropsWithChildren) => {
  const coreSettings = useAppSettings()
  const userSettings = useUserSettings({ userId: coreSettings.appSettings?.activeAccountId })
  const appWindow = useAppWindow(coreSettings)

  const startRenderTime = useRef(null)

  const [isAuth, setIsAuth] = useState(false)

  return (
    <AppContext.Provider
      value={{
        isAuth,
        setIsAuth,
        startRenderTime,
        ...appWindow,
        ...coreSettings,
        ...userSettings
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)

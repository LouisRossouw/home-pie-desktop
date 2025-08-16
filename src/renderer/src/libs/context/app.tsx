import {
  useRef,
  useState,
  createRef,
  useContext,
  createContext,
  PropsWithChildren,
  MutableRefObject
} from 'react'

// import { defaultDotSquadColour } from '@shared/dot-squad/constants'

import { UseAppWindow, useAppWindow } from '~/libs/hooks/use-app-window'
// import { useDotSquad, UseDotSquadType } from '~/libs/hooks/use-dot-squad'
import { type UseAppSettings, type AppSetting, useAppSettings } from '~/libs/hooks/use-app-settings'

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
  getAllAppSettings: async () => ({}) as AppSetting
}

// ***
// TODO; Remove dot squad from app context. causes re-renderings.
// ***

// const dotSquadInit = {
//   dotA: defaultDotSquadColour,
//   dotB: defaultDotSquadColour,
//   dotC: defaultDotSquadColour,
//   handleUpdateDotSquad: () => ({})
// }

type AppExtensions = UseAppWindow & UseAppSettings

type AppContextType = {
  isAuth: boolean
  setIsAuth: (v: boolean) => void
  startRenderTime: MutableRefObject<number | null>
} & AppExtensions

export const AppContext = createContext<AppContextType>({
  isAuth: false,
  setIsAuth: () => {},
  startRenderTime: createRef(),
  // ...dotSquadInit,
  ...appWindowInit,
  ...appSettingsInit
})

export const AppContextProvider = ({ children }: PropsWithChildren) => {
  const appSettings = useAppSettings()
  const appWindow = useAppWindow(appSettings)
  // const dotSquad = useDotSquad()

  const startRenderTime = useRef(null)

  const [isAuth, setIsAuth] = useState(false)

  return (
    <AppContext.Provider
      value={{
        isAuth,
        setIsAuth,
        startRenderTime,
        // ...dotSquad,
        ...appWindow,
        ...appSettings
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)

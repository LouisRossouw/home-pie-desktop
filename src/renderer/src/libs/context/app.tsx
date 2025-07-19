import { createContext, PropsWithChildren, useContext, useState } from 'react'

import { Frame } from '~/libs/dot-squad'
import { useDotSquad } from '~/libs/hooks/use-dot-squad'
import { defaultDotSquadColour } from '~/libs/dot-squad/constants'

type AppContextType = {
  isAuth: boolean
  setIsAuth: (v: boolean) => void
  dotA: string
  dotB: string
  dotC: string
  handleUpdateDotSquad: (v: Frame[]) => void
}

export const AppContext = createContext<AppContextType>({
  isAuth: false,
  setIsAuth: () => {},
  dotA: defaultDotSquadColour,
  dotB: defaultDotSquadColour,
  dotC: defaultDotSquadColour,
  handleUpdateDotSquad: () => {}
})

export const AppContextProvider = ({ children }: PropsWithChildren) => {
  const dotSquad = useDotSquad()

  const [isAuth, setIsAuth] = useState(false)

  return (
    <AppContext.Provider
      value={{
        isAuth,
        setIsAuth,
        ...dotSquad
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)

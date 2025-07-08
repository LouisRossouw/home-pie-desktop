import { createContext, PropsWithChildren, useContext, useState } from 'react'

type AppContextType = {
  isAuth: boolean
  setIsAuth: (v: boolean) => void
}

export const AppContext = createContext<AppContextType>({
  isAuth: false,
  setIsAuth: () => {}
})

export const AppContextProvider = ({ children }: PropsWithChildren) => {
  const [isAuth, setIsAuth] = useState(false)

  return (
    <AppContext.Provider
      value={{
        isAuth,
        setIsAuth
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)

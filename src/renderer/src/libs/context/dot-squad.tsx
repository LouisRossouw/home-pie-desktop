import { useContext, createContext, PropsWithChildren } from 'react'
import { useDotSquad, UseDotSquadType } from '../hooks/use-dot-squad'
import { defaultDotSquadColour } from '@shared/constants'

const DotSquadContext = createContext<UseDotSquadType>({
  dotA: defaultDotSquadColour,
  dotB: defaultDotSquadColour,
  dotC: defaultDotSquadColour,
  handleUpdateDotSquad: () => ({})
})

export const DotSquadContextProvider = ({ children }: PropsWithChildren) => {
  const dotSquad = useDotSquad()

  return (
    <DotSquadContext.Provider
      value={{
        ...dotSquad
      }}
    >
      {children}
    </DotSquadContext.Provider>
  )
}

export const useDotSquadTest = () => useContext(DotSquadContext)

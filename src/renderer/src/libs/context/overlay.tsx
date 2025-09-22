import { createContext, PropsWithChildren, useContext, useEffect } from 'react'
import { defaultOverlay, OverlaySettings, useOverlay } from '~/libs/hooks/use-overlay'

type OverlayContextType = {
  open: boolean
  setOpen: (v: boolean) => void
  closeOverlay: () => void
  overlay: OverlaySettings
  showOverlay: (overlay: OverlaySettings) => void
}

export const OverlayContext = createContext<OverlayContextType>({
  open: false,
  setOpen: () => {},
  closeOverlay: () => {},
  overlay: defaultOverlay,
  showOverlay: (overlay: OverlaySettings) => {
    overlay
  }
})

const OverlayContextProvider = ({ children }: PropsWithChildren) => {
  const { closeOverlay, overlay, ...rest } = useOverlay()

  useEffect(() => {
    if (overlay.autoClose) {
      const timer = setTimeout(async () => {
        closeOverlay()
      }, overlay.autoClose)
      return () => clearTimeout(timer)
    }

    return
  }, [overlay.mode])

  return (
    <OverlayContext.Provider
      value={{
        closeOverlay,
        overlay,
        ...rest
      }}
    >
      {children}
    </OverlayContext.Provider>
  )
}

export default OverlayContextProvider

export const useAppOverlay = () => useContext(OverlayContext)

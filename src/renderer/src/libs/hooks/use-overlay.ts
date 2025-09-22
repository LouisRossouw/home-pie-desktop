import { ReactNode, useState } from 'react'

type AnimationTypes = 'fade' | 'slide' | 'none'

export type LoginStates =
  | 'LOADING'
  | 'LOADING-LOG-IN'
  | 'LOADING-LOG-OUT'
  | 'SWITCH-ACCOUNT'
  | 'CHILDREN'
  | undefined

export type OverlaySettings = {
  mode?: LoginStates
  transparent?: boolean
  animationType?: AnimationTypes
  children?: ReactNode
  disableClose?: boolean
  extraText?: string
  autoClose?: number
}

export const defaultOverlay: OverlaySettings = {
  mode: undefined,
  transparent: false,
  animationType: 'fade',
  children: null,
  disableClose: false,
  extraText: '',
  autoClose: undefined
}

export function useOverlay() {
  const [open, setOpen] = useState(false)
  const [overlay, setOverlay] = useState<OverlaySettings>({
    mode: 'LOADING',
    transparent: false,
    animationType: 'fade',
    children: null,
    disableClose: false,
    extraText: '',
    autoClose: undefined
  })

  function showOverlay(overlay: OverlaySettings) {
    setOpen(true)
    setOverlay(overlay)
  }

  function closeOverlay() {
    setOpen(false)
    setOverlay({
      mode: undefined,
      transparent: false,
      animationType: 'fade',
      children: null,
      disableClose: false,
      extraText: '',
      autoClose: undefined
    })
  }

  return {
    open,
    setOpen,
    closeOverlay,
    overlay,
    showOverlay
  }
}

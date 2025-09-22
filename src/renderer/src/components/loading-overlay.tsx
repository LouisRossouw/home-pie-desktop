import { X } from 'lucide-react'

import { Button } from './ui/button'
import logo from '../assets/LR16.png'

import { cn } from '~/libs/utils/cn'
import { LoadingIndicator } from './loading-indicator'
import { useAppOverlay } from '~/libs/context/overlay'

// Experimental
export function LoadingOverlay() {
  const { open, overlay, closeOverlay } = useAppOverlay()

  if (!open) return null

  return (
    <div
      className={cn(
        'fixed w-full h-full z-100',
        'flex items-center justify-center rounded-lg',
        overlay.transparent ? '' : 'bg-background',
        overlay.animationType === 'fade' && 'animate-in fade-in duration-500 ease-in-out'
      )}
    >
      {!overlay.disableClose && (
        <div className="absolute top-0 w-full items-end p-4 z-50">
          <Button variant={'ghost'} size={'icon'} onClick={closeOverlay}>
            <X size={18} color={'gray'} />
          </Button>
        </div>
      )}
      <div className="flex w-full h-full items-center justify-center">
        {overlay.mode === 'LOADING' && (
          <>
            <div className="flex items-center justify-center text-center">
              <img src={logo} width={40} height={40}></img>
            </div>
            {overlay.extraText && (
              <div className="text-center">
                <p>{overlay.extraText}</p>
              </div>
            )}
          </>
        )}
        {overlay.mode === 'LOADING-LOG-IN' && (
          <div className="flex items-center justify-center gap-4">
            <img src={logo} width={40} height={40}></img>
            <p>Signing in.. {overlay.extraText}</p>
          </div>
        )}
        {overlay.mode === 'LOADING-LOG-OUT' && (
          <div className="flex items-center justify-center gap-4">
            <img src={logo} width={40} height={40}></img>
            <p>Signing out.. {overlay.extraText}</p>
          </div>
        )}
        {overlay.mode === 'SWITCH-ACCOUNT' && (
          <div className="">
            <div className="flex items-center justify-center text-center">
              <LoadingIndicator />
            </div>
            <div className="text-center">
              <p>Switching account.. {overlay.extraText}</p>
            </div>
          </div>
        )}
        {overlay.mode === 'CHILDREN' && <div className="flex w-full">{overlay.children}</div>}
      </div>
    </div>
  )
}

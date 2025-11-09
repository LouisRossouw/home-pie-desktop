import { useLocation } from 'react-router'
import { Maximize, Minimize2, X } from 'lucide-react'

import { WindowModes } from '@shared/types'
import { settingKeys } from '@shared/default-app-settings'

import { useApp } from '~/libs/context/app'

import { Button } from './ui/button'
import { DotSquad } from './dot-squad'
import { WindowUIModeSelector } from './window-ui-mode-selector'
import { capitalize } from '~/libs/utils/utils'
import { appEnvironment, getAppName } from '@shared/constants'

const isDev = import.meta.env.DEV
const mode = import.meta.env.MODE

const webKit = {
  drag: { WebkitAppRegion: 'drag' },
  noDrag: { WebkitAppRegion: 'no-drag' }
} as { drag: React.CSSProperties; noDrag: React.CSSProperties }

export function WindowFrame() {
  const { pathname } = useLocation()
  const { appSettings, windowControl, resetWindow, updateAppSettings } = useApp()

  const isLogin = pathname === '/login'

  function handleUIModeChange({ action }: { action: WindowModes }) {
    if (action === 'default') {
      updateAppSettings([{ setting: settingKeys.appWindowMode, value: '' }])
      return resetWindow()
    }
    windowControl({ action })
  }

  const currentUIMode = appSettings?.appWindowMode as WindowModes | undefined

  return (
    <div
      className="h-8 rounded-t-lg px-2 bg-background border-b items-center justify-center"
      style={webKit.drag}
    >
      <div className="grid grid-cols-3 w-full">
        <div className="flex w-full items-center">
          {isLogin ? (
            <div></div>
          ) : (
            <div className="flex gap-1 items-center text-sm">
              <p className="hue-rotate-animation">{getAppName}</p>
              {isDev && <p className="opacity-50">/ {capitalize(appEnvironment)}</p>}
            </div>
          )}
        </div>

        <div className="flex w-full items-center justify-center">
          {!isLogin ? (
            <div className="flex">
              <DotSquad />
            </div>
          ) : (
            <div>HomePie</div>
          )}
        </div>

        <div className="flex w-full items-center justify-end">
          {!isLogin && (
            <div className="flex" style={webKit.noDrag}>
              <div>
                <WindowUIModeSelector
                  currentUIMode={currentUIMode}
                  handleUIModeChange={handleUIModeChange}
                />
              </div>
              <Button
                size={'sm'}
                variant={'ghost'}
                className="h-8 w-8"
                onClick={() => windowControl({ action: 'minimize' })}
              >
                <Minimize2 size={18} />
              </Button>
              <Button
                size={'sm'}
                variant={'ghost'}
                className="h-8 w-8"
                onClick={() => windowControl({ action: 'maximize' })}
              >
                <Maximize size={18} />
              </Button>
            </div>
          )}

          <div style={webKit.noDrag}>
            <Button
              size={'sm'}
              variant={'ghost'}
              className="h-8 w-8"
              onClick={() => windowControl({ action: 'close' })}
            >
              <X size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

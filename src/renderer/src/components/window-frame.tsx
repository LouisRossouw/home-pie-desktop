import { useLocation } from 'react-router'
import { Maximize, Minimize2, X } from 'lucide-react'

import { WindowModes } from '@shared/types'

import { useApp } from '~/libs/context/app'

import { Button } from './ui/button'
import { DotSquad } from './dot-squad'
import { useMemo } from 'react'
import { buildThemeClasses } from '~/libs/utils/update-theme-ui'
import { cn } from '~/libs/utils/cn'

import { Themes } from '~/libs/themes'

import { WindowUIModeSelector } from './window-ui-mode-selector'

const webKit = {
  drag: { WebkitAppRegion: 'drag' },
  noDrag: { WebkitAppRegion: 'no-drag' }
} as { drag: React.CSSProperties; noDrag: React.CSSProperties }

export function WindowFrame() {
  const { pathname } = useLocation()
  const { appSettings, windowControl, resetWindow, updateAppSettings } = useApp()

  const classes = useMemo(() => {
    const currentTheme = appSettings?.theme as Themes
    return buildThemeClasses({
      currentTheme,
      overrides: {
        themeType: 'solid',
        border: 'border-b border-x',
        dontIgnoreText: true
      }
    })
  }, [appSettings])

  const isLogin = pathname === '/login'

  function handleUIModeChange({ action }: { action: WindowModes }) {
    if (action === 'default') {
      updateAppSettings([{ setting: 'appWindowMode', value: '' }])
      return resetWindow()
    }
    windowControl({ action })
  }

  const currentUIMode = appSettings?.appWindowMode as WindowModes | undefined

  return (
    <div
      className={cn(
        'h-8 rounded-t-lg w-full flex items-center justify-between px-2 bg-background',
        ...classes
      )}
      style={webKit.drag}
    >
      {/* TODO; Turn into grid columns , or something else to center things! */}
      {isLogin ? <div></div> : <div>HomePie</div>}
      {!isLogin ? (
        <div className="flex" style={webKit.noDrag}>
          <DotSquad />
        </div>
      ) : (
        <div>HomePie</div>
      )}

      <div className="flex" style={webKit.noDrag}>
        <WindowUIModeSelector
          currentUIMode={currentUIMode}
          handleUIModeChange={handleUIModeChange}
        />
        {!isLogin && (
          <>
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
          </>
        )}

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
  )
}

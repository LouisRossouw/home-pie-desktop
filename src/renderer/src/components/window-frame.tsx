import { useLocation } from 'react-router'
import { Maximize, Minimize2, X } from 'lucide-react'

import { Button } from './ui/button'
import { DotSquad } from './dot-squad'
import { useMemo } from 'react'
import { buildThemeClasses } from '~/libs/utils/update-theme-ui'
import { cn } from '~/libs/utils/cn'
import { useApp } from '~/libs/context/app'
import { Themes } from '~/libs/themes'

export function WindowFrame() {
  const { pathname } = useLocation()
  const { appSettings } = useApp()

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

  return (
    <div
      className={cn(
        'h-8 rounded-t-lg w-full flex items-center justify-between px-2 bg-background',
        ...classes
      )}
      style={{ WebkitAppRegion: 'drag' }}
    >
      {/* TODO; Turn into grid columns , or something else to center things! */}
      {isLogin ? <div></div> : <div>HomePie</div>}
      {!isLogin ? (
        <div className="flex" style={{ WebkitAppRegion: 'no-drag' }}>
          <DotSquad />
        </div>
      ) : (
        <div>HomePie</div>
      )}

      <div className="flex" style={{ WebkitAppRegion: 'no-drag' }}>
        {!isLogin && (
          <>
            <Button
              size={'sm'}
              variant={'ghost'}
              className="h-8 w-8"
              onClick={() => window.api.windowControl({ action: 'minimize' })}
            >
              <Minimize2 size={18} />
            </Button>
            <Button
              size={'sm'}
              variant={'ghost'}
              className="h-8 w-8"
              onClick={() => window.api.windowControl({ action: 'maximize' })}
            >
              <Maximize size={18} />
            </Button>
          </>
        )}

        <Button
          size={'sm'}
          variant={'ghost'}
          className="h-8 w-8"
          onClick={() => window.api.windowControl({ action: 'close' })}
        >
          <X size={18} />
        </Button>
      </div>
    </div>
  )
}

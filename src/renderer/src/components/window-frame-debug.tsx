import { Link, useLocation, useNavigate } from 'react-router'
import { AppVersion } from './app-version'
import { useMemo, useRef } from 'react'
import { Bug, House } from 'lucide-react'
import { useApp } from '~/libs/context/app'
import { Button } from './ui/button'
import { buildThemeClasses } from '~/libs/utils/update-theme-ui'
import { cn } from '~/libs/utils/cn'
import { Themes } from '~/libs/themes'

const isDev = import.meta.env.DEV
const mode = import.meta.env.MODE

export function WindowFrameDebug() {
  const countToDebug = useRef(0)
  const { pathname } = useLocation()
  const navigation = useNavigate()

  const { appSettings, updateAppSettings } = useApp()

  function handleDebugRedirect() {
    countToDebug.current += 1

    if (countToDebug.current >= 5) {
      countToDebug.current = 0
      navigation('debug')
      updateAppSettings([{ setting: 'debug', value: true }])
    }
  }

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

  if (isLogin) {
    return (
      <div
        className={cn(
          'flex items-center justify-between h-8 px-4 rounded-b-lg bg-background',
          ...classes
        )}
      ></div>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between h-8 px-4 rounded-b-lg border-t bg-background',
        ...classes
      )}
    >
      <div className="grid grid-cols-3 w-full">
        <div className="flex gap-4 justify-start items-center">
          <Link to={'/'}>
            <House size={18} />
          </Link>
          <p className="text-xs">{pathname}</p>
        </div>
        <div className="flex justify-center items-center">
          {isDev && <p className="text-xs">{mode}</p>}
        </div>
        <div className="flex justify-end items-center gap-4">
          {appSettings?.debug && (
            <Button variant={'outline'} className="w-6 h-6" onClick={() => navigation('debug')}>
              <Bug />
            </Button>
          )}
          <div onClick={handleDebugRedirect}>
            <AppVersion />
          </div>
        </div>
      </div>
    </div>
  )
}

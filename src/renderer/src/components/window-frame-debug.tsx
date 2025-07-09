import { useLocation } from 'react-router'
import { AppVersion } from './app-version'

const isDev = import.meta.env.DEV
const mode = import.meta.env.MODE

export function WindowFrameDebug() {
  const { pathname } = useLocation()

  return (
    <div className="flex items-center justify-between h-8 px-4 rounded-b-lg border-t bg-background">
      <p className="text-sm">{pathname}</p>
      {isDev && <p className="text-sm">{mode}</p>}

      <AppVersion />
    </div>
  )
}

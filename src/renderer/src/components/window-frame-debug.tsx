import { Link, useLocation, useNavigate } from 'react-router'
import { AppVersion } from './app-version'
import { useRef } from 'react'
import { House } from 'lucide-react'

const isDev = import.meta.env.DEV
const mode = import.meta.env.MODE

export function WindowFrameDebug() {
  const countToDebug = useRef(0)
  const { pathname } = useLocation()
  const navigation = useNavigate()

  function handleDebugRedirect() {
    countToDebug.current += 1

    if (countToDebug.current >= 5) {
      navigation('debug')
    }
  }

  return (
    <div className="flex items-center justify-between h-8 px-4 rounded-b-lg border-t bg-background">
      <div className="flex gap-2 items-center">
        <Link to={'/'}>
          <House size={18} />
        </Link>
        <p className="text-sm">{pathname}</p>
      </div>
      {isDev && <p className="text-sm">{mode}</p>}

      <div onClick={handleDebugRedirect}>
        <AppVersion />
      </div>
    </div>
  )
}

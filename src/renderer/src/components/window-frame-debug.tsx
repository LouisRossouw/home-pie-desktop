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

  const isLogin = pathname === '/login'

  if (isLogin) {
    return (
      <div className="flex items-center justify-between h-8 px-4 rounded-b-lg  bg-background"></div>
    )
  }

  return (
    <div className="flex items-center justify-between h-8 px-4 rounded-b-lg border-t bg-background">
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
        <div className="flex justify-end">
          <div onClick={handleDebugRedirect}>
            <AppVersion />
          </div>
        </div>
      </div>
    </div>
  )
}

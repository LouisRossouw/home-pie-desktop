import { useEffect } from 'react'
import logo from '../assets/LR16.png'

import { AppVersion } from '~/components/app-version'

const ee = import.meta.env.VITE_APP_TEST

export function SplashRoute() {
  // TODO; Use this route to show logo + version number

  useEffect(() => {
    window.api.resizeApp({ width: 250, height: 250 })
  }, [])

  return (
    <div className="splash_window">
      <div className="splash_container">
        <div className="splash_screen">
          <div className="grid gap-4 p-4 text-center items-center justify-center">
            <img src={logo} width={80} height={80}></img>

            <AppVersion className="text-gray-400" />
            <p className="text-white">{JSON.stringify(ee)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useEffect } from 'react'

import { AppVersion } from '~/components/app-version'
import { updateThemeUi } from '~/libs/utils/update-theme-ui'
import { AnimatedWords } from '~/components/animated-words'
import { appEnvironment, isDevelopment, getAppName } from '@shared/constants'

const ee = import.meta.env.VITE_APP_TEST

export function SplashRoute() {
  // TODO; Use this route to show logo + version number

  useEffect(() => {
    window.api.app.resizeApp({ width: 250, height: 250 })
    updateThemeUi('dark')
  }, [])

  return (
    <div className="splash_window">
      <div className="splash_container">
        <div className="splash_screen">
          <div className="grid gap-1 p-4 text-center items-center justify-center">
            <AnimatedWords
              speed={70}
              trailCount={20}
              text={`<HIGHLIGHT-ME>${getAppName}</HIGHLIGHT-ME>`}
              className="hue-rotate-animation text-3xl"
            />
            <AppVersion
              animateWordsOptions={{ delay: 1000, speed: 20, trailCount: 50 }}
              animateWords
              className="text-gray-400 text-xs"
            />

            {/* {isDevelopment() && (
              <p className="text-gray-400 text-xs">{capitalize(appEnvironment)}</p>
            )} */}
          </div>
        </div>
      </div>
    </div>
  )
}

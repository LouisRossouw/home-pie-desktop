import { useEffect } from 'react'

export function SplashRoute() {
  useEffect(() => {
    // TODO; If splash screen change the width and height to be smaller.

    window.api.resizeApp({ width: 400, height: 600 })
  }, [])

  return (
    <div className="bg-green-500 h-full  flex items-center justify-center">
      <h2>Splash screen</h2>
    </div>
  )
}

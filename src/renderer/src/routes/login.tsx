import { useEffect } from 'react'

export function Login() {
  useEffect(() => {
    window.api.resizeApp({ width: 900, height: 670 })
  }, [])

  return (
    <div className="bg-red-500 h-full  flex items-center justify-center">
      <h2>Log in screen</h2>
    </div>
  )
}

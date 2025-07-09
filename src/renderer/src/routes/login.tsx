import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '~/components/ui/button'

export default function Login() {
  const navigation = useNavigate()

  useEffect(() => {
    window.api.resizeApp({ width: 500, height: 800 })
  }, [])

  function handleManualLogin() {
    navigation('/')
    window.api.resizeApp({ width: 900, height: 670 })
  }

  return (
    <div className="flex w-full h-[calc(100vh-64px)] items-center justify-center p-4 bg-background">
      <div className="grid w-full p-4 border rounded-lg gap-4">
        <h2>Log in screen</h2>
        <Button onClick={handleManualLogin}>Login</Button>
      </div>
    </div>
  )
}

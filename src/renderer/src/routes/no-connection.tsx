// TODO; No connection route, ie when no internet we can show this route
// and attempt to reconnect while polling for connection.

import { useEffect } from 'react'
import { Button } from '~/components/ui/button'

export default function NoConnectionRoute() {
  // TODO; Add a poll / counter that attempts to reconnect

  // TODO; Add a cool countdown

  // TODO TODO; Add a super sad face, maybe a cry face 😭

  // SUPER TODOTODO; Make a micro game for this screen, maybe port over my zombiezombie Threejs experience.

  useEffect(() => {
    window.api.resizeApp({ width: 500, height: 500 })
  }, [])

  return (
    <div className="flex w-full h-[calc(100vh-64px)] items-center justify-center p-4 bg-background">
      <div className="grid w-full p-4 border rounded-lg gap-4">
        <h2>Oh nooos, No connection 😥</h2>
        <Button onClick={() => console.log('TODO; Retry connection')}>Retry</Button>
      </div>
    </div>
  )
}

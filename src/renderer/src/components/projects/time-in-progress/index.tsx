import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Button } from '~/components/ui/button'

export function TimeInProgress() {
  const [data, setData] = useState<any>('') // Temp

  const { mutateAsync: testMutation, isPending } = useMutation({
    mutationKey: ['test'],
    mutationFn: testFn,
    onSuccess: (res) => {
      if (res.ok) {
        setData(res.data.datetime)
      }
    },
    onError: (err) => {
      console.error('Password reset error:', err.message)
    }
  })

  const { mutateAsync: testLogout } = useMutation({
    mutationFn: testForceRedirect
  })

  return (
    <div className="flex w-full h-[calc(100vh-96px)] items-center justify-center">
      <div className="grid text-center gap-4">
        <h2>Time In Progress</h2>
        {JSON.stringify(data)}
        <Button onClick={() => testMutation()}>Test {JSON.stringify(isPending)}</Button>
        <Button onClick={() => testLogout()}>Force log out test</Button>
      </div>
    </div>
  )
}

async function testFn() {
  return window.api.apiTest()
}

async function testForceRedirect() {
  return window.api.apiLogoutTest()
}

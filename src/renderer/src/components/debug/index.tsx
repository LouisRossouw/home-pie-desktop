import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'

import { ApiTest } from '@shared/types'
import { getBaseURl } from '@shared/api'
import { getOAuthClients } from '@shared/auth'

import { useApp } from '~/libs/context/app'

import { Button } from '~/components/ui/button'
import { ThemeSelector } from '~/components/theme-selector'

const MODE = import.meta.env.MODE
const isDev = import.meta.env.DEV

const baseURL = getBaseURl()
const authClients = getOAuthClients()

export function Debug() {
  // TODO; Only allow if user isStaff & isAdmin

  const { handleUpdateDotSquad } = useApp()

  const [output, setOutput] = useState<any>('')
  const [listenersCount, setListenersCount] = useState<Record<string, string>>({})

  const { mutateAsync: sendTestPing, isPending: isPendingPingTest } = useMutation({
    mutationKey: ['get-stats'],
    mutationFn: testPing,
    onSuccess: (res: ApiTest) => {
      setOutput(res.data)
    },
    onError: (err) => {
      setOutput(JSON.stringify(err))
      console.error('error:', err.message)
    }
  })

  useEffect(() => {
    getListenersCount()
  }, [])

  async function getListenersCount() {
    const dotSquadLS = await window.api.listenerCount('dot-squad')
    const routerListenerLS = await window.api.listenerCount('navigate-to')

    setListenersCount({ dotSquadLS, routerListenerLS })
  }

  function clear() {
    setOutput(undefined)
  }

  const isAuth = false // TODO
  const isStaff = false // TODO

  const TokenExpires = 0 // TODO
  const connected = undefined // TODO

  const PGCID = authClients?.GOOGLE_CLIENT_ID.length
  const PMCID = authClients?.MANUAL_CLIENT_ID.length

  return (
    <div className=" w-full h-[calc(100vh-152px)] items-center justify-center px-4 pb-4 bg-background">
      <div className="flex  p-2">
        <Button variant={'outline'} onClick={clear}>
          Clear
        </Button>
      </div>

      <div className="grid grid-cols-3 w-full h-full gap-4">
        <div className="grid border rounded-lg p-4 gap-4">
          <div className="space-y-4">
            <div className="">
              <label>Info:</label>
            </div>

            <div className="grid">
              <InfoRow label={`${isAuth ? '✔️' : '✖️'} isAuth`} value={String(isAuth)} />
              <InfoRow label={`${isStaff ? '✔️' : '✖️'} isStaff`} value={String(isStaff)} />
              <InfoRow label={`${isDev ? '🌖' : '🌎'} appEnv`} value={MODE || 'N/A'} />
              <InfoRow
                label={`${baseURL === 'http://127.0.0.1:8000' ? '🌖' : '🌎'} baseURL`}
                value={baseURL || 'N/A'}
              />
              <InfoRow
                label={`${PGCID === 40 ? '✔️' : '✖️'} PROD_GOOGLE_CLIENT_ID`}
                value={PGCID || 'N/A'}
              />
              <InfoRow
                label={`${PMCID === 40 ? '✔️' : '✖️'} PROD_MANUAL_CLIENT_ID`}
                value={PMCID || 'N/A'}
              />
              <InfoRow
                label={`${TokenExpires > 0 ? '✔️' : '✖️'} TokenExpires`}
                value={TokenExpires ? `${TokenExpires} min` : 'N/A'}
              />
              <InfoRow label="Connected" value={String(connected)} />
            </div>

            <div className="">
              <label>Listeners:</label>
            </div>
            <div className="grid">
              {Object.entries(listenersCount).map(([label, value]) => (
                <InfoRow key={label} label={label} value={value} />
              ))}
            </div>
          </div>
        </div>

        {/* Test buttons go here ! */}
        <div className="grid h-full w-full border rounded-lg p-4">
          <label>Test buttons:</label>
          <Button onClick={() => sendTestPing()}>{isPendingPingTest ? '..' : 'Test ping'}</Button>
          <Button onClick={() => handleUpdateDotSquad('notAuth')}>Test dotSquad</Button>
          <ThemeSelector />
        </div>

        <div className="border rounded-lg p-4">
          <div className="h-8">
            <label>Output:</label>
          </div>
          <div className="h-full overflow-y-hidden">
            {isPendingPingTest ? (
              'Loading..'
            ) : (
              <p className="text-xs">{JSON.stringify(output, null, 2)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex w-full justify-normal gap-2">
      <div className="w-full">
        <p className="text-xs">{label}:</p>
      </div>
      <div>
        <p className="text-xs">{value}</p>
      </div>
    </div>
  )
}

async function testPing() {
  return await window.api.apiTest()
}

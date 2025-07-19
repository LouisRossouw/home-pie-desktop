import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'

import { ApiTest } from '@shared/types'
import { getBaseURl } from '@shared/api'
import { getOAuthClients } from '@shared/auth'

import { Button } from '~/components/ui/button'
import { ThemeSelector } from '~/components/theme-selector'

const MODE = import.meta.env.MODE
const isDev = import.meta.env.DEV
// const isProd = import.meta.env.PROD

const baseURL = getBaseURl()
const authClients = getOAuthClients()

export function Debug() {
  // TODO; Only allow if user isStaff & isAdmin

  const [output, setOutput] = useState<any>()

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

  const isAuth = false // TODO
  const isStaff = false // TODO

  const TokenExpires = 0 // TODO
  const connected = undefined // TODO

  const PGCID = authClients?.GOOGLE_CLIENT_ID.length
  const PMCID = authClients?.MANUAL_CLIENT_ID.length

  return (
    <div className="flex w-full h-[calc(100vh-96px)] items-center justify-center p-4 bg-background">
      <div className="flex w-full h-full gap-4">
        <div className="grid border rounded-lg w-1/3 p-4 gap-4">
          <div>
            <div className="py-2">
              <label>Info:</label>
            </div>
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

          <div className="py-2">
            <label>Output:</label>
            <div>
              {isPendingPingTest ? (
                'Loading..'
              ) : (
                <p className="text-xs">{JSON.stringify(output, null, 2)}</p>
              )}
            </div>
          </div>
        </div>

        {/* Test buttons go here ! */}
        <div className="flex h-full w-full border rounded-lg justify-center items-center">
          <Button onClick={() => sendTestPing()}>{isPendingPingTest ? '..' : 'Test ping'}</Button>
          <ThemeSelector />
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-normal">
      <p className="text-xs">{label}:</p>
      <p className="text-xs">{value}</p>
    </div>
  )
}

async function testPing() {
  return await window.api.apiTest()
}

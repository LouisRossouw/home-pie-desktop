import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'

import { getBaseURl } from '@shared/api'
import { getOAuthClients } from '@shared/auth'
import { ApiTest, Setting } from '@shared/types'
import { settingKeys } from '@shared/default-app-settings'

import { useApp } from '~/libs/context/app'
import { useNav } from '~/libs/hooks/use-navigation'
import { useDotSquadTest } from '~/libs/context/dot-squad'

import { Button } from '~/components/ui/button'
import { ThemeSelector } from '~/components/theme-selector'
import { LoadingIndicator } from '~/components/loading-indicator'

const MODE = import.meta.env.MODE
const isDev = import.meta.env.DEV

const baseURL = getBaseURl()
const authClients = getOAuthClients()

export function Debug() {
  // TODO; Only allow if user isStaff & isAdmin
  const { navigateTo } = useNav()
  const { handleUpdateDotSquad } = useDotSquadTest()
  const { appSettings, getAppSetting, updateAppSettings, getAllAppSettings } = useApp()

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

  const { mutateAsync: mrPingPingMutation } = useMutation({
    mutationKey: ['mr-ping-ping'],
    mutationFn: (data: { intent: string }) => apiMrPingPingTest(data),
    onSuccess: (res) => {
      setOutput(res)
    }
  })

  useEffect(() => {
    getListenersCount()
  }, [])

  async function getListenersCount() {
    const dotSquadLS = await window.api.app.listenerCount('dot-squad')
    const routerLS = await window.api.app.listenerCount('navigate-to')
    const ResizeLS = await window.api.app.listenerCount('window-resized')
    const ProcessLS = await window.api.app.listenerCount('emit-process-activity')

    setListenersCount({ dotSquadLS, routerLS, ResizeLS, ProcessLS })
  }

  // Fetch setting directly from db.
  async function handleGetSettings(setting: Setting) {
    const result = await window.api.db.getAppSetting({ setting })

    setOutput(JSON.parse(result))
  }

  function clear() {
    setOutput(undefined)
  }

  const isAuth = true // TODO
  const isStaff = true // TODO

  const TokenExpires = 0 // TODO
  const connected = undefined // TODO

  const PGCID = authClients?.GOOGLE_CLIENT_ID.length
  const PMCID = authClients?.MANUAL_CLIENT_ID.length

  const isDebug = appSettings?.debug

  if (!isDebug || !isAuth || !isStaff) {
    return (
      <div className=" w-full h-[calc(100vh-152px)] items-center justify-center px-4 pb-4 bg-background">
        <p>Debug mode has not been active</p>
        <Button
          variant={'outline'}
          onClick={() => {
            navigateTo('/')
            updateAppSettings([{ setting: settingKeys.debug, value: false }])
          }}
        >
          Disable debug
        </Button>
      </div>
    )
  }

  return (
    <div className=" w-full h-[calc(100vh-152px)] items-center justify-center px-4 pb-4 bg-background">
      <div className="flex p-2 justify-between">
        <Button variant={'outline'} onClick={clear}>
          Clear
        </Button>
        <Button
          variant={'outline'}
          onClick={() => {
            navigateTo('/')
            updateAppSettings([{ setting: settingKeys.debug, value: false }])
          }}
        >
          Disable debug
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
        <div className="grid h-full w-full border rounded-lg p-4 overflow-y-scroll">
          <label>Test buttons:</label>

          <div className="grid gap-2 border-t py-4">
            <label>External API:</label>
            <Button onClick={() => sendTestPing()}>{isPendingPingTest ? '..' : 'Test ping'}</Button>
            <Button onClick={() => mrPingPingMutation({ intent: 'apps-config' })}>
              {'Mr Ping Ping apps'}
            </Button>
            <Button onClick={() => mrPingPingMutation({ intent: 'app-config' })}>
              {'Mr Ping Ping app config'}
            </Button>
            <Button onClick={() => mrPingPingMutation({ intent: 'apps-status' })}>
              {'Mr Ping Ping apps status'}
            </Button>

            <Button onClick={() => mrPingPingMutation({ intent: 'app-status' })}>
              {'Mr Ping Ping app status'}
            </Button>
          </div>
          <div className="grid gap-2 border-t py-4">
            <label>DotSquad:</label>
            <Button onClick={() => handleUpdateDotSquad('notAuth')}>Test dotSquad</Button>
          </div>
          <div className="grid gap-2 border-t py-4">
            <label>Route Nav:</label>
            <Button onClick={() => navigateTo('/no-connection')}>no-connection</Button>
          </div>

          <div className="grid gap-2 border-t py-4">
            <label>Local Database:</label>
            <Button onClick={() => handleGetSettings(settingKeys.lockScreen)}>
              GetSetting - lock-screen
            </Button>
            <Button
              onClick={async () => {
                const result = await updateAppSettings([
                  { setting: settingKeys.dateFormat, value: 'noooo' },
                  { setting: settingKeys.appHeight, value: 99999 }
                ])
                setOutput(result)
              }}
            >
              updateAppSettings - dateFormat
            </Button>
            <Button
              onClick={async () => {
                const result = await getAppSetting('dateFormat')
                setOutput(result)
              }}
            >
              getAppSetting - dateFormat
            </Button>
            <Button
              onClick={async () => {
                const result = await getAllAppSettings()
                setOutput(result)
              }}
            >
              getAllAppSettings
            </Button>
          </div>
          <div className="grid gap-2 border-t py-4">
            <label>Theme:</label>
            <ThemeSelector handleAddNewChanges={() => console.log('TODO')} />
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="h-8">
            <label>Output:</label>
          </div>
          <div className="h-full overflow-y-hidden">
            {isPendingPingTest ? (
              <LoadingIndicator />
            ) : (
              <p className="text-xs">{JSON.stringify(output, null, 2)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string | number }) {
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
  return await window.api.test.apiTest()
}

async function apiMrPingPingTest({ intent }: { intent: string }) {
  if (intent === 'app-config') {
    return await window.api.external.apiMrPingPingAppConfig({ appName: 'timeinprogress_client' })
  }
  if (intent === 'apps-config') {
    return await window.api.external.apiMrPingPingAppsConfig()
  }
  if (intent === 'apps-status') {
    return await window.api.external.apiMrPingPingAppsStatus()
  }
  if (intent === 'app-status') {
    return await window.api.external.apiMrPingPingAppStatus({ appName: 'timeinprogress_client' })
  }

  return
}

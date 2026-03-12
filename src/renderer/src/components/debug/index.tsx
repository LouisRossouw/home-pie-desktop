import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import {
  Shield,
  Activity,
  Zap,
  Code,
  FlaskConical,
  Search,
  Info,
  Trash2,
  XCircle,
  Database,
  Layout,
  RefreshCcw,
  Copy,
  Settings
} from 'lucide-react'

import { ApiTest } from '@shared/types'
import { settingKeys } from '@shared/default-app-settings'

import { useApp } from '~/libs/context/app'
import { useNav } from '~/libs/hooks/use-navigation'
import { useDotSquadTest } from '~/libs/context/dot-squad'

import { Button } from '~/components/ui/button'
import { ThemeSelector } from '~/components/theme-selector'
import { LoadingIndicator } from '~/components/loading-indicator'
import { useAppOverlay } from '~/libs/context/overlay'
import { appIpcKey, getApiBaseURL, oAuthClients } from '@shared/constants'
import { Label } from '~/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Separator } from '~/components/ui/separator'
import { cn } from '~/libs/utils/cn'

const MODE = import.meta.env.MODE
const isDev = import.meta.env.DEV

export function Debug(): JSX.Element {
  // TODO; Only allow if user isStaff & isAdmin
  const { navigateTo } = useNav()
  const { handleUpdateDotSquad } = useDotSquadTest()
  const { appSettings, updateAppSettings, getAllAppSettings } = useApp()

  const userId = (appSettings?.activeAccountId ?? 0) as number

  const { showOverlay } = useAppOverlay()

  const [output, setOutput] = useState<unknown>(undefined)
  const [listenersCount, setListenersCount] = useState<Record<string, string>>({})

  const { mutateAsync: sendTestPing, isPending: isPendingPingTest } = useMutation({
    mutationKey: ['get-stats'],
    mutationFn: testPing,
    onSuccess: (res: ApiTest) => {
      setOutput(res.data)
    },
    onError: (err: Error) => {
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

  async function getListenersCount(): Promise<void> {
    const dotSquadLS = await window.api.app.listenerCount(appIpcKey.dotSquad)
    const routerLS = await window.api.app.listenerCount(appIpcKey.navigateTo)
    const resizeLS = await window.api.app.listenerCount(appIpcKey.windowResized)
    const processLS = await window.api.app.listenerCount(appIpcKey.emitProcessActivity)
    const authLS = await window.api.app.listenerCount(appIpcKey.authCode)

    setListenersCount({ dotSquadLS, routerLS, resizeLS, processLS, authLS })
  }

  // ** TODO; update logic/func to handle CORE & USER settings.

  // Fetch setting directly from db.
  async function handleGetSettings(setting: string): Promise<void> {
    console.log('Fetching setting:', setting)
    const result = 'HEEEELP; FIX ME'
    setOutput(JSON.parse(result))
  }

  function clear(): void {
    setOutput(undefined)
  }

  const isAuth = true // TODO
  const isStaff = true // TODO

  const TokenExpires = 0 // TODO
  const connected = undefined // TODO

  const PGCID = oAuthClients?.GOOGLE_CLIENT_ID?.length
  const PMCID = oAuthClients?.MANUAL_CLIENT_ID?.length

  const isDebug = appSettings?.debug

  async function handleCopyOutput(): Promise<void> {
    if (output) {
      await navigator.clipboard.writeText(JSON.stringify(output, null, 2))
    }
  }

  if (!isDebug || !isAuth || !isStaff) {
    return (
      <div className="w-full h-[calc(100vh-152px)] flex flex-col items-center justify-center p-8 bg-background animate-in fade-in duration-500">
        <div className="flex flex-col items-center gap-4 text-center max-w-xs">
          <XCircle className="size-12 text-destructive opacity-20" />
          <p className="font-bold text-lg tracking-tight">Access Restricted</p>
          <p className="text-sm text-muted-foreground">
            Debug mode is currently inactive or you lack sufficient permissions.
          </p>
          <Button
            variant="outline"
            className="mt-4 font-bold"
            onClick={() => {
              navigateTo('/')
              updateAppSettings([{ setting: settingKeys.debug, value: false }])
            }}
          >
            Disable Debug Mode
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-[calc(100vh-90px)] flex flex-col bg-background animate-in fade-in duration-700">
      {/* HEADER ACTIONS */}
      <div className="flex px-4 py-2 items-center justify-between border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
            <Shield className="size-4 text-primary" />
          </div>
          <h1 className="text-lg font-black tracking-tighter uppercase">Debug Console</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-2 font-bold text-xs" onClick={clear}>
            <Trash2 className="size-3.5" />
            Clear
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 font-bold text-xs border-primary/20 hover:bg-primary/5"
            onClick={() => {
              navigateTo('/')
              updateAppSettings([{ setting: settingKeys.debug, value: false }])
            }}
          >
            <XCircle className="size-3.5 text-destructive" />
            Disable Debug
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 w-full h-full gap-6 p-6 overflow-hidden">
        {/* INFO COLUMN */}
        <Card className="flex p-0 flex-col bg-transparent border-primary/10 shadow-none overflow-hidden">
          <CardHeader className="bg-primary/5 py-3 border-b border-primary/5">
            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 ">
              <Activity className="size-3.5" /> System Info
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex-1 overflow-y-auto space-y-6 scrollbar-hide">
            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase opacity-40 tracking-widest">
                General
              </Label>
              <div className="space-y-1">
                <InfoBadge
                  label="Auth Status"
                  value={isAuth ? 'Verified' : 'Unauth'}
                  success={isAuth}
                />
                <InfoBadge
                  label="Staff Mode"
                  value={isStaff ? 'Active' : 'Guest'}
                  success={isStaff}
                />
                <InfoBadge label="Dev Mode" value={isDev ? 'On' : 'Off'} warning={isDev} />
              </div>
            </div>

            <Separator className="bg-primary/5" />

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase opacity-40 tracking-widest">
                Environment
              </Label>
              <div className="space-y-0">
                <InfoRow label="API Base" value={getApiBaseURL || 'N/A'} isMono />
                <InfoRow label="Mode" value={MODE || 'N/A'} />
                <InfoRow label="Token Exp" value={TokenExpires ? `${TokenExpires} min` : 'N/A'} />
                <InfoRow label="Connected" value={String(connected)} />
                <InfoRow label="Google ID" value={PGCID || 'N/A'} />
                <InfoRow label="Manual ID" value={PMCID || 'N/A'} />
              </div>
            </div>

            <Separator className="bg-primary/5" />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] font-bold uppercase opacity-40 tracking-widest">
                  IPC Listeners
                </Label>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-4 opacity-40"
                  onClick={getListenersCount}
                >
                  <RefreshCcw className="size-3" />
                </Button>
              </div>
              <div className="space-y-0">
                {Object.entries(listenersCount).map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between text-xs">
                    <span className="font-medium  truncate mr-2">{label}</span>
                    <Badge
                      variant="secondary"
                      className="h-5 px-1.5 text-[10px] font-bold tabular-nums"
                    >
                      {value}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* TEST BUTTONS COLUMN */}
        <Card className="flex p-0 flex-col bg-transparent border-primary/10 shadow-none overflow-hidden">
          <CardHeader className="bg-primary/5 py-3 border-b border-primary/5">
            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 ">
              <FlaskConical className="size-3.5" /> Test Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <div className="p-4 space-y-6 pb-12">
                <TestSection title="External API" icon={<Search className="size-3" />}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start font-bold h-8"
                    onClick={() => sendTestPing()}
                  >
                    {isPendingPingTest ? <LoadingIndicator /> : 'Execute Test Ping'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start font-medium h-8"
                    onClick={() => mrPingPingMutation({ intent: 'apps-config' })}
                  >
                    Mr Ping: Apps Config
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start font-medium h-8 text-[11px]"
                    onClick={() => mrPingPingMutation({ intent: 'app-config' })}
                  >
                    Mr Ping: Meta (TIP)
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start font-medium h-8"
                    onClick={() => mrPingPingMutation({ intent: 'apps-status' })}
                  >
                    Mr Ping: Apps Status
                  </Button>
                </TestSection>

                <TestSection title="DotSquad" icon={<Zap className="size-3" />}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start h-8"
                    onClick={() => handleUpdateDotSquad('notAuth')}
                  >
                    Broadcaster Test
                  </Button>
                </TestSection>

                <TestSection title="Database & Session" icon={<Database className="size-3" />}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start h-8"
                    onClick={() => handleGetSettings(settingKeys.lockScreen)}
                  >
                    Get &quot;lock-screen&quot; Setting
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start h-8"
                    onClick={async () => setOutput(await getAllAppSettings())}
                  >
                    Dump All App Settings
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start h-8"
                    onClick={async () =>
                      setOutput(await window.api.db.getSession({ userId, key: 'accessToken' }))
                    }
                  >
                    Request Access Token
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start h-8"
                    onClick={async () =>
                      setOutput(await window.api.db.getSession({ userId, key: 'refreshToken' }))
                    }
                  >
                    Request Refresh Token
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start h-8"
                    onClick={async () =>
                      setOutput(
                        await window.api.db.setSession({ userId, key: 'expiresIn', value: '0' })
                      )
                    }
                  >
                    Expire Access Token
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start h-8"
                    onClick={async () =>
                      setOutput(await window.api.db.getSession({ userId, key: 'expiresIn' }))
                    }
                  >
                    Get Access Token Expires In
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-full justify-start h-8 text-destructive border-destructive/10"
                    onClick={async () => {
                      setOutput(
                        await window.api.db.setSession({
                          userId,
                          key: 'accessToken',
                          value: 'pewpew!'
                        })
                      )
                    }}
                  >
                    Poisen Access Token
                  </Button>
                </TestSection>

                <TestSection title="Navigation & UI" icon={<Layout className="size-3" />}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start h-8"
                    onClick={() => navigateTo('/no-connection')}
                  >
                    Route: No-Connection
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start h-8"
                    onClick={() =>
                      showOverlay({
                        disableClose: false,
                        animationType: 'fade',
                        mode: 'SWITCH-ACCOUNT'
                      })
                    }
                  >
                    Show Account Overlay
                  </Button>
                </TestSection>

                <TestSection title="Appearance" icon={<Settings className="size-3" />}>
                  <ThemeSelector handleAddNewChanges={() => console.log('Theme Updated')} />
                </TestSection>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* OUTPUT COLUMN */}
        <Card className="flex p-0 flex-col bg-black/40 border-primary/10 shadow-lg overflow-hidden glassmorphism-dark group">
          <CardHeader className="bg-white/5 py-3 border-b border-white/5 flex flex-row items-center justify-between shrink-0">
            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <Code className="size-3.5 text-blue-400" /> Console
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 opacity-0 group-hover:opacity-40 hover:!opacity-100 transition-opacity"
              onClick={handleCopyOutput}
            >
              <Copy className="size-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-hidden relative">
            <div className="h-full w-full overflow-y-auto">
              <div className="p-4 font-mono text-xs leading-relaxed selection:bg-blue-500/30">
                {output ? (
                  <pre className="text-blue-300 whitespace-pre-wrap break-all">
                    <code>{JSON.stringify(output, null, 2)}</code>
                  </pre>
                ) : (
                  <div className="h-full min-h-[300px] flex flex-col items-center justify-center opacity-20 text-center gap-3">
                    <Info className="size-8" />
                    <p className="uppercase tracking-widest text-[10px] font-bold">
                      Waiting for input
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function InfoBadge({
  label,
  value,
  success,
  warning
}: {
  label: string
  value: string
  success?: boolean
  warning?: boolean
}) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="font-bold opacity-50">{label}</span>
      <Badge
        variant="secondary"
        className={cn(
          'text-[10px] font-black uppercase px-2 h-5 flex items-center',
          success && 'bg-green-500/10 text-green-500 border-green-500/20',
          warning && 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
        )}
      >
        {value}
      </Badge>
    </div>
  )
}

function InfoRow({
  label,
  value,
  isMono
}: {
  label: string
  value: string | number
  isMono?: boolean
}) {
  return (
    <div className="flex justify-between">
      <Label className="text-[10px] font-bold opacity-40 uppercase tracking-tighter">{label}</Label>
      <p
        className={cn('text-xs font-bold leading-none truncate', isMono && 'font-mono opacity-80')}
      >
        {value}
      </p>
    </div>
  )
}

function TestSection({
  title,
  icon,
  children
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 opacity-50">
        <div className="size-5 rounded border bg-primary/5 flex items-center justify-center">
          {icon}
        </div>
        <Label className="text-[10px] font-bold uppercase tracking-widest">{title}</Label>
      </div>
      <div className="grid gap-2 pl-7">{children}</div>
    </div>
  )
}

async function testPing(): Promise<ApiTest> {
  return await window.api.test.apiTest()
}

async function apiMrPingPingTest({ intent }: { intent: string }): Promise<any> {
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

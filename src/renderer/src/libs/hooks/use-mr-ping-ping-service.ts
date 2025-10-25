import { useState } from 'react'
import { ApiMrPingPingStatus } from '@shared/types'

export function useMrPingPingService() {
  const [status, setStatus] = useState<ApiMrPingPingStatus | undefined>(undefined)

  async function handleGetStatus() {
    const res = await window.api.external.apiMrPingPingStatus()
    setStatus(res)
  }

  async function getAppStatus({ appNames }: { appNames: string[] }) {
    const res = await Promise.all(
      appNames.map((appName) => window.api.external.apiMrPingPingAppStatus({ appName }))
    )

    return res.flatMap((item) => item.data)
  }

  async function getAppRecordedData({
    appNames,
    range,
    interval
  }: {
    appNames: string[]
    range: string
    interval: number
  }) {
    const res = await Promise.all(
      appNames.map((appName) =>
        window.api.external.apiMrPingPingAppData({ appName, range, interval })
      )
    )

    return res.flatMap((item) => item.data)
  }

  return {
    status,
    setStatus,
    handleGetStatus,
    getAppStatus,
    getAppRecordedData
  }
}

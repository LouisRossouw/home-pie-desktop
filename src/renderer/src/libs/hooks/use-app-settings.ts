import { useState } from 'react'

import { CoreSetting } from '@shared/types'
import { arrayToObject } from '~/libs/utils/utils'

type Value = string | boolean | number | undefined
export type AppSettings = Record<CoreSetting, Value> | undefined

export type UseAppSettings = {
  appSettings: AppSettings | undefined
  getAppSetting: (v: CoreSetting) => Promise<Value>
  getAllAppSettings: () => Promise<AppSettings>
  setAppSettings: React.Dispatch<React.SetStateAction<AppSettings>>
  updateAppSettings: (v: { setting: CoreSetting; value: Value }[]) => Promise<boolean>
}

// ** !!
// TODO; Rename file to use-core-settings
// ** !!

export function useAppSettings() {
  const [appSettings, setAppSettings] = useState<AppSettings>(undefined)

  async function getAppSetting(setting: CoreSetting) {
    if (appSettings) return appSettings[setting]

    return JSON.parse(await window.api.db.getCoreSetting({ key: setting }))
  }

  async function updateAppSettings(settings: { setting: CoreSetting; value: Value }[]) {
    setAppSettings((prevSettings) => {
      const updatedSettings = { ...prevSettings } as AppSettings

      for (const s of settings) {
        updatedSettings![s.setting] = s.value
      }

      return updatedSettings
    })

    for (const s of settings) {
      await window.api.db.setCoreSetting({ key: s.setting, value: s.value! })
    }

    return true
  }

  async function getAllAppSettings() {
    if (appSettings) return appSettings

    const settingsArray = await window.api.db.getAllCoreSettings()
    const settingsObj = arrayToObject(settingsArray) as AppSettings

    setAppSettings(settingsObj)
    return settingsObj
  }

  return {
    appSettings,
    getAppSetting,
    setAppSettings,
    getAllAppSettings,
    updateAppSettings
  }
}

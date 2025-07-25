import { useState } from 'react'

import { Setting } from '@shared/types'
import { arrayToObject } from '~/libs/utils/utils'

type Value = string | boolean | number
export type AppSetting = Record<Setting, Value> | undefined

export type UseAppSettings = {
  appSettings: AppSetting | undefined
  getAppSetting: (v: Setting) => Promise<Value>
  getAllAppSettings: () => Promise<AppSetting>
  setAppSettings: React.Dispatch<React.SetStateAction<AppSetting>>
  updateAppSettings: (v: { setting: Setting; value: Value }[]) => Promise<boolean>
}

export function useAppSettings() {
  const [appSettings, setAppSettings] = useState<AppSetting>(undefined)

  async function getAppSetting(setting: Setting) {
    if (appSettings) return appSettings[setting]

    return JSON.parse(await window.api.getAppSetting({ setting }))
  }

  async function updateAppSettings(settings: { setting: Setting; value: Value }[]) {
    setAppSettings((prevSettings) => {
      const updatedSettings = { ...prevSettings } as AppSetting

      for (const s of settings) {
        updatedSettings![s.setting] = s.value
      }

      return updatedSettings
    })

    for (const s of settings) {
      await window.api.setAppSetting({ setting: s.setting, value: s.value })
    }

    return true
  }

  async function getAllAppSettings() {
    if (appSettings) return appSettings

    const settingsArray = await window.api.getAllAppSettings()
    const settingsObj = arrayToObject(settingsArray) as AppSetting

    setAppSettings(settingsObj)
    return settingsObj
  }

  // TODO; Do i need this?
  // async function deleteAppSetting({ setting }: { setting: Setting }) {
  // TODO; Remove a specific key from useState and the db settings table.
  // if(appSettings){
  //   appSettings.dateFormat = ""
  // }
  // }

  return {
    appSettings,
    getAppSetting,
    setAppSettings,
    getAllAppSettings,
    updateAppSettings
  }
}

import { useState } from 'react'
import { arrayToObject } from '~/libs/utils/utils'

type AppSetting = Record<string, string | boolean | number> | undefined

export type UseAppSettings = {
  appSettings: AppSetting
  getAllAppSettings: () => Promise<AppSetting>
  setAppSettings: React.Dispatch<React.SetStateAction<AppSetting>>
}

export function useAppSettings() {
  const [appSettings, setAppSettings] = useState<AppSetting>(undefined)

  function getAppSetting() {
    // TODO; Filter for setting from the useState.
  }

  function updateAppSetting() {
    // TODO; update a specific setting in useState and the db settings table.
  }

  async function getAllAppSettings() {
    const settingsArray = await window.api.getAllAppSettings()
    const settingsObj = arrayToObject(settingsArray)
    setAppSettings(settingsObj)
    return settingsObj
  }

  function deleteAppSetting() {
    // TODO; Remove a specific key from useState and the db settings table.
  }

  return {
    appSettings,
    setAppSettings,
    getAllAppSettings
  }
}

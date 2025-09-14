import { useState } from 'react'

import { UserSetting } from '@shared/types'
import { arrayToObject } from '~/libs/utils/utils'

type Value = string | boolean | number | undefined
export type UserSettings = Record<UserSetting, Value> | undefined

export type UseUserSettings = {
  userSettings: UserSettings | undefined
  getUserSetting: (v: UserSetting) => Promise<Value>
  getAllUserSettings: () => Promise<UserSettings>
  setUserSettings: React.Dispatch<React.SetStateAction<UserSettings>>
  updateUserSettings: (v: { setting: UserSetting; value: Value }[]) => Promise<boolean>
}

export function useUserSettings({ userId }: { userId: string | Value }) {
  const [userSettings, setUserSettings] = useState<UserSettings>(undefined)

  const id = userId as number

  async function getUserSetting(setting: UserSetting) {
    if (userSettings) return userSettings[setting]

    return JSON.parse(await window.api.db.getUserSetting({ userId: id, key: setting }))
  }

  async function updateUserSettings(settings: { setting: UserSetting; value: Value }[]) {
    setUserSettings((prevSettings) => {
      const updatedSettings = { ...prevSettings } as UserSettings

      for (const s of settings) {
        updatedSettings![s.setting] = s.value
      }

      return updatedSettings
    })

    for (const s of settings) {
      await window.api.db.setUserSetting({ userId: id, key: s.setting, value: s.value! })
    }

    return true
  }

  async function getAllUserSettings() {
    if (userSettings) return userSettings

    const settingsArray = await window.api.db.getAllUserSettings({ userId: id })
    const settingsObj = arrayToObject(settingsArray) as UserSettings

    setUserSettings(settingsObj)
    return settingsObj
  }

  return {
    userSettings,
    getUserSetting,
    setUserSettings,
    getAllUserSettings,
    updateUserSettings
  }
}

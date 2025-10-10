import { useEffect, useRef, useState } from 'react'

import { UserSetting } from '@shared/types'
import { arrayToObject } from '~/libs/utils/utils'

import { updateThemeUi } from '../utils/update-theme-ui'

type Value = string | boolean | number | undefined
export type UserSettings = Record<UserSetting, Value> | undefined

// prettier-ignore
export type UseUserSettings = {
  userSettings: UserSettings | undefined
  getUserSetting: (v: UserSetting) => Promise<Value>
  getAllUserSettings: (userIdTest?: number) => Promise<UserSettings>
  setUserSettings: React.Dispatch<React.SetStateAction<UserSettings>>
  updateUserSettings: (v: { newUserId?: number; setting: UserSetting; value: Value }[]) => Promise<boolean>
  applyUserSettingsToApp: (v: UserSettings) => Promise<boolean>
  deleteUserSettings: (v: { userId: number }) => Promise<boolean>
}

export function useUserSettings({ userId }: { userId?: string | Value }) {
  const [userSettings, setUserSettings] = useState<UserSettings>(undefined)
  const currentUserId = useRef(0)

  const id = userId as number

  // Reload the ui with the new users settings.
  useEffect(() => {
    const init = async () => {
      const settingsObj = await getAllUserSettings()
      await applyUserSettingsToApp(settingsObj)
      currentUserId.current = id
    }

    init()
  }, [id])

  async function updateUserSettings(
    settings: { newUserId?: number; setting: UserSetting; value: Value }[]
  ) {
    setUserSettings((prevSettings) => {
      const updatedSettings = { ...prevSettings } as UserSettings

      for (const s of settings) {
        updatedSettings![s.setting] = s.value
      }

      return updatedSettings
    })

    for (const s of settings) {
      await window.api.db.setUserSetting({
        userId: s.newUserId ?? id,
        key: s.setting,
        value: s.value!
      })
    }

    return true
  }

  async function getAllUserSettings() {
    if (id === currentUserId.current && userSettings) return userSettings

    const settingsArray = await window.api.db.getAllUserSettings({ userId: id })
    const settingsObj = arrayToObject(settingsArray) as UserSettings

    setUserSettings(settingsObj)
    return settingsObj
  }

  async function getUserSetting(setting: UserSetting) {
    if (userSettings) return userSettings[setting]

    return JSON.parse(await window.api.db.getUserSetting({ userId: id, key: setting }))
  }

  async function applyUserSettingsToApp(userSetting: UserSettings) {
    const currentTheme = userSetting?.theme as string | undefined

    updateThemeUi(currentTheme)
    return true
  }

  async function deleteUserSettings({ userId }: { userId: number }) {
    return await window.api.db.deleteUserSettings({ userId })
  }

  return {
    userSettings,
    getUserSetting,
    setUserSettings,
    getAllUserSettings,
    updateUserSettings,
    deleteUserSettings,
    applyUserSettingsToApp
  }
}

import { useEffect, useRef, useState } from 'react'

import { UserSetting } from '@shared/types'
import { arrayToObject } from '~/libs/utils/utils'

import { updateThemeUi } from '../utils/update-theme-ui'
import { parseOtherSettings } from '@shared/utils'

type Value = string | boolean | number | undefined
export type UserSettings = Record<UserSetting, Value> | undefined

// prettier-ignore
export type UseUserSettings = {
  userSettings: UserSettings | undefined
  getUserSetting: (v: UserSetting, userId?: number) => Promise<Value>
  getAllUserSettings: (userIdTest?: number) => Promise<UserSettings>
  setUserSettings: React.Dispatch<React.SetStateAction<UserSettings>>
  updateUserSettings: (v: { newUserId?: number; setting: UserSetting; value: Value }[]) => Promise<boolean>
  updateUserOtherSettings: (v: { key: string, value: string }) => Promise<boolean>
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

  async function updateUserOtherSettings({ key, value }: { key: string; value: string }) {
    const parsedOther = parseOtherSettings(userSettings)

    parsedOther[key] = value

    await updateUserSettings([{ setting: 'other', value: JSON.stringify(parsedOther) }])

    return true
  }

  async function getAllUserSettings() {
    if (id === currentUserId.current && userSettings) return userSettings

    const settingsArray = await window.api.db.getAllUserSettings({ userId: id })
    const settingsObj = arrayToObject(settingsArray) as UserSettings

    setUserSettings(settingsObj)
    return settingsObj
  }

  // RemoveThis / TODO?
  async function deleteUserSettings() {
    return false
  }

  async function getUserSetting(setting: UserSetting, userId?: number) {
    if (userSettings && !userId) return userSettings[setting]

    const maybeUserSettings = await window.api.db.getUserSetting({
      userId: userId ? userId : id, // Get a specific user id, OR, if undefined return the current userId in session.
      key: setting
    })

    return maybeUserSettings ? JSON.parse(maybeUserSettings) : undefined
  }

  async function applyUserSettingsToApp(userSetting: UserSettings) {
    const currentTheme = userSetting?.theme as string | undefined

    updateThemeUi(currentTheme)
    return true
  }

  return {
    userSettings,
    getUserSetting,
    setUserSettings,
    getAllUserSettings,
    updateUserSettings,
    updateUserOtherSettings,
    applyUserSettingsToApp,
    deleteUserSettings
  }
}

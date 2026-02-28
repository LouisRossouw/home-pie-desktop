import { UserSetting } from "./types"

type Value = string | boolean | number | undefined
type UserSettings = Record<UserSetting, Value> | undefined

export function getRandomInteger(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}


export function parseOtherSettings(userSettings: UserSettings): Record<string, string> {
  const rawOther = userSettings?.other as string | undefined
  return rawOther ? JSON.parse(rawOther) : {}
}
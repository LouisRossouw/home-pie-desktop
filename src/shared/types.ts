// TODO; Maybe switch to open-api, to generate api response types from my server.

import { defaultAppSettings } from '@main/src/default-app-settings'

export type ApiTest = { ok: boolean; data?: any }

export type Project = {
  title: string
  slug: string
  img?: string
  url: string
}

export type ApiProjectsList = { ok: boolean; data?: Project[] }

export type Setting = (typeof defaultAppSettings)[number]['slug']

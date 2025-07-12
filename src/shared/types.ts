// TODO; Maybe switch to open-api, to generate api response types from my server.

export type ApiTest = { ok: boolean; data?: any }

type Projects = {
  title: string
  slug: string
  img?: string
  url: string
}

export type ApiProjectsList = { ok: boolean; data?: Projects[] }

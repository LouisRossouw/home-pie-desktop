// import { ApiTimeInProgressOverview } from '@shared/types'

import { Schemas } from '@shared/types'
import invariant from 'tiny-invariant'

import { updateDotSquadActivity } from '@main/src/app'
import { requireSession } from '@main/src/session'

type Config = Schemas['Config']

export async function apiGetProjectConfig({
  project
}: {
  project: 'time-in-progress' | 'insta-insights' | 'yt-insights'
}) {
  const apiClient = await requireSession()

  try {
    const { response, data } = await apiClient.GET(`/api/${project}/config`, {})

    invariant(data, 'Something went wrong')

    if (response.status === 200) {
      updateDotSquadActivity({ activity: 'selectProject' })
      return data ?? []
    }

    return { ok: false }
  } catch (error) {
    return undefined
  }
}

export async function apiPutProjectConfig({
  project,
  config
}: {
  project: 'insta-insights' | 'yt-insights'
  config: Config
}) {
  const apiClient = await requireSession()

  try {
    const { response } = await apiClient.PUT(`/api/${project}/config`, {
      body: config
    })

    invariant(response.status === 204, 'Something went wrong')

    if (response.status === 204) {
      updateDotSquadActivity({ activity: 'selectProject' })
      return true
    }

    return false
  } catch (error) {
    return undefined
  }
}

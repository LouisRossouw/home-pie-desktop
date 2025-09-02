import { requireSession } from '@main/src/session'
import { updateDotSquadActivity } from '@main/src/app'
import axios from 'axios'

let ledStatus = false

export async function apiTest() {
  // const apiClient = await requireSession()

  const ledStatusStr = ledStatus ? 'on' : 'off'

  const apiClient = axios.create({
    baseURL: 'http://10.0.0.109',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // const response = await apiClient.get(`/led/${ledStatusStr}`, {
  const response = await apiClient.get(`/temperature`, {
    headers: { 'Content-Type': 'application/json' }
  })

  console.log(response.data)

  if (response.status === 200) {
    updateDotSquadActivity({ activity: 'simpleCheck' })
    ledStatus = !response.data.led
    return { ok: true, data: response.data }
  }

  console.error('Something went wrong')

  return { ok: false }
}

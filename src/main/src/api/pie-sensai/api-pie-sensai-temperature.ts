import { updateDotSquadActivity } from '@main/src/app'
import { handleError } from '@main/src/session'

export async function apiPieSensaiTemperature() {
  try {
    const response = await fetch(`http://10.0.0.153/temperature`)

    if (response.status === 200) {
      updateDotSquadActivity({ activity: 'simpleCheck' })
      const data = await response.json()

      return data
    }

    console.error('Something went wrong')

    return { ok: false }
  } catch (error) {
    handleError(error)
    return undefined
  }
}

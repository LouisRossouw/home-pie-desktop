import { updateDotSquadActivity } from '@main/src/app'
import { handleError } from '@main/src/session'

export async function apiPieSensaiError() {
  try {
    // To test the red error LEDS, exclude params on this endpoint.
    const response = await fetch(`http://10.0.0.153/message`)

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

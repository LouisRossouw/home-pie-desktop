import { updateDotSquadActivity } from '@main/src/app'
import { handleError } from '@main/src/session'

export async function apiPieSensaiMessage({
  message,
  textSize
}: {
  message: string
  textSize?: number
}) {
  // const apiClient = await requireSession()

  // Send a messsage directly to the device, good for quickl testing, but better to go
  // via the API

  try {
    const response = await fetch(
      `http://10.0.0.153/message?text=${message}&textSize=${textSize ?? 1}`
    )

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

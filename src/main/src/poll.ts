import { currentRoute, updateDotSquadActivity } from './app'

// TODO; System poll, Turn into a class in the future.

const ignoreRoutes = ['splash', 'login']

let intervalId: NodeJS.Timeout | null = null

let pollCount = 0
let pollResetAt = 99
let isPolling = false
const pollMS = 1000

let anEvent = 0
const resetAnEventAt = 10

export async function startPolling() {
  if (intervalId !== null) return
  intervalId = setInterval(polling, pollMS)
  isPolling = true
}

export function stopPolling() {
  if (intervalId !== null) {
    clearInterval(intervalId)
    intervalId = null
    isPolling = false
  }
}

function polling() {
  if (currentRoute === 'no-connection') {
    // TODO; remain in a loop, break when connection resolves
    // TODO; not 100% sure if this should be done in main process or renderer?
    console.log('Is there connection? check connection!')
  }

  if (ignoreRoutes.includes(currentRoute)) return

  const isAnEvent = anEvent === 0

  if (isAnEvent) {
    emitEventToRender('is-an-event')
  }

  // Update other checks
  incrementAndResetPoll()
  updateChecksCounter()
  // console.log('System Poll:', pollCount)
}

// Increment and reset poll count
function incrementAndResetPoll() {
  pollCount = pollCount < pollResetAt ? pollCount + 1 : 0
}

function updateChecksCounter() {
  anEvent = anEvent < resetAnEventAt ? anEvent + 1 : 0
}

// Emit events in the main process
function emitEvent(event: string) {
  console.log('Emiting:', event)
}

// Emit events to the render process
function emitEventToRender(event: string) {
  console.log('Emiting to render:', event)
  updateDotSquadActivity({ activity: 'singleBlink' })
  // mainWindow?.webContents.send('system:event', event)
}

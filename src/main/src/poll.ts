// import { mainWindow } from '..'

// TODO; System poll, Turn into a class in the future.

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
  const isAnEvent = anEvent === 0

  if (isAnEvent) {
    emitEvent('is-an-event')
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

function emitEvent(event: string) {
  console.log('Emiting:', event)
  // mainWindow?.webContents.send('system:event', event)
}

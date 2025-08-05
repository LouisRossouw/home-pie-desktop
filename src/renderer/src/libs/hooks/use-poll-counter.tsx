import { useEffect, useRef, useState } from 'react'

// ********

// Render poll; wip

// ********

type State = {
  pollCount: number
  addSomeStateHere: number // TODO; Add some check here
  addSomeOtherStateHere: number // TODO; Add some check here
}

export interface UsePollReturn {
  pollCount: number
  isPolling: boolean
  startPolling: () => void
  stopPolling: () => void
  pausePolling: (duration: number) => () => void
  state: State
}

// * The values in the state & poll count will reset back to 0 based on their individual resetValues,
// then use the value 0 as a trigger to some action / event.

const pollResetAt = 99

const resetValues = {
  addSomeStateHere: 5, // Temp
  addSomeOtherStateHere: 59 // 1 Min ie: in 1 minute this key will reset back to 0. and we can maybe use this to execute random taks, events, actions ?
}

export function usePoll(): UsePollReturn {
  const intervalIdRef = useRef<number | null>(null)

  const [state, setState] = useState({
    pollCount: 0,
    addSomeStateHere: 0, // TODO; Add some check here
    addSomeOtherStateHere: 0 // TODO; Add some check here
  })

  const [isPolling, setIsPolling] = useState(true)

  useEffect(() => {
    if (isPolling) {
      startPolling()
    } else {
      stopPolling()
    }
    return () => stopPolling()
  }, [isPolling])

  const polling = () => {
    setState((prev) => {
      const newState = { ...prev }

      newState.pollCount = prev.pollCount < pollResetAt ? prev.pollCount + 1 : 0

      updatePollStates(prev, newState)

      return newState
    })
  }

  const startPolling = () => {
    stopPolling()
    intervalIdRef.current = window.setInterval(polling, 1000) // TODO: Add an option in settings to change this value for performance
  }

  const stopPolling = () => {
    if (intervalIdRef.current !== null) {
      clearInterval(intervalIdRef.current)
      intervalIdRef.current = null
    }
  }

  const pausePolling = (duration: number) => {
    setIsPolling(false)
    const timer = setTimeout(() => {
      setIsPolling(true)
    }, duration)
    return () => clearTimeout(timer)
  }

  return {
    pollCount: state.pollCount,
    isPolling,
    startPolling,
    stopPolling,
    pausePolling,
    state
  }
}

function updatePollStates(prev: State, newState: State) {
  for (const k in resetValues) {
    if (prev[k as keyof typeof resetValues] < resetValues[k as keyof typeof resetValues]) {
      newState[k as keyof typeof resetValues] = prev[k as keyof typeof resetValues] + 1
    } else {
      newState[k as keyof typeof resetValues] = 0
    }
  }
}

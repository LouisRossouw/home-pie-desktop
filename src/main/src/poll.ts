// import { mainWindow } from '..'

// TODO; System poll, Turn into a class in the future.

export function startPoll() {
  let count = 0
  setInterval(() => {
    count < 99 ? count++ : (count = 0)
    console.log('System Poll:', count)
  }, 10000) // 10 seconds.
}

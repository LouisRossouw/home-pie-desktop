import { type Frame } from '.'

export default function playDotSquad(
  frames: Frame[],
  setDotA: (v: string) => void,
  setDotB: (v: string) => void,
  setDotC: (v: string) => void
) {
  // Feed a list of flashes
  function processItem(i: number) {
    setDotA(frames[i].a)
    setDotB(frames[i].b)
    setDotC(frames[i].c)

    // Check if there are more items to process
    if (i < frames.length - 1) {
      // Set a timeout to process the next item after the delay
      setTimeout(function () {
        setDotA('rgb(20, 20, 20)')
        setDotB('rgb(20, 20, 20)')
        setDotC('rgb(20, 20, 20)')

        processItem(i + 1)
      }, frames[i].delay)
    }
  }
  // Start the loop with the first item
  processItem(0)
}

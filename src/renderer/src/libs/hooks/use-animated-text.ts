import { useEffect, useRef } from 'react'

// Experimental and rebuilt with chatgpt,
// inspired by my original code in quixvert.com text fade in effect.

// It is not the best performance way to fade in text,
// but it has a specific look that i wanted.

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

async function animateHighlightGlow(el: HTMLElement) {
  let tg = 0
  let r = 250
  let g = 250
  let b = 250

  for (let t = 0; t < 10; t++) {
    await delay(25)
    tg += 0.1
    r -= 10
    g -= 0
    b -= 0
    el.style.textShadow = `0px 0px 5px rgba(150, 255, 100, ${tg})`
    el.style.color = `rgb(${r}, ${g}, ${b})`
  }

  for (let t = 1; t >= 0; t -= 0.1) {
    await delay(50)
    el.style.textShadow = `0px 0px 15px rgba(150, 255, 100, ${t})`
  }
}

export function useAnimatedText(
  text: string,
  options?: {
    trailCount?: number
    speed?: number
    uniqueId?: string
    delay?: number
  } // 👈 Updated option type
) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!ref.current) return
    const container = ref.current
    container.innerHTML = '' // clear previous
    container.style.display = 'inline-block'

    const trailCount = options?.trailCount ?? 5
    const speed = options?.speed ?? 80
    const initialDelay = options?.delay ?? 0 // 👈 Read the delay option
    const uid = options?.uniqueId ?? `anim_${Date.now()}`

    // --- Parsing and Element Creation (No Change) ---

    // First, handle the text with highlight markers and split into segments.
    const segments: { text: string; highlight: boolean }[] = []
    const highlightPattern = /<HIGHLIGHT-ME>(.*?)<\/HIGHLIGHT-ME>/g
    let lastIndex = 0
    let match

    while ((match = highlightPattern.exec(text)) !== null) {
      const nonHighlightedText = text.substring(lastIndex, match.index)
      if (nonHighlightedText.length > 0) {
        segments.push({ text: nonHighlightedText, highlight: false })
      }
      segments.push({ text: match[1], highlight: true })
      lastIndex = match.index + match[0].length
    }

    const remainingText = text.substring(lastIndex)
    if (remainingText.length > 0) {
      segments.push({ text: remainingText, highlight: false })
    }

    // Now, split segments into individual characters (including spaces)
    const characters: { char: string; highlight: boolean }[] = []
    segments.forEach((seg) => {
      for (const char of seg.text) {
        characters.push({ char, highlight: seg.highlight })
      }
    })

    // Create spans per character with initial blur & opacity
    characters.forEach((c, i) => {
      const span = document.createElement('span')
      span.id = `${uid}_${i}`
      span.style.filter = 'blur(4px)'
      span.style.opacity = '0'
      span.dataset.revealed = 'false'
      span.textContent = c.char
      if (c.char === ' ') {
        span.innerHTML = '&nbsp;'
      } else if (c.highlight) {
        span.dataset.highlight = 'true'
      }

      span.style.display = 'inline-block'
      container.appendChild(span)
    })

    // --- Animation: reveal characters in sliding window order ---
    ;(async function animate() {
      // 🚀 Apply the initial delay here before the animation loop starts
      if (initialDelay > 0) {
        await delay(initialDelay)
      }

      const spans = Array.from(container.children) as HTMLElement[]
      const totalSteps = spans.length

      for (let step = 0; step < totalSteps + trailCount; step++) {
        // wait every step
        await delay(speed)

        // for each position in the trail window
        for (let e = 0; e < trailCount; e++) {
          const idx = step - e
          if (idx < 0 || idx >= spans.length) continue
          const span = spans[idx]

          if (span.dataset.revealed === 'true') continue

          const fraction = (e + 1) / trailCount
          const targetOpacity = Math.min(1, fraction)
          const targetBlur = Math.max(0, 4 * (1 - fraction))

          const currOpacity = parseFloat(span.style.opacity || '0')
          const currFilter = span.style.filter || 'blur(4px)'
          const match = currFilter.match(/blur\(([\d.]+)px\)/)
          const currBlur = match ? parseFloat(match[1]) : 4

          const newOpacity = Math.max(currOpacity, targetOpacity)
          const newBlur = Math.min(currBlur, targetBlur)

          span.style.opacity = newOpacity.toString()
          span.style.filter = `blur(${newBlur}px)`

          if (fraction === 1) {
            span.style.opacity = '1'
            span.style.filter = 'blur(0px)'
            span.dataset.revealed = 'true'

            if (span.dataset.highlight === 'true') {
              setTimeout(() => animateHighlightGlow(span), 0)
            }
          }
        }
      }
    })()
  }, [text, options]) // Ensure options is in dependency array

  return ref
}

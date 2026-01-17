export function formatCount(value: number | string | null | undefined, decimals = 2): string {
  if (value === null || value === undefined) return ''

  const num = typeof value === 'string' ? Number(value) : value
  if (Number.isNaN(num)) return ''

  const units = ['', 'K', 'M', 'B', 'T']
  let n = Math.abs(num)
  let unitIndex = 0

  while (n >= 1000 && unitIndex < units.length - 1) {
    n /= 1000
    unitIndex++
  }

  const formatted =
    n % 1 === 0
      ? n.toString()
      : n
          .toFixed(decimals)
          .replace(/\.0+$/, '')
          .replace(/(\.\d*[1-9])0+$/, '$1')

  return `${num < 0 ? '-' : ''}${formatted}${units[unitIndex]}`
}

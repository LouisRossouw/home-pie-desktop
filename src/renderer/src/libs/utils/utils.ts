export function capitalize(str: string) {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function arrayToObject(array: Record<string, string>[]) {
  return array.reduce(
    (acc, { key, value }) => {
      try {
        acc[key] = JSON.parse(value)
      } catch {
        acc[key] = value
      }
      return acc
    },
    {} as Record<string, string | boolean | number>
  )
}

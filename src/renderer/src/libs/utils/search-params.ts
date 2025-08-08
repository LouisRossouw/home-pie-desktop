export function getAllSearchParams(SP: any) {
  const params = {} as any
  for (const [key, value] of SP.entries()) {
    params[key] = value
  }
  return params
}

export function buildPathAndSP(path: string, SP: any) {
  const newSP = new URLSearchParams(SP)
  return `${path}?${newSP.toString()}`
}

export function buildParamsString(paramsData: Record<string, any>) {
  const queryString = Object.entries(paramsData)
    .map(([key, value]) => {
      const k = encodeURIComponent(key)
      const v = encodeURIComponent(value ?? '')
      return `${k}=${v}`
    })
    .join('&')
  return queryString
}

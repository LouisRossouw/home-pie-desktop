const isDev = import.meta.env.DEV
const isProd = import.meta.env.PROD

export function getBaseURl() {
  if (isDev) return import.meta.env.VITE_DEV_BASEURL
  if (isProd) return import.meta.env.VITE_PROD_BASEURL
  return undefined
}

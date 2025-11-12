import { oAuthClients } from './constants'

const isDev = import.meta.env.DEV
const isProd = import.meta.env.PROD

export function getOAuthClients() {
  if (isDev) {
    return {
      GOOGLE_CLIENT_ID: import.meta.env.VITE_DEV_GOOGLE_CLIENT_ID,
      MANUAL_CLIENT_ID: import.meta.env.VITE_DEV_MANUAL_CLIENT_ID
    }
  }
  if (isProd) {
    return {
      GOOGLE_CLIENT_ID: import.meta.env.VITE_PROD_GOOGLE_CLIENT_ID,
      MANUAL_CLIENT_ID: import.meta.env.VITE_PROD_MANUAL_CLIENT_ID
    }
  }

  return undefined
}

export function getOauthClientForUserAuthType({ authType }: { authType?: string }) {
  return authType === '' ? oAuthClients!.MANUAL_CLIENT_ID : oAuthClients!.GOOGLE_CLIENT_ID
}

import * as coreSettings from './core-settings'
import * as userSettings from './user-settings'
import * as session from './session'
import * as finances from './finances'

export const SQL = {
  ...coreSettings,
  ...userSettings,
  ...session,
  ...finances
}


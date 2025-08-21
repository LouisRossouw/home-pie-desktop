import { NavAPI, navAPI } from './nav-api'
import { AppAPI, appAPI } from './app-api'
import { testAPI, TestAPI } from './test-api'
import { ExternalAPI, externalAPI } from './external-api'
import { DatabaseAppSettingsAPI, databaseAppSettingsAPI } from './database-api'

export const api = {
  nav: navAPI,
  app: appAPI,
  test: testAPI,
  external: externalAPI,
  db: databaseAppSettingsAPI
}

export type Api = {
  nav: NavAPI
  app: AppAPI
  test: TestAPI
  external: ExternalAPI
  db: DatabaseAppSettingsAPI
}

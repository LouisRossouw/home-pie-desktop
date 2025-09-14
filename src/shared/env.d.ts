interface ImportMetaEnv {
  // API
  readonly VITE_DEV_API_BASEURL: string
  readonly VITE_PROD_API_BASEURL: string

  // APP
  readonly VITE_DEV_APP_BASEURL: string
  readonly VITE_PROD_APP_BASEURL: string

  // WEB
  readonly VITE_DEV_WEB_BASEURL: string
  readonly VITE_PROD_WEB_BASEURL: string

  // AUTH CLIENTS IDS
  readonly VITE_PROD_GOOGLE_CLIENT_ID: string
  readonly VITE_PROD_MANUAL_CLIENT_ID: string
  readonly VITE_DEV_GOOGLE_CLIENT_ID: string
  readonly VITE_DEV_MANUAL_CLIENT_ID: string
  readonly VITE_LOCAL_SERVER_PROJECTS_PATH: string
  // readonly VITE_BUILD_DATE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

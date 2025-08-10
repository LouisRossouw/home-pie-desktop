interface ImportMetaEnv {
  readonly VITE_DEV_BASEURL: string
  readonly VITE_PROD_BASEURL: string
  readonly VITE_PROD_GOOGLE_CLIENT_ID: string
  readonly VITE_PROD_MANUAL_CLIENT_ID: string
  readonly VITE_DEV_GOOGLE_CLIENT_ID: string
  readonly VITE_DEV_MANUAL_CLIENT_ID: string
  readonly VITE_LOCAL_SERVER_PROJECTS_PATH: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TEST: string
  readonly VITE_DEV_BASEURL: string
  readonly VITE_PROD_BASEURL: string
  readonly VITE_PROD_GOOGLE_CLIENT_ID: string
  readonly VITE_PROD_MANUAL_CLIENT_ID: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

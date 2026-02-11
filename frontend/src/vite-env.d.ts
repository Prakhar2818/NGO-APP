/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_SOCKET_URL: string
  readonly VITE_ADMIN_CONTACT_EMAIL: string
  readonly PROD: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

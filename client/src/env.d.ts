/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  VITE_APP_LIFFID: string
  VITE_APP_USE_VCONSOLE: string
}

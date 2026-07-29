import { createPinia } from 'pinia'
import { createApp, type App as VueApp } from 'vue'
import App from './App.vue'
import { createAppRouter } from './router'

export interface MountProps {
  container: HTMLElement | string
  basename?: string
}

let appInstance: VueApp | null = null

export async function bootstrap(_props: MountProps) {
  console.log('[billing] bootstrap called')
}

export async function mount(props: MountProps) {
  const container =
    typeof props.container === 'string'
      ? (document.getElementById(props.container) as HTMLElement)
      : props.container

  if (!container) {
    throw new Error(`[billing] container not found: ${props.container}`)
  }

  const app = createApp(App)
  const pinia = createPinia()
  const router = createAppRouter()

  // Sync with Shell's basename if provided
  if (props.basename) {
    router.options.history = createWebHistoryWithBasename(props.basename)
  }

  app.use(pinia)
  app.use(router)
  app.mount(container)
  appInstance = app

  console.log('[billing] mounted to', container)
  return app
}

export async function unmount(_props?: MountProps) {
  if (appInstance) {
    appInstance.unmount()
    appInstance = null
    console.log('[billing] unmounted')
  }
}

function createWebHistoryWithBasename(basename: string) {
  return createWebHashHistory(basename)
}

import { createWebHashHistory } from 'vue-router'

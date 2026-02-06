import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import VueApexCharts from 'vue3-apexcharts'
import App from './App.vue'
import router from './app/router'
import { i18n } from './i18n'
import { connectRealtime, setQueryClient } from './realtime/client'
import './style.css'

async function initApp() {
  // MSW disabled - not using mocks/dummy data
  // MSW setup removed to prevent console errors

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchInterval: false,
        retry: 0, // Don't retry on error - show error state immediately
        staleTime: 60_000, // 60 seconds - data is fresh for 1 minute
      },
    },
  })

  const app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)
  app.use(VueQueryPlugin, { queryClient })
  app.use(VueApexCharts)
  app.use(router)
  app.use(i18n)

  // Setup realtime (polling disabled to prevent continuous refetch)
  setQueryClient(queryClient)
  // WebSocket connection only - no polling fallback
  connectRealtime()
  // Polling disabled: setupPolling(queryClient) - removed to prevent continuous refetch

  app.mount('#app')
}

initApp().catch(console.error)

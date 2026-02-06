import type { QueryClient } from '@tanstack/vue-query'
import type { RealtimeEvent, RealtimeEventHandler } from './events'

let ws: WebSocket | null = null
let pollingInterval: ReturnType<typeof setInterval> | null = null
const POLLING_INTERVAL = 10000 // 10 seconds
const handlers: RealtimeEventHandler[] = []

const wsUrl = import.meta.env.VITE_WS_URL

export function connectRealtime(): boolean {
  if (wsUrl) {
    try {
      ws = new WebSocket(wsUrl)
      
      ws.onopen = () => {
        console.log('WebSocket connected')
        if (pollingInterval) {
          clearInterval(pollingInterval)
          pollingInterval = null
        }
      }

      ws.onmessage = (event) => {
        try {
          const data: RealtimeEvent = JSON.parse(event.data)
          handleEvent(data)
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        fallbackToPolling()
      }

      ws.onclose = () => {
        console.log('WebSocket closed')
        fallbackToPolling()
      }
      
      return true
    } catch (error) {
      console.error('Failed to connect WebSocket:', error)
      fallbackToPolling()
      return false
    }
  } else {
    fallbackToPolling()
    return false
  }
}

function fallbackToPolling() {
  // Polling disabled to prevent continuous refetch
  // If WebSocket fails, queries will only refetch on manual user action
  if (pollingInterval) return

  // Polling disabled - no automatic refetch
  // console.log('Falling back to polling') // Disabled
  // if (queryClientInstance) {
  //   pollingInterval = setInterval(() => {
  //     queryClientInstance!.invalidateQueries({ queryKey: ['orders'] })
  //     queryClientInstance!.invalidateQueries({ queryKey: ['dashboardSummary'] })
  //   }, POLLING_INTERVAL)
  // }
}

export function setupPolling(queryClient: QueryClient) {
  // Polling disabled to prevent continuous refetch
  // Queries will only refetch on manual user action (retry button, etc.)
  if (pollingInterval) {
    clearInterval(pollingInterval)
    pollingInterval = null
  }
  // Disabled polling:
  // pollingInterval = setInterval(() => {
  //   queryClient.invalidateQueries({ queryKey: ['orders'] })
  //   queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] })
  // }, POLLING_INTERVAL)
}

let queryClientInstance: QueryClient | null = null

export function setQueryClient(client: QueryClient) {
  queryClientInstance = client
}

function handleEvent(event: RealtimeEvent) {
  if (queryClientInstance) {
    switch (event.type) {
      case 'order.created':
      case 'order.updated':
        queryClientInstance.invalidateQueries({ queryKey: ['orders'] })
        queryClientInstance.invalidateQueries({ queryKey: ['dashboardSummary'] })
        break
      case 'inventory.low_stock':
        queryClientInstance.invalidateQueries({ queryKey: ['products'] })
        queryClientInstance.invalidateQueries({ queryKey: ['dashboardSummary'] })
        break
    }
  }

  handlers.forEach((handler) => handler(event))
}

export function subscribe(handler: RealtimeEventHandler) {
  handlers.push(handler)
  return () => {
    const index = handlers.indexOf(handler)
    if (index > -1) {
      handlers.splice(index, 1)
    }
  }
}

export function disconnectRealtime() {
  if (ws) {
    ws.close()
    ws = null
  }
  if (pollingInterval) {
    clearInterval(pollingInterval)
    pollingInterval = null
  }
}

import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export interface Command {
  id: string
  title: string
  keywords?: string[]
  route: string
  query?: Record<string, string>
  group: string
  description?: string
}

const STORAGE_KEY = 'command-palette-recent'
const MAX_RECENT = 8

export const isOpen = ref(false)
export const query = ref('')

const recentCommands = ref<Command[]>([])

// Load recent commands from localStorage
function loadRecentCommands(): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      recentCommands.value = JSON.parse(stored)
    }
  } catch (error) {
    console.warn('Failed to load recent commands:', error)
  }
}

// Save recent commands to localStorage
function saveRecentCommands(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentCommands.value))
  } catch (error) {
    console.warn('Failed to save recent commands:', error)
  }
}

// Initialize
loadRecentCommands()

export function open(): void {
  isOpen.value = true
  query.value = ''
}

export function close(): void {
  isOpen.value = false
  query.value = ''
}

export function toggle(): void {
  if (isOpen.value) {
    close()
  } else {
    open()
  }
}

export function runCommand(command: Command): void {
  // Add to recent (remove if already exists, then add to front)
  const index = recentCommands.value.findIndex((c) => c.id === command.id)
  if (index !== -1) {
    recentCommands.value.splice(index, 1)
  }
  recentCommands.value.unshift(command)
  
  // Keep only MAX_RECENT
  if (recentCommands.value.length > MAX_RECENT) {
    recentCommands.value = recentCommands.value.slice(0, MAX_RECENT)
  }
  
  saveRecentCommands()
  
  // Navigate
  const router = useRouter()
  router.push({
    path: command.route,
    query: command.query,
  })
  
  close()
}

export const recentCommandsList = computed(() => recentCommands.value)

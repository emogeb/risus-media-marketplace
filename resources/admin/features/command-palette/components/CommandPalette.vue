<template>
  <Teleport to="body">
    <Transition name="command-palette">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] overflow-y-auto"
        @click.self="close"
      >
        <!-- Overlay -->
        <div class="fixed inset-0 bg-black/30 backdrop-blur-sm" @click="close" />
        
        <!-- Panel -->
        <div class="flex min-h-screen items-start justify-center pt-[20vh] px-4">
          <div
            class="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-200 transition-all"
            @click.stop
          >
            <!-- Input -->
            <div class="border-b border-gray-200 p-4">
              <input
                ref="inputRef"
                v-model="query"
                type="text"
                :placeholder="$t('commandPalette.placeholder')"
                class="w-full bg-transparent text-lg outline-none placeholder:text-gray-400"
                @keydown.esc="close"
                @keydown.down.prevent="selectNext"
                @keydown.up.prevent="selectPrev"
                @keydown.enter.prevent="executeSelected"
              />
            </div>

            <!-- Results -->
            <div class="max-h-[60vh] overflow-y-auto">
              <!-- Loading (not needed for now, but structure ready) -->
              
              <!-- Empty State -->
              <div v-if="filteredCommands.length === 0" class="py-12 text-center">
                <p class="text-sm text-gray-500">{{ $t('commandPalette.empty') }}</p>
              </div>

              <!-- Commands List -->
              <div v-else class="py-2">
                <div
                  v-for="(group, groupIndex) in groupedCommands"
                  :key="group.name"
                  class="mb-4"
                >
                  <!-- Group Header -->
                  <div class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {{ group.name }}
                  </div>

                  <!-- Group Commands -->
                  <div
                    v-for="(command, cmdIndex) in group.commands"
                    :key="command.id"
                    :ref="(el) => setCommandRef(el, groupIndex, cmdIndex)"
                    :class="[
                      'flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors',
                      selectedIndex === getCommandIndex(groupIndex, cmdIndex)
                        ? 'bg-blue-50 text-blue-900'
                        : 'hover:bg-gray-50 text-gray-900',
                    ]"
                    @click="executeCommand(command)"
                    @mouseenter="selectedIndex = getCommandIndex(groupIndex, cmdIndex)"
                  >
                    <!-- Icon placeholder -->
                    <div class="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                      <svg
                        v-if="command.group === 'navigation'"
                        class="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                      <svg
                        v-else
                        class="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                        />
                      </svg>
                    </div>

                    <!-- Command Info -->
                    <div class="flex-1 min-w-0">
                      <div class="text-sm font-medium">{{ command.title }}</div>
                      <div v-if="command.description" class="text-xs text-gray-500 mt-0.5">
                        {{ command.description }}
                      </div>
                    </div>

                    <!-- Keyboard hint -->
                    <div class="flex-shrink-0 text-xs text-gray-400">
                      <kbd class="px-2 py-1 bg-gray-100 rounded">↵</kbd>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer hint -->
            <div class="border-t border-gray-200 px-4 py-2 flex items-center justify-between text-xs text-gray-500">
              <div class="flex items-center gap-4">
                <span class="flex items-center gap-1">
                  <kbd class="px-1.5 py-0.5 bg-gray-100 rounded text-xs">↑</kbd>
                  <kbd class="px-1.5 py-0.5 bg-gray-100 rounded text-xs">↓</kbd>
                  {{ $t('commandPalette.navigate') }}
                </span>
                <span class="flex items-center gap-1">
                  <kbd class="px-1.5 py-0.5 bg-gray-100 rounded text-xs">↵</kbd>
                  {{ $t('commandPalette.select') }}
                </span>
              </div>
              <span class="flex items-center gap-1">
                <kbd class="px-1.5 py-0.5 bg-gray-100 rounded text-xs">Esc</kbd>
                {{ $t('commandPalette.close') }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  isOpen,
  query,
  open,
  close,
  runCommand as executeCommand,
  type Command,
} from '../composables/useCommandPalette'

const { t } = useI18n()

const inputRef = ref<HTMLInputElement | null>(null)
const selectedIndex = ref(0)
const commandRefs = ref<(HTMLElement | null)[][]>([])

// Define all commands
const allCommands = computed<Command[]>(() => [
  // Navigation
  {
    id: 'dashboard',
    title: t('commandPalette.commands.dashboard.title'),
    keywords: ['dashboard', 'ana', 'sayfa', 'home'],
    route: '/',
    group: 'navigation',
  },
  {
    id: 'orders',
    title: t('commandPalette.commands.orders.title'),
    keywords: ['sipariş', 'order', 'siparişler'],
    route: '/orders',
    group: 'navigation',
  },
  {
    id: 'products',
    title: t('commandPalette.commands.products.title'),
    keywords: ['ürün', 'product', 'ürünler', 'stok'],
    route: '/products',
    group: 'navigation',
  },
  {
    id: 'customers-individual',
    title: t('commandPalette.commands.customersIndividual.title'),
    keywords: ['müşteri', 'customer', 'bireysel', 'individual'],
    route: '/customers/individual',
    group: 'navigation',
  },
  {
    id: 'customers-company',
    title: t('commandPalette.commands.customersCompany.title'),
    keywords: ['müşteri', 'customer', 'şirket', 'company'],
    route: '/customers/company',
    group: 'navigation',
  },
  {
    id: 'sellers',
    title: t('commandPalette.commands.sellers.title'),
    keywords: ['satıcı', 'seller', 'satıcılar'],
    route: '/sellers',
    group: 'navigation',
  },
  // Quick Filters
  {
    id: 'low-stock',
    title: t('commandPalette.commands.lowStock.title'),
    description: t('commandPalette.commands.lowStock.description'),
    keywords: ['düşük', 'stok', 'low', 'stock'],
    route: '/products',
    query: { lowStock: 'true' },
    group: 'quickFilters',
  },
  {
    id: 'pending-payment',
    title: t('commandPalette.commands.pendingPayment.title'),
    description: t('commandPalette.commands.pendingPayment.description'),
    keywords: ['ödeme', 'bekleyen', 'pending', 'payment'],
    route: '/orders',
    query: { payment_status: 'pending' },
    group: 'quickFilters',
  },
  {
    id: 'to-pack',
    title: t('commandPalette.commands.toPack.title'),
    description: t('commandPalette.commands.toPack.description'),
    keywords: ['paket', 'pack', 'sevkiyat', 'fulfillment'],
    route: '/fulfillment',
    query: { status: 'to_pack' },
    group: 'quickFilters',
  },
])

// Filter commands based on query
const filteredCommands = computed(() => {
  const q = query.value.toLowerCase().trim()
  if (!q) {
    return allCommands.value
  }

  return allCommands.value.filter((cmd) => {
    const titleMatch = cmd.title.toLowerCase().includes(q)
    const keywordMatch = cmd.keywords?.some((kw) => kw.toLowerCase().includes(q))
    return titleMatch || keywordMatch
  })
})

// Group commands
const groupedCommands = computed(() => {
  const groups: Record<string, Command[]> = {}
  
  filteredCommands.value.forEach((cmd) => {
    if (!groups[cmd.group]) {
      groups[cmd.group] = []
    }
    groups[cmd.group].push(cmd)
  })

  return Object.entries(groups).map(([name, commands]) => ({
    name: t(`commandPalette.groups.${name}`),
    commands,
  }))
})

// Get flat index from group and command index
function getCommandIndex(groupIndex: number, cmdIndex: number): number {
  let index = 0
  for (let i = 0; i < groupIndex; i++) {
    index += groupedCommands.value[i].commands.length
  }
  return index + cmdIndex
}

// Set command ref
function setCommandRef(el: any, groupIndex: number, cmdIndex: number): void {
  if (!commandRefs.value[groupIndex]) {
    commandRefs.value[groupIndex] = []
  }
  commandRefs.value[groupIndex][cmdIndex] = el
}

// Keyboard navigation
function selectNext(): void {
  const total = filteredCommands.value.length
  if (total === 0) return
  selectedIndex.value = (selectedIndex.value + 1) % total
  scrollToSelected()
}

function selectPrev(): void {
  const total = filteredCommands.value.length
  if (total === 0) return
  selectedIndex.value = selectedIndex.value === 0 ? total - 1 : selectedIndex.value - 1
  scrollToSelected()
}

function scrollToSelected(): void {
  nextTick(() => {
    // Find the selected element and scroll into view
    let currentIndex = 0
    for (let groupIndex = 0; groupIndex < groupedCommands.value.length; groupIndex++) {
      const group = groupedCommands.value[groupIndex]
      for (let cmdIndex = 0; cmdIndex < group.commands.length; cmdIndex++) {
        if (currentIndex === selectedIndex.value) {
          const el = commandRefs.value[groupIndex]?.[cmdIndex]
          if (el) {
            el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
          }
          return
        }
        currentIndex++
      }
    }
  })
}

function executeSelected(): void {
  if (filteredCommands.value.length === 0) return
  
  // Find selected command
  let currentIndex = 0
  for (const group of groupedCommands.value) {
    for (const cmd of group.commands) {
      if (currentIndex === selectedIndex.value) {
        executeCommand(cmd)
        return
      }
      currentIndex++
    }
  }
}

// Reset selection when query changes
watch(query, () => {
  selectedIndex.value = 0
})

// Focus input when opened
watch(isOpen, (newValue) => {
  if (newValue) {
    nextTick(() => {
      inputRef.value?.focus()
      selectedIndex.value = 0
    })
  }
})

// Global keyboard shortcuts
function handleKeyDown(event: KeyboardEvent): void {
  // Check if user is typing in an input/textarea
  const target = event.target as HTMLElement
  const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'
  const isContentEditable = target.isContentEditable
  
  // Ctrl+K or Cmd+K (don't trigger if typing in input/textarea)
  if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
    if (!isInput && !isContentEditable) {
      event.preventDefault()
      if (!isOpen.value) {
        open()
      }
    }
    return
  }
  
  // ESC (only if palette is open and not in input)
  if (event.key === 'Escape' && isOpen.value && !isInput) {
    event.preventDefault()
    close()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.command-palette-enter-active,
.command-palette-leave-active {
  transition: opacity 0.2s ease;
}

.command-palette-enter-from,
.command-palette-leave-to {
  opacity: 0;
}

.command-palette-enter-active .relative,
.command-palette-leave-active .relative {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.command-palette-enter-from .relative,
.command-palette-leave-to .relative {
  transform: scale(0.95);
  opacity: 0;
}
</style>

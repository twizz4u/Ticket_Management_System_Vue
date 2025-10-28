<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppFooter from '@/component/AppFooter.vue'
import AppAdd from './AppAdd.vue'
import AppToast from '@/component/AppToast.vue'

const STORAGE_KEY = 'tms:tickets'

// Toast state
const toast = ref({
  show: false,
  message: '',
  type: 'success',
})

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
}

const hideToast = () => {
  toast.value.show = false
}

const sidebarOpen = ref(true)

const router = useRouter()

// load from localStorage if available, otherwise use defaults
const defaultTickets = [
  { id: 'TCK-001', title: 'Login issue', status: 'Open', priority: 'High', assignee: 'Alice' },
  {
    id: 'TCK-002',
    title: 'Error on checkout',
    status: 'In Progress',
    priority: 'Medium',
    assignee: 'Bob',
  },
  {
    id: 'TCK-003',
    title: 'Feature request: reports',
    status: 'Closed',
    priority: 'Low',
    assignee: 'Carol',
  },
]

const tickets = ref([])

const loadTickets = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) tickets.value = JSON.parse(raw)
    else tickets.value = defaultTickets.slice()
  } catch (err) {
    // if parse error, fall back and log
    console.error('Failed to load tickets from localStorage', err)
    tickets.value = defaultTickets.slice()
  }
}

const saveTickets = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets.value))
  } catch (e) {
    console.error('Failed to save tickets', e)
    showToast('Failed to save changes. Please try again.', 'error')
    return false
  }
  return true
}

onMounted(() => loadTickets())

const counts = computed(() => {
  return {
    open: tickets.value.filter((t) => t.status === 'Open').length,
    inProgress: tickets.value.filter((t) => t.status === 'In Progress').length,
    closed: tickets.value.filter((t) => t.status === 'Closed').length,
  }
})

const activeView = ref('dashboard') // 'dashboard' | 'create'
const editingTicket = ref(null)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const showDashboard = () => {
  editingTicket.value = null
  activeView.value = 'dashboard'
}

const showCreate = () => {
  editingTicket.value = null
  activeView.value = 'create'
}

const handleTicketCreated = (ticket) => {
  // prepend new ticket and persist
  tickets.value.unshift(ticket)
  if (saveTickets()) {
    showToast('Ticket created successfully')
  }
  activeView.value = 'dashboard'
}

const handleTicketUpdated = (updated) => {
  const idx = tickets.value.findIndex((t) => t.id === updated.id)
  if (idx !== -1) {
    tickets.value.splice(idx, 1, updated)
    if (saveTickets()) {
      showToast('Ticket updated successfully')
    }
  }
  activeView.value = 'dashboard'
  editingTicket.value = null
}

const editTicket = (ticket) => {
  editingTicket.value = { ...ticket }
  activeView.value = 'create'
}

const deleteTicket = (id) => {
  if (!window.confirm('Delete this ticket? This cannot be undone.')) return
  const idx = tickets.value.findIndex((t) => t.id === id)
  if (idx !== -1) {
    tickets.value.splice(idx, 1)
    if (saveTickets()) {
      showToast('Ticket deleted', 'info')
    }
  }
}

const logout = () => {
  try {
    // Clear auth state but keep stored users and tickets
    localStorage.removeItem('tms:auth')
    localStorage.removeItem('tms:user')
  } catch (e) {
    console.error('Logout failed', e)
  }
  // Navigate to signin page
  router.push({ name: 'signin' })
}
</script>

<template>
  <section class="min-h-screen bg-white">
    <!-- Toast -->
    <AppToast :show="toast.show" :message="toast.message" :type="toast.type" @close="hideToast" />

    <!-- Header -->
    <header class="flex items-center justify-between px-6 py-4 border-b bg-cyan-50">
      <div class="flex items-center gap-4">
        <button
          @click="toggleSidebar"
          aria-label="Toggle sidebar"
          class="p-2 rounded-md hover:bg-cyan-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-cyan-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h2 class="text-xl font-semibold text-gray-800">
          {{ activeView === 'dashboard' ? 'Dashboard' : 'Create Ticket' }}
        </h2>
      </div>

      <div class="flex items-center">
        <button
          @click="showCreate"
          class="flex items-center gap-2 px-3 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
        >
          New Ticket
        </button>
      </div>
    </header>

    <!-- Body -->
    <div class="flex">
      <!-- Sidebar -->
      <aside
        :class="[
          sidebarOpen ? 'w-0 sm:w-64' : 'sm:w-0 w-64',
          'transition-all duration-200 bg-cyan-700 text-cyan-50 h-[calc(100vh-64px)] overflow-auto',
        ]"
      >
        <div class="p-4 flex flex-col h-full">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-2">
              <span class="ml-1 text-lg font-bold">TicketPro</span>
            </div>
            <button @click="toggleSidebar" class="md:hidden p-1 rounded hover:bg-cyan-600/30">
              ✕
            </button>
          </div>

          <nav class="flex-1">
            <ul class="space-y-2 text-sm">
              <li
                @click="showDashboard"
                :class="[
                  'px-2 py-2 rounded cursor-pointer',
                  activeView === 'dashboard' ? 'bg-cyan-600/20' : 'hover:bg-cyan-600/20',
                ]"
              >
                View Tickets
              </li>
              <li
                @click="showCreate"
                :class="[
                  'px-2 py-2 rounded cursor-pointer',
                  activeView === 'create' ? 'bg-cyan-600/20' : 'hover:bg-cyan-600/20',
                ]"
              >
                Create Ticket
              </li>
            </ul>
          </nav>

          <div class="mt-4 text-xs text-cyan-200">
            <button @click="logout" class="w-full text-left px-2 py-2 rounded hover:bg-cyan-600/20">
              Logout
            </button>
          </div>
        </div>
      </aside>

      <!-- Main content -->
      <main class="flex-1 p-6 bg-cyan-50 min-h-[calc(100vh-64px)]">
        <!-- Metrics -->
        <div v-if="activeView === 'dashboard'">
          <!-- Analytics metric cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div class="p-4 bg-white rounded-lg shadow-sm flex items-center justify-between">
              <div>
                <h3 class="text-sm text-gray-500">Open Tickets</h3>
                <p class="text-2xl font-semibold text-gray-800">{{ counts.open }}</p>
              </div>
              <div class="bg-cyan-100 p-3 rounded-full text-cyan-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4"
                  />
                </svg>
              </div>
            </div>

            <div class="p-4 bg-white rounded-lg shadow-sm flex items-center justify-between">
              <div>
                <h3 class="text-sm text-gray-500">In Progress</h3>
                <p class="text-2xl font-semibold text-gray-800">{{ counts.inProgress }}</p>
              </div>
              <div class="bg-orange-100 p-3 rounded-full text-orange-600">
                <!-- Analytics / in-progress icon (three bars) -->
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <rect x="4" y="10" width="3.5" height="10" rx="0.5" />
                  <rect x="10.25" y="6" width="3.5" height="14" rx="0.5" />
                  <rect x="16.5" y="2" width="3.5" height="18" rx="0.5" />
                </svg>
              </div>
            </div>

            <div class="p-4 bg-white rounded-lg shadow-sm flex items-center justify-between">
              <div>
                <h3 class="text-sm text-gray-500">Closed</h3>
                <p class="text-2xl font-semibold text-gray-800">{{ counts.closed }}</p>
              </div>
              <div class="bg-cyan-100 p-3 rounded-full text-cyan-600">
                <!-- Closed icon: lock (filled style) -->
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5 8V6a5 5 0 0110 0v2h1a1 1 0 011 1v7a2 2 0 01-2 2H5a2 2 0 01-2-2V9a1 1 0 011-1h1zm2-2a3 3 0 116 0v2H7V6z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- Demarcation: separator and heading -->
          <div class="w-full flex items-center mb-4">
            <hr class="flex-1 border-cyan-200" />
            <span class="mx-4 text-cyan-700 font-semibold text-lg">Tickets</span>
            <hr class="flex-1 border-cyan-200" />
          </div>

          <div
            class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 overflow-y-auto max-h-[48vh]"
          >
            <article
              v-for="ticket in tickets"
              :key="ticket.id"
              class="bg-white p-4 rounded-lg shadow-sm hover:shadow-lg transition"
            >
              <div class="flex items-start justify-between">
                <div>
                  <p class="text-xs text-gray-500">{{ ticket.id }}</p>
                  <h3 class="mt-1 text-lg font-semibold text-gray-800">{{ ticket.title }}</h3>
                </div>
                <div class="ml-4 shrink-0">
                  <span
                    :class="[
                      'inline-flex items-center px-2 py-1 rounded text-xs font-semibold',
                      ticket.priority === 'High'
                        ? 'bg-red-100 text-red-700'
                        : ticket.priority === 'Medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700',
                    ]"
                    >{{ ticket.priority }}</span
                  >
                </div>
              </div>

              <div class="mt-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div
                    class="h-8 w-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700 font-semibold"
                  >
                    {{ ticket.assignee ? ticket.assignee.charAt(0) : '?' }}
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Assignee</p>
                    <p class="text-sm font-medium text-gray-800">{{ ticket.assignee }}</p>
                  </div>
                </div>

                <div class="text-right">
                  <p class="text-sm text-gray-600">Status</p>
                  <p
                    :class="[
                      'inline-flex items-center px-2 py-1 rounded text-sm font-semibold',
                      ticket.status === 'Open'
                        ? 'bg-cyan-100 text-cyan-700'
                        : ticket.status === 'In Progress'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-gray-100 text-gray-700',
                    ]"
                  >
                    {{ ticket.status }}
                  </p>
                </div>
              </div>

              <div class="mt-4 flex items-center justify-end gap-3">
                <button @click="editTicket(ticket)" class="text-cyan-600 hover:underline">
                  Edit
                </button>
                <button @click="deleteTicket(ticket.id)" class="text-red-600">Delete</button>
              </div>
            </article>
          </div>
        </div>

        <div v-if="activeView === 'create'">
          <AppAdd
            :ticket="editingTicket"
            @ticket-created="handleTicketCreated"
            @ticket-updated="handleTicketUpdated"
            @cancel="showDashboard"
          />
        </div>
      </main>
    </div>

    <footer>
      <AppFooter />
    </footer>
  </section>
</template>

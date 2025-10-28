<script setup>
import { ref, watch, onMounted, computed } from 'vue'

// support both create and edit flows
const props = defineProps({
  ticket: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['ticket-created', 'ticket-updated', 'cancel'])

const form = ref({
  title: '',
  description: '',
  assignee: '',
  priority: 'Medium',
  status: 'Open',
})

const errors = ref({})
const isSubmitting = ref(false)

const populateForm = (t) => {
  if (!t) {
    form.value = { title: '', description: '', assignee: '', priority: 'Medium', status: 'Open' }
    return
  }
  form.value = {
    title: t.title || '',
    description: t.description || '',
    assignee: t.assignee || '',
    priority: t.priority || 'Medium',
    status: t.status || 'Open',
  }
}

// initialize from prop when mounted or when prop changes
onMounted(() => populateForm(props.ticket))
watch(
  () => props.ticket,
  (next) => populateForm(next),
  { deep: true },
)

const isEdit = computed(() => !!props.ticket && !!props.ticket.id)

const validate = () => {
  errors.value = {}
  if (!form.value.title.trim()) errors.value.title = 'Title is required'
  if (!form.value.description.trim()) errors.value.description = 'Description is required'
  if (!form.value.assignee.trim()) errors.value.assignee = 'Assignee is required'
  return Object.keys(errors.value).length === 0
}

const makeId = () => {
  // Simple id generator: TCK- + last 6 of timestamp
  return `TCK-${String(Date.now()).slice(-6)}`
}

const submit = async (e) => {
  e.preventDefault()
  if (!validate()) return
  isSubmitting.value = true
  try {
    if (props.ticket && props.ticket.id) {
      // editing existing ticket: keep id
      const updated = { id: props.ticket.id, ...form.value }
      emit('ticket-updated', updated)
    } else {
      const ticket = { id: makeId(), ...form.value }
      emit('ticket-created', ticket)
      // Reset form for next create
      form.value = { title: '', description: '', assignee: '', priority: 'Medium', status: 'Open' }
    }
  } finally {
    isSubmitting.value = false
  }
}

const cancel = () => {
  emit('cancel')
}
</script>

<template>
  <section class="bg-white rounded-lg shadow-md p-6">
    <h3 class="text-xl font-semibold mb-4">{{ isEdit ? 'Edit Ticket' : 'Create New Ticket' }}</h3>
    <form @submit="submit" class="space-y-4">
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-200"
          placeholder="Short summary"
        />
        <p v-if="errors.title" class="text-red-600 text-sm mt-1">{{ errors.title }}</p>
      </div>

      <div>
        <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          v-model="form.description"
          rows="4"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-200"
          placeholder="Describe the issue in detail"
        ></textarea>
        <p v-if="errors.description" class="text-red-600 text-sm mt-1">{{ errors.description }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="assignee" class="block text-sm font-medium text-gray-700">Assignee</label>
          <input
            id="assignee"
            v-model="form.assignee"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-200"
            placeholder="Assign to"
          />
          <p v-if="errors.assignee" class="text-red-600 text-sm mt-1">{{ errors.assignee }}</p>
        </div>

        <div>
          <label for="priority" class="block text-sm font-medium text-gray-700">Priority</label>
          <select
            id="priority"
            v-model="form.priority"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-200"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
      </div>

      <div class="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          @click="cancel"
          class="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 disabled:opacity-70"
        >
          <span v-if="!isSubmitting">{{ isEdit ? 'Update' : 'Create' }}</span>
          <span v-else>{{ isEdit ? 'Updating...' : 'Creating...' }}</span>
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.shadow-md {
  box-shadow: 0 4px 14px rgba(16, 24, 40, 0.06);
}
</style>

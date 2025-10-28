<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppNavbar from '../component/AppNavbar.vue'
import AppFooter from '../component/AppFooter.vue'

const router = useRouter()
const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
})

const errors = ref({})
const showPassword = ref(false)
const isSubmitting = ref(false)

const validateForm = () => {
  errors.value = {}

  if (!form.value.firstName.trim()) {
    errors.value.firstName = 'First name is required'
  }

  if (!form.value.lastName.trim()) {
    errors.value.lastName = 'Last name is required'
  }

  if (!form.value.email) {
    errors.value.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Please enter a valid email address'
  }

  if (!form.value.password) {
    errors.value.password = 'Password is required'
  } else if (form.value.password.length < 8) {
    errors.value.password = 'Password must be at least 8 characters'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async (e) => {
  e.preventDefault()
  if (!validateForm()) return

  isSubmitting.value = true
  try {
    // Get existing users or initialize empty array
    const existingUsers = JSON.parse(localStorage.getItem('tms:users') || '[]')

    // Check if email already exists
    if (existingUsers.some((user) => user.email === form.value.email)) {
      errors.value.email = 'Email already registered'
      return
    }

    // Create new user object
    const newUser = {
      id: Date.now(), // Simple unique ID
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      password: form.value.password, // In a real app, this should be hashed
    }

    // Add new user to array and save back to localStorage
    existingUsers.push(newUser)
    localStorage.setItem('tms:users', JSON.stringify(existingUsers))

    // Set current user
    localStorage.setItem('tms:auth', 'true')
    localStorage.setItem(
      'tms:user',
      JSON.stringify({
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      }),
    )

    // Redirect to dashboard
    router.push({ name: 'dashboard' })
  } catch (error) {
    console.error('Signup error:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <AppNavbar />
  <section class="min-h-screen bg-linear-to-b from-cyan-50/50 to-white flex items-center">
    <div class="container mx-auto px-4 py-12 md:py-20">
      <div class="text-center max-w-2xl mx-auto mb-12">
        <h1 class="text-4xl md:text-5xl font-bold mb-6 text-gray-800">Join us Today!</h1>
        <p class="text-lg md:text-xl text-gray-600">
          Sign up now to streamline your ticket management process and enhance your productivity.
        </p>
      </div>

      <div class="flex flex-col lg:flex-row gap-12 items-center max-w-6xl mx-auto">
        <figure class="w-full lg:w-1/2 rounded-2xl overflow-hidden shadow-xl">
          <img
            src="/images/signup.jpg"
            alt="Sign up illustration"
            class="w-full h-full object-cover"
          />
        </figure>

        <form
          @submit="handleSubmit"
          class="bg-white p-8 md:p-10 rounded-xl shadow-lg flex-1 w-full max-w-xl"
        >
          <fieldset class="grid md:grid-cols-2 gap-6">
            <div>
              <label for="firstName" class="block text-gray-700 font-semibold mb-2">
                First Name
              </label>
              <div class="relative">
                <input
                  v-model="form.firstName"
                  type="text"
                  id="firstName"
                  :class="[
                    'w-full px-4 py-3 border rounded-lg transition-all duration-200 bg-gray-50',
                    errors.firstName
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:border-cyan-500 focus:ring-cyan-200',
                  ]"
                  placeholder="John"
                  @focus="delete errors.firstName"
                />
                <span v-if="errors.firstName" class="text-red-600 text-sm mt-1 block">
                  {{ errors.firstName }}
                </span>
              </div>
            </div>

            <div>
              <label for="lastName" class="block text-gray-700 font-semibold mb-2">
                Last Name
              </label>
              <div class="relative">
                <input
                  v-model="form.lastName"
                  type="text"
                  id="lastName"
                  :class="[
                    'w-full px-4 py-3 border rounded-lg transition-all duration-200 bg-gray-50',
                    errors.lastName
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:border-cyan-500 focus:ring-cyan-200',
                  ]"
                  placeholder="Doe"
                  @focus="delete errors.lastName"
                />
                <span v-if="errors.lastName" class="text-red-600 text-sm mt-1 block">
                  {{ errors.lastName }}
                </span>
              </div>
            </div>
          </fieldset>

          <div class="my-6">
            <label for="email" class="block text-gray-700 font-semibold mb-2">
              Email Address
            </label>
            <div class="relative">
              <input
                v-model="form.email"
                type="email"
                id="email"
                :class="[
                  'w-full px-4 py-3 border rounded-lg transition-all duration-200 bg-gray-50',
                  errors.email
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:border-cyan-500 focus:ring-cyan-200',
                ]"
                placeholder="john@example.com"
                @focus="delete errors.email"
              />
              <span v-if="errors.email" class="text-red-600 text-sm mt-1 block">
                {{ errors.email }}
              </span>
            </div>
          </div>

          <div class="mb-8">
            <label for="password" class="block text-gray-700 font-semibold mb-2"> Password </label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                id="password"
                :class="[
                  'w-full px-4 py-3 pr-12 border rounded-lg transition-all duration-200 bg-gray-50',
                  errors.password
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:border-cyan-500 focus:ring-cyan-200',
                ]"
                placeholder="••••••••"
                @focus="delete errors.password"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                @click="showPassword = !showPassword"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  :class="{ 'text-cyan-600': showPassword }"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    v-if="!showPassword"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    v-if="!showPassword"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                  <path
                    v-else
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              </button>
              <span v-if="errors.password" class="text-red-600 text-sm mt-1 block">
                {{ errors.password }}
              </span>
            </div>
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full bg-cyan-600 text-white py-3 rounded-lg font-semibold hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-all duration-300 relative disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span :class="{ 'opacity-0': isSubmitting }">Create Account</span>
            <svg
              v-if="isSubmitting"
              class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </button>

          <p class="mt-6 text-sm text-gray-600 text-center">
            Already have an account?
            <router-link
              :to="{ name: 'signin' }"
              class="text-cyan-600 hover:text-cyan-700 font-medium"
              >Log in</router-link
            >
          </p>
        </form>
      </div>
    </div>
  </section>
  <AppFooter />
</template>

<style scoped>
input:focus {
  outline: none;
}

.bg-gray-50 {
  background-color: #f9fafb;
}
</style>

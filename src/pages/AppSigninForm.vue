<script setup>
import { ref } from 'vue'
import AppNavbar from '../component/AppNavbar.vue'
import AppFooter from '../component/AppFooter.vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const remember = ref(false)
const error = ref('')
const isSubmitting = ref(false)

const validate = () => {
  error.value = ''
  if (!email.value.trim()) {
    error.value = 'Email is required'
    return false
  }
  if (!password.value.trim()) {
    error.value = 'Password is required'
    return false
  }
  return true
}

const onSubmit = async (e) => {
  e.preventDefault()
  if (!validate()) return
  isSubmitting.value = true
  error.value = ''

  try {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('tms:users') || '[]')

    // Find user with matching email and password
    const user = users.find((u) => u.email === email.value && u.password === password.value)

    if (!user) {
      error.value = 'Invalid email or password'
      return
    }

    // Store authenticated user info (excluding password)
    const userInfo = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    }

    localStorage.setItem('tms:user', JSON.stringify(userInfo))
    localStorage.setItem('tms:auth', 'true')

    // Redirect to original destination or dashboard
    const redirectTo = route.query.redirect || { name: 'dashboard' }
    await router.push(redirectTo)
  } catch (error) {
    console.error('Login error:', error)
    error.value = 'An error occurred while signing in'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <AppNavbar />
  <section
    class="sign in max-h-screen bg-linear-to-br from-cyan-100 via-blue-100 to-blue-300 scrollbar-hide"
  >
    <div class="container mx-auto px-4 py-20">
      <div class="text-center mb-10">
        <h4 class="text-2xl font-bold text-cyan-700 mb-4">
          Sign in to access your account and manage your tickets efficiently.
        </h4>
      </div>
      <form
        @submit="onSubmit"
        class="bg-white/90 backdrop-blur-sm p-8 mx-auto rounded-2xl shadow-xl w-full max-w-md border border-cyan-100 space-y-5"
      >
        <div>
          <label for="email" class="block text-cyan-700 font-medium mb-1">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            v-model="email"
            required
            class="w-full border border-cyan-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
          />
        </div>

        <div>
          <label for="password" class="block text-cyan-700 font-medium mb-1">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            v-model="password"
            required
            class="w-full border border-cyan-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
          />
        </div>

        <div class="flex items-center justify-between">
          <label class="flex items-center text-cyan-700 text-sm">
            <input type="checkbox" v-model="remember" class="mr-2 accent-cyan-500" />
            Remember me
          </label>
          <a href="#" class="text-cyan-600 hover:text-amber-500 text-sm font-medium"
            >Forgot password?</a
          >
        </div>

        <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 rounded-lg shadow-md transition-all duration-200 disabled:opacity-70"
        >
          <span v-if="!isSubmitting">Sign In</span>
          <span v-else>Signing in...</span>
        </button>
        <div class="text-center mt-4">
          <span class="text-gray-600">Don't have an account?</span>
          <router-link :to="{ name: 'signup' }" class="text-cyan-600 hover:text-cyan-700 ml-1"
            >Sign up</router-link
          >
        </div>
      </form>
    </div>
  </section>
  <AppFooter />
</template>

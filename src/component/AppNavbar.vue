<script setup>
import { ref } from 'vue'

const isMenuOpen = ref(false)
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <header class="sticky w-full top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
    <nav class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link :to="{ name: 'home' }" class="flex items-center space-x-2">
            <span class="text-xl font-bold text-cyan-600">Ticket Management</span>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <div class="flex items-center space-x-4">
            <router-link :to="{ name: 'dashboard' }" class="get-started-btn">Dashboard</router-link>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden">
          <button @click="toggleMenu" class="mobile-menu-button" aria-label="Toggle Menu">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                v-if="!isMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-show="isMenuOpen" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <div class="pt-4 space-y-2">
            <router-link
              :to="{ name: 'dashboard' }"
              className="mobile-get-started-btn block text-center w-full px-4 py-2 bg-linear-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-md shadow hover:opacity-90 transition-all duration-200"
              >Dashboard</router-link
            >
            <router-link
              :to="{ name: 'signup' }"
              class="mobile-login-btn block text-center w-full px-4 py-2 text-gray-800 font-medium border border-gray-200 rounded-md hover:bg-gray-50 transition-all duration-200"
              >Sign up</router-link
            >
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.nav-link {
  color: #4b5563;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #0891b2;
}

.login-btn {
  padding: 0.5rem 1rem;
  color: #0891b2;
  font-weight: 500;
  transition: color 0.2s;
}

.login-btn:hover {
  color: #0e7490;
}

.get-started-btn {
  padding: 0.5rem 1rem;
  background-color: #0891b2;
  color: white;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.get-started-btn:hover {
  background-color: #0e7490;
}

.get-started-btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(8, 145, 178, 0.5);
}

.mobile-menu-button {
  color: #4b5563;
  transition: color 0.2s;
}

.mobile-menu-button:hover,
.mobile-menu-button:focus {
  color: #0891b2;
  outline: none;
}

.mobile-nav-link {
  display: block;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  color: #4b5563;
  transition: all 0.2s;
}

.mobile-nav-link:hover {
  color: #0891b2;
  background-color: #f9fafb;
}

.mobile-login-btn {
  width: 100%;
  padding: 0.5rem 0.75rem;
  text-align: center;
  color: #0891b2;
  font-weight: 500;
  transition: color 0.2s;
}

.mobile-login-btn:hover {
  color: #0e7490;
}

.mobile-get-started-btn {
  width: 100%;
  padding: 0.5rem 0.75rem;
  text-align: center;
  background-color: #0891b2;
  color: white;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.mobile-get-started-btn:hover {
  background-color: #0e7490;
}
</style>

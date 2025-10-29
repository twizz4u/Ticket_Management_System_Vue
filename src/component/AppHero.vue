<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // Add fade-in animation to elements
  const elements = document.querySelectorAll('.animate-fade-in')
  elements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('opacity-100')
    }, index * 200)
  })
})
</script>

<template>
  <section
    class="hero min-h-[85vh] bg-linear-to-b from-cyan-50 to-cyan-100 relative overflow-hidden"
  >
    <div class="container mx-auto px-4 h-full">
      <div class="flex flex-col lg:flex-row items-center h-full py-12">
        <div
          class="hero-content flex-1 space-y-6 lg:space-y-8 text-center lg:text-left basis-full lg:basis-[50%] animate-fade-in opacity-0"
        >
          <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 leading-tight">
            Manage Tickets <span class="text-cyan-600">Easily</span>
          </h1>
          <p
            class="text-lg sm:text-xl text-gray-600 max-w-lg mx-auto lg:mx-0 animate-fade-in opacity-0"
          >
            Track, organize, and resolve tickets with ease — built for speed and simplicity. Your
            one-stop solution for efficient ticket management.
          </p>
          <div
            class="hero-buttons flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4 animate-fade-in opacity-0"
          >
            <router-link
              :to="{ name: 'signup' }"
              class="inline-block px-8 py-3 bg-cyan-600 text-white rounded-lg font-semibold transform transition-all duration-300 hover:scale-105 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50"
            >
              Get Started
            </router-link>
            <router-link
              :to="{ name: 'signin' }"
              class="inline-block px-8 py-3 border-2 border-cyan-600 text-cyan-600 rounded-lg font-semibold transform transition-all duration-300 hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50"
            >
              Login
            </router-link>
          </div>
        </div>
        <figure class="basis-full lg:basis-1/2 relative animate-fade-in opacity-0 mt-8 lg:mt-0">
          <div
            class="hidden sm:block absolute -top-4 -left-4 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
          ></div>
          <div
            class="hidden sm:block absolute -bottom-8 -right-4 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"
          ></div>
          <img
            src="/images/hero.png"
            alt="Ticket Management System Interface"
            class="w-full h-full object-contain relative z-10 transform transition-transform duration-500 hover:scale-105"
          />
        </figure>
      </div>
    </div>

    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
      <path
        fill="#7cc1d4"
        fill-opacity="1"
        d="M0,224L48,208C96,192,192,160,288,160C384,160,480,192,576,186.7C672,181,768,139,864,144C960,149,1056,203,1152,208C1248,213,1344,171,1392,149.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
      ></path>
    </svg>
  </section>
</template>

<style scoped>
.animate-fade-in {
  transition: opacity 0.5s ease-in-out;
}

.animate-blob {
  color: #7cc1d4;
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}
</style>

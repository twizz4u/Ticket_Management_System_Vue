<script setup>
const props = defineProps({
  feature: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <article
    class="feature-card bg-white rounded-xl shadow-sm hover:shadow-lg transition-transform duration-200 ease-out hover:-translate-y-1 p-6 flex items-start gap-4"
    tabindex="0"
    aria-labelledby="feature-title"
  >
    <div
      class="w-12 h-12 shrink-0 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-600"
    >
      <!-- optional icon (image path) or fallback SVG -->
      <img
        v-if="props.feature.icon"
        :src="props.feature.icon"
        :alt="props.feature.title + ' icon'"
        class="w-8 h-8"
      />
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4" />
      </svg>
    </div>

    <div class="flex-1">
      <h3 id="feature-title" class="text-lg font-semibold text-gray-800">
        {{ props.feature.title }}
      </h3>
      <p class="mt-2 text-gray-600 text-sm">{{ props.feature.desc }}</p>
    </div>
  </article>
</template>

<style scoped>
/* Small enhancement for keyboard focus to match the app accent */
.feature-card:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(8, 145, 178, 0.12);
}
</style>

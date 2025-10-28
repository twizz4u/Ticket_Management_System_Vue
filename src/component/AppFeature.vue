<script setup>
import AppFeatureCard from './AppFeatureCard.vue'
import features from '../assest/data.json'

const ticketFeature = features

console.log(ticketFeature)
</script>

<template>
  <section class="features">
    <div class="container mx-auto px-4 py-12">
      <h2 class="text-3xl font-bold text-center mb-8 text-gray-800">App Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <AppFeatureCard v-for="feature in ticketFeature" :key="feature.id" :feature="feature" />
      </div>
    </div>
  </section>
</template>

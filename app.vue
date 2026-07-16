<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { BASE_URL } from '~/utils/config'

useHead({
  titleTemplate: (title) => title ? `${title} — The Talking Chart` : 'The Talking Chart',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    {
      name: 'description',
      content:
        'Free, printable PECs chart generator. Pick from 400+ icons, add labels, and print. No sign-up. No cost. Ever.',
    },
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: `${BASE_URL}/favicon.svg` },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossorigin: '',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800;900&family=Inter:wght@400;500;600;700&display=swap',
    },
  ],
  htmlAttrs: {
    lang: 'en',
  },
  bodyAttrs: {
    class: 'bg-white text-slate-900 antialiased',
  },
})
</script>

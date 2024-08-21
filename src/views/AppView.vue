<script setup>
import AppRibbon from '@/components/AppRibbon.vue';
import Input from '@/components/ui/input/Input.vue';

</script>

<template>
  <AppRibbon />

  <section class="max-w-screen-xl mx-auto px-4 md:px-8 my-10">

    <div class="mx-auto mb-10 ">
      <label class="block text-md font-medium text-gray-700"> Title </label>

      <Input type="text" v-model="test"
        class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-4 lg:gap-4">
      <div class="h-32 rounded-lg bg-gray-200"></div>
      <div class="h-32 rounded-lg bg-gray-200"></div>
      <div class="h-32 rounded-lg bg-gray-200"></div>
      <div class="h-32 rounded-lg bg-gray-200"></div>

      <div class="h-32 rounded-lg bg-gray-200"></div>
      <div class="h-32 rounded-lg bg-gray-200"></div>
      <div class="h-32 rounded-lg bg-gray-200"></div>
      <div class="h-32 rounded-lg bg-gray-200"></div>

      <div class="h-32 rounded-lg bg-gray-200"></div>
      <div class="h-32 rounded-lg bg-gray-200"></div>
      <div class="h-32 rounded-lg bg-gray-200"></div>
      <div class="h-32 rounded-lg bg-gray-200"></div>

      <div class="h-32 rounded-lg bg-gray-200"></div>
      <div class="h-32 rounded-lg bg-gray-200"></div>
      <div class="h-32 rounded-lg bg-gray-200"></div>
      <div class="h-32 rounded-lg bg-gray-200"></div>

      <div class="h-32 rounded-lg bg-gray-200"></div>
      <div class="h-32 rounded-lg bg-gray-200"></div>
      <div class="h-32 rounded-lg bg-gray-200"></div>
      <div class="h-32 rounded-lg bg-gray-200"></div>
    </div>
  </section>

</template>

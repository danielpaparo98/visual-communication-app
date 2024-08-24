<script setup>
import { reactive, onBeforeMount } from 'vue';
import AppRibbon from '@/components/AppRibbon.vue';
import Input from '@/components/ui/input/Input.vue';
import Card from '@/components/Card.vue';

let chart = reactive({
  title: '',
  cards: [],
});


onBeforeMount(() => {
  chart.title = 'My Chart';

  // If there is no stored chart, create a new one from scratch
  for (let i = 0; i < 20; i++) {
    // const img = this.icons[Math.floor(Math.random() * this.icons.length)];
    chart.cards.push({
      id: 'card-' + i,
      // img_addr: img.addr,
      // img_alt: img.alt,
      heading: '' + i,
      subtitle: '' + i + 'hello',
    })
  }
}
);
</script>

<template>
  <AppRibbon />

  <section class="max-w-screen-xl mx-auto px-4 md:px-8 my-10 print">

    <div class="mx-auto mb-10 ">
      <label class="block text-md font-medium text-gray-700"> Title </label>

      <p class="print text-6xl text-center">{{ chart.title }} </p>
      <Input type="text" v-model.lazy="chart.title" v-on:change="increment"
        class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
    </div>


    <div class="grid grid-cols-1 gap-4 md:grid-cols-4 lg:gap-4 print">
      <!-- <div v-for="card in chart.cards" :key="card.id" class="rounded-lg bg-gray-200">
      </div> -->
      <Card v-for="card in chart.cards" :id="card.id" :heading="card.heading" :description="card.subtitle"></Card>
    </div>

    <p class="text-xl text-center">Created using <a href="http://thetalkingchart.com">thetalkingchart.com</a></p>
  </section>

</template>

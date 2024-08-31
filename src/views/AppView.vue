<script setup>
import { reactive, onBeforeMount, watch } from 'vue';
import AppRibbon from '@/components/AppRibbon.vue';
import Input from '@/components/ui/input/Input.vue';
import Card from '@/components/Card.vue';
import Dialog from '@/components/ui/dialog/Dialog.vue';
import { watchImmediate } from '@vueuse/core';

let chart = reactive({
  title: '',
  cards: [],
});

// Function to store the chart object in localStorage
function storeChart() {
  localStorage.setItem('chart', JSON.stringify(chart));
}

function newChart() {
  // If there is no stored chart, create a new one from scratch
  chart.title = 'My Chart';
  for (let i = 0; i < 20; i++) {
    chart.cards.push({
      id: 'card-' + i,
      imgURL: "https://placehold.co/400x400",
      heading: '',
      description: '',
    });

  }
}

// Function to load the chart object from localStorage
function loadChart() {
  const storedChart = localStorage.getItem('chart');
  if (storedChart) {
    chart = JSON.parse(storedChart);
  } else {
    newChart();
  }
}

// Load the chart object when the component is mounted
onBeforeMount(() => {
  loadChart();
});


function handleCardUpdate(cardId, { field, value }) {
  let card = chart.cards.find(c => c.id === cardId);
  card[field] = value;
  storeChart();

}

function handleOpenIcon(card) {
  /**
   * TODO implement this function
   */
}
</script>

<template>
  <AppRibbon />

  <section class="max-w-screen-xl mx-auto px-4 md:px-8 my-10 print">

    <div class="mx-auto mb-10 ">
      <label class="block text-md font-medium text-gray-700"> Title </label>

      <p class="print text-6xl text-center">{{ chart.title }} </p>
      <Input type="text" v-model.lazy="chart.title"
        class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
    </div>


    <div class="grid grid-cols-1 gap-4 md:grid-cols-4 lg:gap-4 print">
      <!-- <div v-for="card in chart.cards" :key="card.id" class="rounded-lg bg-gray-200">
      </div> -->
      <Card v-for="card in chart.cards" :key="card.id" :id="card.id" :heading="card.heading"
        :description="card.description" :imageUrl="card.imgURL" @updateCard="handleCardUpdate(card.id, $event)"
        @openIcon="handleOpenIcon(card)"></Card>
    </div>

    <p class="text-xl text-center">Created using <a href="http://thetalkingchart.com">thetalkingchart.com</a></p>
  </section>

</template>

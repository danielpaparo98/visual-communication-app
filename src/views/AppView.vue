<script setup>
import { reactive, onBeforeMount } from 'vue';
import AppRibbon from '@/components/AppRibbon.vue';
import Input from '@/components/ui/input/Input.vue';
import Card from '@/components/Card.vue';
import Dialog from '@/components/ui/dialog/Dialog.vue';
import { watchImmediate } from '@vueuse/core';
import html2pdf from 'html2pdf.js';

const fonts = [
  { name: 'Default', class: 'font-medium' },
  { name: 'Nunito', class: 'nunito' },
  { name: 'Kalam', class: 'kalam' },
  { name: 'OpenDyslexic', class: 'opendyslexic' },
];

let chart = reactive({
  title: '',
  cards: [],
  fontClass: fonts[0].class,
});

// Function to store the chart object in localStorage
function storeChart() {
  localStorage.setItem('chart', JSON.stringify(chart));
}

function newChart() {
  chart.title = 'My Chart';
  chart.cards = [];
  chart.fontClass = fonts[0].class;
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
    const parsedChart = JSON.parse(storedChart);
    chart.title = parsedChart.title;
    chart.cards = parsedChart.cards;
    chart.fontClass = parsedChart.fontClass;
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

function handleFontChange(fontClass) {
  chart.fontClass = fontClass;
  storeChart();
}


function handleOpenIcon(card) {
  /**
   * TODO implement this function
   */
}

function handleNewChart() {
  newChart();
  storeChart();
}

function handleLoadChart() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.chart';
  input.onchange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = e.target.result;
      const parsedChart = JSON.parse(contents);
      chart.title = parsedChart.title;
      chart.cards = parsedChart.cards;

    };
    reader.readAsText(file);
  };
  input.click();
}


function handleSaveChart() {
  const data = JSON.stringify(chart);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = chart.title + '.chart';
  a.click();
  URL.revokeObjectURL(url);
}

function handlePrint() {
  window.print();
}

function handleExport() {
  const printSection = document.querySelector('.print');
  const options = {
    filename: chart.title + '.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 1 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
  };

  html2pdf().set(options).from(printSection).save();
}


</script>

<template>
  <AppRibbon :onNewChart="handleNewChart" :onLoadChart="handleLoadChart" :onSaveChart="handleSaveChart"
    :onExport="handleExport" :onPrint="handlePrint" :currentFontClass="chart.fontClass" :fontClasses="fonts"
    @font-change="handleFontChange" />

  <section class="max-w-screen-xl mx-auto px-4 md:px-8 my-10 print" :class="chart.fontClass">

    <div class="mx-auto mb-10 ">
      <p class="print text-6xl text-center print-only">{{ chart.title }} </p>
      <label class="block text-md font-medium text-gray-700"> Title </label>
      <Input type="text" v-model.lazy="chart.title" v-on:input="storeChart"
        class="block text-5xl h-20 w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
    </div>


    <div class="grid grid-cols-1 gap-4 md:grid-cols-4 lg:gap-4 print">
      <Card v-for="card in chart.cards" :key="card.id" :id="card.id" :heading="card.heading"
        :description="card.description" :imageUrl="card.imgURL" @updateCard="handleCardUpdate(card.id, $event)"
        @openIcon="handleOpenIcon(card)"></Card>
    </div>
    <p class="text-xl text-center print-only">Created using <a href="http://thetalkingchart.com">thetalkingchart.com</a>
    </p>
  </section>

  <Dialog></Dialog>

</template>
<style scoped>
/* Add your scoped CSS rules here */
@import url('https://fontlibrary.org/en/face/opendyslexic');
@import url('https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap');

.nunito,
.nunito * {
  font-family: "Nunito", sans-serif !important;
  font-style: normal !important;
}

.kalam,
.kalam * {
  font-family: "Kalam", cursive !important;
  font-weight: 400 !important;
  font-style: normal !important;
}

.opendyslexic,
.opendyslexic * {
  font-family: 'OpenDyslexicMonoRegular' !important;
  font-weight: normal !important;
  font-style: normal !important;
}
</style>
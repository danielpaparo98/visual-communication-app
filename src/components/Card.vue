<script setup>
import { defineEmits, ref, toRefs, watch } from 'vue';
import Input from '@/components/ui/input/Input.vue'; // Ensure this path is correct

const emit = defineEmits(['updateCard', 'openIcon']);
const props = defineProps({
    id: String,
    heading: String,
    description: String,
    imageUrl: String
});

const { heading, description } = toRefs(props);

// Create local state variables
const localHeading = ref(heading.value);
const localDescription = ref(description.value);

// Watch for changes in props and update local state
watch(heading, (newVal) => {
    localHeading.value = newVal;
});
watch(description, (newVal) => {
    localDescription.value = newVal;
});

// Watch for changes in localHeading and localDescription and emit updateCard event
watch(localHeading, (newVal) => {
    emit('updateCard', { field: 'heading', value: newVal });
});
watch(localDescription, (newVal) => {
    emit('updateCard', { field: 'description', value: newVal });
});


function openIcon() {
    emit('openIcon', props.id);
}
</script>

<template>
    <div class="rounded-lg bg-gray-200 py-3 px-7 print text-center">
        <img :src="imageUrl" alt="Card Image" class="card-image" @click="openIcon" />
        <div class="cardclass">
            <h2 class="card-title text-2xl print-only">{{ localHeading }}</h2>
            <Input type="text" v-model="localHeading"
                class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-2xl" />
            <h2 class="card-title text-xl print-only">{{ localDescription }}</h2>
            <Input type="text" v-model="localDescription"
                class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
        </div>
    </div>
</template>
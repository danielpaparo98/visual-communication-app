<script setup>
const props = defineProps(
    {
        heading: String,
        description: String,
        imageUrl: String,
    }
);
</script>

<template>
    <div class="rounded-lg bg-gray-200 py-3 px-7 print text-center">
        <img :src="imageUrl" alt="Card Image" class="card-image" />
        <div class="cardclass">
            <h2 class="card-title text-2xl">{{ heading }}</h2>
            <Input type="text"
                class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-2xl" />
            <h2 class="card-title text-xl">{{ description }}</h2>
            <Input type="text"
                class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />

        </div>
    </div>
</template>

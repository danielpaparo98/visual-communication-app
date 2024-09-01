<script setup lang="ts">
import { Input } from '@/components/ui/input'
import Button from './ui/button/Button.vue';
import { defineEmits, toRefs, ref, watch } from 'vue';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const emit = defineEmits(['font-change']);

function print_chart() {
    window.print();
}

const props = defineProps({
    onNewChart: Function,
    onSaveChart: Function,
    onLoadChart: Function,
    onPrint: Function,
    onExport: Function,
    currentFontClass: String,
    fontClasses: Array<{ name: String, class: string }>,
});

const { currentFontClass } = toRefs(props);
let localFontClass = ref(currentFontClass.value);

watch(localFontClass, (newValue) => {
    emit('font-change', newValue);
});
</script>

<template>
    <div class="max-w-screen-xl mx-auto px-4 md:px-8">
        <div class="items-start justify-between py-4 border-b md:flex">
            <div class="items-center gap-x-3 mt-6 md:mt-0 sm:flex">
                <Button @click="onLoadChart()">Load</Button>
                <Button @click="onSaveChart()">Save</Button>
                <Button @click="onNewChart()">New</Button>
            </div>
            <div>
                <Select v-model="localFontClass">
                    <SelectTrigger class="w-[180px]">
                        <SelectValue :placeholder="currentFontClass" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem v-for="font in fontClasses" :key="font.class" :class="font.class"
                                :value="font.class">
                                {{ font.name }}
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div class="items-center gap-x-3 mt-6 md:mt-0 sm:flex">
                <Button @click="onExport()">Export to PDF</Button>
                <Button @click="onPrint()">Print</Button>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Input } from '@/components/ui/input'
import Select from './ui/select/Select.vue';
import Button from './ui/button/Button.vue';

function print_chart() {
    window.print();
}

const props = defineProps({
    onNewChart: Function,
    onSaveChart: Function,
    onLoadChart: Function,
    onPrint: Function,
    onExport: Function,
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
                <Select />
            </div>
            <div class="items-center gap-x-3 mt-6 md:mt-0 sm:flex">
                <Button @click="onExport()">Export to PDF</Button>
                <Button @click="onPrint()">Print</Button>

            </div>
        </div>
    </div>
</template>

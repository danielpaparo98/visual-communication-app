<script setup>
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from '@/components/ui/dialog'
import { icons } from '@/assets/icons.js';
import { ref, toRefs } from 'vue';

const props = defineProps({
    card_id: String,
    currentImgURL: String,
    iconPickerVisability: Boolean,
});

const { iconPickerVisability } = toRefs(props); // Create a reactive reference to iconPickerVisability

const emit = defineEmits(['new-card-image', 'close-icon-picker']);

let localCardImage = ref('https://placehold.co/400x400');

function updateIcon() {
    emit('new-card-image', localCardImage.value);
}

function closeIconPicker() {
    emit('close-icon-picker');
}

</script>

<template>
    <Dialog :open="iconPickerVisability" @update:open="closeIconPicker">
        <DialogContent class="sm:max-w-[1000px] grid-rows-[auto_minmax(0,1fr)_auto] max-h-[90dvh]">
            <DialogHeader>
                <DialogTitle>Pick an Icon</DialogTitle>
                <DialogDescription>
                    Choose something that clearly represents the meaning your chart will communicate.
                </DialogDescription>
            </DialogHeader>
            <div class="grid gap-4 py-4">
                <div class="grid grid-cols-6 items-center gap-8 overflow-y-auto px-6">
                    <div v-for="icon in icons">
                        <img :src="icon.url" @click="localCardImage = icon.url">
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose as-child>
                        <Button @click="updateIcon">
                            Save changes
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </div>
        </DialogContent>
    </Dialog>
</template>
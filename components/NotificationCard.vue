<script setup lang="ts">
import {type INotificationProps} from '@/types/components'
const title = ref('');
const props = defineProps<INotificationProps>();
defineSlots<{
    title(props:{title: string}):any,
    icon(props:{}): any,
    message(props:{}): any
}>()
</script>
<template>
    <div class="flex items-center h-20 overflow-hidden border-b border-solid border-giggle-border" :class="props.class">
        <div class="flex-shrink-0">
            <slot name="icon">
                <span class="bg-primary pi pi-bell"></span>
            </slot>
        </div>
        <div class="ml-4">
            <slot name="title" :title="title">
                <h3 class="text-lg font-semibold">{{ props.title }}</h3>
            </slot>
            <slot name="message">
                <p class="text-gray-500">{{ props.message }}</p>
            </slot>
        </div>
    </div>
</template>

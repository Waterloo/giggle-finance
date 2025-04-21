<script setup lang="ts">
import type { INotificationProps } from '~/types/components';
const props = defineProps<{items:INotificationProps[], class?: string | Record<string, undefined> | string[]}>();
</script>
<template>
<div :class="props.class">

<NotificationCard v-for="item in props.items" :key="item.notificationId" class="bg-white">
    <template #title>
       <p class="font-medium"> {{item.title}} </p> 
    </template>
    <template #message>
        <p class="text-gray-500">{{ item.message }} </p>
    </template>
    <template #icon>
        <img :src="item.icon" />
    </template>
</NotificationCard>
</div>
</template>
<style>

</style>
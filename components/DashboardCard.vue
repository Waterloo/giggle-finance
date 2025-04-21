<script setup lang="ts">
interface IDashboardCard {
	icon?: string;
	iconClass?: string;
	title: string | number;
	metric: string | number | undefined;
}

const props = withDefaults(defineProps<IDashboardCard>(), {
	iconClass: "bg-green-500",
	icon: "pi pi-user",
});
</script>
<template>
    <div
        class="flex items-center flex-grow flex-shrink-0  gap-4 p-4 bg-white rounded-lg shadow-[-1px_5px_20px_0px_#0101010A] min-h-28">
        <div class="flex items-center justify-center w-8 h-8 rounded" :class="props.iconClass">
            <i :class="props.icon"></i>
        </div>
        <div>
            <span class="text-3xl font-extrabold">{{ props.metric }}</span>
            <p class="text-gray-600">{{ props.title }}</p>
        </div>
    </div>
</template>
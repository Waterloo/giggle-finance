<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem';

const prop = defineProps<{ items: MenuItem[] }>();
</script>
<template>
	<div class="min-h-full px-4 pt-8 bg-white min-w-56 flex-shrink-0 w-80">
		<Menu :model="prop.items" class=" border-none max-w-full">
			<template #start>
				<slot name="start"/>
			</template>
			<template #item="{ item, props }">
				<NuxtLink
v-ripple class="flex align-items-center font " exact-active-class="text-primary font-medium"
					v-bind="props.action" :to="item.path">
					<span :class="item.icon" />
					<span class="ml-2">{{ item.label }}</span>
					<Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
					<span
v-if="item.shortcut"
						class="p-1 ml-auto text-xs border-1 surface-border border-round surface-100">{{
			item.shortcut }}</span>
				</NuxtLink>
			</template>
		</Menu>
	</div>
</template>
<style></style>
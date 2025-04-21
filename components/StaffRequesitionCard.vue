<template>
  <div class="w-full p-4 mb-6 bg-white rounded-lg shadow-md">
    <div class="grid grid-cols-2 gap-4 mb-4">
      <div>
        <h3 class="text-sm font-semibold text-gray-500">Time of event</h3>
        <p class="text-base font-medium">{{ time }}</p>
      </div>
      <div>
        <h3 class="text-sm font-semibold text-gray-500">Staff requested</h3>
        <p class="text-base font-medium">{{ props.job.slots }}</p>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4 mb-4">
    <div class="mb-4">
      <h3 class="text-sm font-semibold text-gray-500">Job type</h3>
      <p class="text-base font-medium">{{ props.job.jobType }}</p>
    </div>
    <div class="mb-4">
      <h3 class="text-sm font-semibold text-gray-500">Staff accepted</h3>
      <div class="flex items-center">
        <Avatar v-for="avatar in visibleStaffAvatars" :key="avatar" :image="avatar" size="normal" shape="circle" class="-ml-2 border-2 border-white first:ml-0 bg-slate-200" />
        <Avatar v-if="extraStaffCount > 0" :label="`+${extraStaffCount}`" size="normal" shape="circle" class="-ml-2 text-gray-600 bg-gray-300 border-2 border-white" />
      </div>
    </div>
  </div>
    <div class="flex space-x-2">
      <NuxtLink :to="`/requisition/${props.job.id}`" custom v-slot="{ navigate }"><Button label="View event" class="flex-grow bg-green-500 hover:bg-green-600" @click="navigate"/></NuxtLink>
      <Button icon="pi pi-trash" class="p-button-danger p-button-outlined" @click="emit('delete-event',props.job.id)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Job } from '~/composables/dataFetching';


const props = defineProps<{job:Job}>();

const router = useRouter();
function navigate() {
  router.push(`/requisition/${props.job.id}`)
}

const emit = defineEmits<{
  (e:'delete-event', id: number): void;
}>();

const time = computed(() =>`${formatTo12hTime(props.job.startTime)} - ${formatTo12hTime(props.job.endTime)}`);
const visibleStaffAvatars = computed(() => (props.job.profilePicturesURLs || []).slice(0, 4));
const extraStaffCount = computed(() => Math.max(0, (props.job.profilePicturesURLs || []).length - 4));
</script>
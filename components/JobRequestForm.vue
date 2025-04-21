<template>
  <div class="max-w-3xl mx-auto bg-white rounded-lg">
    <form @submit.prevent="handleSubmit">
      <div class="grid grid-cols-2 gap-6">
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Event date</label>
          <div class="p-2 bg-gray-50 rounded border border-gray-200">{{ jobRequest?.date }}</div>
        </div>
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Job type</label>
          <div class="p-2 bg-gray-50 rounded border border-gray-200">{{ jobRequest?.jobType }}</div>
        </div>
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Event start time</label>
          <div class="p-2 bg-gray-50 rounded border border-gray-200">{{ jobRequest?.startTime }}</div>
        </div>
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Event end time</label>
          <div class="p-2 bg-gray-50 rounded border border-gray-200">{{ jobRequest?.endTime }}</div>
        </div>
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Number of staff required</label>
          <div class="p-2 bg-gray-50 rounded border border-gray-200">{{ jobRequest?.staffRequested }}</div>
        </div>
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Base Pay</label>
          <InputNumber v-model="jobRequest.basePay" locale="en-US" class="w-full" placeholder="Enter hourly rate" suffix="/Hr" />
        </div>
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Regulars requested</label>
          <div class="p-2 bg-gray-50 rounded border border-gray-200">{{ jobRequest?.regularsRequested || 0}}</div>
        </div>
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Backup Staff</label>
          <InputNumber v-model="backupSlots" class="w-full" />
        </div>
      </div>
      <Button type="submit" label="Accept Request" class="mt-6 bg-green-500 text-white" :disabled="!isFormValid" :loading="isLoading"></Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { JobRequest } from "~/composables/dataFetching";
const jobRequest = defineProps<JobRequest>();


const isFormValid = computed(() => {
  return Boolean(jobRequest.basePay);
});


const emit = defineEmits<{
  (e: 'submit', data: { jobRequest: JobRequest }): void;
}>();

const { approveJob, isLoading } = useOutletApproveJob();
const backupSlots = ref(0);
const handleSubmit = async () => {
    try {
        console.log(`jobRequest`);
        await approveJob({
        jobId: jobRequest.id,
        basePay: (parseFloat(jobRequest.basePay as string)).toString(),
        backupSlots: backupSlots.value
    });

    console.log(`jobRequest finished`);
    emit('submit', {
        ...jobRequest,
        basePay: (parseFloat(jobRequest.basePay as string)),
        backupSlots: backupSlots.value
    });
} catch (error) {
    console.error(error);
}


};
</script>
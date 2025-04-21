<script setup>
import { computed } from 'vue';
import {formatTo12hTime,formatToDMY} from "~/utils/format";
const props = defineProps({
  jobData: {
    type: Object,
    required: true,
    default: () => ({
      id: Number,
      date: Date,
      startTime: Date,
      endTime: Date,
      jobType: String,
      staffRequested: Number,
      staffAccepted: Number,
      regularsRequested: Number,
      regularsAccepted: Number
    })
  }
});

const emit = defineEmits(['view-details']);

const handleViewDetails = () => {
  emit('view-details');
};

const staffProgress = computed(() => Math.round((props.jobData.staffAccepted / props.jobData.staffRequested) * 100));
const regularsProgress = computed(() => Math.round((props.jobData.regularsAccepted / props.jobData.regularsRequested) * 100));

const staffProgressColor = computed(() => getProgressColor(staffProgress.value));
const regularsProgressColor = computed(() => getProgressColor(regularsProgress.value));

function getProgressColor(percentage) {
  if (percentage >= 75) {
    return 'bg-green-500';
  } else if (percentage >= 50) {
    return 'bg-yellow-500';
  } else {
    return 'bg-red-500';
  }
}
</script>

<template>
  <div class="bg-white p-8 rounded-lg shadow-sm">
    <!-- Row 1 -->
    <div class="grid grid-cols-2 gap-6 mb-6">
      <div>
        <h3 class="text-gray-400 text-sm mb-2">Date of event</h3>
        <p class="text-black text-base font-bold">{{ formatToDMY(props.jobData.date) }}</p>
      </div>
      <div>
        <h3 class="text-gray-400 text-sm mb-2">Time of event</h3>
        <p class="text-black text-base font-bold">{{ formatTo12hTime(props.jobData.startTime) }} - {{ formatTo12hTime(props.jobData.endTime) }}</p>
      </div>
    </div>

    <!-- Row 2 -->
    <div class="grid grid-cols-2 gap-6 mb-6">
      <div>
        <h3 class="text-gray-400 text-sm mb-2">Job type</h3>
        <p class="text-black text-base font-bold">{{ props.jobData.jobType }}</p>
      </div>
      <div>
        <h3 class="text-gray-400 text-sm mb-2">Staff requested</h3>
        <p class="text-black text-base font-bold">{{ props.jobData.staffRequested }}</p>
      </div>
    </div>

    <!-- Staff Progress -->
    <div class="mb-6">
      <div class="flex justify-between mb-2">
        <span class="text-gray-400 text-sm">Staff Accepted:</span>
        <span class="text-green-500 text-sm font-medium">{{ props.jobData.staffAccepted }}/{{ props.jobData.staffRequested }}</span>
      </div>
      <ProgressBar 
        :value="staffProgress" 
        class="h-3" 
        :pt="{ root: { class: 'bg-gray-200 rounded-full' }, value: { class: staffProgressColor } }"
      />
    </div>

    <!-- Regulars Progress -->
    <div class="mb-8">
      <div class="flex justify-between mb-2">
        <span class="text-gray-400 text-sm">Regulars Accepted:</span>
        <span class="text-yellow-500 text-sm font-medium">{{ props.jobData.regularsAccepted }}/{{ props.jobData.regularsRequested }}</span>
      </div>
      <ProgressBar 
        :value="regularsProgress" 
        class="h-3" 
        :pt="{ root: { class: 'bg-gray-200 rounded-full' }, value: { class: regularsProgressColor } }"
      />
    </div>

    <!-- View Details Button -->
    <Button label="View details" class="w-full p-button-success" @click="handleViewDetails" />
  </div>
</template>

<style scoped>
.p-button-success {
 padding: 0.75rem 1.5rem; 
}
</style>
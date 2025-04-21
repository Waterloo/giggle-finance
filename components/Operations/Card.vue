<script setup>
  import { formatTo12hTime,formatToDMY } from '~/utils/format';

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
  emit('view-details', props.jobData.id);
};



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


    <!-- View Details Button -->
    <Button label="View details" class="w-full p-button-success" @click="handleViewDetails" />
  </div>
</template>
<style scoped>
.p-button-success {
 padding: 0.75rem 1.5rem; 
}
</style>
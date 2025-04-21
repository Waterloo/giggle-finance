<template>
  <div class="grid grid-cols-3 gap-4 ">
    <!-- Staff Requested Card -->
    <div class="bg-white rounded-lg shadow-sm p-4 flex items-center">
      <div class="bg-blue-50 rounded-full p-3 mr-4">
        <i class="pi pi-users text-blue-500 text-xl"></i>
      </div>
      <div>
        <h3 class="text-2xl font-bold">{{ staffRequested }}</h3>
        <p class="text-gray-500 text-sm">Staff Requested</p>
      </div>
    </div>

    <!-- Staff Confirmed Card -->
    <div class="bg-white rounded-lg shadow-sm p-4 flex items-center">
      <div class="bg-green-50 rounded-full p-3 mr-4">
        <i class="pi pi-check-circle text-green-500 text-xl"></i>
      </div>
      <div>
        <h3 class="text-2xl font-bold">{{ staffConfirmed }}/{{ staffRequested }}</h3>
        <p class="text-gray-500 text-sm">Staff Confirmed</p>
      </div>
    </div>

    <!-- Regulars Confirmed Card -->
    <div class="bg-white rounded-lg shadow-sm p-4 flex items-center">
      <div class="bg-orange-50 rounded-full p-3 mr-4">
        <i class="pi pi-star text-orange-500 text-xl"></i>
      </div>
      <div>
        <h3 class="text-2xl font-bold">{{ regularsAccepted }}/{{ totalRegularsInvited }}</h3>
        <p class="text-gray-500 text-sm">Regulars Confirmed</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  staffRequested: {
    type: [Number, String],
    default: 33
  },
  staffConfirmed: {
    type: [Number, String],
    default: 30
  },
  regularsAccepted: {
    type: [Number, String],
    default: 3
  },
  totalRegularsInvited: {
    type: [Number, String],
    default: 6
  }
});

// Skeleton version of this component can be created separately if needed
</script>
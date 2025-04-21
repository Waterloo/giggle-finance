<template>
    <div class="p-6 bg-white rounded-lg shadow-sm">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div class="space-y-2">
          <h3 class="text-sm font-medium text-gray-500">Event start time</h3>
          <p class="text-lg font-semibold text-gray-900">{{ formatTo12hTime(props.eventDetails?.startTime) }}</p>
        </div>
        <div class="space-y-2">
          <h3 class="text-sm font-medium text-gray-500">Event end time</h3>
          <p class="text-lg font-semibold text-gray-900">{{ formatTo12hTime(props.eventDetails?.endTime) }}</p>
        </div>
        <div class="space-y-2">
          <h3 class="text-sm font-medium text-gray-500">Staff requested</h3>
          <p class="text-lg font-semibold text-gray-900">{{ props.eventDetails?.staffRequested }}</p>
        </div>
        <div class="space-y-2">
          <h3 class="text-sm font-medium text-gray-500">Job Type</h3>
          <p class="text-lg font-semibold text-gray-900">{{ props.eventDetails?.jobType }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">

  import type { EventDetails, StaffList } from '~/composables/dataFetching';
  
  const props = defineProps<{
    eventDetails: EventDetails,
    confirmedStaffList: StaffList[]
  }>();

  </script>
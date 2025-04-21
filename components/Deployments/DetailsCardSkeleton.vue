<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <!-- Event Details Header Skeleton -->
    <div class="flex justify-between items-center mb-4">
      <Skeleton width="150px" height="24px" />
      <Skeleton shape="circle" size="30px" />
    </div>

    <!-- Event Details Grid Skeleton -->
    <div class="grid grid-cols-2 gap-6">
      <!-- Date Skeleton -->
      <div class="col-span-1">
        <Skeleton width="100px" height="16px" class="mb-2" />
        <Skeleton width="150px" height="20px" />
      </div>

      <!-- Time Skeleton -->
      <div class="col-span-1">
        <Skeleton width="100px" height="16px" class="mb-2" />
        <Skeleton width="150px" height="20px" />
      </div>

      <!-- Staff Requested Skeleton -->
      <div class="col-span-1">
        <Skeleton width="120px" height="16px" class="mb-2" />
        <div class="flex items-center">
          <Skeleton width="50px" height="20px" />
          <Skeleton shape="circle" size="24px" class="ml-2" />
        </div>
      </div>

      <!-- Basic Pay Skeleton -->
      <div class="col-span-1">
        <Skeleton width="80px" height="16px" class="mb-2" />
        <div class="flex items-center">
          <Skeleton width="70px" height="20px" />
          <Skeleton shape="circle" size="24px" class="ml-2" />
        </div>
      </div>

      <!-- Additional Requirements Skeleton -->
      <div class="col-span-2">
        <Skeleton width="150px" height="16px" class="mb-2" />
        <div class="flex items-center">
          <Skeleton width="200px" height="20px" />
          <Skeleton shape="circle" size="24px" class="ml-2" />
        </div>
      </div>
    </div>

    <!-- Action Buttons Skeleton -->
    <div class="flex gap-3 mt-6">
      <Skeleton width="150px" height="36px" borderRadius="4px" />
      <Skeleton width="150px" height="36px" borderRadius="4px" />
    </div>
  </div>
</template>

<script setup>
// No props or data needed for the skeleton component
</script>
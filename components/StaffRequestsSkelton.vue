<script setup lang="ts">
</script>
<template>
<div class="bg-white p-6 rounded shadow-md">
    <div class="grid grid-cols-2 gap-6">
      <!-- Left Column -->
      <div class="space-y-6">
        <div>
          <Skeleton width="8rem" height="1rem" class="mb-2" />
          <Skeleton width="10rem" height="1.25rem" />
        </div>
        <div>
          <Skeleton width="6rem" height="1rem" class="mb-2" />
          <Skeleton width="8rem" height="1.25rem" />
        </div>
        <div>
          <Skeleton width="10rem" height="1rem" class="mb-2" />
          <Skeleton width="4rem" height="1.25rem" />
        </div>
      </div>

      <!-- Right Column -->
      <div class="space-y-6">
        <div>
          <Skeleton width="8rem" height="1rem" class="mb-2" />
          <Skeleton width="12rem" height="1.25rem" />
        </div>
        <div>
          <Skeleton width="9rem" height="1rem" class="mb-2" />
          <Skeleton width="3rem" height="1.25rem" />
        </div>
        <div>
          <Skeleton width="6rem" height="1rem" class="mb-2" />
          <Skeleton width="5rem" height="1.25rem" />
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-8 mt-6">
      <Skeleton width="100%" height="2.5rem" class="flex-1" />
      <Skeleton width="100%" height="2.5rem" class="flex-1" />
    </div>
  </div>
</template>
<style>

</style>
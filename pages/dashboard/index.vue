<script setup lang="ts">
import type { TabMenuChangeEvent } from "primevue/tabmenu";
import {formatTo12hTime} from "~/utils/format";
import emptyImg from '~/assets/images/Empty.svg';




const { title } = usePageHeader();

onMounted(() => {
    title.value = "Overview";
})

const selectedDate = ref(new Date());
const selectedIndex = ref(0);

const calendarPTOptions = {
  input: {
    class: ["bg-transparent"],
  },
};

const { slots, isLoading: isSlotLoading } = useDashboard(selectedDate);
const selectedJob = computed(() => slots.value[selectedIndex.value]?.id);
const { job, isLoading: isStaffLoading } = useJobOverview(selectedJob);



function switchOverview(_event: TabMenuChangeEvent) {
  selectedIndex.value = _event.index;
  console.log(selectedIndex.value);
}

const isDetailsLoading = computed(() => isSlotLoading.value || isStaffLoading.value);

//when ever date changes reset selected index to zero
watch(selectedDate, () => {
  selectedIndex.value = 0;
});


</script>
<template>
  <div v-auto-animate>
    <Calendar
      v-model="selectedDate"
      date-format="dd M yy - DD"
      class="mb-4 bg-transparent shadow-none border-giggle-border"
      :pt="calendarPTOptions"
    />

    <div v-if="!isSlotLoading && slots?.length === 0" class="flex justify-center items-center mt-20 flex-col">
      <h1 class="text-3xl font-semibold text-gray-600 mb-4">It looks empty here</h1>
      <h2 class="text-base font-semibold text-gray-600 mb-6">It looks like there’s no requests created, Try creating a new request.</h2>
      <img :src="emptyImg">
    </div>
    <TabMenu v-if="!isSlotLoading && slots?.length > 0" :model="slots" class="mb-4" @tab-change="switchOverview">
      <template #item="{ item, props }">
        <a v-ripple v-bind="props.action" class="flex align-items-center">
          <span class="text-xs font-bold"
            >{{ formatTo12hTime(item.startTime) }} - {{ formatTo12hTime(item.endTime) }}</span
          >
        </a>
      </template>
    </TabMenu>
    <div v-if="isSlotLoading" class="px-2 mb-4 overflow-x-auto bg-white">
    <div class="flex py-2">
      <div v-for="i in 5" :key="i" class="flex-shrink-0">
        <div class="flex items-center px-4 py-2 space-x-2 bg-gray-100 rounded-full">
          <Skeleton width="8rem" height="1rem" />
        </div>
      </div>
    </div>
  </div>
        <div v-if="!isDetailsLoading && job?.jobDetails" class="flex w-full gap-4">    
            <DashboardCard :metric="job?.jobDetails?.staffRequested" title="Requested" />
            <DashboardCard :metric="job?.jobDetails?.staffConfirmed" title="Signed In / Confirmed" />
            <DashboardCard 
                :metric="job?.jobDetails?.staffCancelled" 
                title="Staff Cancelled" 
                icon-class="text-white bg-red-400" />
        </div>
        <div v-if="isDetailsLoading" class="flex w-full gap-4">
            <DashboardCardSkelton />
            <DashboardCardSkelton />
            <DashboardCardSkelton />   
        </div>
       
        <TheSlotStaffDetails v-if="!isDetailsLoading && job?.jobDetails" class="mt-12" :staff-details="job?.applicants!" />
        <SkeletonTable v-if="isDetailsLoading" class="mt-12" /> 
  </div>
</template>
<style></style>

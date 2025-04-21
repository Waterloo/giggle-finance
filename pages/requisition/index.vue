<script setup lang="ts">
import emptyImg from '~/assets/images/Empty.svg';


const { title } = usePageHeader();

onMounted(() => {
    title.value = "Staff Requisition";
})

const date = new Date();
date.setDate(date.getDate() + 1);
const currentDate = ref(date);
const visible = ref(false);

const openDialog = () => {
  visible.value = true;
};

const { jobs, isLoading, refetchJobs } = useJobsList(currentDate);

function handleSubmit() {
  visible.value = false;
  refetchJobs();
}

function deleteRequest(id){
console.log("id", id);
}

</script>

<template>
  <div>
    <div class="max-w-full overflow-hidden">
      <RequestDate
        v-model="currentDate"
        :start-date="date"
        class="max-w-full pt-4 bg-white border-b-2 shadow-sm"
      >
        <template #top-actions>
          <Button
            label="Create New Request"
            class="p-2 text-white bg-green-500 rounded hover:bg-green-600 float-end"
            @click="openDialog"
          />
        </template>
      </RequestDate>
    </div>

    <h2 class="font-medium mt-14">Requests</h2>
    <div v-if="isLoading" class="grid grid-cols-2 mt-6 gap-y-4 gap-x-8">
      <StaffRequesitionCardSkelton v-for="i in 4" :key="i" />
    </div>
    <div v-else class="grid grid-cols-2 mt-6 gap-y-4 gap-x-8">
      <StaffRequesitionCard
        v-for="request in jobs"
        :key="request.id"
        :job="request"
        @delete-event="deleteRequest"
      />
    </div>

    <div v-if="!isLoading && jobs?.length === 0" class="flex justify-center items-center mt-20 flex-col">
      <h1 class="text-3xl font-semibold text-gray-600 mb-4">It looks empty here</h1>
      <h2 class="text-base font-semibold text-gray-600 mb-6">It looks like there’s no requests created, Try creating a new request.</h2>
      <img :src="emptyImg">
    </div>

    <Dialog v-model:visible="visible">
      <template #header>
        <h2 class="mb-6 text-xl font-semibold">Create a request</h2>
      </template>
      
      <StaffRequestForm :date="currentDate" @submit="handleSubmit" />
    </Dialog>
  </div>
</template>

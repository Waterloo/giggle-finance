<script setup lang="ts">
const { title, back, subtitle } = usePageHeader();

onMounted(() => {
  title.value = "Requisition Details";
  back.value = "/requisition";
});

const route = useRoute();
const id = computed(() => {
  return Number(route.params.jobid);
});
const { jobDetails, isLoading } = useJobDetails(id);

watch(
  () => jobDetails.value?.eventDetails?.date,
  () => {
    const eventDetails = jobDetails.value?.eventDetails;
    if (!eventDetails) return;
    title.value = formatToDMY(eventDetails.date);
    subtitle.value = `${formatTo12hTime(
      eventDetails.startTime
    )} - ${formatTo12hTime(eventDetails.endTime)}`;
  }
);
</script>
<template>
  <div>
    <h3 class="mb-4 font-medium">Requisition Details</h3>
    <RequisitionDetailsCard
      v-if="jobDetails?.eventDetails"
      :event-details="jobDetails?.eventDetails"
      :confirmed-staff-list="jobDetails?.confirmedStaffList"
      class="mb-8"
    />
    <RequisitionDetailsCardSkelton v-if="isLoading" class="mb-8" />

    <h4 class="font-semibold mb-4">Staff Overview</h4>
    <div class="flex w-full gap-4 mb-8" v-if="!isLoading">
      <DashboardCard
        :metric="jobDetails?.eventDetails?.staffRequested"
        title="Requested"
      />
      <DashboardCard
        :metric="jobDetails?.eventDetails?.staffConfirmed"
        title="Confirmed"
      />
      <DashboardCard
        :metric="
          jobDetails?.eventDetails?.regularsAccepted +
          '/' +
          jobDetails?.eventDetails?.totalRegularsInvited
        "
        title="Regulars Accepted"
      />
    </div>

    <div v-if="isLoading" class="flex w-full gap-4 mb-8">
      <DashboardCardSkelton />
      <DashboardCardSkelton />
      <DashboardCardSkelton />
    </div>

    <h4 class="font-semibold mb-4">Confirmed Staff List</h4>
    <ConfirmedStaffTable
      v-if="jobDetails?.confirmedStaffList"
      :staff-list="jobDetails.confirmedStaffList!"
    />
  </div>
</template>
<style></style>

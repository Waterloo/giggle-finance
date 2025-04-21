<script setup lang="ts">
import emptyImg from "~/assets/images/Empty.svg";
import { useOutletStore } from "~/store/useOutletStore";
const outletStore = useOutletStore();
const outlet = computed(() => outletStore.selectedOutlet?.id);
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const startDate = ref(tomorrow);

const params = computed(() => {
    startDate.value.setHours(12, 0, 0, 0);
    return {
        outlet: outlet.value,
        "list-type": "future",
        "start-date": startDate.value.toISOString().split("T")[0],
    };
});

const { data, isLoading, refetch } = useDeploymentList(params);

const handleViewDetails = (id: number) => {
    navigateTo(`/deployments/${id}`);
};
const isCalendarVisible = ref(false);

const { title } = usePageHeader();
title.value = "Deployments";

onMounted(() => {
    title.value = "Deployments";
});
let calendarOverlay = ref(null);
</script>

<template>
    <div v-auto-animate>
        <div class="mb-6 flex justify-between items-center">
            <div class="relative">
                <!-- Date display button -->
                <button
                    @click="calendarOverlay.toggle($event)"
                    class="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                >
                    <span class="text-green-500 mr-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </span>
                    <span>{{ startDate.toDateString() }}</span>
                    <span class="ml-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </span>
                </button>

                <!-- Calendar dropdown -->
                <OverlayPanel ref="calendarOverlay" :unstyled="true">
                    <Calendar
                        v-model="startDate"
                        :inline="true"
                        :minDate="tomorrow"
                        @update:model-value="calendarOverlay.hide()"
                    />
                </OverlayPanel>
            </div>
        </div>
        <div v-if="isLoading" class="flex flex-col gap-6">
            <StaffRequestsSkelton v-for="n in 4" :key="n" />
        </div>
        <div v-else>
            <div
                v-if="data?.length === 0"
                class="flex flex-col items-center justify-center"
            >
                <h1 class="text-3xl font-semibold text-gray-600 mb-4">
                    It looks empty here
                </h1>
                <h2 class="text-base font-semibold text-gray-600 mb-6">
                    It looks like there are no deployments
                </h2>
                <img :src="emptyImg" />
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DeploymentsCard
                    v-for="job in data"
                    :key="job.id"
                    class="w-full"
                    :job-data="{
                        id: job.id,
                        date: job.date,
                        startTime: job.startTime,
                        endTime: job.endTime,
                        jobType: job.jobType,
                        staffRequested: job.slots,
                        staffAccepted: job.staffAccepted,
                        regularsRequested: job.regularsRequested,
                        regularsAccepted: job.regularsAccepted,
                    }"
                    @view-details="handleViewDetails(job.id)"
                />
            </div>
        </div>
    </div>
</template>

<style></style>

<script setup lang="ts">
import emptyImg from "~/assets/images/Empty.svg";
import { useOutletStore } from "~/store/useOutletStore";

const { title } = usePageHeader();
title.value = "Operation Day";

onMounted(() => {
    title.value = "Operation Day";
});

const outletStore = useOutletStore();
const outlet = computed(() => outletStore.selectedOutlet?.id);
const today = new Date();

const startDate = ref(today);
const params = computed(() => {
    startDate.value.setHours(12, 0, 0, 0);
    return {
        outlet: outlet.value,
        "list-type": "operation-day",
        "start-date": startDate.value.toISOString().split("T")[0],
    };
});

const { data, isLoading, refetch } = useDeploymentList(params);

const handleViewDetails = (id: number) => {
    navigateTo(`/operation/${id}`);
};
</script>

<template>
    <div v-auto-animate>
        <div v-if="isLoading" class="flex flex-col gap-6">
            <StaffRequestsSkelton v-for="n in 4" :key="n" />
        </div>
        <div v-else>
            <div>
                <button
                    class="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 my-4 pointer-events-none"
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
                    <span>{{ formatToDMYDay(startDate) }}</span>
                </button>
            </div>
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
                <OperationsCard
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
                        staffAccepted: job.staffAccepted + job.backUpSlots,
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

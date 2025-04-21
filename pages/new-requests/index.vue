<script setup lang="ts">
import emptyImg from "~/assets/images/Empty.svg";
import { useOutletStore } from "~/store/useOutletStore";

definePageMeta({
    alias: "/",
});

const { title } = usePageHeader();

onMounted(() => {
    title.value = "New Requests";
});

const { selectedOutlet } = storeToRefs(useOutletStore());
const selectedOutletId = computed(() => selectedOutlet.value?.id as number);

const { jobs, isLoading, refetch } = useOutletJobsList(selectedOutletId);
let pollingInterval = null;

onMounted(() => {
    // Start polling every minute (60000 milliseconds)
    pollingInterval = setInterval(() => {
        refetch();
        console.info("Requests Updated");
    }, 60000);
});

// Clean up the interval when the component unmounts
onBeforeUnmount(() => {
    if (pollingInterval) {
        clearInterval(pollingInterval);
    }
});
async function approveJob(id: number) {
    try {
        await refetch();
    } catch (error) {
        console.error("Failed to approve job", error);
    }
}
</script>
<template>
    <div>
        <div class="grid grid-cols-2 gap-6">
            <template v-if="isLoading">
                <StaffRequestsSkelton v-for="n in 4" :key="n" />
            </template>
            <template v-else>
                <StaffRequests
                    v-for="job in jobs"
                    :key="job.id"
                    :job-data="job"
                    @approve="refetch"
                />
            </template>
        </div>
        <div
            v-if="!isLoading && jobs?.length === 0"
            class="flex justify-center items-center mt-20 flex-col"
        >
            <h1 class="text-3xl font-semibold text-gray-600 mb-4">
                It looks empty here
            </h1>
            <h2 class="text-base font-semibold text-gray-600 mb-6">
                It looks like there’s no operations pending
            </h2>
            <img :src="emptyImg" />
        </div>
    </div>
</template>
<style></style>

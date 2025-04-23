<script lang="ts" setup>
const { title } = usePageHeader();

const { error, refetch, walletReleaseData, isLoading } = useWalletRelease();
const startDate = ref(new Date().toISOString().split("T")[0]);
const endDate = ref(new Date().toISOString().split("T")[0]);
const loading = ref(true);
const {
    error: historyError,
    refetch: refetchHistory,
    walletReleaseHistoryResult,
    isLoading: isHistoryLoading,
} = useWalletReleaseHistory(startDate, endDate);
onMounted(() => {
    title.value = "Wallet";
    loading.value = false;
});
function switchAttendanceType({ index }: { index: number }) {
    loading.value = true;
    if (index === 0) {
        refetch();
    } else if (index === 1) {
        refetchHistory();
    }
    loading.value = false;
}
const selectedApplicants = ref([]);
function handleReleaseSelection(applicants: []) {
    console.log(applicants);
    selectedApplicants.value = applicants;
}
const toast = useToast();
const { releaseFunds, releaseStatus, isReleasing, releaseError } =
    useReleaseWallet();

watch(releaseStatus, () => {
    if (releaseStatus.value === "success") {
        toast.add({
            severity: "success",
            summary: "Success",
            detail: "Funds released successfully",
            life: 3000,
        });
    }
});
watch(releaseError, () => {
    if (releaseError.value) {
        toast.add({
            severity: "error",
            summary: "Error",
            detail: releaseError.value.message,
            life: 3000,
        });
    }
});
async function handleReleaseFund() {
    try {
        await releaseFunds(selectedApplicants.value);
        refetch();
        selectedApplicants.value = [];
    } catch {
        toast.add({
            severity: "error",
            summary: "Error",
            detail: "An error occurred while releasing funds",
            life: 3000,
        });
    }
}
</script>

<template>
    <div v-auto-animate>
        <div v-if="loading">
            <Skeleton width="100%" height="1.5rem" />
            <Skeleton width="100%" height="5rem" />
        </div>
        <div v-else>
            <TabView
                @tab-change="switchAttendanceType"
                class="transparent-tabview"
            >
                <TabPanel
                    ><template #header>
                        <span class="inline-block px-2 pi pi-dollar" />
                        Release Requests</template
                    >
                    <div>
                        <WalletReleaseList
                            :applicants="walletReleaseData"
                            @release-fund="handleReleaseSelection"
                        />
                    </div>
                    <div
                        v-if="selectedApplicants.length > 0"
                        class="mt-10 flex justify-center items-center"
                    >
                        <Button @click="handleReleaseFund">Release Fund</Button>
                    </div>
                </TabPanel>
                <TabPanel
                    ><template #header>
                        <span class="inline-block px-2 pi pi-folder" />Release
                        Reports</template
                    >
                    <div>
                        <WalletOverviewCards
                            class="my-10"
                            :stats="walletReleaseHistoryResult"
                        />
                        <WalletTransferList
                            :transfers="walletReleaseHistoryResult?.transfers"
                        />
                    </div>
                </TabPanel>
            </TabView>
        </div>
    </div>
</template>
<style scoped>
/* Remove the background from TabView container */
:deep(.transparent-tabview .p-tabview-panels) {
    background: transparent;
    border: none;
    padding: 0;
}

/* Remove border from nav container if needed */
:deep(.transparent-tabview .p-tabview-nav-container) {
    background: transparent;
    border-bottom: none; /* Or keep a border if you want to separate tabs from content */
}

/* Customize tab headers if needed */
:deep(.transparent-tabview .p-tabview-nav) {
    background: transparent;
}

/* Additional styling for active tabs if needed */
:deep(.transparent-tabview .p-tabview-nav .p-tabview-nav-link) {
    background: transparent;
}

:deep(.transparent-tabview .p-tabview-nav .p-tabview-nav-link.p-highlight) {
    /* Custom styling for the active tab */
    border-color: var(--primary-color, #3b82f6);
    color: var(--primary-color, #3b82f6);
}

.date-range-picker {
    max-width: 400px;
}

.custom-calendar {
    width: 100%;
}

:deep(.p-calendar) {
    width: 100%;
}

:deep(.p-inputtext) {
    border-radius: 8px !important;
    padding: 1rem !important;
    width: 100%;
    background-color: white !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.date-display {
    display: flex;
    align-items: center;
    width: 100%;
    font-size: 1.1rem;
    font-weight: 500;
}

.date-icon {
    color: #22c55e;
    margin-right: 12px;
    font-size: 1.2rem;
}

.success-icon {
    margin-left: auto;
    color: #22c55e;
    font-size: 1.2rem;
}
</style>

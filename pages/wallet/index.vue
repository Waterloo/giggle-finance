<script lang="ts" setup>
const { title } = usePageHeader();

const { error, refetch, walletReleaseData, isLoading } = useWalletRelease();
const startDate = ref(new Date().toISOString().split("T")[0]);
const endDate = ref(new Date().toISOString().split("T")[0]);

const {
    error: historyError,
    refetch: refetchHistory,
    walletReleaseHistoryResult,
    isLoading: isHistoryLoading,
} = useWalletReleaseHistory(startDate, endDate);
onMounted(() => {
    title.value = "Wallet";
});
function switchAttendanceType({ index }: { index: number }) {
    if (index === 0) {
        refetch();
    } else if (index === 1) {
        refetchHistory();
    }
}
</script>

<template>
    <div v-auto-animate>
        <TabView @tab-change="switchAttendanceType">
            <TabPanel
                ><template #header>
                    <span class="inline-block px-2 pi pi-dollar" />
                    Release Requests</template
                >
                <div>
                    <WalletReleaseList :applicants="walletReleaseData" />
                </div>
            </TabPanel>
            <TabPanel
                ><template #header>
                    <span class="inline-block px-2 pi pi-folder" />Release
                    Reports</template
                >
                <div>
                    {{ walletReleaseHistoryResult }}
                </div>
            </TabPanel>
        </TabView>
    </div>
</template>

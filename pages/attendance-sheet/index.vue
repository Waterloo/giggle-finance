<script lang="ts" setup>
import { useOutletStore } from "@/store/useOutletStore";
const { title } = usePageHeader();
const outlet = useOutletStore();
import { formatToDMY } from "@/utils/format";

const outletId = computed(() => outlet.selectedOutlet?.id);

const loading = ref(true);

let filter = ref("active");

const startDate = ref(new Date().toISOString().split("T")[0]);
const endDate = ref(new Date().toISOString().split("T")[0]);
const date = new Date();

const dateRange = ref([date, date]);
const isCalendarVisible = ref(false);
const { isLoading, attendanceData, refetch, error } = useOutletAttendance(
    outletId,
    filter,
    startDate,
    endDate,
);

function switchAttendanceType({ index }: { index: number }) {
    filter.value = index === 0 ? "active" : "history";
    if (outletId.value) {
        refetch();
    }
}
const displayDateRange = computed(() => {
    if (dateRange.value && dateRange.value[0] && dateRange.value[1]) {
        return `${formatToDMY(dateRange.value[0])} - ${formatToDMY(dateRange.value[1])}`;
    }
    return "Select date range";
});

const toggleCalendar = () => {
    isCalendarVisible.value = !isCalendarVisible.value;
};

const onDateSelect = () => {
    // Close the calendar when a range is fully selected
    if (dateRange.value && dateRange.value[0] && dateRange.value[1]) {
        isCalendarVisible.value = false;

        startDate.value = dateRange.value[0].toISOString().split("T")[0];
        endDate.value = dateRange.value[1].toISOString().split("T")[0];
        console.log(startDate.value, endDate.value);
    }
};

// Optional: Close calendar when clicking outside
const closeCalendarOnClickOutside = (event) => {
    if (
        isCalendarVisible.value &&
        !event.target.closest(".date-range-picker")
    ) {
        isCalendarVisible.value = false;
    }
};
onMounted(async () => {
    title.value = "Attendance Sheet";
    loading.value = false;
});
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
                        <span class="inline-block px-2 pi pi-verified" />
                        Active Sheets</template
                    >

                    <div>
                        <AttendanceList
                            :isLoading="isLoading"
                            :data="attendanceData"
                        />
                    </div>
                </TabPanel>
                <TabPanel
                    ><template #header
                        ><span class="inline-block px-2 pi pi-history" />Sheets
                        History</template
                    >
                    <div class="my-6 flex justify-between items-center">
                        <div class="relative">
                            <!-- Date display button -->
                            <button
                                @click.stop="toggleCalendar"
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
                                <span>{{ displayDateRange }}</span>
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
                            <div
                                v-if="isCalendarVisible"
                                class="absolute z-10 mt-1 bg-white rounded-md shadow-lg"
                            >
                                <Calendar
                                    v-model="dateRange"
                                    selectionMode="range"
                                    :showTime="false"
                                    :inline="true"
                                    @date-select="onDateSelect"
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <AttendanceList
                            :isLoading="isLoading"
                            :data="attendanceData"
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

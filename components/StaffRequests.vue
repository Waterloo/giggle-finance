<script setup>
const props = defineProps({
    jobData: {
        type: Object,
        required: true,
        default: () => ({
            id: 0,
            date: "04 May 2024",
            startTime: "08:00 AM",
            endTime: "10:00 AM",
            jobType: "Waiter",
            staffRequested: 33,
            regularsRequested: 15,
            basePay: "15 SGD",
        }),
    },
});

const { approveJob, isLoading } = useOutletApproveJob();

const emit = defineEmits(["approve", "view-details"]);

const handleApprove = async () => {
    emit("approve");
};

const handleViewDetails = () => {
    isDialogVisible.value = true;
    emit("view-details");
};

const isDialogVisible = ref(false);
</script>

<template>
    <div class="bg-white p-6 rounded shadow-md">
        <div class="grid grid-cols-2 gap-6">
            <!-- Left Column -->
            <div class="space-y-6">
                <div>
                    <h3 class="text-sm font-semibold text-gray-500">
                        Date of event
                    </h3>
                    <p class="text-base font-medium">
                        {{ formatToDMY(jobData.date) }}
                    </p>
                </div>
                <div>
                    <h3 class="text-sm font-semibold text-gray-500">
                        Job type
                    </h3>
                    <p class="text-base font-medium">{{ jobData.jobType }}</p>
                </div>
                <div>
                    <h3 class="text-sm font-semibold text-gray-500">
                        Regulars Requested
                    </h3>
                    <p class="text-base font-medium">
                        {{ jobData.regularsRequested }}
                    </p>
                </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-6">
                <div>
                    <h3 class="text-sm font-semibold text-gray-500">
                        Time of event
                    </h3>
                    <p class="text-base font-medium">
                        {{ formatTo12hTime(jobData.startTime) }} -
                        {{ formatTo12hTime(jobData.endTime) }}
                    </p>
                </div>
                <div>
                    <h3 class="text-sm font-semibold text-gray-500">
                        Staff requested
                    </h3>
                    <p class="text-base font-medium">
                        {{ jobData.staffRequested }}
                    </p>
                </div>
                <div>
                    <h3 class="text-sm font-semibold text-gray-500">
                        Base pay
                    </h3>
                    <p class="text-base font-medium">{{ jobData.basePay }}</p>
                </div>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-8 mt-6">
            <Button
                label="Approve"
                class="flex-1 p-button-outlined p-button-success"
                :loading="isLoading"
                @click="handleApprove()"
            />
            <Button
                label="View details"
                class="flex-1 p-button-success"
                @click="handleViewDetails"
            />

            <Dialog v-model:visible="isDialogVisible" modal>
                <JobRequestForm
                    v-bind="jobData"
                    @submit="
                        () => {
                            isDialogVisible = false;
                            handleApprove();
                        }
                    "
                />
            </Dialog>
        </div>
    </div>
</template>

<style scoped>
.p-card {
    border-radius: 0.5rem;
}

.p-card-content {
    padding: 1.5rem;
}

.p-button {
    padding: 0.75rem 1.5rem;
}
</style>

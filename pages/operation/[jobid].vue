<script setup lang="ts">
import { useOutletStore } from "~/store/useOutletStore";
import { formatTo12hTime, formatToDMY } from "~/utils/format";
const { title, back, subtitle } = usePageHeader();

const outletStore = useOutletStore();
const outlet = computed(() => outletStore.selectedOutlet?.id);

const route = useRoute();

const queryVersion = ref(0);
const params = computed(() => ({
    id: Number(route.params.jobid),
    type: "operation-day",
    version: queryVersion.value,
}));
const { data, isLoading, refetch } = useDeploymentDetails(params);

const searchParams = ref({
    name: "",
    outlet: outlet.value,
});
const {
    data: applicants,
    isLoading: isLoadingApplicants,
    refetch: refetchApplicants,
} = useUserSearch(searchParams);
onMounted(() => {
    title.value = "Operation Details";
    back.value = "/operation";
});

// watch job details date and update title and subtitle

watchEffect(() => {
    if (data.value?.jobDetails) {
        title.value = formatToDMY(data.value?.jobDetails?.date);
        subtitle.value = `${formatTo12hTime(data.value?.jobDetails?.startTime)} - ${formatTo12hTime(data.value?.jobDetails?.endTime)}`;
    }
});

// refetch on params change
watch(params, async () => {
    console.log(params.value);
    await refetch();
});
let searchQuery = ref("");
const handleSearch = async (query) => {
    // Update search parameters with the new query and current outlet
    searchParams.value = {
        name: query,
        outlet: outlet.value,
    };
    // Refetch applicants with the new search parameters
    await refetchApplicants();
};

const { mutate, status, isLoading: isLoadingInvite } = useInviteApplicants();
const toast = useToast();

// Watch the status to show appropriate toast messages
watch(
    () => status.value,
    (newStatus) => {
        if (newStatus === "success") {
            toast.add({
                severity: "success",
                summary: "Staff Invited",
                detail: "Staff invited successfully",
                life: 3000,
            });
            // Optionally reset fields or refetch data here
            queryVersion.value++;
        } else if (newStatus === "error") {
            toast.add({
                severity: "error",
                summary: "Invitation Failed",
                detail: "Failed to invite staff. Please try again.",
                life: 5000,
            });
        }
    },
);

const handleInvite = async ({ selectedStaffs, newBasePay }) => {
    console.log(selectedStaffs, newBasePay);
    if (!selectedStaffs || selectedStaffs.length === 0) {
        toast.add({
            severity: "warn",
            summary: "No staff selected",
            detail: "Please select at least one staff member to invite",
            life: 3000,
        });
        return;
    }

    try {
        await mutate({
            jobId: Number(route.params.jobid),
            applicants: selectedStaffs.map((staff) => staff.applicantId),
            basePay: String(newBasePay) || "14",
        });
    } catch (error) {
        // This might not trigger since your useInviteApplicants doesn't seem to throw errors
        console.error("Invitation error:", error);
    }
};

const {
    mutate: reReleaseSlots,
    state: reReleaseStatus,
    error: reReleaseError,
} = useReReleaseSlots();

async function handleReRelease(newBasePay) {
    if (!newBasePay) {
        toast.add({
            severity: "warn",
            summary: "No base pay provided",
            detail: "Please enter a new base pay",
            life: 3000,
        });
        return;
    }

    try {
        await reReleaseSlots({
            jobId: Number(route.params.jobid),
            basePay: String(newBasePay),
        });
        toast.add({
            severity: "success",
            summary: "Re-release successful",
            detail: "Slots re-released successfully",
            life: 3000,
        });
    } catch (error) {
        console.error("Re-release error:", error);
    }
}
const { removeApplicant } = useRemoveApplicant();
async function handleRemoveStaff(staffId) {
    try {
        await removeApplicant(staffId);
        await refetch();
    } catch (error) {
        console.error("Remove staff error:", error);
    }
}
</script>

<template>
    <div v-auto-animate>
        <div v-if="isLoading">
            <DeploymentsDetailsCardSkeleton />
        </div>
        <div v-else>
            <div v-if="data">
                <DeploymentsDetailsCard
                    :eventDetails="{
                        id: data.jobDetails.id,
                        date: data.jobDetails.date,
                        startTime: data.jobDetails.startTime,
                        endTime: data.jobDetails.endTime,
                        basicPay: data.jobDetails.basicPay,
                        regularsAccepted: data.jobDetails.regularsAccepted,
                        staffRequested: data.jobDetails.slots,
                        additionalRequirements:
                            data.jobDetails.additionalRequirements,
                    }"
                    @re-release="handleReRelease"
                />
            </div>
        </div>
        <div v-if="data">
            <h4 class="text-base text-xl font-semibold my-6">Staff Details</h4>
            <OperationsStaffDetails
                :staff-list="data?.enrollmentsList?.confirmed || []"
                :loading="isLoading"
                :basic-pay="Number(data?.jobDetails?.basicPay) || 0"
                :regulars-accepted="data?.jobDetails?.regularsAccepted || 0"
                :applicants-list="applicants?.applicantsList || []"
                :applicants-loading="isLoadingApplicants"
                @invite-staff="handleInvite"
                @search="handleSearch"
                @remove-staff="handleRemoveStaff"
            />
            <h4 class="text-base text-xl font-semibold my-6">
                Cancelled Staff
            </h4>
            <DeploymentsCancelledList
                :cancelled="data?.enrollmentsList?.cancelled || []"
            />
        </div>
    </div>
</template>

<style></style>

<script lang="ts" setup>
// import { formatTo12hTime } from "@/utils/format";
const { title, subtitle, back } = usePageHeader();

let loading = ref(true);
const route = useRoute();

const attendanceId = computed(() => route.params.id);
const { jobAttendanceData, isLoading, error, refetch } =
    useJobAttendanceSheet(attendanceId);

onMounted(() => {
    title.value = "Attendance Sheet";
    back.value = "/attendance-sheet";

    loading.value = false;
});

watch(jobAttendanceData, () => {
    if (jobAttendanceData.value) {
        console.log(jobAttendanceData.value);
        title.value = formatToDMYDay(jobAttendanceData.value.jobDetails.date);
        subtitle.value = `${formatTo12hTime(jobAttendanceData.value.jobDetails.startTime)} - ${formatTo12hTime(jobAttendanceData.value.jobDetails.endTime)}`;
    }
});

const signatureOptions = {
    minWidth: 1.8,
    maxWidth: 2.2,
};

const signaturePad = ref();
const handleSignSubmit = async () => {
    const { data: imageData, isEmpty } = signaturePad.value.saveSignature();
    const blob = dataURItoBlob(imageData);

    // saveAttendance({
    //   enrollmentsData: data!,
    //   jobIds: attendanceDetails.value.jobIds,
    //   signatureURL: signUrl.replace("job/", ""),
    // });
};
const selectedRows = ref([]);
function handleReleaseToWallet(data) {
    // Implement release to wallet logic here
    selectedRows.value = data;
}
const { submitReleaseToWallet, submitStatus, isSubmitting, submitError } =
    useReleaseToWallet();

const toast = useToast();

watch(submitStatus, (status) => {
    if (status === "success") {
        toast.add({
            severity: "success",
            summary: "Success",
            detail: "Funds released successfully",
            life: 3000,
        });
    }
});

watch(submitError, () => {
    if (submitError.value) {
        toast.add({
            severity: "error",
            summary: "Error",
            detail: submitError.value.message,
            life: 3000,
        });
    }
});

async function releaseToWallet() {
    try {
        await submitReleaseToWallet({
            jobId: Number(route.params.id),
            enrollments: selectedRows.value,
        });
    } catch (error) {
        toast.add({
            severity: "error",
            summary: "Error",
            detail: error,
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
            <!-- <div class="flex gap-4 my-20">
                   <div v-if="jobAttendanceData?.signature?.status == 'signed'">
                       <img
                           :src="jobAttendanceData?.signature?.signatureURL"
                           alt="Signature"
                           class="w-96 h-20 rounded-full"
                       />
                   </div>
                   <div class="flex" v-else>
                       <VueSignaturePad
                           ref="signaturePad"
                           width="400px"
                           height="160px"
                           class="bg-white border border-r-0"
                           :options="signatureOptions"
                       />
                       <Button
                           icon="pi pi-trash"
                           class="p-button-danger p-button-outlined rounded-l-none border-l-0"
                           @click="signaturePad.clearSignature()"
                       />
                   </div>

                   <div class="flex flex-col gap-6 items-end">
                       <div>
                           Singnature Status
                           <span
                               class="ml-4 bg-green-500 text-white px-4 py-2 rounded-md"
                               v-if="jobAttendanceData?.signature?.status == 'signed'"
                               >Singed</span
                           >
                           <span
                               v-else
                               class="ml-4 bg-red-500 text-white px-4 py-2 rounded-md"
                               >Pending</span
                           >
                       </div>
                       <div>
                           <Button
                               :disabled="
                                   jobAttendanceData?.signature?.status == 'signed'
                               "
                           >
                               Request Singature
                           </Button>
                       </div>
                   </div>
               </div> -->

            <AttendanceSheetList
                @selectionChange="handleReleaseToWallet"
                :attendance-sheet="jobAttendanceData?.attendanceSheet"
            />
            <div
                v-if="selectedRows?.length > 0"
                class="my-10 flex justify-center items-center"
            >
                <Button @click="releaseToWallet"> Release to Wallet </Button>
            </div>
        </div>
    </div>
</template>

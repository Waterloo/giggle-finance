<template>
    <div class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-xl mb-4">Cancelled List</h3>

        <DataTable
            :value="cancelled"
            responsiveLayout="scroll"
            class="p-datatable-sm"
        >
            <template #empty> No staff found. </template>
            <template #loading> Loading staff data. Please wait. </template>
            <Column header="Name" style="width: 25%">
                <template #body="slotProps">
                    <div class="flex items-center">
                        <div
                            class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2 overflow-hidden"
                        >
                            <img
                                v-if="
                                    slotProps.data.profilePictureURL &&
                                    slotProps.data.profilePictureURL !== 'gg'
                                "
                                :src="slotProps.data.profilePictureURL"
                                class="w-full h-full object-cover"
                                alt="Profile"
                            />
                            <span v-else class="text-gray-500 text-xs">{{
                                getInitials(slotProps.data.fullName)
                            }}</span>
                        </div>
                        <span>{{ slotProps.data.fullName }}</span>
                    </div>
                </template>
            </Column>

            <Column header="NRIC" style="width: 20%">
                <template #body="slotProps">
                    <span>{{ maskNRIC(slotProps.data.nric) }}</span>
                </template>
            </Column>

            <Column header="Status" style="width: 15%">
                <template #body="slotProps">
                    <span
                        class="bg-red-100 text-red-600 px-2 py-1 rounded text-xs"
                        >Cancelled</span
                    >
                </template>
            </Column>

            <Column header="Contact" style="width: 15%">
                <template #body="slotProps">
                    <button
                        v-tooltip.top="'Open WhatsApp'"
                        @click="openWhatsApp(slotProps.data.phone)"
                        class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"
                    >
                        <i class="pi pi-whatsapp text-green-600"></i>
                    </button>
                </template>
            </Column>

            <Column header="Upload MC" style="width: 10%">
                <template #body="slotProps">
                    <div class="relative flex items-center justify-center">
                        <input
                            type="file"
                            :id="`file-upload-${slotProps.data.enrollmentId}`"
                            class="hidden"
                            accept="image/*,.pdf"
                            @change="
                                handleFileUpload(
                                    $event,
                                    slotProps.data.enrollmentId,
                                )
                            "
                            v-tooltip.top="'Upload MC'"
                            :disabled="isUploading[slotProps.data.enrollmentId]"
                        />
                        <label
                            :for="`file-upload-${slotProps.data.enrollmentId}`"
                            class="border-2 border-green-500 text-green-500 rounded-md w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-green-50"
                            :class="{
                                'opacity-50 cursor-not-allowed':
                                    isUploading[slotProps.data.enrollmentId],
                            }"
                        >
                            <i
                                class="pi text-lg"
                                :class="
                                    isUploading[slotProps.data.enrollmentId]
                                        ? 'pi-spin pi-spinner'
                                        : 'pi-upload'
                                "
                            ></i>
                        </label>
                        <a
                            v-if="slotProps.data.medicalCertificate"
                            :href="slotProps.data.medicalCertificate"
                            target="_blank"
                            class="text-green-600 text-xs mt-2 block hover:underline flex items-center"
                        >
                            <i class="pi pi-eye mr-1"></i> View Certificate
                        </a>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { ref, reactive } from "vue";
import { useToast } from "primevue/usetoast";

// Define the structure of a cancelled deployment item based on the provided schema

// Define props
const props = defineProps<{
    cancelled: CancelledItem[] | null | undefined;
}>();

// Helper function to mask NRIC (show only last 4 characters)
const maskNRIC = (nric: string) => {
    if (!nric) return "";
    return "*".repeat(nric.length - 4) + nric.slice(-4);
};

// Helper function to get initials from name
const getInitials = (name: string) => {
    if (!name) return "";
    return name
        .split(" ")
        .map((part) => part.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

// Toast for notifications
const toast = useToast();

// Track upload status for each enrollment
const isUploading = reactive<Record<number, boolean>>({});

// Get the update medical certificate composable
const { uploadMedicalCertificate } = useUpdateMedicalCertificate();

const { getSignedURL } = useGetSignedURL();

// Handle file upload
const handleFileUpload = async (event: Event, enrollmentId: number) => {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    console.log(file);
    if (!file) {
        toast.add({
            severity: "error",
            summary: "Error",
            detail: "No file selected",
            life: 3000,
        });
        return;
    }

    // Check file size (max 5MB)
    if (file.size > 2 * 1024 * 1024) {
        toast.add({
            severity: "error",
            summary: "Error",
            detail: "File size exceeds 5MB limit",
            life: 3000,
        });
        fileInput.value = "";
        return;
    }

    let fileType = "medical-certificate";
    let extension = file.name.split(".").pop();

    // Call the mutation function and WAIT for it to complete
    const signedURL = await getSignedURL({ fileType, extension });

    try {
        if (signedURL) {
            // Set uploading state
            isUploading[enrollmentId] = true;

            const result = uploadMedicalCertificate({
                enrollmentId,
                file: file,
                fileNameBase: signedURL.uploadInfo.path,
            });

            // Update the local data with the new certificate URL
            if (props.cancelled) {
                const staffIndex = props.cancelled.findIndex(
                    (staff) => staff.enrollmentId === enrollmentId,
                );
                if (staffIndex !== -1 && result.certificateURL) {
                    props.cancelled[staffIndex].medicalCertificate =
                        result.certificateURL;
                }
            }

            // Show success message
            toast.add({
                severity: "success",
                summary: "Success",
                detail: "Medical certificate uploaded successfully",
                life: 3000,
            });

            // Reset file input
            fileInput.value = "";
        } else {
            toast.add({
                severity: "error",
                summary: "Error",
                detail: "Failed to generate signed URL",
                life: 3000,
            });
        }
    } catch (error) {
        console.error("Error uploading medical certificate:", error);
        toast.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to upload medical certificate",
            life: 3000,
        });
    } finally {
        // Reset uploading state
        isUploading[enrollmentId] = false;
    }
};

// Convert file to base64 string
// const fileToBase64 = (file: File): Promise<string> => {
//     return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.readAsDataURL(file);
//         reader.onload = () => {
//             const result = reader.result as string;
//             // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
//             const base64String = result.split(",")[1];
//             resolve(base64String);
//         };
//         reader.onerror = (error) => reject(error);
//     });
// };

const openWhatsApp = (phone: string) => {
    if (!phone) {
        toast.add({
            severity: "error",
            summary: "Error",
            detail: "Phone number not available",
            life: 3000,
        });
        return;
    }

    // Format phone number (remove spaces, ensure it starts with country code)
    const formattedPhone = phone.startsWith("+")
        ? phone.replace(/\s+/g, "")
        : `+${phone.replace(/\s+/g, "")}`;

    // Open WhatsApp web with the phone number
    window.open(`https://wa.me/${formattedPhone.replace("+", "")}`, "_blank");
};
</script>

<style scoped>
:deep(.p-datatable-thead) th {
    @apply text-gray-600 font-medium text-sm;
    background-color: transparent;
    border-bottom: 1px solid #e5e7eb;
}

:deep(.p-datatable-tbody) tr {
    @apply border-b border-gray-100;
}

:deep(.p-datatable-tbody) tr:last-child {
    @apply border-b-0;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
    @apply py-3;
    border: none;
}
</style>

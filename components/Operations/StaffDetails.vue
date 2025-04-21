<template>
    <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="mb-4">
            <h3 class="font-medium mb-4">Invite Staff</h3>
            <div class="p-inputgroup">
                <InputText
                    v-model="searchQuery"
                    placeholder="Search name to invite"
                    class="max-w-sm"
                    @input="handleSearch"
                    @click="toggleSearchPanel"
                    ref="searchInput"
                />
                <span class="p-inputgroup-addon">
                    <i class="pi pi-search"></i>
                </span>
            </div>

            <OverlayPanel
                ref="searchOverlay"
                :appendTo="'body'"
                class="staff-search-overlay max-w-sm w-full"
            >
                <div class="flex flex-column gap-3 w-25rem">
                    <div v-if="searchQuery.trim().length === 0">
                        <div class="p-4 text-center text-color-secondary">
                            Type something to search staff
                        </div>
                    </div>
                    <div v-else-if="filteredStaff.length > 0">
                        <div class="max-h-80 overflow-y-auto">
                            <div
                                v-for="staff in filteredStaff"
                                :key="staff.id"
                                class="p-3 border-b hover:bg-gray-50 cursor-pointer flex align-items-center"
                                @click="toggleStaffSelection(staff)"
                            >
                                <Checkbox
                                    v-model="staff.selected"
                                    :binary="true"
                                    class="mr-3"
                                    @click.stop
                                />
                                <Avatar
                                    :image="staff.profilePictureURL || null"
                                    :icon="
                                        !staff.profilePictureURL
                                            ? staff.gender === 'female'
                                                ? 'pi pi-user-plus'
                                                : 'pi pi-user'
                                            : null
                                    "
                                    :label="
                                        !staff.profilePictureURL
                                            ? staff.fullName
                                                  ?.charAt(0)
                                                  .toUpperCase()
                                            : null
                                    "
                                    :style="{
                                        backgroundColor:
                                            !staff.profilePictureURL
                                                ? staff.gender === 'female'
                                                    ? '#FFDEE9'
                                                    : '#D9E5FF'
                                                : null,
                                        color: !staff.profilePictureURL
                                            ? staff.gender === 'female'
                                                ? '#FF4081'
                                                : '#3B82F6'
                                            : null,
                                    }"
                                    shape="circle"
                                    class="mr-2"
                                />
                                <div>
                                    <div>
                                        {{ staff.fullName }}
                                        <span
                                            class="text-xs text-color-secondary"
                                            >({{
                                                staff.gender === "female"
                                                    ? "F"
                                                    : "M"
                                            }})</span
                                        >
                                        <span
                                            ><Tag>{{
                                                staff.isRegular
                                                    ? "Regular"
                                                    : "New Invite"
                                            }}</Tag></span
                                        >
                                    </div>
                                    <div class="text-xs text-color-secondary">
                                        {{ staff.nric }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            class="p-3 flex justify-content-end border-t bg-gray-50"
                        >
                            <Button
                                label="Send Invite"
                                :disabled="selectedStaff.length === 0"
                                class="p-button-success"
                                @click="openConfirmDialog"
                            />
                        </div>
                    </div>
                    <div v-else class="p-4 text-center text-color-secondary">
                        No matching staff found
                    </div>
                </div>
            </OverlayPanel>
        </div>

        <!-- Staff Table -->
        <div>
            <SkeletonTable v-if="loading" />
            <DataTable
                v-else
                :value="staff"
                class="p-datatable-sm"
                :loading="loading"
                v-model:filters="filters"
                filterDisplay="row"
                dataKey="id"
            >
                <template #empty> No staff found. </template>
                <template #loading> Loading staff data. Please wait. </template>
                <!-- Name Column -->
                <Column
                    field="fullName"
                    style="min-width: 200px"
                    sortable
                    :show-filter-menu="false"
                >
                    <template #header>
                        <div class="text-center w-full">Name</div>
                    </template>
                    <template #body="{ data }">
                        <div class="flex items-center">
                            <Avatar
                                :image="data.profilePictureURL || null"
                                :icon="
                                    !data.profilePictureURL
                                        ? data.gender === 'female'
                                            ? 'pi pi-user-plus'
                                            : 'pi pi-user'
                                        : null
                                "
                                :label="
                                    !data.profilePictureURL
                                        ? data.fullName.charAt(0).toUpperCase()
                                        : null
                                "
                                :style="{
                                    backgroundColor: !data.profilePictureURL
                                        ? data.gender === 'female'
                                            ? '#FFDEE9'
                                            : '#D9E5FF'
                                        : null,
                                    color: !data.profilePictureURL
                                        ? data.gender === 'female'
                                            ? '#FF4081'
                                            : '#3B82F6'
                                        : null,
                                }"
                                shape="circle"
                                class="mr-2"
                            />
                            <span>{{ data.fullName }}</span>
                        </div>
                    </template>
                    <template #filter="{ filterModel, filterCallback }">
                        <InputText
                            v-model="filterModel.value"
                            type="text"
                            placeholder="Search name"
                            class="p-column-filter w-full"
                            @input="filterCallback()"
                        />
                    </template>
                </Column>

                <!-- NRIC Column -->
                <Column
                    field="nric"
                    style="min-width: 150px"
                    headerClass="text-center"
                    bodyClass="text-center"
                    :show-filter-menu="false"
                >
                    <template #header>
                        <div class="text-center w-full">NRIC</div>
                    </template>
                    <template #filter="{ filterModel, filterCallback }">
                        <InputText
                            v-model="filterModel.value"
                            type="text"
                            placeholder="Search NRIC"
                            class="p-column-filter w-full"
                            @input="filterCallback()"
                        />
                    </template>
                </Column>

                <!-- Base Pay Column -->
                <Column
                    field="basicPay"
                    style="min-width: 120px"
                    headerClass="text-center"
                    bodyClass="text-center"
                    :show-filter-menu="false"
                >
                    <template #header>
                        <div class="text-center w-full">Base Pay</div>
                    </template>
                    <template #body="{ data }">
                        <div class="flex items-center justify-center">
                            <span>${{ data.basicPay }}/hr</span>
                        </div>
                    </template>
                    <template #filter="{ filterModel, filterCallback }">
                        <InputText
                            v-model="filterModel.value"
                            type="text"
                            placeholder="Search pay"
                            class="p-column-filter w-full"
                            @input="filterCallback()"
                        />
                    </template>
                </Column>

                <!-- Status Column -->
                <Column
                    field="status"
                    style="min-width: 150px"
                    headerClass="text-center"
                    bodyClass="text-center"
                    :show-filter-menu="false"
                >
                    <template #header>
                        <div class="text-center w-full">Status</div>
                    </template>
                    <template #body="{ data }">
                        <span
                            class="inline-block px-4 py-1.5 text-center font-medium rounded-md"
                            :class="{
                                'bg-red-500 text-white':
                                    data.status === 'Cancelled',
                                'bg-green-500 text-white':
                                    data.status === 'Signed in',
                                'bg-yellow-500 text-gray-800':
                                    data.status === 'Nearby',
                                'bg-orange-500 text-white':
                                    data.status === 'On the way',
                                'bg-blue-500 text-white':
                                    data.status === 'Processing',
                                'bg-gray-500 text-white': ![
                                    'Cancelled',
                                    'Signed in',
                                    'Nearby',
                                    'On the way',
                                    'Processing',
                                ].includes(data.status),
                            }"
                        >
                            {{ data.status }}
                        </span>
                    </template>
                    <template #filter="{ filterModel, filterCallback }">
                        <Dropdown
                            v-model="filterModel.value"
                            :options="statusOptions"
                            option-label="label"
                            option-value="value"
                            placeholder="Select status"
                            class="p-column-filter w-full"
                            @change="filterCallback()"
                        />
                    </template>
                </Column>

                <!-- WhatsApp Column -->
                <Column
                    field="whatsapp"
                    style="min-width: 150px"
                    headerClass="text-center"
                    bodyClass="text-center"
                    :show-filter-menu="false"
                >
                    <template #header>
                        <div class="text-center w-full">WhatsApp</div>
                    </template>
                    <template #body="{ data }">
                        <Button
                            icon="pi pi-whatsapp"
                            class="p-button-rounded p-button-success p-button-sm"
                            v-tooltip.top="'Open WhatsApp'"
                            @click="openWhatsApp(data.phone)"
                        />
                    </template>
                </Column>
                <Column header="Remove" style="width: 5rem; text-align: center">
                    <template #body="{ data }">
                        <Button
                            icon="pi pi-trash"
                            class="p-button-rounded p-button-text p-button-danger p-button-sm"
                            v-tooltip.top="'Remove Applicant'"
                            @click="openDeleteConfirmDialog(data)"
                        />
                    </template>
                </Column>
            </DataTable>
        </div>
        <!-- Confirmation Dialog -->
        <Dialog
            v-model:visible="confirmDialogVisible"
            modal
            header="Confirm Invite"
            :closable="true"
            class="confirm-invite-dialog"
        >
            <div class="p-4">
                <p class="text-gray-700 mb-4">
                    Confirm the staff and their new pay
                </p>

                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-1"
                            >Old Base Pay</label
                        >
                        <div class="p-inputtext bg-gray-100 p-2 rounded">
                            ${{ basicPay }}/hr
                        </div>
                    </div>
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-1"
                            >New Invitee Pay</label
                        >
                        <InputText
                            v-model="newBasePay"
                            class="w-full"
                            placeholder="$14/hr"
                        />
                    </div>
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                        >Applied to staff(s)</label
                    >
                    <div
                        class="border rounded-md p-4 min-h-32 flex items-center"
                    >
                        <div
                            v-for="invitedStaff in selectedStaff"
                            :key="invitedStaff.id"
                            class="flex items-center justify-between"
                        >
                            <div class="flex items-center">
                                <Avatar
                                    :image="
                                        invitedStaff.profilePictureURL || null
                                    "
                                    :icon="
                                        !invitedStaff.profilePictureURL
                                            ? invitedStaff.gender === 'female'
                                                ? 'pi pi-user-plus'
                                                : 'pi pi-user'
                                            : null
                                    "
                                    :style="{
                                        backgroundColor:
                                            invitedStaff.gender === 'female'
                                                ? '#FFDEE9'
                                                : '#D9E5FF',
                                        color:
                                            invitedStaff.gender === 'female'
                                                ? '#FF4081'
                                                : '#3B82F6',
                                    }"
                                    shape="circle"
                                    class="mr-2"
                                    size="small"
                                />
                                <span class="text-sm">{{
                                    invitedStaff.fullName
                                }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="p-0">
                <Button
                    label="Confirm & Send Invite"
                    class="w-full p-button-success rounded-none py-3 flex items-center justify-center"
                    @click="confirmInvite"
                    style="border-radius: 0; margin: 0"
                >
                    <i class="pi pi-check mr-2"></i>
                    <span>Confirm & Send Invite</span>
                </Button>
            </div>
        </Dialog>

        <Dialog
            v-model:visible="deleteConfirmDialogVisible"
            modal
            header="Confirm Removal"
            :closable="true"
            class="confirm-delete-dialog w-full max-w-md"
            @hide="staffMemberToDelete = null"
        >
            <div class="p-4">
                <div v-if="staffMemberToDelete" class="text-center">
                    <p class="text-gray-700 mb-2">
                        Are you sure you want to remove this staff member from
                        the deployment?
                    </p>
                    <p class="font-bold text-lg mb-4">
                        {{ staffMemberToDelete.fullName }} ({{
                            staffMemberToDelete.nric
                        }})
                    </p>
                </div>
                <div v-else class="p-4 text-center text-gray-500">
                    Loading staff details...
                </div>
            </div>

            <!-- Footer with actions -->
            <template #footer>
                <div class="flex gap-2 p-3 border-t">
                    <Button
                        label="Confirm & Remove"
                        icon="pi pi-trash"
                        class="p-button-danger"
                        @click="executeRemoveStaff"
                        :disabled="!staffMemberToDelete"
                    />
                </div>
            </template>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { FilterMatchMode } from "primevue/api";
import { useToast } from "primevue/usetoast";

const toast = useToast();

const props = defineProps({
    staffList: {
        type: Array,
        default: () => [],
    },
    loading: {
        type: Boolean,
        default: false,
    },
    basicPay: {
        type: Number,
        default: 0,
    },
    applicantsList: {
        type: Array,
        default: () => [],
    },
    applicantsLoading: {
        type: Boolean,
        default: false,
    },
});

// Add selected property to applicants
const localApplicantsList = ref([]);

watch(
    () => props.applicantsList,
    (newApplicants) => {
        if (newApplicants && newApplicants.length > 0) {
            localApplicantsList.value = newApplicants.map((applicant) => ({
                ...applicant,
                selected: applicant.selected || false,
            }));
        } else {
            localApplicantsList.value = [];
        }
    },
    { immediate: true },
);

// Search and filter state
const searchQuery = ref("");
const searchOverlay = ref(null);
const searchInput = ref(null);
const filters = ref({
    fullName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nric: { value: null, matchMode: FilterMatchMode.CONTAINS },
    basicPay: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    whatsapp: { value: null, matchMode: FilterMatchMode.EQUALS },
});

// Filter options
const statusOptions = ref([
    { label: "Cancelled", value: "cancelled" },
    { label: "Near By", value: "nearby" },
    { label: "Signed In", value: "signed_in" },
    { label: "On The Way", value: "on_the_way" },
    { label: "Processing", value: "processing" },
    { label: "Pending", value: "pending" },
]);

// Staff selection and dialog state
const confirmDialogVisible = ref(false);
const newBasePay = ref(14);
// Add these refs for the delete confirmation dialog
const deleteConfirmDialogVisible = ref(false);
const staffMemberToDelete = ref(null); // To store the staff member being confirmed for deletion
// Computed property to get staff list for the table
const staff = computed(() => {
    return props.staffList;
});

// Filtered staff based on search query for the invite dropdown
const filteredStaff = computed(() => {
    if (!searchQuery.value) {
        return localApplicantsList.value;
    }

    const query = searchQuery.value.toLowerCase();
    return localApplicantsList.value.filter(
        (item) =>
            item.fullName?.toLowerCase().includes(query) ||
            item.nric?.toLowerCase().includes(query),
    );
});

// Selected staff list from applicants
const selectedStaff = computed(() => {
    return localApplicantsList.value.filter((item) => item.selected);
});

// Toggle staff selection
const toggleStaffSelection = (staffMember) => {
    staffMember.selected = !staffMember.selected;
};

// Open WhatsApp with the given phone number
const openWhatsApp = (phone) => {
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

// Open confirm dialog
const openConfirmDialog = () => {
    // Close the search overlay
    searchOverlay.value.hide();
    newBasePay.value = props.basicPay;

    confirmDialogVisible.value = true;
};
const emits = defineEmits(["inviteStaff", "search", "removeStaff"]);
// Confirm invite
const confirmInvite = () => {
    emits("inviteStaff", {
        selectedStaffs: selectedStaff.value,
        newBasePay: newBasePay.value,
    });
    // Close dialog and reset selection on applicants
    confirmDialogVisible.value = false;
    localApplicantsList.value.forEach((item) => {
        item.selected = false;
    });
};

onMounted(() => {
    // No need for document click listener anymore
});

// Update the handleSearch function to use OverlayPanel with new behavior
// Replace these functions with simplified versions
const handleSearch = () => {
    showSearchOverlayWithSyntheticEvent();
    // Only emit search event if there's a search query
    if (searchQuery.value && searchQuery.value.trim().length > 0) {
        emits("search", searchQuery.value);
    }
};

const toggleSearchPanel = (event) => {
    if (searchOverlay.value && searchInput.value) {
        searchOverlay.value.toggle(event);
    }
};

const showSearchOverlayWithSyntheticEvent = () => {
    if (searchOverlay.value && searchInput.value) {
        // Get the DOM element
        const inputEl = searchInput.value.$el || searchInput.value;

        // Create a synthetic MouseEvent centered on the input element
        const rect = inputEl.getBoundingClientRect();
        const syntheticEvent = {
            target: inputEl,
            currentTarget: inputEl,
            preventDefault: () => {},
            stopPropagation: () => {},
            clientX: rect.left + rect.width / 2,
            clientY: rect.top + rect.height / 2,
        };

        // Use the synthetic event to show the overlay
        searchOverlay.value.show(syntheticEvent);
    }
};
// Remove the watch for searchQuery - we'll handle showing the panel with the click event
//
// Function to open the delete confirmation dialog
const openDeleteConfirmDialog = (staffMember) => {
    staffMemberToDelete.value = staffMember; // Store the staff to be deleted
    deleteConfirmDialogVisible.value = true; // Show the dialog
};

// Function called when the "Confirm & Remove" button is clicked
const executeRemoveStaff = () => {
    if (staffMemberToDelete.value) {
        emits("removeStaff", staffMemberToDelete.value.enrollmentId); // Emit the event
        toast.add({
            severity: "info",
            summary: "Removal Initiated",
            detail: `${staffMemberToDelete.value.fullName} will be removed.`,
            life: 3000,
        });
    }
    deleteConfirmDialogVisible.value = false; // Close the dialog
    // staffMemberToDelete is cleared by the @hide handler on the dialog
};

// Function called when the "Cancel" button is clicked or dialog is closed externally
const cancelRemoveStaff = () => {
    deleteConfirmDialogVisible.value = false;
    // staffMemberToDelete is cleared by the @hide handler on the dialog
};
</script>

<style scoped>
/* Custom styles if needed */
.p-datatable .p-datatable-tbody > tr > td {
    padding: 0.75rem 1rem;
}

.p-dialog-content {
    padding: 0 !important;
}

.confirm-invite-dialog .p-dialog-header {
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
}

.confirm-invite-dialog .p-dialog-content {
    padding: 0 !important;
}

.confirm-invite-dialog .p-dialog-footer {
    display: none;
}

.staff-search-overlay {
    width: 400px;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
/* Remove filter icon space completely */

::v-deep(.p-column-filter-clear-button) {
    display: none !important;
}
</style>

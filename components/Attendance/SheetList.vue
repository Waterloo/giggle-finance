<script setup lang="ts">
import { ref, watch } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Avatar from "primevue/avatar";
import Tag from "primevue/tag";
import Button from "primevue/button";
import OverlayPanel from "primevue/overlaypanel";
import Calendar from "primevue/calendar";
import Dropdown from "primevue/dropdown";
import MultiSelect from "primevue/multiselect";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
// Adjust path if your utils folder is elsewhere relative to components
import { maskNRIC, formatTo12hTime } from "~/utils/format";

// Interface based on the provided schema
interface AttendanceRecord {
    id: number;
    applicantId: number;
    name: string;
    profilePic: string;
    nric: string;
    paymentStatus: "pending" | "paid";
    basePay: string;
    signInTime: string | null;
    signOutTime: string | null;
    breakTime: string | null;
    totalHourWorked: number | null;
    totalPay: string;
    penaltyAmount: string;
    netPay: string;
    issue: string[];
}

// Valid break time options
const breakTimeOptions = [
    { label: "0:15", value: "0.15" },
    { label: "0:30", value: "0.30" },
    { label: "0:45", value: "0.45" },
    { label: "1:00", value: "1" },
    { label: "1:15", value: "1.15" },
    { label: "1:30", value: "1.30" },
];

// Valid issue options
const issueOptions = [
    { label: "Wrong Attire", value: "wrong_attire" },
    { label: "Not Suitable", value: "not_suitable" },
    { label: "Late", value: "late" },
];

// Emit event when selection changes
const emit = defineEmits<{
    (
        e: "selectionChange",
        selectedItems: {
            id: number;
            signInTime: string | null;
            signOutTime: string | null;
            breakTime: string | null;
            issue: string[];
        }[],
    ): void;
    (e: "update:attendanceSheet", updatedSheet: AttendanceRecord[]): void;
}>();

const selectedRows = ref<AttendanceRecord[]>([]);
const issuePanel = ref(); // Reference for overlay panel
const activeIssues = ref<string[]>([]); // To store active issues
const editDialog = ref(false);
const editingRecord = ref<AttendanceRecord | null>(null);
const tempSignInTime = ref<Date | null>(null);
const tempSignOutTime = ref<Date | null>(null);
const tempBreakTime = ref<string | null>(null);
const tempIssues = ref<string[]>([]);

const props = defineProps({
    attendanceSheet: {
        type: Array<AttendanceRecord>,
        default: () => [
            {
                id: 1,
                applicantId: 101,
                name: "Ioni Bowcher (F)",
                profilePic: "https://example.com/profiles/ion.jpg",
                nric: "S1234G452",
                paymentStatus: "pending",
                basePay: "17",
                signInTime: "2023-05-15T08:00:00Z",
                signOutTime: "2023-05-15T14:00:00Z",
                breakTime: "1.30",
                totalHourWorked: 4.5,
                totalPay: "100",
                penaltyAmount: "50",
                netPay: "150",
                issue: ["late", "wrong_attire"],
            },
            {
                id: 2,
                applicantId: 102,
                name: "Aiden Elsner (M)",
                profilePic: "https://example.com/profiles/aiden.jpg",
                nric: "S1234T758",
                paymentStatus: "paid",
                basePay: "18",
                signInTime: "2023-05-15T08:00:00Z",
                signOutTime: "2023-05-15T14:00:00Z",
                breakTime: "0.30",
                totalHourWorked: 4.5,
                totalPay: "108",
                penaltyAmount: "0",
                netPay: "108",
                issue: [],
            },
        ],
    },
});

const attendanceData = ref<AttendanceRecord[]>([...props.attendanceSheet]);

// Watch for changes in selectedRows and emit the full selected row objects
function handleSelectionChange() {
    // Map the selected rows to only include the required attributes
    const formattedSelection = selectedRows.value.map((row) => ({
        id: row.id,
        signInTime: row.signInTime || "",
        signOutTime: row.signOutTime || "",
        breakTime: row.breakTime || "0.15",
        issue: row.issue || [],
    }));

    // Emit the simplified data structure
    emit("selectionChange", formattedSelection);
}

// Format payment status (simple capitalization)
const formatPaymentStatus = (
    status: "pending" | "paid" | undefined,
): string => {
    if (!status) return "";
    return status.charAt(0).toUpperCase() + status.slice(1);
};

// Get severity for payment status tag
const getPaymentStatusSeverity = (status: "pending" | "paid" | undefined) => {
    return status === "paid" ? "info" : "danger";
};

// Format hours (ensure 2 decimal places, handle null)
const formatHours = (hours: number | null): string => {
    return (hours ?? 0).toFixed(2);
};

// Helper to safely format ISO date strings to 12h time
const formatIsoStringTo12hTime = (isoString: string | null): string => {
    if (!isoString) {
        return "N/A";
    }
    try {
        const dateObj = new Date(isoString);
        if (isNaN(dateObj.getTime())) {
            console.warn("Invalid date string provided:", isoString);
            return "Invalid Date";
        }
        return formatTo12hTime(dateObj);
    } catch (e) {
        console.error("Error parsing or formatting date:", isoString, e);
        return "Error";
    }
};

// Function to format the display of sign-in and sign-out times
const formatSignInOutTimes = (
    signInTime: string | null,
    signOutTime: string | null,
): string => {
    let signInDisplay = "N/A";
    let signOutDisplay = "N/A";

    if (signInTime) {
        signInDisplay = formatIsoStringTo12hTime(signInTime);
    }

    if (signOutTime) {
        signOutDisplay = formatIsoStringTo12hTime(signOutTime);
    }

    return `${signInDisplay} - ${signOutDisplay}`;
};

// Function to show issues in overlay panel
const showIssues = (event: Event, issues: string[]) => {
    activeIssues.value = issues;
    issuePanel.value.toggle(event);
};

// Function to format break time display
const formatBreakTime = (breakTime: string | null): string => {
    if (!breakTime) return "0:00 Hours";

    // Format the break time for display
    const option = breakTimeOptions.find((opt) => opt.value === breakTime);
    return option ? `${option.label} Hours` : `${breakTime} Hours`;
};

// Function to open edit dialog
const openEditDialog = (record: AttendanceRecord) => {
    editingRecord.value = { ...record };
    tempSignInTime.value = record.signInTime
        ? new Date(record.signInTime)
        : null;
    tempSignOutTime.value = record.signOutTime
        ? new Date(record.signOutTime)
        : null;
    tempBreakTime.value = record.breakTime;
    tempIssues.value = [...(record.issue || [])];
    editDialog.value = true;
};

// Function to save edited record
const saveEditedRecord = () => {
    if (!editingRecord.value) return;

    // Update the record with temp values
    editingRecord.value.signInTime = tempSignInTime.value
        ? tempSignInTime.value.toISOString()
        : null;
    editingRecord.value.signOutTime = tempSignOutTime.value
        ? tempSignOutTime.value.toISOString()
        : null;
    editingRecord.value.breakTime = tempBreakTime.value;
    editingRecord.value.issue = [...tempIssues.value];

    // Calculate new total hours worked
    if (editingRecord.value.signInTime && editingRecord.value.signOutTime) {
        const signInMs = new Date(editingRecord.value.signInTime).getTime();
        const signOutMs = new Date(editingRecord.value.signOutTime).getTime();
        let hoursWorked = (signOutMs - signInMs) / (1000 * 60 * 60);

        // Subtract break time
        if (editingRecord.value.breakTime) {
            hoursWorked -= parseFloat(editingRecord.value.breakTime);
        }

        editingRecord.value.totalHourWorked = hoursWorked > 0 ? hoursWorked : 0;

        // Recalculate total pay
        const basePay = parseFloat(editingRecord.value.basePay || "0");
        editingRecord.value.totalPay = (basePay * hoursWorked).toFixed(2);
    }

    // Update in the data array
    const index = attendanceData.value.findIndex(
        (r) => r.id === editingRecord.value?.id,
    );
    if (index !== -1) {
        attendanceData.value[index] = { ...editingRecord.value };
    }

    // Emit updated attendance sheet
    emit("update:attendanceSheet", attendanceData.value);

    // Close the dialog
    editDialog.value = false;
};

// Function to get formatted issue display
const getIssueLabel = (issueValue: string): string => {
    const issue = issueOptions.find((opt) => opt.value === issueValue);
    return issue ? issue.label : issueValue;
};
</script>

<template>
    <DataTable
        v-model:selection="selectedRows"
        :value="attendanceData"
        dataKey="id"
        selectionMode="multiple"
        @row-select="handleSelectionChange"
        @row-unselect="handleSelectionChange"
        class="p-datatable-sm"
        responsiveLayout="scroll"
        :metaKeySelection="false"
        stripedRows
    >
        <template #empty>
            <div class="flex justify-center items-center">
                No data available
            </div>
        </template>
        <!-- Selection Column -->
        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

        <!-- Name Column -->
        <Column field="name" header="Name" sortable>
            <template #body="slotProps">
                <div class="flex align-items-center gap-2">
                    <Avatar
                        :image="slotProps.data.profilePic"
                        shape="circle"
                        size="small"
                        aria-hidden="true"
                    />
                    <span>{{ slotProps.data.name }}</span>
                </div>
            </template>
        </Column>

        <!-- NRIC Column -->
        <Column field="nric" header="NRIC No">
            <template #body="slotProps">
                {{ maskNRIC(slotProps.data.nric) }}
            </template>
        </Column>

        <!-- Payment Status Column -->
        <Column field="paymentStatus" header="Payment Status" sortable>
            <template #body="slotProps">
                <Tag
                    :class="
                        slotProps.data.paymentStatus === 'paid'
                            ? 'paid-tag'
                            : 'pending-tag'
                    "
                    :value="formatPaymentStatus(slotProps.data.paymentStatus)"
                />
            </template>
        </Column>

        <!-- Base Pay Column -->
        <Column field="basePay" header="Base Pay" sortable dataType="numeric">
            <template #body="slotProps">
                ${{ slotProps.data.basePay ?? "0" }}/Hr
            </template>
        </Column>

        <!-- Sign In & Out Column -->
        <Column field="signInTime" header="Sign in & out" sortable>
            <template #body="slotProps">
                <div class="flex align-items-center justify-content-between">
                    <div class="flex align-items-center sign-time">
                        <i class="pi pi-calendar-check text-green-500 mr-2"></i>
                        {{
                            formatSignInOutTimes(
                                slotProps.data.signInTime,
                                slotProps.data.signOutTime,
                            )
                        }}
                    </div>
                    <Button
                        icon="pi pi-pencil"
                        text
                        rounded
                        severity="secondary"
                        aria-label="Edit times"
                        v-tooltip.top="'Edit Sign In/Out Times'"
                        @click="openEditDialog(slotProps.data)"
                    />
                </div>
            </template>
        </Column>

        <!-- Break Taken Column -->
        <Column field="breakTime" header="Break taken" sortable>
            <template #body="slotProps">
                <div class="flex align-items-center break-time">
                    <i class="pi pi-clock text-green-500 mr-2"></i>
                    {{ formatBreakTime(slotProps.data.breakTime) }}
                </div>
            </template>
        </Column>

        <!-- Total Hours Column -->
        <Column
            field="totalHourWorked"
            header="Total hours"
            sortable
            dataType="numeric"
        >
            <template #body="slotProps">
                {{ formatHours(slotProps.data.totalHourWorked) }} Hours
            </template>
        </Column>

        <!-- Total Pay Column -->
        <Column field="totalPay" header="Total Pay" sortable dataType="numeric">
            <template #body="slotProps">
                <div class="flex align-items-center">
                    ${{ slotProps.data.totalPay ?? "0.00" }}
                    <span
                        v-if="
                            slotProps.data.penaltyAmount &&
                            parseFloat(slotProps.data.penaltyAmount) > 0
                        "
                        class="ml-2 text-green-500"
                    >
                        +${{ slotProps.data.penaltyAmount }}
                    </span>
                </div>
            </template>
        </Column>

        <!-- Issues Reported Column -->
        <Column
            field="issue"
            header="Issues reported"
            class="issues-column"
            headerClass="bg-red-50"
        >
            <template #body="slotProps">
                <div class="flex align-items-center justify-content-between">
                    <span
                        :class="{
                            'text-red-500 font-medium':
                                slotProps.data.issue?.length > 0,
                        }"
                    >
                        {{ slotProps.data.issue?.length || 0 }} issues reported
                    </span>
                    <Button
                        v-if="slotProps.data.issue?.length > 0"
                        icon="pi pi-chevron-down"
                        text
                        rounded
                        severity="secondary"
                        aria-label="Show issues details"
                        v-tooltip.top="'View Issues'"
                        @click="showIssues($event, slotProps.data.issue)"
                    />
                </div>
            </template>
        </Column>
    </DataTable>

    <!-- Overlay Panel for Issues -->
    <OverlayPanel ref="issuePanel" class="issues-panel">
        <div class="p-3">
            <h4 class="mb-2">Issues Reported</h4>
            <ul class="issues-list p-0">
                <li
                    v-for="(issue, index) in activeIssues"
                    :key="index"
                    class="mb-1"
                >
                    <i class="pi pi-exclamation-circle text-red-500 mr-2"></i>
                    {{ getIssueLabel(issue) }}
                </li>
            </ul>
        </div>
    </OverlayPanel>

    <!-- Edit Dialog -->
    <Dialog
        v-model:visible="editDialog"
        modal
        header="Edit Attendance Record"
        :style="{ width: '450px' }"
        :closable="true"
    >
        <div class="grid p-fluid">
            <!-- Sign In Time -->
            <div class="col-12 field mb-3">
                <label for="signInTime">Sign In Time</label>
                <Calendar
                    id="signInTime"
                    v-model="tempSignInTime"
                    showTime
                    timeOnly
                    hourFormat="12"
                    :showSeconds="false"
                />
            </div>

            <!-- Sign Out Time -->
            <div class="col-12 field mb-3">
                <label for="signOutTime">Sign Out Time</label>
                <Calendar
                    id="signOutTime"
                    v-model="tempSignOutTime"
                    showTime
                    timeOnly
                    hourFormat="12"
                    :showSeconds="false"
                />
            </div>

            <!-- Break Time -->
            <div class="col-12 field mb-3">
                <label for="breakTime">Break Time</label>
                <Dropdown
                    id="breakTime"
                    v-model="tempBreakTime"
                    :options="breakTimeOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select Break Time"
                />
            </div>

            <!-- Issues -->
            <div class="col-12 field mb-3">
                <label for="issues">Issues</label>
                <MultiSelect
                    id="issues"
                    v-model="tempIssues"
                    :options="issueOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select Issues"
                    display="chip"
                />
            </div>
        </div>

        <template #footer>
            <Button
                label="Cancel"
                icon="pi pi-times"
                text
                @click="editDialog = false"
            />
            <Button
                label="Save"
                icon="pi pi-check"
                @click="saveEditedRecord"
                autofocus
            />
        </template>
    </Dialog>
</template>
<style scoped>
/* Match the styling from the image */
:deep(.p-datatable) {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

:deep(.p-datatable-header) {
    background-color: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
}

:deep(.p-datatable-thead > tr > th) {
    background-color: #f8f9fa;
    padding: 0.75rem;
    font-weight: 600;
    color: #333;
}

:deep(.p-datatable-tbody > tr) {
    transition: background-color 0.2s;
}

:deep(.p-datatable-tbody > tr:nth-child(even)) {
    background-color: #f8f9fa;
}

:deep(.p-datatable-tbody > tr > td) {
    padding: 0.75rem;
    border-bottom: 1px solid #e9ecef;
}

/* Payment status styles */
.paid-tag {
    background-color: #e3f2fd !important;
    color: #0288d1 !important;
    border: none !important;
    font-size: 0.85rem !important;
    padding: 0.25rem 0.75rem !important;
    border-radius: 4px !important;
}

.pending-tag {
    background-color: #ffebee !important;
    color: #d32f2f !important;
    border: none !important;
    font-size: 0.85rem !important;
    padding: 0.25rem 0.75rem !important;
    border-radius: 4px !important;
}

/* Issues column styles */
.issues-column {
    background-color: #ffebee;
}

/* Issues panel styles */
.issues-panel {
    max-width: 300px;
}

.issues-list {
    list-style-type: none;
    margin: 0;
}

.issues-list li {
    display: flex;
    align-items: center;
    padding: 4px 0;
}

/* Time display styling */
.sign-time,
.break-time {
    display: flex;
    align-items: center;
}

.text-gray-500 {
    color: #6b7280;
}
</style>

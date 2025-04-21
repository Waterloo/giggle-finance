<template>
    <DataTable
        :value="normalizedData"
        :loading="isLoading"
        class="transparent-table"
    >
        <Column field="date" header="Date" sortable>
            <template #body="{ data }">
                {{ data.formattedDate }}
            </template>
        </Column>
        <Column field="time" header="Event Time" sortable>
            <template #body="{ data }">
                {{ data.formattedStartTime }} - {{ data.formattedEndTime }}
            </template>
        </Column>
        <Column field="isSigned" header="Signature Status">
            <template #body="{ data }">
                <span
                    class="status-badge"
                    :class="getSignatureStatusClass(data.isSigned)"
                >
                    {{ capitalizeFirstLetter(data.isSigned) }}
                </span>
            </template>
        </Column>
        <Column field="isPaid" header="Payment Status">
            <template #body="{ data }">
                <span
                    class="status-badge"
                    :class="getPaymentStatusClass(data.isPaid)"
                >
                    {{ getPaymentStatusText(data.isPaid) }}
                </span>
            </template>
        </Column>
        <Column field="action" header="Action">
            <template #body="{ data }">
                <NuxtLink
                    :to="`/attendance-sheet/${data.id}`"
                    class="view-details-btn"
                >
                    View details
                </NuxtLink>
            </template>
        </Column>
    </DataTable>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    isLoading: {
        type: Boolean,
        default: false,
    },
    data: {
        type: Array,
        default: () => [],
    },
});

// Transform the data to match the format needed for the table
const normalizedData = computed(() => {
    return props.data.map((item) => {
        return {
            ...item,
            formattedDate: formatToDMY(item.date),
            formattedStartTime: formatTo12hTime(item.startTime),
            formattedEndTime: formatTo12hTime(item.endTime),
            // Add sortable fields that maintain proper sort order
            date: new Date(item.date), // For proper date sorting
            time: item.startTime, // For time sorting
        };
    });
});

// Helper functions
const getSignatureStatusClass = (status) => {
    return {
        signed: status === "signed",
        pending: status === "pending",
    };
};

const getPaymentStatusClass = (status) => {
    return {
        "fully-paid": status === "paid",
        pending: status === "pending",
    };
};

const getPaymentStatusText = (status) => {
    return status === "paid" ? "Fully Paid" : capitalizeFirstLetter(status);
};

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

// Format functions
function formatToDMY(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = new Intl.DateTimeFormat("en", { month: "long" }).format(date);
    const year = date.getFullYear();
    return `${day} - ${month} - ${year}`;
}

function formatTo12hTime(timeString) {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = (hour % 12 || 12).toString().padStart(2, "0");
    return `${formattedHour}:${minutes} ${ampm}`;
}
</script>

<style scoped>
.status-badge {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    font-weight: 500;
    color: white;
    text-align: center;
    min-width: 90px;
}

.signed {
    background-color: #3b82f6;
}

.pending {
    background-color: #ef4444;
}

.fully-paid {
    background-color: #3b82f6;
}

.view-details-btn {
    display: inline-block;
    background-color: #10b981;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    text-decoration: none;
    font-weight: 500;
    min-width: 90px;
    text-align: center;
}

:deep(.p-datatable) {
    border-radius: 8px;
    overflow: hidden;
}

:deep(.p-datatable-header) {
    background-color: #f9fafb;
}

:deep(.p-datatable-thead) {
    background-color: #f9fafb;
}

:deep(.p-datatable-thead th) {
    font-weight: 600;
    padding: 1rem;
}

:deep(.p-datatable-tbody td) {
    padding: 1rem;
}

:deep(.transparent-table .p-datatable-header) {
    background: transparent;
    border: none;
}

:deep(.transparent-table .p-datatable-thead) {
    background: transparent;
}

:deep(.transparent-table .p-datatable-thead > tr > th) {
    background: transparent;
    border-color: transparent; /* Or use a subtle border color if needed */
}

/* Additional styling for consistent appearance */
:deep(.transparent-table) {
    background: transparent;
}

:deep(.transparent-table .p-datatable-wrapper) {
    background: transparent;
}
</style>

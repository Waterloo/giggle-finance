<template>
    <div>
        <div>
            <DataTable
                :value="applicants"
                v-model:selection="selectedApplicants"
                dataKey="id"
                selectionMode="multiple"
                @rowSelect="onSelectionChange"
                @rowUnselect="onSelectionChange"
                responsiveLayout="scroll"
                tableStyle="max-height: 50rem"
            >
                <!-- Multi-selection Checkbox -->
                <Column selectionMode="multiple" style="width: 3em" />

                <!-- Name with Avatar and Gender -->
                <Column header="Name" field="name" sortable>
                    <template #body="{ data }">
                        <div class="flex align-items-center">
                            <Avatar
                                :image="data.profilePictureURL"
                                shape="circle"
                                size="large"
                                class="mr-2 w-5 h-5"
                            />
                            <span
                                >{{ data.name }} ({{
                                    data.gender.charAt(0).toUpperCase()
                                }})</span
                            >
                        </div>
                    </template>
                </Column>

                <!-- NRIC Number -->
                <Column field="nric" header="NRIC No" sortable />

                <!-- Amount Requested -->
                <Column
                    field="amountRequested"
                    header="Amount Requested"
                    sortable
                >
                    <template #body="{ data }">
                        {{ formatCurrency(data.amountRequested) }}
                    </template>
                </Column>

                <!-- Wallet Balance -->
                <Column
                    field="walletBalance"
                    header="Total Wallet Amount"
                    sortable
                >
                    <template #body="{ data }">
                        {{ formatCurrency(data.walletBalance) }}
                    </template>
                </Column>

                <!-- Bank Name -->
                <Column field="bankName" header="Bank Name" sortable />
            </DataTable>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Avatar from "primevue/avatar";

// Props: receive an array of applicant objects
const props = defineProps({
    applicants: {
        type: Array,
        required: true,
    },
});

const emit = defineEmits(["releaseFund"]);
// Local state for selected rows
const selectedApplicants = ref([]);

function onSelectionChange() {
    if (selectedApplicants.value.length > 0) {
        emit(
            "releaseFund",
            selectedApplicants.value.map((applicant) => applicant.id),
        );
    } else {
        emit("releaseFund", []);
    }
}

// Utility to format numbers as currency
function formatCurrency(value) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(value);
}
</script>

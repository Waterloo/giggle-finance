<script lang="ts" setup>
import { maskNRIC, formatDate } from "@/utils/format";
defineProps<{ transfers: any[] }>();
</script>

<template>
    <DataTable :value="transfers" class="p-datatable-sm">
        <template #empty>
            <div>No Transfers Found</div>
        </template>

        <Column field="name" header="Name" sortable>
            <template #body="slotProps">
                <div class="flex align-items-center gap-2">
                    <Avatar
                        :image="slotProps.data.profilePictureURL"
                        shape="circle"
                        size="small"
                    />
                    <span>{{ slotProps.data.name }}</span>
                </div>
            </template>
        </Column>
        <Column field="nric" header="NRIC No">
            <template #body="slotProps">
                {{ maskNRIC(slotProps.data.nric) }}
            </template>
        </Column>
        <Column field="amountRequested" header="Amount Requested" sortable>
            <template #body="slotProps">
                ${{ slotProps.data.amountRequested }}
            </template>
        </Column>
        <Column field="walletBalance" header="Total Wallet Amount" sortable>
            <template #body="slotProps">
                ${{ slotProps.data.walletBalance }}
            </template>
        </Column>
        <Column field="bankName" header="Bank Name" sortable>
            <template #body="slotProps">
                {{ slotProps.data.bankName }}
            </template>
        </Column>
        <Column field="bankAccountNumber" header="Account Number">
            <template #body="slotProps">
                {{ slotProps.data.bankAccountNumber }}
            </template>
        </Column>
        <Column field="requestDate" header="Request Date" sortable>
            <template #body="slotProps">
                {{ formatDate(slotProps.data.requestDate) }}
            </template>
        </Column>
    </DataTable>
</template>

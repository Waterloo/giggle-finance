<script lang="ts" setup>
defineProps({
    stats: {
        type: Object,
        default: () => ({
            totalRequests: 0,
            approvedRequests: 0,
            amountReleased: 0,
        }),
    },
});
</script>

<template>
    <div class="grid grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow-md p-4 flex items-center">
            <div class="bg-green-50 rounded-md p-3 mr-4">
                <i class="pi pi-wallet text-green-500 text-xl"></i>
            </div>
            <div>
                <h3 class="text-2xl font-bold">{{ stats.totalRequests }}</h3>
                <p class="text-gray-500 text-sm">Total Requests</p>
            </div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-4 flex items-center">
            <div class="bg-green-50 rounded-md p-3 mr-4">
                <i class="pi pi-check text-green-500 text-xl"></i>
            </div>
            <div>
                <h3 class="text-2xl font-bold">{{ stats.approvedRequests }}</h3>
                <p class="text-gray-500 text-sm">Approved Requests</p>
            </div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-4 flex items-center">
            <div class="bg-green-50 rounded-md p-3 mr-4">
                <i class="pi pi-dollar text-green-500 text-xl"></i>
            </div>
            <div>
                <h3 class="text-2xl font-bold">{{ stats.amountReleased }}</h3>
                <p class="text-gray-500 text-sm">Amount Released</p>
            </div>
        </div>
    </div>
</template>

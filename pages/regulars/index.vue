<script setup lang="ts">
const { title } = usePageHeader();

onMounted(() => {
    title.value = "Manage Regulars";
})

const { regulars, removeRegular } = useRegularsList();
const { applicants } = useApplicantsList();
const currentLoadingList = ref<Record<number, boolean>>({});

async function removeFromRegularsList(id: number) {
    currentLoadingList.value[id] = true;
    await removeRegular(id);
    currentLoadingList.value[id] = false;
}

</script>
<template>
<div>
<div class="flex gap-8">
    <div class="bg-white w-2/3 min-h-32 p-4">
        <h1 class="font-medium mb-6">Regulars</h1>
        <DataTable :value="regulars" >
            <Column field="fullName" header="Name" sortable>
                <template #body="slotProps">
                    <div class="flex items-center">
                        <Avatar :image="slotProps.data.profilePictureURL" shape="circle" class="mr-2" />
                        <span>{{ slotProps.data.fullName }} ({{ slotProps.data.gender?.[0]?.toUpperCase() }})</span>
                    </div>
                </template>
            </Column>
            <Column field="nric" header="NRIC Number" sortable></Column>
            <Column  header="">
                <template #body="slotProps">
                    <Button icon="pi pi-trash" class="p-button-danger p-button-outlined" severity="danger" @click="removeFromRegularsList(slotProps.data.applicantId)" :loading="currentLoadingList[slotProps.data.applicantId]" />
                </template>
            </Column>
            <template #empty>
                <div class="flex justify-center items-center h-full">
                    No regulars available
                </div>
            </template>
  </DataTable>

    </div>
    <div class="bg-white w-1/3 min-h-32 p-4">
        <h1 class="font-medium mb-6">Recent Staff</h1>
        <DataTable :value="applicants"></DataTable>
    </div>
</div>
</div>
</template>
<style>

</style>
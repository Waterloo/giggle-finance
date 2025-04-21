<script setup lang="ts">
import type { StaffList } from "~/composables/dataFetching";
const props =defineProps<{
    staffList: StaffList[]
}>()

</script>
<template>
<DataTable :value="props.staffList">
    <Column field="fullName" header="Name" sortable frozen>
          <template #body="slotProps">
            <h1 class="flex items-center">
              <Avatar
                :image="slotProps.data.profilePictureURL"
                shape="circle"
                class="mr-2"
              /> {{ slotProps.data.fullName }} ({{ slotProps.data.gender?.[0] }})
            </h1>
          </template>
        </Column>
        <Column field="nric" header="NRIC Number" sortable>
          <template #body="slotProps">
            <span> {{ slotProps.data.nric }} </span>
          </template>
        </Column>
        <template #empty>
            <div class="flex justify-center items-center h-full">
              No confirmed staff
            </div>
        </template>
</DataTable>    
</template>
<script setup lang="ts">
const { title } = usePageHeader();

onMounted(() => {
  title.value = "Events";
});

const { attendanceList, attendanceType, isLoading } = useAttendanceList();

function switchAttendanceType({ index }: { index: number }) {
  attendanceType.value = index === 0 ? "active" : "history";
}

</script>
<template>
  <div v-auto-animate>
    <TabView @tab-change="switchAttendanceType">
      <TabPanel header="Pending Signature">
        <DataTable v-if="!isLoading" :value="attendanceList" class="p-datatable-sm">
          <Column field="date" header="Date">
            <template #body="{ data }">
              {{ formatToDMY(data.date) }}
            </template>
          </Column>
          <Column field="action" header="Action">
            <template #body="{ data }">
              <NuxtLink
                v-slot="{ navigate }"
                :to="`/attendance/${data.date}`"
                custom
              >
                <Button
                  label="Review and Sign"
                  class="p-button-success p-button-sm"
                  @click="navigate"
              /></NuxtLink>
            </template>
          </Column>
          <template #empty>
            <div class="flex justify-center items-center h-full">
              No pending signature
            </div>
          </template>
        </DataTable>
        <DataTable v-if="isLoading" :value="[{ skelton: true },{},{}]" class="p-datatable-sm">
          <Column field="skelton" header="Date" sortable>
            <template #body>
              <Skeleton width="7rem" height="0.75rem"/>
            </template>
          </Column>
          <Column header="Action">
            <template #body>
              <Skeleton width="8rem" height="2rem"/>
            </template>
          </Column>
        </DataTable>
      </TabPanel>
      <TabPanel header="History">
        <DataTable :value="attendanceList" class="p-datatable-sm">
          <Column field="date" header="Date">
          <template #body="{ data }">
            {{ formatToDMY(data.date) }}
          </template>
          
          </Column>
          <Column field="action" header="Action">
            <template #body="{ data }">
              <NuxtLink
                v-slot="{ navigate }"
                :to="`/attendance/${data.date}`"
                custom
              >
                <Button
                  label="Review and Sign"
                  class="p-button-success p-button-sm"
                  @click="navigate"
              /></NuxtLink>
            </template>
          </Column>
        </DataTable>
      </TabPanel>
    </TabView>
  </div>
</template>
<style></style>

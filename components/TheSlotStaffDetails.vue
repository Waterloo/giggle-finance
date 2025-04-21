<script setup lang="ts">
import type { Applicant } from "~/composables/dataFetching";
const props = defineProps<{ staffDetails: Applicant[] }>();

const sortField = ref("");
const sortOrder = ref(1);

const pingUser = (user: User) => {
  alert(`Ping ${user.name}`);
};

type levels = "info" | "secondary" | "success" | "warning" | "danger";
type Severity = {
  level: levels;
  label: string;
};

const severities: Record<string, Severity> = {
  processing: { label: "Processing", level: "secondary" },
  pending: { label: "Pending", level: "secondary" },
  awaiting: { label: "Awaiting", level: "secondary" },
  on_the_way: { label: "On the way", level: "warning" },
  nearby: { label: "Nearby", level: "info" },
  signed_in: { label: "Signed In", level: "success" },
  cancelled: { label: "Cancelled", level: "danger" },
};

function getSeverities(str: string): Severity {
  return severities[str];
}
</script>
<template>
  <div>
    <h4 class="font-semibold mb-6">Staff Details</h4>
    <div>
      <DataTable
        :value="props.staffDetails"
        :sort-field="sortField"
        :sort-order="sortOrder"
        width="100%"
      >
        <Column field="fullName" header="Name" sortable frozen>
          <template #body="slotProps">
            <h1 class="flex items-center">
              <Avatar
                :image="slotProps.data.profilePictureURL"
                shape="circle"
                class="mr-2"
              />
              {{ slotProps.data.fullName }} ({{ slotProps.data.gender?.[0] }})
            </h1>
          </template>
        </Column>
        <Column field="nric" header="NRIC Number" sortable>
          <template #body="slotProps">
            <span> {{ slotProps.data.nric }} </span>
          </template>
        </Column>
        <Column field="status" header="Status" sortable>
          <template #body="slotProps">
            <Badge
              :value="getSeverities(slotProps.data.status).label"
              :severity="getSeverities(slotProps.data.status).level"
            />
          </template>
        </Column>
        <Column header="Ping">
          <template #body="slotProps">
            <button
              class="px-2 py-1 text-white bg-green-500 rounded hover:bg-green-600"
              @click="pingUser(slotProps.data)"
            >
              Ping
            </button>
          </template>
        </Column>
        <template #empty>
          <div class="flex justify-center items-center h-full">
            No staff details yet.
          </div>
        </template>
      </DataTable>
    </div>
  </div>
</template>
<style></style>

<template>
    <DataTable :value="staffList" :paginator="true" :rows="10"
               paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
               :rowsPerPageOptions="[10,20,50]"
               currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" responseiveLayout="scroll"
               :globalFilterFields="['name','nricNo']">
      <Column field="name" header="Name" :sortable="true">
        <template #body="slotProps">
          <div class="flex items-center">
            <Avatar :image="slotProps.data.avatar" shape="circle" size="normal" class="mr-2" />
            <span>{{ slotProps.data.name }} ({{ slotProps.data.gender }})</span>
          </div>
        </template>
      </Column>
      <Column field="nricNo" header="NRIC No">
        <template #body="slotProps">
          {{ maskNRIC(slotProps.data.nricNo) }}
        </template>
      </Column>
      <Column header="Add to regulars" :sortable="false">
        <template #body="slotProps">
          <Button v-if="slotProps.data.isRegular" 
                  icon="pi pi-check" 
                  class="p-button-rounded p-button-text"/>
          <Button v-else 
                  label="Add" 
                  icon="pi pi-plus" 
                  @click="addToRegulars(slotProps.data.id)"
                  class="p-button-success p-button-rounded p-button-sm" />
        </template>
      </Column>
      <Column field="signInOut" header="Sign in & out" :sortable="true">
        <template #body="slotProps">
          <div class="flex items-center justify-end">
            <span>{{ slotProps.data.signInOut }}</span>
            <Button icon="pi pi-pencil" 
                    @click="editSignInOut(slotProps.data.id)"
                    class="ml-2 p-button-text p-button-rounded" />
          </div>
        </template>
      </Column>
    </DataTable>
  </template>
  
  <script setup lang="ts">
  
  interface Staff {
    id: number;
    name: string;
    gender: 'M' | 'F';
    nricNo: string;
    isRegular: boolean;
    signInOut: string;
    avatar: string;
  }
  
  const props = defineProps<{
    staffList: Staff[];
  }>();
  
  const emit = defineEmits<{
    (e: 'addToRegulars', id: number): void;
    (e: 'editSignInOut', id: number): void;
  }>();
  

  
  const addToRegulars = (id: number) => {
    emit('addToRegulars', id);
  };
  
  const editSignInOut = (id: number) => {
    emit('editSignInOut', id);
  };
  </script>
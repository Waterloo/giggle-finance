<script setup>
import { computed, ref } from 'vue';
import {formatTo12hTime, formatToDMY} from "~/utils/format";

const showReReleaseModal = ref(false);
const newInviteePay = ref('');
const checkbox = ref(true);
const props = defineProps({
  eventDetails: {
    type: Object,
    default: () => ({
      id: 1,
      date: '04 - April - 2024',
      startTime: '08:00 AM',
      endTime: '10:00 AM',
      staffRequested: 33,
      staffConfirmed: 30,
      regularsAccepted: 3,
      totalRegularsInvited: 6,
      basicPay: '$14/hr',
      additionalRequirements: 'Main Staff Only'
    })
  },
});

// Format date for display
const formattedDate = computed(() => {
  return formatToDMY(props.eventDetails.date);
});

// Format time for display
const formattedTime = computed(() => {
  return `${formatTo12hTime(props.eventDetails.startTime)} - ${formatTo12hTime(props.eventDetails.endTime)}`;
});

// Extract the base pay value without the "/hr" suffix
const oldBasePay = computed(() => {
  const payString = props.eventDetails.basicPay || '';
  return payString.replace('/hr', '');
});
const emit = defineEmits(['re-release']);
const toast = useToast();
// Handle confirm and release
const handleConfirmRelease = () => {
  // This will be implemented later with the composable
  if(!newInviteePay.value) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Please enter a new invitee pay',
      life: 3000
    });
    return;
  }
  emit('re-release', newInviteePay.value);
  showReReleaseModal.value = false;
  
};
onMounted(() => {
  newInviteePay.value = oldBasePay.value;
});
</script>

<template>
  <div class="">
    <!-- Event Details Header -->
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-xl">Event Details</h3>
      <Button 
        label="Re-Release Slots" 
        class="p-button-success"
        icon="pi pi-refresh"
        @click="showReReleaseModal = true"
      />
    </div>

    <!-- Event Details Grid -->
    <div class="grid grid-cols-2 gap-6 bg-white rounded-lg shadow-sm p-6">
      <!-- Date -->
      <div class="col-span-1">
        <h4 class="text-gray-500 text-sm mb-1">Event date</h4>
        <p class="font-medium">{{ formattedDate }}</p>
      </div>

      <!-- Time -->
      <div class="col-span-1">
        <h4 class="text-gray-500 text-sm mb-1">Event time</h4>
        <p class="font-medium">{{ formattedTime }}</p>
      </div>

      <!-- Staff Requested -->
      <div class="col-span-1">
        <h4 class="text-gray-500 text-sm mb-1">Staff requested</h4>
        <div class="flex items-center">
          <p class="font-medium">{{ eventDetails.staffRequested }}</p>
          <!-- <Button 
            icon="pi pi-pencil" 
            class="p-button-text p-button-sm ml-2" 
            aria-label="Edit Staff"
            v-tooltip.top="'Edit Staff Count'"
          /> -->
        </div>
      </div>

      <!-- Basic Pay -->
      <div class="col-span-1">
        <h4 class="text-gray-500 text-sm mb-1">Basic pay</h4>
        <div class="flex items-center">
          <p class="font-medium">{{ eventDetails.basicPay }}</p>
          <!-- <Button 
            icon="pi pi-pencil" 
            class="p-button-text p-button-sm ml-2" 
            aria-label="Edit Pay"
            v-tooltip.top="'Edit Basic Pay'"
          /> -->
        </div>
      </div>

      <!-- Additional Requirements -->
      <div class="col-span-2">
        <h4 class="text-gray-500 text-sm mb-1">Additional requirements</h4>
        <div class="flex items-center">
          <Checkbox v-if="eventDetails.additionalRequirements" v-model="checkbox" binary class="mr-2" />
          <p class="font-medium">{{ eventDetails.additionalRequirements || 'None' }}</p>
          <!-- <Button 
            icon="pi pi-pencil" 
            class="p-button-text p-button-sm ml-2" 
            aria-label="Edit Requirements"
            v-tooltip.top="'Edit Requirements'"
          /> -->
        </div>
      </div>
    </div>
  </div>

  <!-- Re-Release Slot Modal -->
  <Dialog 
    v-model:visible="showReReleaseModal" 
    modal 
    header="Re-Release Slot" 
    class="max-w-lg confirm-invite-dialog "
    :closable="true"
  >
    <div class="p-2">
      <p class="text-gray-600 mb-4">Confirm the new pay</p>
      
      <div class="grid grid-cols-2 gap-4 mb-4">
        <!-- Old Base Pay -->
        <div>
          <label class="block text-gray-600 mb-2">Old Base Pay</label>
          <div class="p-inputgroup">
            <span class="p-inputgroup-addon">$</span>
            <InputText 
              :value="oldBasePay" 
              disabled 
              class="w-full bg-gray-100"
            />
            <span class="p-inputgroup-addon">/hr</span>
          </div>
        </div>
        
        <!-- New Invitee Pay -->
        <div>
          <label class="block text-gray-600 mb-2">New Invitee Pay</label>
          <div class="p-inputgroup">
            <span class="p-inputgroup-addon">$</span>
            <InputText 
              v-model="newInviteePay" 
              class="w-full" 
              placeholder="Enter amount"
            />
            <span class="p-inputgroup-addon">/hr</span>
          </div>
        </div>
      </div>
      
      <Button 
        label="Confirm & Release" 
        class="p-button-success w-full"
        @click="handleConfirmRelease"
      />
    </div>
  </Dialog>
</template>



<style scoped>
.p-dialog-content {
  padding: 0 !important;
}

.confirm-invite-dialog .p-dialog-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.confirm-invite-dialog .p-dialog-content {
  padding: 0 !important;
}

.confirm-invite-dialog .p-dialog-footer {
  display: none;
}

</style>
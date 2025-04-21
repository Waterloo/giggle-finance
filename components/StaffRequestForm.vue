<template>
    <div class="max-w-3xl mx-auto bg-white rounded-lg ">
      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-2 gap-6">
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Event date</label>
            <Calendar v-model="job.date as Date" dateFormat="dd/mm/yy" class="w-full" :minDate="minDate" />
          </div>
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Job type</label>
            <!-- <InputText v-model="formData.jobType" placeholder="Enter job type" class="w-full" /> -->
            <Dropdown v-model="job.jobType" :options="positions" optionLabel="name" placeholder="Select job type" class="w-full md:w-14rem" />

          </div>
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Event start time</label>
            <Calendar v-model="job.startTime as unknown as Date" timeOnly hourFormat="12" class="w-full" :stepMinute="15"/>
          </div>
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Event end time</label>
            <Calendar v-model="job.endTime as unknown as Date" timeOnly hourFormat="12" class="w-full" :stepMinute="15"/>
          </div>
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Number of staff required</label>
            <Dropdown v-model="job.slotsCount" :options="staffOptions" optionLabel="label" optionValue="value" placeholder="Select number of staff" class="w-full" />
          </div>
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Request regulars</label>
            <MultiSelect v-model="job.requestedRegulars" :options="regulars" optionLabel="fullName" filter placeholder="Select regulars" class="w-full">
              <template #option="slotProps">
                <div class="flex items-center">
                  <Avatar :image="slotProps.option.profilePictureURL" shape="circle" class="mr-2" />
                  <span>{{ slotProps.option.fullName }} ({{ slotProps.option.gender?.[0].toUpperCase() }})</span>
                </div>
              </template>
              <template #empty>There are no regulars available.</template>
            </MultiSelect>
          </div>
        </div>
        <div class="mt-6">
          <label class="block mb-1 text-sm font-medium text-gray-700">Additional requirements</label>
          <Dropdown v-model="job.additionalRequirements" :options="requirementOptions" showClear optionLabel="name" placeholder="Select requirements" class="w-full" />
        </div>
        <Button @click="handleCreateJob" label="Submit" class="mt-4" :disabled="!isFormValid" :loading="jobCreationLoading" ></Button>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
// import { useVuelidate } from '@vuelidate/core'
// import { required, helpers } from '@vuelidate/validators'

  interface RequestFormProps {
    date?: Date
  }

const emit =  defineEmits(['submit']);

  interface FormData {
    eventDate: Date | null;
    jobType: object;
    startTime: Date | null;
    endTime: Date | null;
    staffRequired: number | null;
    requestRegulars: { name: string; id: number }[];
    additionalRequirements: { name: string; id: number }[];
  }
  

  const props = defineProps<RequestFormProps>()

  const formData = ref<FormData>({
    eventDate: props.date || new Date(),
    jobType: {
    type: 1,
    label: "Waiter"
  },
    startTime: null,
    endTime: null,
    staffRequired: null,
    requestRegulars: [],
    additionalRequirements: []
  });
  
//   const rules = {
//   eventDate: { required },
//   jobType: { required },
//   startTime: { required },
//   endTime: { 
//     required,
//     laterThanStart: helpers.withMessage(
//       'End time must be later than start time',
//       (value: Date | null, vm: any) => value && vm.startTime && value > vm.startTime
//     )
//   },
//   staffRequired: { 
//     required,
//     numeric: helpers.withMessage(
//       'Must be a number',
//       (value: number | null) => value !== null && !isNaN(value)
//     )
//   },
//   requestRegulars: { 
//     required,
//     minLength: helpers.withMessage(
//       'At least one regular must be selected',
//       (value: string[]) => value.length > 0
//     )
//   },
//   additionalRequirements: {}
// }



  const staffOptions = Array.from({ length: 20 }, (_, i) => ({ label: `${i + 1}`, value: i + 1 }));  
  const {regulars} = useRegularsList();
  const {positions} = usePositionsList();
  const { job, createJob, jobCreationLoading } = useCreateJob();

  async function handleCreateJob() {
    await createJob();
    emit('submit');
  }

  watch(props, () => {
    if(!props.date || props.date < new Date()) {
      job.date = new Date();
      return
    }

    job.date = props.date;

  }, { immediate: true });
  
  const requirementOptions = [
    { name: 'Male Staff Only', id: 'male_staff_only' },
    { name: 'Female Staff Only', id: 'female_staff_only' },
    { name: '50/50 Male & Female Staff Only', id: '50-50-male-and-female' },
    // Add more requirement options as needed
  ];

  // computed that enables submit only if start time, endtime, position and staff is selected in the job object
  const isFormValid = computed(() => {
    return Boolean(
      job.date &&
      job.jobType &&
      job.startTime &&
      job.endTime &&
      job.slotsCount);
  })
  
  const handleSubmit = () => {
    // Handle form submission logic here
    console.log('Form submitted:', formData.value);
  };

  const minDate = ref(new Date());

  onMounted(() => {
    minDate.value = new Date();
  });
  </script>
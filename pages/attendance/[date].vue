<script setup lang="ts">
import Calendar, { type CalendarState } from "primevue/calendar";
import { breaks } from "@/utils/constants";
import MultiSelect from "primevue/multiselect";
import { dataURItoBlob } from "~/utils/format";
const route = useRoute();
const date = computed(() => {
  return route.params.date as string;
});

const { title, subtitle, back } = usePageHeader();

onMounted(() => {
  title.value = "Attendance";
  subtitle.value = date.value;
  back.value = "/attendance";
});

const { attendanceDetails, attendanceDetailsLoading } = useAttendanceDetails(date);

const issues = [
  { issue: "wrong_attire", label: "Wrong attire" },
  { issue: "not_suitable", label: "Not suitable" },
  { issue: "late", label: "Late Report" },
];

const breakTime = ref<Record<number, { timeInMinutes: number }>>({});
const signInTime = ref<Record<number, Date>>({});
const signOutTime = ref<Record<number, Date>>({});
const issuesRef = ref<Record<number, { issues: string[] }>>({});

watch(
  () => attendanceDetails.value,
  () => {
    console.log("watch triggered");
    attendanceDetails.value?.enrollments.forEach((item, index) => {
      signInTime.value[index] = item.signInTime;
      signOutTime.value[index] = item.signOutTime;
      console.log("item.breakTime", item.breakTime);
      breakTime.value[index] = item.breakTime as unknown as {
        timeInMinutes: number;
      };
      issuesRef.value[index] = item.issues;
    });
  }
);

function totalHours(
  signInTime: Date,
  signOutTime: Date,
  breakTime: number
): string {
  console.log("signInTime", signInTime);
  console.log("signOutTime", signOutTime);
  // Create a local copy of signOutTime if it needs to be adjusted
  // const adjustedSignOutTime =
  //   signOutTime
  const adjustedSignOutTime =
    signOutTime < signInTime
      ? new Date(signOutTime.getTime() + 24 * 60 * 60 * 1000) // Add 24 hours
      : signOutTime;
if(!adjustedSignOutTime) return "00:00 Hours"
  const timeDifferenceInMilliseconds =
    adjustedSignOutTime.getTime() - signInTime.getTime();
  const totalMinutes = timeDifferenceInMilliseconds / (1000 * 60);

  // Subtract break time (given in minutes)
  const workedMinutes = totalMinutes - breakTime;
  const validMinutes = Math.max(workedMinutes, 0);
  const hours = Math.floor(validMinutes / 60);
  const minutes = Math.round(validMinutes % 60);

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} Hours`;
}

const calendarPT = {
  input: (options: { state: CalendarState }) => ({
    value: `${options.state.currentHour
      .toString()
      .padStart(2, "0")}:${options.state.currentMinute
      .toString()
      .padStart(2, "0")} ${options.state.pm ? "PM" : "AM"}`,
  }),
};

const signatureOptions = {
  minWidth: 1.8,
  maxWidth: 2.2,
};

const signaturePad = ref();

const { mutate: saveAttendance } = useAttendanceSave();
const { mutateAsync: upload } = useUploader();
const { addRegular, removeRegular } = useRegularsList();

const handleSubmit = async () => {
  if (!attendanceDetails.value) return;
  const data = attendanceDetails.value?.enrollments.map((item, index) => ({
    id: item.id,
    applicantId: item.applicantId,
    signInTime: dateToISODateTime(signInTime.value[index]),
    signOutTime: dateToISODateTime(signOutTime.value[index]),
    breakTime: breakTime.value[index].value,
    issues: issuesRef.value[index].map((issue) => issue.issue),
  }));
  const { data: imageData, isEmpty } = signaturePad.value.saveSignature();
  const blob = dataURItoBlob(imageData);
  const signUrl = await upload(blob);
  console.log("jobIds", attendanceDetails.value.jobIds);
  saveAttendance({
    enrollmentsData: data!,
    jobIds: attendanceDetails.value.jobIds,
    signatureURL: signUrl.replace("job/", ""),
  });
};


const currentTogglingApplicant = ref(0);

const tempRegularsStatusMap = reactive<Record<number, boolean>>({});
const regularsStatusMap = computed(() => {
  return attendanceDetails.value?.enrollments.reduce((acc, item) => {
    acc[item.applicantId] = item.isRegular;
    return acc;
  }, {} as Record<number, boolean>);
});

const reactiveRegularsStatusMap = computed(() => {

  return {
    ...regularsStatusMap.value,
    ...tempRegularsStatusMap,}
});


async function toggleRegular(applicantId: number) {
  const isRegular = reactiveRegularsStatusMap.value[applicantId]
  currentTogglingApplicant.value = applicantId
  if (isRegular) {
    await removeRegular(applicantId);
    tempRegularsStatusMap[applicantId] = false;
  } else {
    await addRegular(applicantId);
    tempRegularsStatusMap[applicantId] = true;
  }
  currentTogglingApplicant.value = 0
}

const skeltonCount = new Array(7).fill({});

</script>
<template>
  <div>
    <DataTable v-if="!attendanceDetailsLoading" :value="attendanceDetails?.enrollments" scrollable>
      <Column field="name" header="Name" sortable frozen>
        <template #body="slotProps">
          <div class="flex items-center">
            <Avatar
              :image="slotProps.data.profilePictureURL"
              shape="circle"
              size="normal"
              class="mr-2"
            />
            <span
              >{{ slotProps.data.fullName }} ({{
                slotProps.data.gender[0].toUpperCase()
              }})</span
            >
          </div>
        </template>
      </Column>
      <Column field="nric" header="NRIC No" />
      <Column field="isRegular" header="Add to regulars" class="p-0">
        <template #body="slotProps">
          <Button
            :label="currentTogglingApplicant === slotProps.data.applicantId ? '' : reactiveRegularsStatusMap[slotProps.data.applicantId] ? '✓' : 'Add'"
            :severity="reactiveRegularsStatusMap[slotProps.data.applicantId] ? 'secondary' : 'primary'"
            :loading="currentTogglingApplicant === slotProps.data.applicantId"
            @click="
              toggleRegular(
                slotProps.data.applicantId
              )
            "
          />
        </template>
      </Column>
      <Column field="signInOut" header="Sign in">
        <template #body="slotProps">
          <div class="flex items-center justify-center">
            <Calendar
              v-model="signInTime[slotProps.index]"
              :pt="calendarPT"
              show-time
              :date-format="'hh:mm A'"
              hour-format="12"
              class="w-28"
            />
          </div>
        </template>
      </Column>
      <Column field="signInOut" header="Sign out">
        <template #body="slotProps">
          <div class="flex items-center">
            <Calendar
              v-model="signOutTime[slotProps.index]"
              :pt="calendarPT"
              show-time
              hour-format="12"
              class="w-28"
            />
            <!-- <Button
              icon="pi pi-pencil"
              class="ml-2 p-button-text p-button-rounded"
            />

            <span
              >{{ formatTo12hTime(new Date(slotProps.data.signInTime)) }}</span> -->
          </div>
        </template>
      </Column>
      <Column header="Break Taken">
        <template #body="slotProps">
          <div class="flex items-center justify-center">
            <Dropdown
              v-model="breakTime[slotProps.index]"
              :options="breaks"
              option-label="label"
              class="min-w-36"
            />
          </div>
        </template>
      </Column>
      <Column header="Total Hours">
        <template #body="slotProps">
          <span>{{
            totalHours(
              signInTime[slotProps.index],
              signOutTime[slotProps.index],
              breakTime[slotProps.index]?.timeInMinutes
            )
          }}</span>
        </template>
      </Column>

      <Column header="Add an issue">
        <template #body="slotProps">
          <div class="flex items-center">
            <MultiSelect
              v-model="issuesRef![slotProps.index]"
              :max-selected-labels="1"
              :options="issues"
              option-label="label"
              placeholder="Choose issues"
              class="min-w-48"
            />
          </div>
        </template>
      </Column>
      
      <template #empty>
        <div class="flex justify-center items-center h-full">
          No Check-in data available
        </div>
      </template>
    </DataTable>

    <DataTable v-else :value="skeltonCount" class="p-datatable-sm">
      <Column field="skelton" header="">
        <template #body>
          <div class="flex gap-2 items-center">
            <Skeleton rounded width="2rem" height="2rem" />
          <Skeleton width="7rem" height="0.75rem" />

          </div>
        </template>
      </Column>
      <Column v-for="skelton in 7" :key="skelton" field="skelton" header="">
        <template #body>
          <Skeleton width="7rem" height="0.75rem" />
        </template>
      </Column>
    </DataTable>

    <div class="mt-6 flex">
  
      <VueSignaturePad
        ref="signaturePad"
        width="100%"
        height="160px"
        class="bg-white border border-r-0"
        :options="signatureOptions"
      />
      <Button
        icon="pi pi-trash"
        class="p-button-danger p-button-outlined rounded-l-none border-l-0"
        @click="signaturePad.clearSignature()"
      />
    </div>
    <div class="flex justify-center mt-4">
      <Button @click="handleSubmit">Submit</Button>
    </div>
  </div>
</template>
<style>
.pi-pencil {
  font-size: 0.75rem;
}
</style>

import { breaks } from "~/utils/constants";

export interface APIResponse<T> {
  success: boolean;
  message: string;
  result: T;
}

export interface Slot {
  id: number;
  startTime: string;
  endTime: string;
  latestBasePay: string;
  isSigned: boolean;
}

export interface EventDetails {
  id: number;
  date: Date;
  startTime: string;
  endTime: string;
  jobType: string;
  staffRequested: number;
  staffConfirmed: number;
  regularsAccepted: number;
  totalRegularsInvited: number;
}

export interface StaffList {
  id: number;
  fullName: string;
  gender: string;
  nric: string;
  isRegular: boolean;
  profilePictureURL: string;
}

export type Applicant = StaffList & { status: string };

export interface JobDetails {
  id: number;
  staffRequested: number;
  staffSignedIn: number;
  staffConfirmed: number;
  staffCancelled: number;
}

export interface Job {
  id: number;
  date: Date;
  startTime: string;
  endTime: string;
  slots: number;
  jobType: string;
  createdAt: Date;
  updatedAt: Date;
  profilePicturesURLs: string[];
}

export function useDashboard(date: Ref<Date>) {
  const { API } = useAuth();
  const formattedDate = computed(() => formatDate(date.value));
  console.log(formattedDate.value);
  const { data: slots, isLoading } = useQuery({
    key: () => ["slots", formattedDate.value],
    query: async () => {
      const response = await API<APIResponse<{ slots: Slot[] }>>("job/slots", {
        query: { date: formattedDate.value },
      });
      return response.result.slots;
    },
    initialData: () => [],
    refetchOnWindowFocus: false,
  });
  return { slots, isLoading };
}

export function useJobOverview(jobId: Ref<number>) {
  const { API } = useAuth();
  const { data: job, isLoading } = useQuery({
    key: () => ["job", jobId.value],
    query: async () => {
      console.log(jobId.value);
      if (!jobId.value) return { jobDetails: null, applicants: [] };
      const response = await API<
        APIResponse<{
          jobDetails: JobDetails;
          applicants: Applicant[];
        }>
      >(`job/${jobId.value}/overview`);
      return response.result;
    },
    refetchOnWindowFocus: false,
  });

  return { job, isLoading };
}

export function useJobsList(date: Ref<Date>) {
  const { API } = useAuth();
  const formattedDate = computed(() => formatDate(date.value));
  const {
    data: jobs,
    isLoading,
    refetch: refetchJobs,
  } = useQuery({
    key: () => ["jobs", formattedDate.value],
    query: async () => {
      const response = await API<APIResponse<{ jobs: Job[] }>>("/job", {
        query: { date: formattedDate.value },
      });
      return response.result.jobs;
    },
    refetchOnWindowFocus: false,
  });
  return { jobs, isLoading, refetchJobs };
}

export function useJobDetails(jobId: Ref<number>) {
  const { API } = useAuth();
  const { data: jobDetails, isLoading } = useQuery({
    key: () => ["job", jobId.value],
    query: async () => {
      const response = await API<
        APIResponse<{
          eventDetails: EventDetails;
          confirmedStaffList: StaffList[];
        }>
      >(`/job/event/${jobId.value}`);
      return {
        eventDetails: response.result.eventDetails,
        confirmedStaffList: response.result.confirmedStaffList,
      };
    },
    refetchOnWindowFocus: false,
  });
  return { jobDetails, isLoading };
}

export type Regular = StaffList & { applicantId: number };

export function useRegularsList() {
  const { API } = useAuth();
  const {
    data: regulars,
    isLoading,
    refetch: refetchRegulars,
  } = useQuery({
    key: () => ["regulers"],
    query: async () => {
      const response =
        await API<APIResponse<{ regularsList: Regular[] }>>("/regular");

      return response.result.regularsList;
    },
    refetchOnWindowFocus: false,
  });

  const { mutateAsync: addRegular } = useMutation({
    mutation: (applicantId: number) => {
      return API<APIResponse<{ regular: Regular }>>("/regular", {
        method: "POST",
        body: { applicantId },
      });
    },
    onSuccess() {
      refetchRegulars();
    },
  });

  const { mutateAsync: removeRegular } = useMutation({
    mutation: (applicantId: number) => {
      return API<APIResponse<{ regular: Regular }>>(`/regular/${applicantId}`, {
        method: "DELETE",
      });
    },
    onSuccess() {
      refetchRegulars();
    },
  });

  return { regulars, isLoading, addRegular, removeRegular };
}

export interface Position {
  id: number;
  name: string;
}

// /outlet/positions
export function usePositionsList() {
  const { API } = useAuth();
  const { data: positions, isLoading } = useQuery({
    key: () => ["positions"],
    query: async () => {
      const response =
        await API<APIResponse<{ positions: Position[] }>>("/outlet/positions");

      return response.result.positions;
    },
    refetchOnWindowFocus: false,
  });
  return { positions, isLoading };
}

export interface JobCreationPayLoad {
  jobType: number;
  date: string;
  startTime: string;
  endTime: string;
  slotsCount: number;
  requestedRegulars: number[];
  additionalRequirements: string;
}

export function useCreateJob() {
  const job = reactive({
    jobType: 0 as unknown,
    date: new Date() as string | Date,
    startTime: "",
    endTime: "",
    slotsCount: 0,
    requestedRegulars: [] as unknown[],
    additionalRequirements: "",
  });

  const { API } = useAuth();
  const {
    mutateAsync,
    status,
    isLoading: jobCreationLoading,
  } = useMutation({
    mutation: (Job: JobCreationPayLoad) => {
      return API<APIResponse<{ job: Job }>>("/job", {
        method: "POST",
        body: Job,
      });
    },
  });

  async function createJob() {
    const newJob = JSON.parse(JSON.stringify(job));
    newJob.date = job.date; // to prevent date being converted to iso before sending
    newJob.date = formatDate(newJob.date);
    newJob.requestedRegulars = newJob.requestedRegulars.map(
      (regular) => regular.id,
    );
    newJob.jobType = newJob.jobType.id;
    newJob.additionalRequirements = newJob.additionalRequirements.id;
    newJob.startTime = formatToHHMM(newJob.startTime);
    newJob.endTime = formatToHHMM(newJob.endTime);

    console.log(job, newJob);

    return await mutateAsync(newJob);
  }
  return { createJob, status, job, jobCreationLoading };
}

type AttendanceType = "active" | "history";

// export function useAttendanceList() {
//   const { API } = useAuth();
//   const attendanceType = ref<AttendanceType>("active");

//   const { data: attendanceList, isLoading } = useQuery({
//     key: () => ["attendanceList", attendanceType.value],
//     query: async () => {
//       const response = await API<APIResponse<{ attendanceList: [] }>>(
//         `/attendance/`,
//         {
//           query: {
//             "list-type": attendanceType.value,
//           },
//         }
//       );
//       return response.result.attendanceList;
//     },
//     refetchOnWindowFocus: false,
//   });
//   return { attendanceList, isLoading, attendanceType };
// }

type enrollmentDetails = StaffList & {
  invitationMode: null;
  signInTime: Date;
  signOutTime: Date;
  issues: string[];
  jobId: number;
  breakTime: number;
};

export function useAttendanceDetails(date: Ref<string>) {
  const { API } = useAuth();
  const { data: attendanceDetails, isLoading: attendanceDetailsLoading } =
    useQuery({
      key: ["attendanceDetails", date.value],
      query: async () => {
        const response = await API<
          APIResponse<{ enrollmentsData: enrollmentDetails[]; jobs: number[] }>
        >(`/attendance/${date.value}`);

        const data = response.result.enrollmentsData;
        const jobIds = response.result.jobs;
        const newData = data.map((item) => {
          const newItem = { ...item };
          newItem.signInTime = new Date(item.signInTime);
          newItem.signOutTime = new Date(item.signOutTime);
          newItem.breakTime = item.breakTime
            ? breaks.find((b) => b.value === item.breakTime)
            : { timeInMinutes: 0, value: 0 };
          newItem.issues = item.issues ?? [];
          return newItem;
        });
        return { enrollments: newData, jobIds };
      },
      refetchOnWindowFocus: false,
    });

  return { attendanceDetails, attendanceDetailsLoading };
}

export function useAttendanceSave() {
  const { API } = useAuth();
  const { mutate, status, isLoading } = useMutation({
    mutation: (enrollments: {
      enrollmentsData: enrollmentDetails[];
      signatureURL: string;
      jobIds: number[];
    }) => {
      return API<APIResponse<{ enrollments: enrollmentDetails[] }>>(
        `/attendance/`,
        {
          method: "PATCH",
          body: enrollments,
        },
      );
    },
  });
  return { mutate, status, isLoading };
}

export interface UploadInfoClass {
  signedUrl: string;
  path: string;
  token: string;
  bucket: string;
}

export function useUploader() {
  const { API } = useAuth();
  const { mutateAsync, status, isLoading } = useMutation({
    mutation: async (file: File | Blob) => {
      const extension = file.type.split("/")[1];
      const fileType = "signature";

      const {
        result: { uploadInfo },
      } = await API<APIResponse<{ uploadInfo: UploadInfoClass }>>(
        `/storage/upload-url/${fileType}/${extension}`,
      );
      const body = new FormData();
      body.append("fileBody", file);
      body.append("path", uploadInfo.path);

      const data = await $fetch<{ Key: string }>(uploadInfo.signedUrl, {
        method: "PUT",
        body,
        headers: {
          Authorization: `Bearer ${uploadInfo.token}`,
        },
      });
      if (data.Key) {
        return uploadInfo.path;
      }
    },
  });
  return { mutateAsync, status, isLoading };
}

export function useApplicantsList() {
  const { API } = useAuth();
  const { data: applicants, isLoading } = useQuery({
    key: () => ["applicants"],
    query: async () => {
      const response = await API<
        APIResponse<{
          regularsSuggestionList: Omit<Applicant, "nric" | "isRegular">[];
        }>
      >("/regular/suggestions");
      return response.result.regularsSuggestionList;
    },
    refetchOnWindowFocus: false,
  });
  return { applicants, isLoading };
}

export type JobRequest = Omit<
  Job,
  "slots" | "createdAt" | "updatedAt" | "profilePicturesURLs"
> & {
  staffRequested: number;
  basePay: string | number;
  regularsRequested: number;
};

export function useOutletJobsList(outletId: Ref<number>) {
  const { API } = useAuth();
  const {
    data: jobs,
    isLoading,
    refetch,
  } = useQuery({
    key: () => [outletId.value, "outletJobRequests"],
    query: async () => {
      const response = await API<APIResponse<{ newJobRequests: JobRequest[] }>>(
        "/job/requests",
        {
          query: {
            outlet: outletId.value,
          },
        },
      );
      return response.result.newJobRequests;
    },
    refetchOnWindowFocus: false,
  });
  return { jobs, isLoading, refetch };
}

export function useOutletApproveJob() {
  // create a mutation to approve a job request, call patch method with job id as param and body as basePay
  const { API } = useAuth();
  const { mutateAsync, status, isLoading } = useMutation({
    mutation: ({
      jobId,
      basePay,
      backupSlots,
    }: {
      jobId: number;
      basePay: number;
      backupSlots: number;
    }) => {
      return API<APIResponse<{ job: Job }>>(`/job/${jobId}/approve`, {
        method: "PATCH",
        body: { basePay, backupSlots },
      });
    },
  });

  return { approveJob: mutateAsync, status, isLoading };
}

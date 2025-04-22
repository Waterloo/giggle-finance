import { defineQuery, useQuery } from "@pinia/colada";

export function useOutletAttendance(
  outletId: ComputedRef<string | undefined>,
  filter: Ref<"active" | "history">,
  fromDate?: Ref<string | undefined>,
  toDate?: Ref<string | undefined>,
) {
  // Use computed for the key to make it reactive
  const { API } = useAuth();
  const {
    data: attendanceData,
    isLoading,
    error,
    refresh,
    refetch,
  } = useQuery({
    key: () => [
      "outlets",
      outletId.value,
      filter.value,
      fromDate?.value,
      toDate?.value,
    ],
    query: async () => {
      if (!outletId.value) return [];

      const queryParams: Record<string, string> = {
        filter: filter.value,
        fromDate: fromDate?.value,
        toDate: toDate?.value,
      };

      // Rest of your function...
      const response = await API<APIResponse<{ updatedSheets: any[] }>>(
        `/finance/outlet/${outletId.value}`,
        {
          query: queryParams,
        },
      );
      return response.result.updatedSheets;
    },
    enabled: () => Boolean(outletId.value),
    refetchOnWindowFocus: false,
  });

  return {
    attendanceData,
    isLoading,
    error,
    refresh,
    refetch,
  };
}
interface WalletReleaseRequestItem {
  id: number;
  name: string;
  gender: "female" | "male" | "others";
  nric: string;
  amountRequested: string; // Note: String type from API
  walletBalance: string; // Note: String type from API
  requestDate: string;
  profilePictureURL: string;
  bankName: string;
  bankAccountNumber: string;
}

interface WalletReleaseResult {
  requests: WalletReleaseRequestItem[];
}

// --- Composable for GET /finance/wallet-release ---

/**
 * Fetches wallet release requests from GET /finance/wallet-release.
 * Assumes API supports optional query parameters: status, fromDate, toDate, page, limit.
 */
export function useWalletRelease() {
  // Optional filters/pagination parameters (API must support these)
  const { API } = useAuth();

  const {
    data: walletReleaseData,
    isLoading,
    error,
    refresh,
    refetch,
  } = useQuery<WalletReleaseRequestItem[]>({
    // Explicitly type the expected data array
    key: () => [
      "wallet-release", // Unique query key
    ],
    query: async (): Promise<WalletReleaseRequestItem[]> => {
      // Ensure query returns the correct type

      try {
        const response = await API<APIResponse<WalletReleaseResult>>(
          `/finance/wallet-release`,
        );
        // Extract data based on the known schema structure (result.requests)
        return response.result?.requests ?? []; // Default to empty array if data is missing
      } catch (err) {
        console.error("Error fetching wallet releases:", err);
        throw err; // Propagate error for useQuery to handle
      }
    },
    refetchOnWindowFocus: false, // Standard option
    // keepPreviousData: true, // Consider enabling for better UX during filtering/pagination
  });

  // Expose the state and methods from useQuery
  return {
    walletReleaseData,
    isLoading,
    error,
    refresh,
    refetch,
  };
}

interface WalletReleaseHistoryTransferItem {
  id: number;
  name: string;
  // gender is missing compared to WalletReleaseRequestItem
  nric: string;
  amountRequested: string; // This seems to be the amount for the specific transfer item
  walletBalance: string; // Wallet balance associated with this record (context may matter)
  requestDate: string; // Date associated with this record (request or processing date?)
  profilePictureURL: string;
  bankName: string;
  bankAccountNumber: string;
}

// Represents the structure of the 'result' object from the history endpoint
interface WalletReleaseHistoryResult {
  totalRequests: number;
  approvedRequests: number;
  amountReleased: string; // Total amount as a string
  transfers: WalletReleaseHistoryTransferItem[]; // The list of history items
}

export function useWalletReleaseHistory(
  startDate: Ref<string>,
  endDate: Ref<string>,
) {
  const { API } = useAuth();

  // Default empty result structure for initial state or error cases
  const defaultHistoryResult: WalletReleaseHistoryResult = {
    totalRequests: 0,
    approvedRequests: 0,
    amountReleased: "0", // Or "0.00" etc. depending on expected format
    transfers: [],
  };

  const {
    // data now holds the full WalletReleaseHistoryResult object
    data: walletReleaseHistoryResult,
    isLoading,
    error,
    refresh,
    refetch,
  } = useQuery<WalletReleaseHistoryResult>({
    // Query returns the WalletReleaseHistoryResult object
    key: () => ["wallet-release-history", startDate.value, endDate.value],
    query: async (): Promise<WalletReleaseHistoryResult> => {
      const queryParams: Record<string, string> = {
        "start-date": startDate.value,
        "end-date": endDate.value,
      };

      try {
        // Expect APIResponse containing WalletReleaseHistoryResult in its 'result' field
        const response = await API<APIResponse<WalletReleaseHistoryResult>>(
          `/finance/wallet-release-history`,
          {
            query: queryParams,
          },
        );
        // Return the entire 'result' object, or the default structure if missing/null
        return response.result ?? defaultHistoryResult;
      } catch (err) {
        console.error("Error fetching wallet release history:", err);
        // Re-throw error to be caught by useQuery and reflected in the 'error' state
        throw err;
      }
    },
    // Enable the query only when both start and end dates are provided
    enabled: () => Boolean(startDate.value && endDate.value),
    refetchOnWindowFocus: false,
  });

  // Optional: Create a computed ref for easier access to the transfers list
  const transfers = computed(
    () => walletReleaseHistoryResult.value?.transfers ?? [],
  );

  // Expose the state and methods from useQuery
  return {
    // The ref holding the full result object: { totalRequests, ..., transfers: [...] }
    walletReleaseHistoryResult,
    // Computed ref for direct access to the list
    transfers,
    isLoading,
    error,
    refresh,
    refetch,
  };
}

// Interface for the payload of the POST /finance/wallet-release request
interface ReleaseWalletPayload {
  release: number[]; // Array of request IDs to be released
}

// Interface for the expected 'result' object in the success response (empty based on schema)
interface ReleaseWalletResult {} // Empty object as per schema: "result": { "type": "object", "properties": {} }

// --- NEW COMPOSABLE ---

/**
 * Composable for releasing wallet funds via POST /finance/wallet-release.
 * Handles the API call to approve and process wallet release requests.
 */
export function useReleaseWallet() {
  const { API } = useAuth(); // Get the authenticated API instance

  // Setup the mutation using useMutation from @pinia/colada
  const {
    mutate, // Function to trigger the API call (mutation)
    status, // Reactive status: 'idle' | 'pending' | 'success' | 'error'
    isLoading, // Computed boolean: true if status is 'pending'
    error, // Holds the error object if the mutation fails
  } = useMutation<
    ReleaseWalletResult, // Expected type of the data returned on success (result field)
    Error, // Type of error expected on failure
    ReleaseWalletPayload // Type of the payload passed to the mutate function
  >({
    // Optional: A unique key for this mutation, useful for devtools and potentially cache invalidation
    key: ["finance", "wallet-release", "release"],

    // The core mutation function that performs the API request
    mutation: async (payload: ReleaseWalletPayload) => {
      // Make the POST request to the endpoint
      const response = await API<APIResponse<ReleaseWalletResult>>(
        `/finance/wallet-release`, // The API endpoint URL
        {
          method: "POST",
          body: JSON.stringify({
            release: payload,
          }), // The payload { release: [id1, id2, ...] }
        },
      );

      // On success, return the 'result' part of the API response.
      // Based on the provided schema, this is expected to be an empty object {}.
      return response.result;
    },

    // Optional callbacks for success/error handling within the composable
    // onSuccess: (data) => { console.log('Wallet release successful:', data); },
    // onError: (err) => { console.error('Wallet release failed:', err); },
  });

  // Expose the mutation function and its state variables
  return {
    releaseFunds: mutate, // Provide the function to trigger the release
    releaseStatus: status, // Expose the current status of the mutation
    isReleasing: isLoading, // Convenience boolean for loading state
    releaseError: error, // Expose any error that occurred
  };
}
interface JobAttendanceSheetItem {
  id: number;
  applicantId: number;
  name: string;
  profilePic: string; // URL
  nric: string;
  paymentStatus: "pending" | "paid" | string; // Add other potential statuses if known
  basePay: string;
  signInTime: string | null; // Assuming time can be null
  signOutTime: string | null; // Assuming time can be null
  breakTime: string; // e.g., "0.15"
  totalHourWorked: number;
  totalPay: string;
  penaltyAmount: string;
  netPay: string;
  issue: string[];
}

interface JobSignature {
  status: "pending" | "signed" | string; // Add other potential statuses if known
  signatureURL: string | null; // URL or null if not signed/available
}

interface JobAttendanceResult {
  attendanceSheet: JobAttendanceSheetItem[];
  signature: JobSignature;
}
export function useJobAttendanceSheet(jobId: Ref<string | number | undefined>) {
  const { API } = useAuth();

  // Define default data structure for initial state or when disabled
  const defaultJobAttendance: JobAttendanceResult = {
    attendanceSheet: [],
    signature: { status: "pending", signatureURL: null },
  };

  const {
    data: jobAttendanceData,
    isLoading,
    error,
    refresh,
    refetch,
  } = useQuery<JobAttendanceResult>({
    key: () => ["finance", "job", "attendance", jobId.value], // Query key includes job ID
    query: async (): Promise<JobAttendanceResult> => {
      // Should not run if jobId is undefined due to 'enabled' config, but good practice
      console.log("Fetching attendance for job", jobId.value);
      if (!jobId.value) {
        return defaultJobAttendance;
      }

      try {
        // Construct the URL with the job ID
        const response = await API<APIResponse<JobAttendanceResult>>(
          `/finance/job/${jobId.value}`, // Use jobId in the path
          // No query parameters needed based on the spec
        );
        // Return the 'result' field which matches JobAttendanceResult
        return response.result ?? defaultJobAttendance;
      } catch (err) {
        console.error(`Error fetching attendance for job ${jobId.value}:`, err);
        throw err; // Propagate error to useQuery
      }
    },
    // Only enable the query if jobId has a value
    enabled: () => Boolean(jobId.value),
    refetchOnWindowFocus: false,
  });

  // Optionally expose parts of the data directly
  const attendanceSheet = computed(
    () => jobAttendanceData.value?.attendanceSheet ?? [],
  );
  const signature = computed(
    () => jobAttendanceData.value?.signature ?? defaultJobAttendance.signature,
  );

  return {
    jobAttendanceData, // The full result object { attendanceSheet, signature }
    attendanceSheet, // Computed ref to the sheet array
    signature, // Computed ref to the signature object
    isLoading,
    error,
    refresh,
    refetch,
  };
}

interface ReleaseToWalletEnrollment {
  id: number; // Enrollment ID or Applicant ID? Based on context, likely enrollment ID
  signInTime: string | null; // Allow null or empty string based on API flexibility
  signOutTime: string | null; // Allow null or empty string
  breakTime: string; // e.g., "0.15"
  issue: string[]; // Array of issue identifiers, e.g., ["wrong_attire"]
}

interface ReleaseToWalletPayload {
  jobId: number;
  enrollments: ReleaseToWalletEnrollment[];
}

interface ReleaseToWalletResult {}

// --- NEW COMPOSABLE for POST /finance/release-to-wallet ---

/**
 * Composable for submitting job attendance data for wallet release.
 * Handles the POST request to /finance/release-to-wallet.
 */
export function useReleaseToWallet() {
  const { API } = useAuth();

  const {
    mutate, // Function to trigger the mutation
    status, // 'idle' | 'pending' | 'success' | 'error'
    isLoading, // true when 'pending'
    error, // Error object on failure
    // data, // Optional: Holds the success response data (ReleaseToWalletResult)
  } = useMutation<
    ReleaseToWalletResult, // Type of successful result data
    Error, // Type of error
    ReleaseToWalletPayload // Type of the payload for the mutate function
  >({
    // Optional mutation key for devtools/caching
    key: ["finance", "release-to-wallet"],

    mutation: async (payload: ReleaseToWalletPayload) => {
      // Perform the POST request
      const response = await API<APIResponse<ReleaseToWalletResult>>(
        `/finance/release-to-wallet`, // API endpoint
        {
          method: "POST",
          body: payload, // Send the payload directly as the body
        },
      );
      // Return the 'result' field from the API response upon success
      return response.result;
    },
    // Optional: Add onSuccess/onError handlers here if needed
    // onSuccess: (result) => { console.log("Release to wallet successful:", result); },
    // onError: (err) => { console.error("Release to wallet failed:", err); },
  });

  // Expose the mutation function and its state
  return {
    submitReleaseToWallet: mutate, // Expose the function to trigger the submission
    submitStatus: status, // Provide the reactive status
    isSubmitting: isLoading, // Convenience boolean for loading state
    submitError: error, // Expose potential errors
  };
}

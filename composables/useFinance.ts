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

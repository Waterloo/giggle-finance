import { applyPlugin } from "#app";
import type { APIResponse } from "./dataFetching";

export function useDeploymentList(params) {
  const { API } = useAuth();
  const query = useQuery({
    key: () => ["deployments", params.value["start-date"]],
    query: async () => {
      const response = await API<APIResponse<DeploymentListResponse>>(
        "/job/deployments",
        {
          query: {
            outlet: params.value.outlet,
            "list-type": params.value["list-type"],
            "start-date": params.value["start-date"],
          },
        },
      );
      return response.result.jobs;
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    refetch: query.refetch,
    error: query.error,
  };
}

export function useDeploymentDetails(params) {
  const { API } = useAuth();
  const query = useQuery({
    key: () => ["deploymentDetails", params.value, params.value.version],
    query: async () => {
      if (!params.value.id) return null;

      const response = await API<APIResponse<DeploymentJobDetails>>(
        `/job/deployment/${params.value.id}`,
        {
          query: {
            type: params.value.type,
          },
        },
      );
      return response.result;
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    refetch: query.refetch,
    error: query.error,
  };
}

export function useUserSearch(params) {
  const { API } = useAuth();
  const query = useQuery({
    key: () => ["userSearch", params.value],
    query: async () => {
      if (!params.value.name) return null;
      const response = await API<APIResponse<UserSearchResponse>>(
        "/user/search",
        {
          query: {
            name: params.value.name,
            outlet: params.value.outlet,
          },
        },
      );
      return response.result;
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    refetch: query.refetch,
    error: query.error,
  };
}

export function useInviteApplicants() {
  const { API } = useAuth();
  const { mutate, status, isLoading } = useMutation({
    key: ["job", "invite"],
    mutation: async (payload) => {
      const response = await API<APIResponse<InviteApplicantsResponse>>(
        "/job/invite",
        {
          method: "POST",
          body: payload,
        },
      );
      return response.result;
    },
  });
  return { mutate, status, isLoading };
}

export function useReReleaseSlots() {
  const { API } = useAuth();

  const {
    mutate: reReleaseSlots,
    state,
    error,
  } = useMutation({
    key: ["job", "re-release-slots"],
    mutation: async (payload: ReReleaseSlotRequest) => {
      const response = await API<APIResponse<Record<string, never>>>(
        "/job/re-release-slots",
        {
          method: "POST",
          body: payload,
        },
      );

      return response.result;
    },
  });

  return {
    mutate: reReleaseSlots,
    state,
    error,
  };
}

// Define the expected response structure from the API after successful upload
interface UpdateMedicalCertificateResponse {
  certificateURL: string;
  // Add any other relevant fields returned by the API
}

// Define the input type for the mutation function
interface UpdateMedicalCertificatePayload {
  enrollmentId: number | string; // ID for the API path parameter {id}
  file: File; // The original File object
  fileNameBase: string; // The desired base name for the file (e.g., "medical_cert_user123")
  // The extension will be appended automatically.
}

export function useRemoveApplicant() {
  const { API } = useAuth();

  const {
    mutate: removeApplicantMutate, // Renaming internally for clarity
    isLoading,
    status, // Providing status might be useful (idle, loading, success, error)
    error,
  } = useMutation({
    // Define a unique key for this mutation type
    key: ["job", "deployment", "remove-applicant"],
    mutation: async (enrollmentId: string) => {
      console.log("Removing applicant with ID:", enrollmentId);
      // Expecting the enrollment ID as a string based on spec
      // The API endpoint is PUT /api/v1/job/deployment/remove-applicant/{id}
      // Assuming the base path /api/v1 is handled by the API helper
      const response = await API<APIResponse<Record<string, never>>>( // Assuming no specific data is returned on success, similar to re-release
        `/job/deployment/remove-applicant/${enrollmentId}`,
        {
          method: "PUT",
          // No body is required according to the spec
        },
      );

      // Return the result, even if it's empty, consistent with other mutations
      return response.result;
    },
    // Optional: Add onSuccess, onError, onSettled callbacks if needed for cache invalidation etc.
    // onSuccess: () => {
    //   // e.g., invalidate queries related to deployment details or lists
    //   queryClient.invalidateQueries(['deploymentDetails', ...]);
    //   queryClient.invalidateQueries(['deployments', ...]);
    // }
  });

  return {
    removeApplicant: removeApplicantMutate, // Expose the mutation function
    isLoading,
    status,
    error,
  };
}

// --- Define the expected response structure for the signed URL ---
interface SignedUrlResponse {
  signedURL: string; // Assuming the API returns an object with a signedURL property
  // Add other properties if the API returns more, e.g., expiry time, upload headers needed?
}

// --- Define the type for the parameters needed when CALLING the mutation ---
interface GetSignedURLParams {
  fileType:
    | "logo"
    | "cover_photo"
    | "applicant-docs"
    | "signature"
    | "applicant-profile-picture"
    | "attire"
    | "staff-profile-picture"
    | "medical-certificate";
  extension: "jpg" | "jpeg" | "png";
}

// --- REFACTORED COMPOSABLE using useMutation ---

/**
 * Provides a function to fetch a signed URL for uploading a file to storage on demand.
 */
export function useGetSignedURL() {
  const { API } = useAuth();

  // For GET requests, use useQuery instead of useMutation
  const getSignedURL = async (params) => {
    if (!params || !params.fileType || !params.extension) {
      throw new Error(
        "getSignedURL mutation requires 'type' and 'extension' parameters.",
      );
    }

    const { fileType, extension } = params;
    const url = `/storage/upload-url/${fileType}/${extension}`;

    // Use API function for GET request
    const response = await API(url, { method: "GET" });

    if (!response.success) {
      throw new Error(`Failed to fetch signed URL: ${response.message}`);
    }

    return response.result || response;
  };

  return { getSignedURL };
}

export function useUpdateMedicalCertificate() {
  const { API } = useAuth();

  const { mutate, isLoading, error } = useMutation({
    key: ["job", "enrollment", "update-medical-certificate"],
    mutation: async ({
      enrollmentId,
      file,
      fileNameBase,
    }: UpdateMedicalCertificatePayload) => {
      console.log("Updating medical certificate");
      if (!fileNameBase || fileNameBase.trim().length === 0) {
        throw new Error(
          "A valid 'fileNameBase' must be provided for renaming the file.",
        );
      }

      const originalExtension = file.name.split(".").pop() || "";
      const newFileName = originalExtension
        ? `${fileNameBase}.${originalExtension}`
        : fileNameBase;

      const renamedFile = new File([file], newFileName, {
        type: file.type,
        lastModified: file.lastModified,
      });

      const formData = new FormData();
      formData.append("file", renamedFile, renamedFile.name);

      const apiUrl = `/job/enrollment/${enrollmentId}/update-medical-certificate`;

      const response = await API<APIResponse<UpdateMedicalCertificateResponse>>(
        apiUrl,
        {
          method: "PUT",
          body: formData,
        },
      );

      return response.result;
    },
  });

  return {
    uploadMedicalCertificate: mutate,
    isLoading,
    error,
  };
}

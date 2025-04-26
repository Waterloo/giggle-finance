import { useQuery } from "@pinia/colada";

const notificationVisibility = ref(false);

export const useNotificationsBar = () => ({
  toggleNotificationVisibility() {
    notificationVisibility.value = !notificationVisibility.value;
  },
  notificationVisibility: readonly(notificationVisibility),
});

interface NotificationItem {
  id: number;
  type: string;
  subType: string;
  message: string;
  context: Record<string, any>; // Use a generic object type for flexibility
}

interface NotificationsResult {
  notifications: NotificationItem[];
}

// --- Composable for GET /api/v1/notification/outlet ---

/**
 * Fetches outlet-specific notifications.
 */

const POLLING_INTERVAL_MS = 30000; // Poll every 30 seconds

export function useOutletNotifications() {
  const { API } = useAuth();

  const {
    data: notificationsData, // Renamed from 'notifications' to avoid naming conflict
    isLoading,
    error,
    refresh,
    refetch,
  } = useQuery<NotificationItem[]>({
    key: ["notifications", "outlet"],
    query: async (): Promise<NotificationItem[]> => {
      try {
        const response =
          await API<APIResponse<NotificationsResult>>(`/notification/outlet`);
        return response.result?.notifications ?? [];
      } catch (err) {
        // console.error("Error fetching outlet notifications:", err); // Keep logging optional
        throw err;
      }
    },
    refetchOnWindowFocus: true,
  });

  return {
    notificationsData,
    isLoading,
    error,
    refresh,
    refetch,
  };
}

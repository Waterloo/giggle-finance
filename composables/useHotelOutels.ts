// composables/useHotelOutlets.ts
import { defineQuery, useQuery } from "@pinia/colada";
import { useOutletStore } from "@/store/useOutletStore";
import { storeToRefs } from "pinia";
import type { Outlet, Hotel } from "@/types/outlet";

export const useHotelOutlets = defineQuery(() => {
  const outletStore = useOutletStore();
  const { selectedHotel } = storeToRefs(outletStore);
  const { API } = useAuth();

  // Query for fetching outlets based on the selected hotel
  const outletQuery = useQuery({
    key: () => ["outlets", selectedHotel.value?.id],
    query: async () => {
      if (!selectedHotel.value?.id) return { outlets: [] };

      const response = await API<APIResponse<{ outlets: Outlet[] }>>(
        `/outlet/hotel/${selectedHotel.value.id}`,
      );

      // Update the store with the fetched outlets
      outletStore.setOutlets(response.result.outlets);
      return response.result;
    },
    // Only enable the query when we have a selected hotel
    enabled: () => Boolean(selectedHotel.value?.id),
  });

  // Query for fetching hotels
  const hotelQuery = useQuery({
    key: ["hotels"],
    query: async () => {
      const response = await API<APIResponse<{ hotels: Hotel[] }>>("/hotel/");

      outletStore.setHotels(response.result.hotels);

      // If no hotel is selected yet and we have hotels, select the first one
      if (response.result.hotels.length > 0 && !selectedHotel.value) {
        outletStore.selectedHotel = response.result.hotels[0];
      }

      return response.result;
    },
    refetchOnWindowFocus: false,
  });

  return {
    hotelData: hotelQuery.data,
    hotelStatus: hotelQuery.status,
    hotelError: hotelQuery.error,
    refreshHotels: hotelQuery.refresh,

    outletData: outletQuery.data,
    outletStatus: outletQuery.status,
    outletError: outletQuery.error,
    refreshOutlets: outletQuery.refresh,
  };
});

import { defineStore } from "pinia";

import type { Outlet, Hotel } from "@/types/outlet";

export const useOutletStore = defineStore(
  "useOutletStore",
  () => {
    const selectedOutlet = ref<Outlet | null>(null);
    const selectedHotel = ref<Pick<
      Outlet,
      "id" | "hotelName" | "hotelLogoURL"
    > | null>(null);
    const hotels = ref<Hotel[]>([]);
    const outlets = ref<Outlet[]>([]);

    function setHotels(newHotels: Hotel[]) {
      hotels.value = newHotels;

      // If we have hotels but no hotel selected, select the first one
      if (newHotels.length > 0 && !selectedHotel.value) {
        selectedHotel.value = newHotels[0];
      }
    }

    function setOutlets(newOutlets: Outlet[]) {
      outlets.value = newOutlets;
      console.log("New outlets:", newOutlets);
      if (
        newOutlets.length > 0 &&
        (!selectedOutlet.value ||
          !newOutlets.find((o) => o.id === selectedOutlet.value?.id))
      ) {
        selectedOutlet.value = filteredOutlets.value[0] || null;
      }
    }

    const filteredOutlets = computed(() => {
      if (!selectedHotel.value) return outlets.value;
      return outlets.value.filter(
        (outlet) => outlet.hotelId === selectedHotel.value?.id,
      );
    });

    // When selected hotel changes, update selected outlet
    watch(selectedHotel, () => {
      if (filteredOutlets.value.length > 0) {
        selectedOutlet.value = filteredOutlets.value[0];
      } else {
        selectedOutlet.value = null;
      }
    });

    return {
      outlets,
      selectedOutlet,
      selectedHotel,
      hotels,
      filteredOutlets,
      setOutlets,
      setHotels,
    };
  },
  {
    persist: {
      pick: ["hotels", "selectedOutlet", "selectedHotel"],
      debug: true,
      storage: piniaPluginPersistedstate.localStorage(),
    },
  },
);

// if (import.meta.hot) {
//  import.meta.hot.accept(acceptHMRUpdate(useOutletStore, import.meta.hot))
// }

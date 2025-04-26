<script setup lang="ts">
import Dropdown from "primevue/dropdown";
import { useOutletStore } from "@/store/useOutletStore";
import type { INotificationProps } from "~/types/components";

const { title, subtitle, back } = usePageHeader();

const { notificationVisibility, toggleNotificationVisibility } =
    useNotificationsBar();
const { notificationsData, isLoading: isLoadingNotifications } =
    useOutletNotifications(); // Fetch notifications

const formattedNotifications = computed((): INotificationProps[] => {
    return (notificationsData.value ?? []).map((item) => ({
        notificationId: String(item.id), // Ensure string ID if needed by component
        // Use a default icon or logic based on item.type/subType if available
        icon: item.icon || "pi pi-bell", // Replace with your default icon path
        title: item.subType || item.type || "Notification", // Use subType, type, or a default title
        message: item.message,
        // Add other properties if INotificationProps requires them from item.context
    }));
});

const items = ref([
    {
        label: "Attendance Sheets",
        icon: "pi pi-file-edit",
        path: "/attendance-sheet",
    },
    {
        label: "Wallet Release",
        icon: "pi pi-wallet",
        path: "/wallet",
    },
    {
        label: "Logout",
        icon: "pi pi-arrow-left",
        path: "/logout",
    },
]);
const outletStore = useOutletStore();
const { hotelStatus, outletStatus, refreshHotels, refreshOutlets } =
    useHotelOutlets();

// Use these for the dropdown bindings
const selectedHotel = computed({
    get: () => outletStore.selectedHotel,
    set: (value) => {
        outletStore.selectedHotel = value;
    },
});

const selectedOutlet = computed({
    get: () => outletStore.selectedOutlet,
    set: (value) => {
        outletStore.selectedOutlet = value;
    },
});

// Get the data from the store
const { hotels, filteredOutlets } = storeToRefs(outletStore);
</script>
<template>
    <main class="min-h-screen max-w-[100vw] flex bg-gray-100 gap-4">
        <TheSidebar :items="items">
            <template #start>
                <div class="flex flex-col gap-6">
                    <Dropdown
                        v-model="selectedHotel"
                        :options="hotels"
                        option-label="name"
                        class="border-none"
                        :loading="hotelStatus === 'pending'"
                    >
                        <template #value="slotProps">
                            <div
                                v-if="slotProps.value"
                                class="flex align-items-center"
                            >
                                <img
                                    :src="slotProps.value.logo"
                                    class="mr-2"
                                    style="width: 18px"
                                />
                                <div>{{ slotProps.value.name }}</div>
                            </div>
                            <span v-else>
                                {{ slotProps.placeholder }}
                            </span>
                        </template>
                        <template #option="slotProps">
                            <img
                                :src="slotProps.option.logo"
                                class="mr-2"
                                style="width: 18px"
                            />
                            <div>{{ slotProps.option.name }}</div>
                        </template>
                    </Dropdown>
                    <Dropdown
                        v-model="selectedOutlet"
                        :options="filteredOutlets"
                        option-label="name"
                        placeholder="Select an outlet"
                        class="border-none"
                        :loading="outletStatus === 'pending'"
                    ></Dropdown>
                </div>
                <Divider />
            </template>
        </TheSidebar>
        <div class="flex-grow py-8 pr-4 h-max">
            <div
                class="flex justify-between h-12 mb-6 border-b border-solid border-giggle-border"
            >
                <div class="flex items-center gap-4 pt-1">
                    <nuxtLink v-if="back" :to="back"
                        ><span
                            class="inline-block text-primary pi pi-angle-left"
                    /></nuxtLink>
                    <h4
                        v-auto-animate
                        class="inline-block font-medium uppercase"
                    >
                        {{ title }}
                    </h4>
                    <template v-if="subtitle">
                        <span class="text-gray-500">|</span>
                        <h4 class="font-medium text-gray-500 uppercase">
                            {{ subtitle }}
                        </h4>
                    </template>
                </div>
                <div v-auto-animate class="relative h-10">
                    <span
                        v-if="formattedNotifications.length > 0"
                        class="pi pi-bell absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2"
                    >
                        {{ formattedNotifications.length }}
                    </span>
                    <NotificationContainer
                        v-if="notificationVisibility"
                        class="absolute z-50 px-4 bg-white shadow-md select-none right-2 min-w-96"
                        :items="formattedNotifications"
                        :is-loading="isLoadingNotifications"
                    />
                </div>
            </div>
            <slot />
        </div>
    </main>
</template>

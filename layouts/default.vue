<script setup lang="ts">
import Dropdown from "primevue/dropdown";
import { useOutletStore } from "@/store/useOutletStore";
import type { INotificationProps } from "~/types/components";

const { title, subtitle, back } = usePageHeader();

const { notificationVisibility, toggleNotificationVisibility } =
    useNotificationsBar();

const notifications: INotificationProps[] = [
    // {
    //   notificationId: "1234",
    //   icon: "/_nuxt/assets/images/Avatar.png",
    //   title: "I am a new notification",
    //   message: "Lorem",
    // },
    // {
    //   notificationId: "1224",
    //   icon: "/_nuxt/assets/images/Avatar.png",
    //   title: "I am a new notification",
    //   message: "Lorem",
    // },
];

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
                        class="pi pi-bell"
                        @click="toggleNotificationVisibility"
                    />
                    <NotificationContainer
                        v-if="notificationVisibility"
                        class="absolute z-50 px-4 bg-white shadow-md select-none right-2 min-w-96"
                        :items="notifications"
                    />
                </div>
            </div>
            <slot />
        </div>
    </main>
</template>

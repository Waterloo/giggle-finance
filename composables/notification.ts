const notificationVisibility = ref(false);

export const useNotificationsBar = () => ({
    toggleNotificationVisibility() {
        notificationVisibility.value = !notificationVisibility.value
    },
    notificationVisibility: readonly(notificationVisibility)
})
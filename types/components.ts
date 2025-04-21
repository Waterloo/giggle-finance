export interface INotificationProps {
    title?: string;
    message?: string;
    class?: string | string[] | Record<string, unknown>;
    icon?: string,
    notificationId?: string
}

export interface INotificationSlots {
    title:any,
    icon: any,
    message: any
}
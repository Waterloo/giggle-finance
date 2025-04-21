export interface Outlet {
  id: number;
  hotelId: number;
  name: string;
  username: string;
  basicPay: string;
  maximumPay: string;
  additionalRequirements: string[];
  hotelName: string;
  hotelLogoURL: string;
}
export interface Hotel {
  id: number;
  name: string;
  logoURL: string;
}

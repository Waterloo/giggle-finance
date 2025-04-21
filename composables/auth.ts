import { useOutletStore } from "~/store/useOutletStore";
import type { Outlet } from "~/types/outlet";

export interface LoginAuthResponse {
  result: {
    refreshToken: string;
    accessToken: string;
  };
  success: boolean;
  message: string;
}

export interface userCredentials {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  avatar: Avatar;
  isVerified: boolean;
  verifiedOver: string;
  isActive: boolean;
  isProfileCompleted: boolean;
  currentOrg: string;
  location: Location;
}

export interface Avatar {
  mime: string;
  data: string;
}

export interface Location {
  lat: string;
  lng: string;
}

const token = ref<string | null>(getToken()?.accessToken || null);
const refreshToken = ref<string | null>(getToken()?.refreshToken || null);

const user = reactive<User>({} as User);
const isAuthenticated = ref(false);

export const useAuth = () => {
  const outletStore = useOutletStore();
  const router = useRouter();
  const config = useRuntimeConfig();
  const loading = ref(false);

  const login = async (credentials: userCredentials) => {
    loading.value = true;
    let loginResponse;
    try {
      const response = await $fetch<LoginAuthResponse>(
        "https://giggle-api.giggleappdevop.workers.dev/api/v1/staff/login",
        {
          method: "POST",
          body: credentials,
          baseURL: config.public.apiBase,
        },
      );

      if (response.success) {
        loginResponse = response;
        isAuthenticated.value = true;
        token.value = response.result.accessToken;
        refreshToken.value = response.result.refreshToken;
        persistToken(response.result);
        await getMe();
      } else {
        loginResponse = { success: false, message: response.message };
      }
    } catch (error) {
      console.error("Login error:", error);
      loginResponse = {
        success: false,
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      };
    } finally {
      loading.value = false;
      // because we only returning from finally its safe to use the unsafe finally
      // eslint-disable-next-line no-unsafe-finally
      return loginResponse!;
    }
  };

  const getMe = async () => {
    const hotels =
      await fetchWithToken<APIResponse<{ hotels: Hotel[] }>>("/hotel/");
    outletStore.setHotels(hotels.result.hotels);

    if (hotels.result.hotels.length > 0) {
      const outlets = await fetchWithToken<APIResponse<{ outlets: Outlet[] }>>(
        `/outlet/hotel/${hotels.result.hotels[0].id}`,
      );
      outletStore.setOutlets(outlets.result.outlets);
    }
  };

  const logout = () => {
    console.log("logout");
    token.value = null;
    refreshToken.value = null;
    isAuthenticated.value = false;
    Object.keys(user).forEach((key) => delete user[key as keyof typeof user]);
    localStorage.removeItem("token");
    router.push("/login");
  };

  const refreshAuthToken = async () => {
    if (!refreshToken.value) {
      console.error("No refresh token available");
      return false;
    }

    try {
      const response = await $fetch<LoginAuthResponse>(
        "https://giggle-api.giggleappdevop.workers.dev/api/v1/staff/refresh",
        {
          method: "POST",
          body: { refreshToken: refreshToken.value },
          baseURL: config.public.apiBase,
        },
      );

      if (response.success) {
        token.value = response.result.accessToken;
        refreshToken.value = response.result.refreshToken;
        persistToken(response.result);
        getMe();
        return true;
      }

      return false;
    } catch (error) {
      console.error("Token refresh error:", error);
      return false;
    }
  };

  const fetchWithToken = async <T>(url: string, options = {}): Promise<T> => {
    if (!token.value) {
      router.push("/login");
    }

    const fetchOptions: FetchOptions = {
      baseURL: config.public.apiBase,
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token.value}`,
      },
    };

    try {
      const response = await $fetch<T>(url, {
        ...fetchOptions,
        baseURL: config.public.apiBase,
        onResponseError: async ({ response }) => {
          if (response.status === 401) {
            // Token might be expired, try to refresh
            const refreshed = await refreshAuthToken();
            if (refreshed) {
              // Retry the original request with the new token
              return $fetch<T>(url, {
                ...fetchOptions,
                headers: {
                  ...fetchOptions.headers,
                  Authorization: `Bearer ${token.value}`,
                },
              });
            } else {
              // If refresh failed, logout and throw an error
              logout();
              throw new Error("Authentication failed");
            }
          }
        },
      });

      return response;
    } catch (error) {
      console.error("Error in fetchWithToken:", error);
      throw error;
    }
  };

  return {
    login,
    logout,
    loading,
    refreshAuthToken,
    fetchWithToken,
    API: fetchWithToken,
    token,
    refreshToken,
    user,
    isAuthenticated,
  };
};

function persistToken(token) {
  localStorage.setItem("token", JSON.stringify(token));
}

function getToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    return JSON.parse(token) as { accessToken: string; refreshToken: string };
  } catch (error) {
    console.error("Error parsing token:", error);
    localStorage.removeItem("token");
    return null;
  }
}

export type UseAuthReturn = ReturnType<typeof useAuth>;

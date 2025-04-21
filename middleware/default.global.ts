export default defineNuxtRouteMiddleware(async (to, from) => {
  const { token } = useAuth();
  if (to.path === "/login") return;

  if (process.client) {
    if (!token.value) {
      return navigateTo("/login");
    }
  }
});

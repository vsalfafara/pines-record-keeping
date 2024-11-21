export default defineNuxtRouteMiddleware((to, from) => {
  const { loggedIn } = useUserSession();
  if (to.name === "Login") {
    if (loggedIn.value) {
      return navigateTo("/access-management");
    }
  } else {
    if (!loggedIn.value) {
      return navigateTo("/login");
    }
  }
});

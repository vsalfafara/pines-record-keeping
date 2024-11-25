<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="w-[calc(100vw-240px)] flex-1 overflow-y-auto p-4">
      <Header />
      <slot />
    </div>
    <Toaster />
  </div>
</template>

<script setup lang="ts">
import Sidebar from "~/components/layouts/Sidebar.vue";
import Header from "~/components/layouts/Header.vue";

// type ActiveLinks =
//   | "client-records"
//   | "reporting-hub"
//   | "property-portfolio"
//   | "access-management";

// const profile = ref<string>("");
// const loading = ref<boolean>(false);

// const active = ref<string | ActiveLinks | symbol>("");

// async function logout() {
//   loading.value = true;
//   await $fetch("/api/auth/logout", {
//     method: "POST",
//   });
//   loading.value = false;
//   const { clear } = useUserSession();
//   await clear();
//   await navigateTo("/login");
// }
</script>

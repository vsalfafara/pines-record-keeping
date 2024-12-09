<template>
  <div class="flex h-full min-w-[240px] flex-col gap-6 bg-slate-50 p-4">
    <div class="flex items-center gap-2">
      <TreePine class="h-10 w-10 rounded-md bg-green-600 p-2 text-white" />
      <h1 class="font-semibold">Pines Memorial</h1>
    </div>
    <div v-for="(group, i) in groups" :key="i">
      <p class="text-sm text-muted-foreground">{{ group.name }}</p>
      <NuxtLink
        v-for="(route, j) in group.routes"
        :key="j"
        :to="{ name: route.name }"
      >
        <Button
          variant="ghost"
          class="flex w-full items-center justify-start gap-2 p-2"
          :class="{
            'bg-accent text-accent-foreground': active === route.name,
          }"
        >
          <component :is="route.meta.icon" />
          <span class="font-semibold">{{ route.name }}</span>
        </Button>
      </NuxtLink>
    </div>
    <div class="mt-auto">
      <Button
        variant="ghost"
        class="flex w-full items-center justify-start gap-2 p-2"
        @click="logout"
      >
        <template v-if="loading">
          <LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
          Logging out...
        </template>
        <template v-else>
          <LogOut class="h-4 w-4" stroke-width="3" />
          <span class="font-semibold">Log out</span>
        </template>
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  TreePine,
  Users,
  ChartColumnIncreasing,
  MapPin,
  UserRoundCog,
  LogOut,
  LoaderCircle,
} from "lucide-vue-next";
import type { RouteRecordNameGeneric } from "vue-router";
import Button from "../ui/button/Button.vue";
import { sidebarRoutes } from "~/app/router.options";

const loading = ref<boolean>(false);
const active = ref<RouteRecordNameGeneric>("");
const route = useRoute();
const groups = ref(sidebarRoutes);

onMounted(async () => {
  const { name } = useRoute();
  if (name) active.value = name;
});

watch(
  () => route.fullPath,
  () => (active.value = route.name)
);

async function logout() {
  loading.value = true;
  await $fetch("/api/auth/logout", {
    method: "POST",
  });
  loading.value = false;
  const { clear } = useUserSession();
  await clear();
  await navigateTo("/login");
}
</script>

<style scoped></style>

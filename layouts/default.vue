<template>
  <div class="flex h-screen">
    <div class="flex h-full min-w-[240px] flex-col gap-6 bg-slate-50 p-4">
      <div class="flex items-center gap-2">
        <TreePine class="h-10 w-10 rounded-md bg-green-600 p-2 text-white" />
        <h1 class="font-semibold">Pines Memorial</h1>
      </div>
      <div>
        <p class="text-sm text-muted-foreground">Platform</p>
        <Button
          variant="ghost"
          class="flex w-full items-center justify-start gap-2 p-2"
        >
          <Users class="h-4 w-4" stroke-width="3" />
          <span class="font-semibold">Client Records</span>
        </Button>
      </div>
      <div>
        <p class="text-sm text-muted-foreground">Admin</p>
        <Button
          variant="ghost"
          class="flex w-full items-center justify-start gap-2 p-2"
        >
          <ChartColumnIncreasing class="h-4 w-4" stroke-width="3" />
          <span class="font-semibold">Reporting Hub</span>
        </Button>
        <Button
          variant="ghost"
          class="flex w-full items-center justify-start gap-2 p-2"
        >
          <MapPin class="h-4 w-4" stroke-width="3" />
          <span class="font-semibold">Property Portfolio</span>
        </Button>
        <Button
          variant="ghost"
          class="flex w-full items-center justify-start gap-2 p-2"
          :class="{
            'bg-accent text-accent-foreground': active === 'Access Management',
          }"
        >
          <UserRoundCog class="h-4 w-4" stroke-width="3" />
          <span class="font-semibold">Access Management</span>
        </Button>
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
    <div class="w-[calc(100vw-240px)] flex-1 overflow-y-auto p-4">
      <div class="mb-4 flex items-center justify-between">
        <p>Access Management</p>
        <span
          class="flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 p-4 text-sm"
          >{{ profile }}</span
        >
      </div>
      <h1 class="mb-2 text-2xl font-semibold">Access Management</h1>
      <p class="mb-4 text-muted-foreground">
        Here's a list of all your admin access
      </p>
      <slot />
    </div>
    <Toaster />
  </div>
</template>

<script setup lang="ts">
import { Button } from "~/components/ui/button";
import Toaster from "@/components/ui/toast/Toaster.vue";
import {
  TreePine,
  Users,
  ChartColumnIncreasing,
  MapPin,
  UserRoundCog,
  LogOut,
  LoaderCircle,
} from "lucide-vue-next";

type ActiveLinks =
  | "client-records"
  | "reporting-hub"
  | "property-portfolio"
  | "access-management";

const profile = ref<string>("");
const loading = ref<boolean>(false);

const active = ref<string | ActiveLinks | symbol>("");

onMounted(async () => {
  const { user, fetch } = useUserSession();
  await fetch();
  profile.value =
    `${user.value?.firstName.charAt(0)}${user.value?.lastName.charAt(0)}`.trim();

  const { name } = useRoute();
  if (name) active.value = name;
});

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

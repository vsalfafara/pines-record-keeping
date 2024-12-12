<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="w-[calc(100vw-240px)] flex-1 overflow-y-auto p-4">
      <Header :breadcrumbs="breadcrumbs" />
      <slot />
    </div>
    <Toaster />
  </div>
</template>

<script setup lang="ts">
import Sidebar from "~/components/layouts/Sidebar.vue";
import Header from "~/components/layouts/Header.vue";
import type { BreadcrumbType } from "~/lib/types";

const { breadcrumbs } = defineProps<{ breadcrumbs: BreadcrumbType[] }>();
</script>

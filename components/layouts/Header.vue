<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <p>{{ pageName }}</p>
      <span
        class="flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 p-4 text-sm"
        >{{ profile }}</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RouteRecordNameGeneric } from "vue-router";

const profile = ref<string>("");
const pageName = ref<RouteRecordNameGeneric>();
const route = useRoute();

onMounted(async () => {
  const { user, fetch } = useUserSession();
  await fetch();
  profile.value =
    `${user.value?.firstName.charAt(0)}${user.value?.lastName.charAt(0)}`.trim();
  updatePageName();
});

function updatePageName() {
  pageName.value = route.name;
}
</script>

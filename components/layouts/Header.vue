<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <Breadcrumb>
        <BreadcrumbList>
          <template v-for="(breadcrumb, index) in breadcrumbs" :key="index">
            <BreadcrumbItem>
              <BreadcrumbPage v-if="breadcrumbs?.length - 1 === index">
                {{ breadcrumb.label }}
              </BreadcrumbPage>
              <BreadcrumbLink
                v-else
                class="cursor-pointer"
                @click="navigateTo({ name: breadcrumb.routeName })"
              >
                {{ breadcrumb.label }}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator v-if="breadcrumbs?.length - 1 !== index" />
          </template>
        </BreadcrumbList>
      </Breadcrumb>
      <span
        class="flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 p-4 text-sm"
        >{{ profile }}</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RouteRecordNameGeneric } from "vue-router";
import type { BreadcrumbType } from "~/lib/types";

const profile = ref<string>("");
const pageName = ref<RouteRecordNameGeneric>();
const route = useRoute();

const { breadcrumbs } = defineProps<{ breadcrumbs: BreadcrumbType[] }>();

const breadcrumbLength = computed(() => {
  return breadcrumbs.length;
});
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

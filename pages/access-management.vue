<template>
  <NuxtLayout :breadcrumbs="breadcrumbs">
    <h1 class="mb-2 text-2xl font-semibold">Access Management</h1>
    <p class="mb-4 text-muted-foreground">
      Here's a list of all your admin access.
    </p>
    <DataTable
      :data="users"
      :columns
      :loading
      table-size="max-h-[calc(100vh-220px)]"
    >
      <template #buttons><AddUserDialog @refresh="getUsers" /></template>
    </DataTable>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { createColumnHelper } from "@tanstack/vue-table";
import { ArrowUpDown } from "lucide-vue-next";
import { useDateFormat } from "@vueuse/core";
import AddUserDialog from "~/components/access-management/AddUserDialog.vue";
import EditUserDialog from "~/components/access-management/EditUserDialog.vue";
import DeleteUserDialog from "~/components/access-management/DeleteUserDialog.vue";
import type { BreadcrumbType } from "~/lib/types";
import DataTable from "~/components/custom/DataTable.vue";

const breadcrumbs = ref<BreadcrumbType[]>([
  {
    label: "Access Management",
    routeName: "Access Management",
  },
]);

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "ADMIN" | "ACCOUNTS_CLERK";
  createdBy: string;
  createdOn: string;
};

const { user: userSession } = useUserSession();
const users = ref<User[]>([]);
const loading = ref<boolean>(false);

const columnHelper = createColumnHelper<User>();

const columns = [
  columnHelper.accessor("firstName", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["First Name", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => h("div", { class: "px-4" }, row.getValue("firstName")),
  }),
  columnHelper.accessor("lastName", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Last Name", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => h("div", { class: "px-4" }, row.getValue("lastName")),
  }),
  columnHelper.accessor("role", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Role", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => {
      let role: any = row.getValue("role");

      role = role
        .split("_")
        .map(
          (word: string) => word[0].toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ")
        .trim();

      return h("div", { class: "px-4" }, role);
    },
  }),
  columnHelper.accessor("email", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Email Address", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => h("div", { class: "px-4" }, row.getValue("email")),
  }),
  columnHelper.accessor("createdBy", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Created By", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => h("div", { class: "px-4" }, row.getValue("createdBy")),
  }),
  columnHelper.accessor("createdOn", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Created On", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => {
      return h(
        "div",
        { class: "px-4" },
        useDateFormat(row.getValue("createdOn"), "DD MMM YYYY").value
      );
    },
  }),
  columnHelper.display({
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;

      const actions = [];

      actions.push(h(EditUserDialog, { user, onRefresh: () => getUsers() }));

      if (userSession.value?.id !== user.id) {
        actions.push(
          h(DeleteUserDialog, {
            user,
            onRefresh: () => getUsers(),
          })
        );
      }
      return h(
        "div",
        {
          class: "flex items-center gap-2 justify-end",
        },
        actions
      );
    },
  }),
];

onMounted(async () => getUsers());

async function getUsers() {
  loading.value = true;
  try {
    const data: any = await $fetch("/api/users/all");
    users.value = data;
  } catch (error) {
    console.log(error);
  }
  loading.value = false;
}
</script>

<style scoped></style>

<template>
  <NuxtLayout :breadcrumbs="breadcrumbs">
    <h1 class="mb-2 text-2xl font-semibold">Client Records</h1>
    <p class="mb-4 text-muted-foreground">
      Here's a list of all your client records.
    </p>
    <DataTable :data="clients" :columns :loading>
      <template #buttons>
        <AddClientDialog @refresh="handleGetClients" />
      </template>
    </DataTable>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { createColumnHelper } from "@tanstack/vue-table";
import { ArrowUpDown } from "lucide-vue-next";
import { useDateFormat } from "@vueuse/core";
import AddClientDialog from "~/components/client-records/AddClientDialog.vue";
import EditClientButton from "~/components/client-records/EditClientButton.vue";
import type { Client } from "~/db/schema";
import type { BreadcrumbType } from "~/lib/types";
import DataTable from "~/components/custom/DataTable.vue";

const breadcrumbs = ref<BreadcrumbType[]>([
  {
    label: "Client Records",
    routeName: "Client Records",
  },
]);

const clients = ref<Client[]>([]);
const loading = ref<boolean>(false);

const columnHelper = createColumnHelper<Client>();

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
  columnHelper.accessor("mobileNumber", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Full Address", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) =>
      h("div", { class: "px-4" }, row.getValue("mobileNumber")),
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
      const client = row.original;

      const actions = [];

      actions.push(h(EditClientButton, { client }));

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

onMounted(async () => handleGetClients());

async function handleGetClients() {
  loading.value = true;
  try {
    const data = await $fetch(`/api/clients/all`);
    clients.value = data as any;
  } catch (error) {
    console.log(error);
  }
  loading.value = false;
}
</script>

<template>
  <NuxtLayout :breadcrumbs="breadcrumbs">
    <div class="mb-2 flex items-center gap-2">
      <h1 class="text-2xl font-semibold">Property Portfolio</h1>
      <Badge variant="outline"
        >Total available lots {{ totalAvailableLots }}</Badge
      >
      <Badge variant="outline">Total taken lots {{ totalTakenLots }}</Badge>
    </div>
    <p class="mb-4 text-muted-foreground">
      Here's a list of all your property ownings.
    </p>
    <DataTable
      :data="properties"
      :columns
      :loading
      :initiallyHiddenColumns
      table-size="max-h-[calc(100vh-220px)]"
    >
      <template #buttons
        ><AddPropertyDialog @refresh="handleGetProperties"
      /></template>
    </DataTable>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { createColumnHelper, type VisibilityState } from "@tanstack/vue-table";
import { ArrowUpDown } from "lucide-vue-next";
import { useDateFormat } from "@vueuse/core";
import DataTable from "~/components/custom/DataTable.vue";
import AddPropertyDialog from "~/components/property-portfolio/AddPropertyDialog.vue";
import DeletePropertyDialog from "~/components/property-portfolio/DeletePropertyDialog.vue";
import EditPropertyButton from "~/components/property-portfolio/EditPropertyButton.vue";
import { type Property } from "~/db/schema";
import type { BreadcrumbType } from "~/lib/types";

const breadcrumbs = ref<BreadcrumbType[]>([
  {
    label: "Property Portfolio",
    routeName: "Property Portfolio",
  },
]);

type CustomProperty = Property & {
  noOfBlocks: number;
  noOfLots: number;
  takenLots: number;
  availableLots: number;
};

const properties = ref<CustomProperty[]>([]);
const totalAvailableLots = ref<number>(0);
const totalTakenLots = ref<number>(0);
const loading = ref<boolean>(false);

const columnHelper = createColumnHelper<CustomProperty>();
const initiallyHiddenColumns = ref<VisibilityState>({
  fullAddress: false,
});

const columns = [
  columnHelper.accessor("name", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Name", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => h("div", { class: "px-4" }, row.getValue("name")),
  }),
  columnHelper.accessor("fullAddress", {
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
    cell: ({ row }) => h("div", { class: "px-4" }, row.getValue("fullAddress")),
  }),
  columnHelper.accessor("noOfBlocks", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["# of Blocks", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => h("div", { class: "px-4" }, row.getValue("noOfBlocks")),
  }),
  columnHelper.accessor("noOfLots", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["# of Lots", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => h("div", { class: "px-4" }, row.getValue("noOfLots")),
  }),
  columnHelper.accessor("takenLots", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Taken Lots", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => h("div", { class: "px-4" }, row.getValue("takenLots")),
  }),
  columnHelper.accessor("availableLots", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Available Lots", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) =>
      h("div", { class: "px-4" }, row.getValue("availableLots")),
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
      const property = row.original;

      const actions = [];

      actions.push(h(EditPropertyButton, { property }));

      if (property.takenLots === 0) {
        actions.push(
          h(DeletePropertyDialog, {
            property,
            onRefresh: () => handleGetProperties(),
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

onMounted(async () => handleGetProperties());

async function handleGetProperties() {
  loading.value = true;
  try {
    const data: any = await $fetch(`/api/properties/all`);
    properties.value = data.properties;
    totalAvailableLots.value = data.totalAvailableLots;
    totalTakenLots.value = data.totalTakenLots;
  } catch (error) {
    console.log(error);
  }
  loading.value = false;
}
</script>

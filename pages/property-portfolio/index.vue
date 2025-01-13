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
    <div class="grid grid-cols-1 gap-2">
      <div
        class="flex flex-col items-end justify-between gap-2 lg:flex-row lg:items-center"
      >
        <Input placeholder="Search" class="max-w-[384px]" />
        <div class="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="outline">
                <Settings2 />
                Toggle Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                v-for="column in table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())"
                :key="column.id"
                class="cursor-pointer capitalize"
                :checked="column.getIsVisible()"
                @update:checked="
                  (value: any) => {
                    column.toggleVisibility(!!value);
                  }
                "
              >
                {{ column.id }}
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <AddPropertyDialog @refresh="handleGetProperties" />
        </div>
      </div>
      <div class="rounded-md border">
        <Table class="whitespace-nowrap">
          <TableHeader>
            <TableRow
              v-for="headerGroup in table.getHeaderGroups()"
              :key="headerGroup.id"
            >
              <TableHead v-for="header in headerGroup.headers" :key="header.id">
                <FlexRender
                  v-if="!header.isPlaceholder"
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-if="loading">
              <TableCell :colspan="columns.length" class="h-24">
                <LoaderCircle class="mx-auto block h-4 w-4 animate-spin" />
              </TableCell>
            </TableRow>
            <template v-else-if="table.getRowModel().rows?.length">
              <template v-for="row in table.getRowModel().rows" :key="row.id">
                <TableRow :data-state="row.getIsSelected() && 'selected'">
                  <TableCell
                    v-for="cell in row.getVisibleCells()"
                    :key="cell.id"
                  >
                    <FlexRender
                      :render="cell.column.columnDef.cell"
                      :props="cell.getContext()"
                    />
                  </TableCell>
                </TableRow>
                <TableRow v-if="row.getIsExpanded()">
                  <TableCell :colspan="row.getAllCells().length">
                    {{ JSON.stringify(row.original) }}
                  </TableCell>
                </TableRow>
              </template>
            </template>
            <TableRow v-else>
              <TableCell :colspan="columns.length" class="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/vue-table";
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from "@tanstack/vue-table";
import { Settings2, ArrowUpDown, LoaderCircle } from "lucide-vue-next";
import { valueUpdater } from "~/lib/utils";
import { useDateFormat } from "@vueuse/core";
import AddPropertyDialog from "~/components/property-portfolio/AddPropertyDialog.vue";
import DeletePropertyDialog from "~/components/property-portfolio/DeletePropertyDialog.vue";
import EditPropertyButton from "~/components/property-portfolio/EditPropertyButton.vue";
import { blockRelations, type Lot, type Property } from "~/db/schema";
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

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = ref<VisibilityState>({});

const table = useVueTable({
  data: properties,
  columns,
  getCoreRowModel: getCoreRowModel(),
  // getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, columnVisibility),
  state: {
    get sorting() {
      return sorting.value;
    },
    get columnFilters() {
      return columnFilters.value;
    },
    get columnVisibility() {
      return columnVisibility.value;
    },
    columnPinning: {
      left: ["status"],
    },
  },
});

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

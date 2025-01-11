<template>
  <div class="grid gap-2">
    <div
      class="flex flex-col items-end justify-end gap-2 lg:flex-row lg:items-center"
    >
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
      </div>
    </div>
    <div class="max-h-[400px] overflow-y-auto rounded-md border">
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
                <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
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
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
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
import {
  Settings2,
  Plus,
  ArrowUpDown,
  LoaderCircle,
  Trash,
  Pencil,
} from "lucide-vue-next";
import type { ClientLot, Interment } from "~/db/schema";
import { useDateFormat } from "@vueuse/core";
import { valueUpdater } from "~/lib/utils";
import { useCurrencyFormatter } from "#build/imports";
import EditIntermentDialog from "./EditIntermentDialog.vue";

const { clientLot } = defineProps<{ clientLot: ClientLot }>();

const toPHP = useCurrencyFormatter();
const loading = ref<boolean>(false);
const interments = ref<Interment[]>([]);

const columnHelper = createColumnHelper<Interment>();

onMounted(() => handleGetInterments());

const columns = [
  columnHelper.accessor("dig", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Dig #", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => h("div", { class: "px-4" }, row.getValue("dig")),
  }),
  columnHelper.accessor("type", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Type", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => h("div", { class: "px-4" }, row.getValue("type")),
  }),
  columnHelper.accessor("deceasedName", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["[Deceased] Name", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) =>
      h("div", { class: "px-4" }, row.getValue("deceasedName")),
  }),
  columnHelper.accessor("deceasedDied", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["[Deceased] Died", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) =>
      h(
        "div",
        { class: "px-4" },
        row.getValue("deceasedDied")
          ? useDateFormat(row.getValue("deceasedDied"), "DD MMM YYYY").value
          : ""
      ),
  }),
  columnHelper.accessor("remainsName", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["[Remains] Died", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => h("div", { class: "px-4" }, row.getValue("remainsName")),
  }),

  columnHelper.accessor("remainsDied", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["[Remains] Died", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) =>
      h(
        "div",
        { class: "px-4" },
        row.getValue("remainsDied")
          ? useDateFormat(row.getValue("remainsDied"), "DD MMM YYYY").value
          : ""
      ),
  }),
  columnHelper.accessor("intermentDate", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Interment Date", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) =>
      h(
        "div",
        { class: "px-4" },
        row.getValue("intermentDate")
          ? useDateFormat(row.getValue("intermentDate"), "DD MMM YYYY").value
          : ""
      ),
  }),
  columnHelper.accessor("intermentTime", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Interment Time", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => {
      let time: string = row.getValue("intermentTime");
      time = time ? time.toUpperCase() : time;
      return h("div", { class: "px-4" }, time);
    },
  }),
  columnHelper.accessor("contractorName", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Contractor Name", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) =>
      h("div", { class: "px-4" }, row.getValue("contractorName")),
  }),
  columnHelper.display({
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const interment = row.original;
      const actions = [];

      actions.push(
        h(EditIntermentDialog, {
          interment,
          onRefresh: () => handleGetInterments(),
        })
      );

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
  data: interments,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
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

async function handleGetInterments() {
  loading.value = true;
  try {
    const response: any = await $fetch(`/api/interments/${clientLot.id}`);
    interments.value = response;
  } catch (error) {
    console.log(error);
  }
  loading.value = false;
}
</script>

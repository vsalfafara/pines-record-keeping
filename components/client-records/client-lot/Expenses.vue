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
        <AddExpenseDialog
          :client-lot="clientLot"
          @refresh="handleGetExpenses"
        />
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
import * as z from "zod";
import {
  Settings2,
  Plus,
  ArrowUpDown,
  LoaderCircle,
  Trash,
  Pencil,
} from "lucide-vue-next";
import type { ClientLot, Expense } from "~/db/schema";
import { useDateFormat } from "@vueuse/core";
import { valueUpdater } from "~/lib/utils";
import RemarksTooltip from "~/components/custom/RemarksTooltip.vue";
import Receipt from "./Receipt.vue";
import { useCurrencyFormatter } from "#build/imports";
import AddExpenseDialog from "./AddExpenseDialog.vue";

const { clientLot } = defineProps<{ clientLot: ClientLot }>();

const toPHP = useCurrencyFormatter();
const loading = ref<boolean>(false);
const expenses = ref<Expense[]>([]);

const columnHelper = createColumnHelper<Expense>();

onMounted(() => {
  handleGetExpenses();
});

const columns = [
  columnHelper.accessor("purpose", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Purpose", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => h("div", { class: "px-4" }, row.getValue("purpose")),
  }),
  columnHelper.accessor("payment", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Payment", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) =>
      h("div", { class: "px-4" }, toPHP.value.format(row.getValue("payment"))),
  }),
  columnHelper.accessor("dateOfPayment", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Date of Payment", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) =>
      h(
        "div",
        { class: "px-4" },
        useDateFormat(row.getValue("dateOfPayment"), "DD MMM YYYY").value
      ),
  }),
  columnHelper.accessor("remarks", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Remarks", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => {
      const remarks: string = row.getValue("remarks");
      return h(RemarksTooltip, {
        remarks: remarks,
      });
    },
  }),
  columnHelper.accessor("receipt", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Receipt", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => {
      const receiptName: string = row.getValue("receipt");
      return h(Receipt, { class: "px-4", receipt: receiptName });
    },
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
];

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = ref<VisibilityState>();

const table = useVueTable({
  data: expenses,
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

async function handleGetExpenses() {
  loading.value = true;
  try {
    const response: any = await $fetch(`/api/expenses/${clientLot.id}`);
    expenses.value = response;
  } catch (error) {
    console.log(error);
  }
  loading.value = false;
}
</script>

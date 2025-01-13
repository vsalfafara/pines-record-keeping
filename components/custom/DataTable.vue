<template>
  <div class="grid grid-cols-1 gap-2">
    <div
      class="flex flex-col items-end justify-between gap-2 lg:flex-row lg:items-center"
    >
      <Input placeholder="Search" class="max-w-[384px]" v-model="filter" />
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
                .filter((column: any) => column.getCanHide())"
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
        <slot name="buttons" />
      </div>
    </div>
    <div
      class="overflow-y-auto rounded-md border"
      :class="{ 'max-h-[400px]': fixedHeight }"
    >
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
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useVueTable,
} from "@tanstack/vue-table";
import { Settings2, LoaderCircle } from "lucide-vue-next";
import { valueUpdater } from "~/lib/utils";

const {
  data,
  columns,
  loading,
  fixedHeight = false,
  initiallyHiddenColumns = {},
} = defineProps<{
  data: any[];
  columns: any;
  loading: boolean;
  fixedHeight?: boolean;
  initiallyHiddenColumns?: VisibilityState;
}>();

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = ref<VisibilityState>(initiallyHiddenColumns);
const filter = ref<string>("");

const table = ref(handleTableInit());

watch(
  () => data,
  () => {
    table.value = handleTableInit();
  }
);

function handleTableInit() {
  return useVueTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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
      get globalFilter() {
        return filter.value;
      },
      get columnVisibility() {
        return columnVisibility.value;
      },
      columnPinning: {
        left: ["status"],
      },
    },
  });
}
</script>

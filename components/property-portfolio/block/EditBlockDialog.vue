<template>
  <Form v-slot="{ handleSubmit }" :validation-schema="formSchema">
    <Sheet :open="dialogState" @update:open="handleOpenDialog" @open="">
      <SheetTrigger as-child>
        <Button variant="outline" size="icon"> <Pencil /> </Button>
      </SheetTrigger>
      <SheetContent class="sm:max-w-[1240px]">
        <SheetHeader class="mb-4">
          <SheetTitle
            ><Pencil class="h-8 w-8 rounded-md bg-blue-50 p-2 text-blue-600"
          /></SheetTitle>
          <SheetDescription>
            <h3 class="mb-2 text-xl font-semibold text-slate-900">
              {{ block?.name }}
            </h3>
            <p>Fill out the form</p>
          </SheetDescription>
        </SheetHeader>
        <form
          id="editBlockForm"
          class="mb-4"
          @submit="handleSubmit($event, handleUpdateBlock)"
        >
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Name *</FormLabel>
              <FormControl>
                <div class="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Input name"
                    :default-value="block?.name"
                    v-bind="componentField"
                  />
                  <Button
                    type="submit"
                    form="editBlockForm"
                    :disabled="loading"
                  >
                    <LoaderCircle
                      v-if="loading"
                      class="mr-2 h-4 w-4 animate-spin"
                    />
                    {{ loading ? "Saving changes..." : "Save Changes" }}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </form>
        <div
          class="mb-4 flex flex-col items-end justify-between gap-2 lg:flex-row lg:items-center"
        >
          <p class="font-semibold text-blue-600">Lots</p>
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
            <AddLotDialog
              v-if="block"
              :block-id="block.id"
              @refresh="handleGetBlock"
            />
          </div>
        </div>
        <div class="rounded-md border">
          <Table class="whitespace-nowrap">
            <TableHeader>
              <TableRow
                v-for="headerGroup in table.getHeaderGroups()"
                :key="headerGroup.id"
              >
                <TableHead
                  v-for="header in headerGroup.headers"
                  :key="header.id"
                >
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
        <!-- <SheetFooter>
          <SheetClose as-child>
            <Button type="button" variant="outline"> Cancel </Button>
          </SheetClose>
        </SheetFooter> -->
      </SheetContent>
    </Sheet>
  </Form>
</template>

<script setup lang="ts">
import { Button } from "~/components/ui/button";
import { Pencil, LoaderCircle, ArrowUpDown, Settings2 } from "lucide-vue-next";
import { toTypedSchema } from "@vee-validate/zod";
import AddLotDialog from "./lot/AddLotDialog.vue";
import * as z from "zod";
import { useToast } from "@/components/ui/toast/use-toast";
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/vue-table";
import { useDateFormat } from "@vueuse/core";
import { valueUpdater } from "~/lib/utils";
import type { Block, Lot } from "~/db/schema";
import EditLotDialog from "./lot/EditLotDialog.vue";
import DeleteLotDialog from "./lot/DeleteLotDialog.vue";
import RemarksTooltip from "~/components/custom/RemarksTooltip.vue";

const { blockData } = defineProps<{
  blockData: Block & { lots?: Lot[] };
}>();

const emit = defineEmits(["refresh"]);
const { toast } = useToast();
const toPHP = useCurrencyFormatter();
const loading = ref<boolean>(false);
const dialogState = ref<boolean>(false);
const block = ref<typeof blockData>(blockData);
const lots = ref<Lot[]>([]);

let formSchema = generateTypedSchema();
const columnHelper = createColumnHelper<Lot>();

onMounted(() => {
  handleGetBlock();
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
        () => ["Lot Name", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => h("div", { class: "px-4" }, row.getValue("name")),
  }),
  columnHelper.accessor("lotType", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Lot Type", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => h("div", { class: "px-4" }, row.getValue("lotType")),
  }),
  columnHelper.accessor("price", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Price", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) =>
      h("div", { class: "px-4" }, toPHP.value.format(row.getValue("price"))),
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
        remarks,
      });
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
  columnHelper.accessor("createdAt", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Created At", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => {
      return h(
        "div",
        { class: "px-4" },
        useDateFormat(row.getValue("createdAt"), "DD MMM YYYY").value
      );
    },
  }),
  columnHelper.display({
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const lot = row.original;

      const actions = [];

      actions.push(
        h(EditLotDialog, { lot, onRefresh: () => handleGetBlock() })
      );

      actions.push(
        h(DeleteLotDialog, {
          lot,
          onRefresh: () => handleGetBlock(),
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
  data: lots,
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

function handleOpenDialog(state: boolean) {
  dialogState.value = state;
  if (state) {
    formSchema = generateTypedSchema();
  }
}

function generateTypedSchema() {
  return toTypedSchema(
    z.object({
      name: z
        .string()
        .min(1, { message: "Please enter a block name" })
        .default(block.value.name),
    })
  );
}

async function handleGetBlock() {
  const response: any = await $fetch(`/api/blocks/${block.value.id}`);
  block.value = response.data;
  lots.value = block.value.lots as Lot[];
  formSchema = generateTypedSchema();
}

async function handleUpdateBlock(values: any) {
  loading.value = true;
  try {
    const response: any = await $fetch(`/api/blocks/${block.value.id}`, {
      method: "PUT",
      body: { ...values },
    });
    toast({
      title: "Success",
      description: response.message,
      variant: "success",
    });
    handleGetBlock();
  } catch (error: any) {
    console.log(error.response);
    toast({
      title: "Error",
      description: "Something went wrong.",
      variant: "destructive",
    });
  }
  loading.value = false;
}
</script>

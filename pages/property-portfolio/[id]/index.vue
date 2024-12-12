<template>
  <NuxtLayout :breadcrumbs="breadcrumbs">
    <h1 class="mb-2 text-2xl font-semibold">{{ property?.name }}</h1>
    <p class="mb-4 text-muted-foreground">
      Below are the details and blocks of this property.
    </p>
    <div class="grid grid-cols-1 gap-4">
      <Form
        v-if="property"
        :validation-schema="formSchema"
        :initial-values="property"
        @submit="handleUpdateProperty"
      >
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center justify-between">
              <p class="text-base font-semibold text-blue-600">
                Property Information
              </p>
              <Button type="submit" :disabled="loading">
                <LoaderCircle
                  v-if="loading"
                  class="mr-2 h-4 w-4 animate-spin"
                />
                {{ loading ? "Saving Changes..." : "Save Changes" }}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-4 gap-4">
              <FormField v-slot="{ componentField }" name="name">
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      v-bind="componentField"
                      :default-value="property.name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="fullAddress">
                <FormItem>
                  <FormLabel>Full Address</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      v-bind="componentField"
                      :default-value="property.fullAddress"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField name="createdAt">
                <FormItem>
                  <FormLabel>Created At</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      :default-value="
                        useDateFormat(property.createdAt, 'DD MMM YYYY').value
                      "
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField name="createdBy">
                <FormItem>
                  <FormLabel>Created By</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      :default-value="property.createdBy"
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
          </CardContent>
        </Card>
      </Form>
      <div
        class="flex flex-col items-end justify-between gap-2 lg:flex-row lg:items-center"
      >
        <p class="font-semibold text-blue-600">Blocks</p>
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
          <AddBlockDialog
            v-if="property"
            :property-id="property.id"
            @refresh="handleGetProperty"
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
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import {
  Settings2,
  Plus,
  ArrowUpDown,
  LoaderCircle,
  Trash,
  Pencil,
} from "lucide-vue-next";
import AddBlockDialog from "~/components/property-portfolio/block/AddBlockDialog.vue";
import DeleteBlockDialog from "~/components/property-portfolio/block/DeleteBlockDialog.vue";
import { valueUpdater } from "~/lib/utils";
import { useDateFormat } from "@vueuse/core";
import { useToast } from "@/components/ui/toast/use-toast";

import type { Block, Property } from "~/db/schema";
import EditBlockDialog from "~/components/property-portfolio/block/EditBlockDialog.vue";
import type { BreadcrumbType } from "~/lib/types";

useHead({
  title: "Property Porfolio",
});

const breadcrumbs = ref<BreadcrumbType[]>([
  {
    label: "Property Portfolio",
    routeName: "Property Portfolio",
  },
]);

const { params } = useRoute();
const { id } = params;
const { toast } = useToast();

const property = ref<Property>();

const blocks = ref<Block[]>([]);
const loading = ref<boolean>(false);

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, { message: "Please enter a property name" }),
    fullAddress: z.string().min(1, { message: "Please enter an address" }),
  })
);

const columnHelper = createColumnHelper<Block>();

const columns = [
  columnHelper.accessor("name", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Block Name", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => h("div", { class: "px-4" }, row.getValue("name")),
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
      const block = row.original;

      const actions = [];

      actions.push(
        h(EditBlockDialog, {
          blockData: block,
          onRefresh: () => handleGetProperty(),
        })
      );

      actions.push(
        h(DeleteBlockDialog, {
          block,
          onRefresh: () => handleGetProperty(),
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
  data: blocks,
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

onMounted(async () => handleGetProperty());

async function handleGetProperty() {
  loading.value = true;
  try {
    const data = await $fetch(`/api/properties/${id}`);
    property.value = data as any;
    blocks.value = property.value?.blocks || [];
    breadcrumbs.value.push({
      label: property.value?.name || "",
      routeName: "#",
    });
  } catch (error) {
    console.log(error);
  }
  loading.value = false;
}

async function handleUpdateProperty(values: any) {
  loading.value = true;
  try {
    const response: any = await $fetch(
      `/api/properties/${property.value?.id}`,
      {
        method: "PUT",
        body: { ...values },
      }
    );
    toast({
      title: "Success",
      description: response.message,
      variant: "success",
    });
  } catch (error) {
    console.log(error);
    toast({
      title: "Error",
      description: "Something went wrong",
      variant: "destructive",
    });
  }
  loading.value = false;
}
</script>

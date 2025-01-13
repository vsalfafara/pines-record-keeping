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
              <FormField name="noOfBlocks">
                <FormItem>
                  <FormLabel>Total # of Blocks</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      :default-value="property.totalNoOfBlocks"
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField name="takenLots">
                <FormItem>
                  <FormLabel>Total Taken Lots</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      :default-value="property.totalTakenLots"
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
              <FormField name="noOfLots">
                <FormItem>
                  <FormLabel>Total # of Lots</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      :default-value="property.totalNoOfLots"
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField name="totalAvailableLots">
                <FormItem>
                  <FormLabel>Total Available Lots</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      :default-value="property.totalAvailableLots"
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField name="createdOn">
                <FormItem>
                  <FormLabel>Created On</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      :default-value="
                        useDateFormat(property.createdOn, 'DD MMM YYYY').value
                      "
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
      <p class="font-semibold text-blue-600">Blocks</p>
      <DataTable
        :data="blocks"
        :columns
        :loading
        table-size="max-h-[calc(100vh-550px)]"
      >
        <template #buttons>
          <AddBlockDialog
            v-if="property"
            :property-id="property.id"
            @refresh="handleGetProperty"
          />
        </template>
      </DataTable>
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
import DataTable from "~/components/custom/DataTable.vue";

const breadcrumbs = ref<BreadcrumbType[]>([
  {
    label: "Property Portfolio",
    routeName: "Property Portfolio",
  },
]);

type CustomBlock = Block & {
  noOfLots: number;
  takenLots: number;
  availableLots: number;
};

const { params } = useRoute();
const { id } = params;
const { toast } = useToast();

type CustomProperty = Property & {
  totalNoOfBlocks: number;
  totalNoOfLots: number;
  totalTakenLots: number;
  totalAvailableLots: number;
};

const property = ref<CustomProperty>();

const blocks = ref<CustomBlock[]>([]);
const loading = ref<boolean>(false);

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, { message: "Please enter a property name" }),
    fullAddress: z.string().min(1, { message: "Please enter an address" }),
  })
);

const columnHelper = createColumnHelper<CustomBlock>();

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
        () => ["Created On", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
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
      const block: any = row.original;

      const actions = [];

      actions.push(
        h(EditBlockDialog, {
          blockData: block,
          onRefresh: () => handleGetProperty(),
        })
      );

      const hasTakenLot = block.lots.find((lot: any) => lot.taken);

      if (!hasTakenLot) {
        actions.push(
          h(DeleteBlockDialog, {
            block,
            onRefresh: () => handleGetProperty(),
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
    const data: any = await $fetch(`/api/properties/${id}`);
    property.value = data as any;
    blocks.value = data.blocks || [];
    if (breadcrumbs.value.length == 2) {
      breadcrumbs.value[1].label = property.value?.name || "";
    } else {
      breadcrumbs.value.push({
        label: property.value?.name || "",
        routeName: "#",
      });
    }
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
    handleGetProperty();
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

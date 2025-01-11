<template>
  <NuxtLayout :breadcrumbs="breadcrumbs">
    <h1 class="mb-2 text-2xl font-semibold">
      {{ `${client?.firstName} ${client?.lastName}` }}
    </h1>
    <p class="mb-4 text-muted-foreground">
      Below are details of the client and their payment records.
    </p>
    <div class="grid grid-cols-1 gap-4">
      <Form
        v-if="client"
        :validation-schema="formSchema"
        :initial-values="client"
        @submit="handleUpdateClient"
      >
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center justify-between">
              <p class="text-base font-semibold text-blue-600">
                Client Information
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
            <div class="grid grid-cols-5 gap-4">
              <div class="grid gap-4">
                <FormField v-slot="{ componentField }" name="firstName">
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        v-bind="componentField"
                        :default-value="client.firstName"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="lastName">
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        v-bind="componentField"
                        :default-value="client.lastName"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
              <FormField v-slot="{ componentField }" name="fullAddress">
                <FormItem>
                  <FormLabel>Full Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Input full address (unit/lot no, barangay, city, country)"
                      class="col-span-2 resize-none"
                      v-bind="componentField"
                      :default-value="client.fullAddress"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <div class="grid gap-4">
                <FormField v-slot="{ componentField }" name="birthDate">
                  <FormItem>
                    <FormLabel>Birthday</FormLabel>
                    <FormControl>
                      <VueTailwindDatepicker
                        v-bind="componentField"
                        placeholder="Select Date"
                        :formatter="{
                          date: 'YYYY-MM-DD',
                          month: 'MMMM',
                        }"
                        as-single
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="email">
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        :default-value="client.email"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
              <div class="grid gap-4">
                <FormField v-slot="{ componentField }" name="mobileNumber">
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        :default-value="client.mobileNumber"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="landlineNumber">
                  <FormItem>
                    <FormLabel>Landline Number</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        :default-value="client.landlineNumber || undefined"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
              <div class="grid gap-4">
                <FormField name="createdAt">
                  <FormItem>
                    <FormLabel>Created At</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        :default-value="
                          useDateFormat(client.createdAt, 'DD MMM YYYY').value
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
                        :default-value="client.createdBy"
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
            </div>
          </CardContent>
        </Card>
      </Form>
      <div
        class="flex flex-col items-end justify-between gap-2 lg:flex-row lg:items-center"
      >
        <p class="font-semibold text-blue-600">Property Information</p>
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
          <AddClientLotDialog
            v-if="client"
            :client-id="client.id"
            @refresh="handleGetClient"
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
import * as z from "zod";
import {
  Settings2,
  Plus,
  ArrowUpDown,
  LoaderCircle,
  Trash,
  Pencil,
} from "lucide-vue-next";
import { valueUpdater } from "~/lib/utils";
import { useDateFormat } from "@vueuse/core";
import { useToast } from "@/components/ui/toast/use-toast";
import { toTypedSchema } from "@vee-validate/zod";
import AddClientLotDialog from "@/components/client-records/client-lot/AddClientLotDialog.vue";
import EditClientLotDialog from "@/components/client-records/client-lot/EditClientLotDialog.vue";

import type { Client, ClientLot } from "~/db/schema";
import type { BreadcrumbType } from "~/lib/types";

useHead({
  title: "Property Porfolio",
});

const breadcrumbs = ref<BreadcrumbType[]>([
  {
    label: "Client Records",
    routeName: "Client Records",
  },
]);

const { params } = useRoute();
const { id } = params;
const { toast } = useToast();

const client = ref<Client>();

const clientLots = ref<ClientLot[]>([]);
const loading = ref<boolean>(false);

const formSchema = toTypedSchema(
  z.object({
    firstName: z.string().min(1, { message: "Please enter a first name" }),
    lastName: z.string().min(1, { message: "Please enter a last name" }),
    fullAddress: z.string().min(1, { message: "Please enter an address" }),
    birthDate: z.string({ message: "Please enter a birth date" }),
    email: z.string().min(1, { message: "Please enter an email address" }),
    mobileNumber: z
      .string()
      .min(1, { message: "Please enter a mobile number" }),
    landlineNumber: z.string().or(z.null()).optional(),
  })
);

const columnHelper = createColumnHelper<ClientLot>();

const columns = [
  columnHelper.accessor("property.name", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Property Name", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => h("div", { class: "px-4" }, row.original.property.name),
  }),
  columnHelper.accessor("block.name", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Block", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => h("div", { class: "px-4" }, row.original.block.name),
  }),
  columnHelper.accessor("lot.name", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Lot No.", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => h("div", { class: "px-4" }, row.original.lot.name),
  }),
  columnHelper.accessor("terms", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Terms", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => h("div", { class: "px-4" }, row.getValue("terms")),
  }),
  columnHelper.accessor("discount", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Discount", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => h("div", { class: "px-4" }, row.getValue("discount")),
  }),
  columnHelper.accessor("lot.price", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Lot Price", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => h("div", { class: "px-4" }, row.original.lot.price),
  }),
  columnHelper.accessor("actualPrice", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Actual Price", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => h("div", { class: "px-4" }, row.getValue("actualPrice")),
  }),
  columnHelper.accessor("balance", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Balance", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => h("div", { class: "px-4" }, row.getValue("balance")),
  }),
  columnHelper.accessor("agent", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Agent", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => h("div", { class: "px-4" }, row.getValue("agent")),
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
      const clientLot = row.original;

      const actions = [];

      actions.push(
        h(EditClientLotDialog, {
          clientLotData: clientLot,
          onRefresh: () => {},
        })
      );

      // actions.push(
      //   h(EditBlockDialog, {
      //     blockData: block,
      //     onRefresh: () => handleGetClient(),
      //   })
      // );

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
  data: clientLots,
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

onMounted(async () => handleGetClient());

async function handleGetClient() {
  loading.value = true;
  try {
    const data = await $fetch(`/api/clients/${id}`);
    client.value = data as any;
    clientLots.value = client.value?.clientLots || [];

    if (breadcrumbs.value.length == 2) {
      breadcrumbs.value[1].label =
        `${client.value?.firstName} ${client.value?.lastName}` || "";
    } else {
      breadcrumbs.value.push({
        label: `${client.value?.firstName} ${client.value?.lastName}` || "",
        routeName: "#",
      });
    }
  } catch (error) {
    console.log(error);
  }
  loading.value = false;
}

async function handleUpdateClient(values: any) {
  loading.value = true;
  try {
    const response: any = await $fetch(`/api/clients/${client.value?.id}`, {
      method: "PUT",
      body: { ...values },
    });
    handleGetClient();
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

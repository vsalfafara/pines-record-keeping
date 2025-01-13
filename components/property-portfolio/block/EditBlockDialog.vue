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
        <div class="grid gap-4">
          <form
            id="editBlockForm"
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
          <p class="font-semibold text-blue-600">Lots</p>
          <DataTable
            :data="lots"
            :columns
            :loading
            table-size="max-h-[calc(100vh-350px)]"
          >
            <template #buttons>
              <AddLotDialog
                v-if="block"
                :block-id="block.id"
                @refresh="handleGetBlock"
              />
            </template>
          </DataTable>
        </div>
      </SheetContent>
    </Sheet>
  </Form>
</template>

<script setup lang="ts">
import { Button } from "~/components/ui/button";
import { Pencil, LoaderCircle, ArrowUpDown } from "lucide-vue-next";
import { toTypedSchema } from "@vee-validate/zod";
import AddLotDialog from "./lot/AddLotDialog.vue";
import * as z from "zod";
import { useToast } from "@/components/ui/toast/use-toast";
import { createColumnHelper } from "@tanstack/vue-table";
import { useDateFormat } from "@vueuse/core";
import type { Block, Lot } from "~/db/schema";
import EditLotDialog from "./lot/EditLotDialog.vue";
import DeleteLotDialog from "./lot/DeleteLotDialog.vue";
import RemarksTooltip from "~/components/custom/RemarksTooltip.vue";
import DataTable from "~/components/custom/DataTable.vue";

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
      const lot = row.original;

      const actions = [];

      actions.push(
        h(EditLotDialog, { lot, onRefresh: () => handleGetBlock() })
      );

      if (!lot.taken) {
        actions.push(
          h(DeleteLotDialog, {
            lot,
            onRefresh: () => handleGetBlock(),
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

<template>
  <DataTable :data="expenses" :columns :loading fixed-height>
    <template #buttons>
      <AddExpenseDialog :client-lot="clientLot" @refresh="handleGetExpenses" />
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { createColumnHelper } from "@tanstack/vue-table";
import { ArrowUpDown } from "lucide-vue-next";
import type { ClientLot, Expense } from "~/db/schema";
import { useDateFormat } from "@vueuse/core";
import RemarksTooltip from "~/components/custom/RemarksTooltip.vue";
import Receipt from "./Receipt.vue";
import { useCurrencyFormatter } from "#build/imports";
import AddExpenseDialog from "./AddExpenseDialog.vue";
import DataTable from "~/components/custom/DataTable.vue";

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

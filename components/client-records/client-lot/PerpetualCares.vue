<template>
  <DataTable :data="perpetualCares" :columns :loading fixed-height />
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { createColumnHelper } from "@tanstack/vue-table";
import { ArrowUpDown } from "lucide-vue-next";
import type { ClientLot, PerpetualCare } from "~/db/schema";
import { useDateFormat } from "@vueuse/core";
import { useCurrencyFormatter } from "#build/imports";
import { Badge } from "~/components/ui/badge";
import DataTable from "~/components/custom/DataTable.vue";

const { clientLot } = defineProps<{ clientLot: ClientLot }>();

type CustomPerpetualCare = PerpetualCare & { status: string; paid: number };

const toPHP = useCurrencyFormatter();
const loading = ref<boolean>(false);
const perpetualCares = ref<CustomPerpetualCare[]>([]);

const columnHelper = createColumnHelper<CustomPerpetualCare>();

onMounted(() => handleGetInterments());

const columns = [
  columnHelper.accessor("status", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Status", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => {
      const status: string = row.getValue("status");
      const variant = status === "Paid" ? "success" : "pending";
      return h(Badge, { variant }, status);
    },
  }),
  columnHelper.accessor("installmentYears", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Installment Years", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) =>
      h("div", { class: "px-4" }, row.getValue("installmentYears")),
  }),
  columnHelper.accessor("dueDate", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Due Date", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) =>
      h(
        "div",
        { class: "px-4" },
        useDateFormat(row.getValue("dueDate"), "DD MMM YYYY").value
      ),
  }),
  columnHelper.accessor("paymentDue", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Payment Due", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) =>
      h(
        "div",
        { class: "px-4" },
        toPHP.value.format(row.getValue("paymentDue"))
      ),
  }),

  columnHelper.accessor("paid", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Paid", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) =>
      h("div", { class: "px-4" }, toPHP.value.format(row.getValue("paid"))),
  }),
];

async function handleGetInterments() {
  loading.value = true;
  try {
    const response: any = await $fetch(`/api/perpetual-cares/${clientLot.id}`);
    perpetualCares.value = response;
  } catch (error) {
    console.log(error);
  }
  loading.value = false;
}
</script>

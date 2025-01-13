<template>
  <DataTable
    :data="interments"
    :columns
    :loading
    :initiallyHiddenColumns
    table-size="max-h-[calc(100vh-500px)]"
  />
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import type { VisibilityState } from "@tanstack/vue-table";
import { createColumnHelper } from "@tanstack/vue-table";
import { ArrowUpDown } from "lucide-vue-next";
import type { ClientLot, Interment } from "~/db/schema";
import { useDateFormat } from "@vueuse/core";
import EditIntermentDialog from "./EditIntermentDialog.vue";
import DataTable from "~/components/custom/DataTable.vue";

const { clientLot } = defineProps<{ clientLot: ClientLot }>();

const loading = ref<boolean>(false);
const interments = ref<Interment[]>([]);

const columnHelper = createColumnHelper<Interment>();
const initiallyHiddenColumns = ref<VisibilityState>({
  deceasedName: false,
  deceasedBorn: false,
  deceasedDied: false,
  remainsName: false,
  remainsBorn: false,
  remainsDied: false,
  contractorMobileNumber: false,
});

onMounted(() => {
  handleGetInterments();
});

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
  columnHelper.accessor("contractorMobileNumber", {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => [
          "Contractor Mobile Number",
          h(ArrowUpDown, { class: "ml-2 h-4 w-4" }),
        ]
      );
    },
    cell: ({ row }) =>
      h("div", { class: "px-4" }, row.getValue("contractorMobileNumber")),
  }),
  columnHelper.display({
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const interment = row.original;
      const actions = [];

      const format = "MM-DD-YYYY";
      if (interment.deceasedBorn)
        interment.deceasedBorn = useDateFormat(
          interment.deceasedBorn,
          format
        ).value;
      if (interment.deceasedDied)
        interment.deceasedDied = useDateFormat(
          interment.deceasedDied,
          format
        ).value;
      if (interment.remainsBorn)
        interment.remainsBorn = useDateFormat(
          interment.remainsBorn,
          format
        ).value;
      if (interment.remainsDied)
        interment.remainsDied = useDateFormat(
          interment.remainsDied,
          format
        ).value;
      if (interment.intermentDate)
        interment.intermentDate = useDateFormat(
          interment.intermentDate,
          format
        ).value;

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

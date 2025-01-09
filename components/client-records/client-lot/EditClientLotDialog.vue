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
            <div class="flex gap-2">
              <h3 class="mb-2 text-xl font-semibold text-slate-900">
                {{ clientLotData.property.name }} |
                {{ clientLotData.block.name }} | {{ clientLotData.lot.name }}
              </h3>
            </div>
          </SheetDescription>
        </SheetHeader>
        <div class="mb-4 grid grid-cols-6 gap-2">
          <div>
            <Label>Property Name</Label>
            <Input
              type="text"
              class="mt-1"
              :default-value="clientLotData.property.name"
              disabled
            />
          </div>
          <div>
            <Label>Block</Label>
            <Input
              type="text"
              class="mt-1"
              :default-value="clientLotData.block.name"
              disabled
            />
          </div>
          <div>
            <Label>Lot</Label>
            <Input
              type="text"
              class="mt-1"
              :default-value="clientLotData.lot.name"
              disabled
            />
          </div>
          <div>
            <Label>Reservation</Label>
            <Input
              type="text"
              class="mt-1"
              :default-value="clientLotData.reservation || undefined"
              disabled
            />
          </div>
          <div>
            <Label>Payment Type</Label>
            <Input
              type="text"
              class="mt-1"
              :default-value="clientLotData.paymentType || undefined"
              disabled
            />
          </div>
          <div>
            <Label>Payment Plan</Label>
            <Input
              type="text"
              class="mt-1"
              :default-value="clientLotData.paymentPlan || undefined"
              disabled
            />
          </div>
          <div>
            <Label>In need</Label>
            <Input
              type="text"
              class="mt-1"
              :default-value="clientLotData.inNeed || undefined"
              disabled
            />
          </div>
          <div>
            <Label>Terms</Label>
            <Input
              type="text"
              class="mt-1"
              :default-value="clientLotData.terms || undefined"
              disabled
            />
          </div>
          <div>
            <Label>Downpayment</Label>
            <Input
              type="text"
              class="mt-1"
              :default-value="clientLotData.downpayment || undefined"
              disabled
            />
          </div>
          <div>
            <Label>Discount</Label>
            <Input
              type="text"
              class="mt-1"
              :default-value="clientLotData.discount || undefined"
              disabled
            />
          </div>
          <div>
            <Label>Month to Pay</Label>
            <Input
              type="text"
              class="mt-1"
              :default-value="clientLotData.monthsToPay || undefined"
              disabled
            />
          </div>
          <div>
            <Label>Monthly</Label>
            <Input
              type="text"
              class="mt-1"
              :default-value="clientLotData.monthly || undefined"
              disabled
            />
          </div>
          <div>
            <Label>Total Interest</Label>
            <Input
              type="text"
              class="mt-1"
              :default-value="clientLotData.totalInterest || undefined"
              disabled
            />
          </div>
          <div>
            <Label>Lot Price</Label>
            <Input
              type="text"
              class="mt-1"
              :default-value="clientLotData.lot.price"
              disabled
            />
          </div>
          <div>
            <Label>Actual Price</Label>
            <Input
              type="text"
              class="mt-1"
              :default-value="clientLotData.actualPrice || undefined"
              disabled
            />
          </div>
          <div>
            <Label>Agent</Label>
            <Input
              type="text"
              class="mt-1"
              :default-value="clientLotData.agent || undefined"
              disabled
            />
          </div>
          <div>
            <Label>Created By</Label>
            <Input
              type="text"
              class="mt-1"
              :default-value="clientLotData.createdBy || undefined"
              disabled
            />
          </div>
          <div>
            <Label>Created On</Label>
            <Input
              type="text"
              class="mt-1"
              :default-value="
                useDateFormat(clientLotData.createdAt, 'DD MMM YYYY').value
              "
              disabled
            />
          </div>
        </div>
        <Tabs default-value="account" @update:model-value="handleChangeTab">
          <div class="flex justify-between">
            <TabsList>
              <TabsTrigger value="payment-plan"> Payment Plan </TabsTrigger>
              <TabsTrigger value="interment"> Interment </TabsTrigger>
              <TabsTrigger value="perpetual-care"> Perpetual Care </TabsTrigger>
              <TabsTrigger value="invoices"> Invoices </TabsTrigger>
              <TabsTrigger value="expenses"> Expenses </TabsTrigger>
            </TabsList>
            <div class="flex gap-2">
              <Button v-if="tab === 'invoices'"> <Plus /> Add Invoice </Button>
            </div>
          </div>
          <TabsContent value="payment-plan"> <p>No content yet</p></TabsContent>
          <TabsContent value="interment"> </TabsContent>
          <TabsContent value="perpetual-care">
            <p>No content yet</p>
          </TabsContent>
          <TabsContent value="invoices">
            <p>No content yet</p>
          </TabsContent>
          <TabsContent value="expenses">
            <p>No content yet</p>
          </TabsContent>
        </Tabs>
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
import { Pencil, Plus } from "lucide-vue-next";
import { toTypedSchema } from "@vee-validate/zod";
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
import type { ClientLot } from "~/db/schema";

const { clientLotData } = defineProps<{
  clientLotData: ClientLot;
}>();

type Tab =
  | "payment-plan"
  | "interment"
  | "perpetual-care"
  | "invoices"
  | "expenses";

const emit = defineEmits(["refresh"]);
const { toast } = useToast();
const toPHP = useCurrencyFormatter();
const loading = ref<boolean>(false);
const dialogState = ref<boolean>(false);
const clientLot = ref<typeof clientLotData>(clientLotData);
const tab = ref<Tab | string | number>("payment-plan");

let formSchema = generateTypedSchema();

onMounted(() => {
  handleGetClientLot();
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
      name: z.string().min(1, { message: "Please enter a block name" }),
      // .default(block.value.name),
    })
  );
}

function handleChangeTab(tabName: Tab | string | number) {
  tab.value = tabName;
}

async function handleGetClientLot() {
  // const response: any = await $fetch(`/api/blocks/${block.value.id}`);
  // block.value = response.data;
  // lots.value = block.value.lots as Lot[];
  // formSchema = generateTypedSchema();
}

async function handleUpdateClientLot(values: any) {
  // loading.value = true;
  // try {
  //   const response: any = await $fetch(`/api/blocks/${block.value.id}`, {
  //     method: "PUT",
  //     body: { ...values },
  //   });
  //   toast({
  //     title: "Success",
  //     description: response.message,
  //     variant: "success",
  //   });
  //   handleGetBlock();
  // } catch (error: any) {
  //   console.log(error.response);
  //   toast({
  //     title: "Error",
  //     description: "Something went wrong.",
  //     variant: "destructive",
  //   });
  // }
  // loading.value = false;
}
</script>

<template>
  <Form
    v-slot="{ handleSubmit, values, setFieldValue, resetForm }"
    as=""
    :validation-schema="formSchema"
    :initial-values="{}"
  >
    <Dialog
      :open="dialogState"
      @update:open="
        (state) => {
          dialogState = state;
          resetForm();
        }
      "
    >
      <DialogTrigger as-child>
        <Button> <Plus /> Add Invoice </Button>
      </DialogTrigger>
      <DialogScrollContent>
        <DialogHeader>
          <DialogTitle
            ><Plus class="h-8 w-8 rounded-md bg-blue-50 p-2 text-blue-600"
          /></DialogTitle>
          <DialogDescription>
            <h3 class="mb-2 text-xl font-semibold text-slate-900">
              Add Invoice
            </h3>
            <p>Fill out the form</p>
          </DialogDescription>
        </DialogHeader>
        <form
          id="clientForm"
          class="grid grid-cols-2 gap-2"
          @submit="handleSubmit($event, handleCreateInvoice)"
        >
          <FormField v-slot="{ componentField }" name="purpose">
            <FormItem>
              <FormLabel>Purpose *</FormLabel>
              <Select
                v-bind="componentField"
                @update:model-value="
                  (v) => {
                    if (v === 'Perpetual Care') {
                      setFieldValue('payment', clientLot.perpetualCarePrice);
                    } else {
                      setFieldValue('payment', undefined, false);
                    }
                  }
                "
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a purpose" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="(purpose, index) in purposes"
                      :key="index"
                      :value="purpose"
                    >
                      {{ purpose }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="payment">
            <FormItem>
              <FormLabel>Payment *</FormLabel>
              <FormControl>
                <div class="relative flex items-center">
                  <Input
                    class="pl-6"
                    type="number"
                    placeholder="0.00"
                    default-value="0"
                    v-bind="componentField"
                    :disabled="values.purpose === 'Perpetual Care'"
                  />
                  <span class="absolute pl-3"> ₱ </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="modeOfPayment">
            <FormItem>
              <FormLabel>Mode Of Payment *</FormLabel>
              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a mode of payment" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="mode in modeOfPayment"
                      :key="mode"
                      :value="mode"
                    >
                      {{ mode }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="dateOfPayment">
            <FormItem>
              <FormLabel>Date of Payment *</FormLabel>
              <FormControl>
                <VueTailwindDatepicker
                  v-bind="componentField"
                  placeholder="Select Date"
                  :formatter="{
                    date: 'MM-DD-YYYY',
                    month: 'MMMM',
                  }"
                  as-single
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="receipt">
            <FormItem class="col-span-2">
              <FormLabel>Receipt *</FormLabel>
              <FormControl>
                <Card
                  class="flex h-[150px] cursor-pointer flex-col items-center justify-center gap-1 p-4"
                  @click="
                    () => {
                      open();
                      onChange((file) => {
                        if (file) {
                          setFieldValue('receipt', file[0]);
                        }
                      });
                    }
                  "
                >
                  <CloudUpload
                    class="h-8 w-8 rounded-full bg-blue-50 p-2 text-blue-500"
                  />
                  <template v-if="!values.receipt">
                    <p class="text-xs">
                      <span class="text-blue-500">Click to upload</span>
                      (5mb)
                    </p>
                    <p class="text-xs">PNG, JPG, JPEG files only</p>
                  </template>
                  <template v-else>
                    <p class="text-xs">
                      <span class="text-blue-500">To upload:</span>
                      {{ values.receipt.name }}
                    </p>
                  </template>
                </Card>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="remarks">
            <FormItem class="col-span-2">
              <FormLabel>Remarks</FormLabel>
              <FormControl>
                <Textarea
                  class="resize-none"
                  placeholder="Enter a comment"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </form>
        <DialogFooter>
          <DialogClose as-child>
            <Button type="button" variant="outline"> Cancel </Button>
          </DialogClose>
          <Button type="submit" form="clientForm" :disabled="loading">
            <LoaderCircle v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
            {{ loading ? "Creating invoice..." : "Confirm" }}
          </Button>
        </DialogFooter>
      </DialogScrollContent>
    </Dialog>
  </Form>
</template>

<script setup lang="ts">
import { Plus, LoaderCircle } from "lucide-vue-next";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/toast/use-toast";
import type { ClientLot } from "~/db/schema";
import { CloudUpload } from "lucide-vue-next";
import { useFileDialog } from "@vueuse/core";

const { clientLot } = defineProps<{ clientLot: ClientLot }>();

const { open, onChange } = useFileDialog({
  accept: "image/*",
});

const emit = defineEmits(["refresh"]);
const { toast } = useToast();
const loading = ref<boolean>(false);
const dialogState = ref<boolean>(false);

const purposes = ref<string[]>(["Interment", "Payment Plan", "Perpetual Care"]);

const paymentTypes = ref<string[]>([
  // "Reservation",
  // "Monthly Terms",
  "Full Payment",
]);

const paymentPlans = ref<string[]>([
  "Downpayment and Installment (with interest)",
  "Downpayment and Installment (without interest)",
  "Installment only (with interest)",
]);

const modeOfPayment = ref<string[]>([
  "Bank Transfer",
  "Cash Payment",
  "Check Payment",
]);
let formSchema = toTypedSchema(
  z.object({
    purpose: z.enum(["Interment", "Payment Plan", "Perpetual Care"], {
      message: "Please select a purpose",
    }),
    payment: z.number({ message: "Please enter an amount" }),
    modeOfPayment: z.enum(["Bank Transfer", "Cash Payment", "Check Payment"], {
      message: "Please select a mode of payment",
    }),
    dateOfPayment: z.array(z.string(), {
      message: "Please enter a birth date",
    }),
    receipt: z.instanceof(File, { message: "Please upload a receipt" }),
    remarks: z.string().optional(),
  })
);
async function handleUploadReceipt(receipt: File) {
  try {
    const config = useRuntimeConfig();
    const formData = new FormData();
    formData.append("api_key", config.public.cloudinary.apiKey);
    formData.append("file", receipt);
    formData.append("upload_preset", config.public.cloudinary.uploadPreset);
    const response: any = await $fetch(
      `https://api.cloudinary.com/v1_1/${config.public.cloudinary.cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    return response.public_id;
  } catch (error) {
    console.log(error);
  }
}

async function handleCreateInvoice(values: any) {
  loading.value = true;
  try {
    values.dateOfPayment = values.dateOfPayment[0];
    const { user } = useUserSession();
    const sessionData = { id: null, ...user.value };
    const receipt = await handleUploadReceipt(values.receipt);
    const body = {
      clientLotId: clientLot.id,
      purpose: values.purpose,
      payment: values.payment,
      dateOfPayment: values.dateOfPayment,
      receipt,
      remarks: values.remarks,
      createdBy: `${sessionData.firstName} ${sessionData.lastName}`,
    };
    const response: any = await $fetch("/api/invoices/create", {
      method: "POST",
      body,
    });
    if (values.purpose === "Interment") {
      await $fetch(`/api/interments/${clientLot.id}`, {
        method: "POST",
        body: {},
      });
    }
    toast({
      title: "Success",
      description: response.message,
      variant: "success",
    });
    emit("refresh");
    dialogState.value = false;
  } catch (error: any) {
    console.log(error);
    toast({
      title: "Error",
      description: "Something went wrong.",
      variant: "destructive",
    });
  }
  loading.value = false;
}
</script>

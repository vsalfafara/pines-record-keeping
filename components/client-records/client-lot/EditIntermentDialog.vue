<template>
  <Form
    v-slot="{ handleSubmit, resetForm }"
    as=""
    :validation-schema="formSchema"
    :initial-values="{
      ...interment,
      deceasedBorn: [interment.deceasedBorn],
      deceasedDied: [interment.deceasedDied],
      remainsBorn: [interment.remainsBorn],
      remainsDied: [interment.remainsDied],
      intermentDate: [interment.intermentDate],
    }"
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
        <Button variant="outline" size="icon"> <Pencil /> </Button>
      </DialogTrigger>
      <DialogScrollContent>
        <DialogHeader>
          <DialogTitle
            ><Pencil class="h-8 w-8 rounded-md bg-blue-50 p-2 text-blue-600"
          /></DialogTitle>
          <DialogDescription>
            <h3 class="mb-2 text-xl font-semibold text-slate-900">
              Edit Interment
            </h3>
            <p>Fill out the form</p>
          </DialogDescription>
        </DialogHeader>
        <form
          id="clientForm"
          class="grid grid-cols-2 gap-2"
          @submit="handleSubmit($event, handleUpdateInterment)"
        >
          <FormField v-slot="{ componentField }" name="dig">
            <FormItem>
              <FormLabel>Dig #</FormLabel>
              <FormControl>
                <Input type="number" v-bind="componentField" disabled />
              </FormControl>
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="type">
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type of dig" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Flesh"> Flesh </SelectItem>
                    <SelectItem value="Bone"> Bone </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="deceasedName">
            <FormItem class="col-span-2">
              <FormLabel>Deceased Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter full name"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="deceasedBorn">
            <FormItem>
              <FormLabel>Deceased Born</FormLabel>
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
            </FormItem> </FormField
          ><FormField v-slot="{ componentField }" name="deceasedDied">
            <FormItem>
              <FormLabel>Deceased Died</FormLabel>
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
          <FormField v-slot="{ componentField }" name="remainsName">
            <FormItem class="col-span-2">
              <FormLabel>Remains Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter full name"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="remainsBorn">
            <FormItem>
              <FormLabel>Remains Born</FormLabel>
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
          <FormField v-slot="{ componentField }" name="remainsDied">
            <FormItem>
              <FormLabel>Remains Died</FormLabel>
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
          <FormField v-slot="{ componentField }" name="intermentDate">
            <FormItem>
              <FormLabel>Interment Date</FormLabel>
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
          <FormField v-slot="{ componentField }" name="intermentTime">
            <FormItem>
              <FormLabel>Interment Time</FormLabel>
              <FormControl>
                <VueTimePicker
                  placeholder="Select Time"
                  v-bind="componentField"
                  time-picker
                  :is-24="false"
                  model-type="hh:mm aaaaa'm'"
                >
                  <template #input-icon>
                    <Clock class="ml-2 h-4 w-4" />
                  </template>
                </VueTimePicker>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="contractorName">
            <FormItem>
              <FormLabel>Contractor Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter full name"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="contractorMobileNumber">
            <FormItem>
              <FormLabel>Contractor Mobile Number</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="09xx xxx xxxx"
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
            {{ loading ? "Updating interment..." : "Confirm" }}
          </Button>
        </DialogFooter>
      </DialogScrollContent>
    </Dialog>
  </Form>
</template>

<script setup lang="ts">
import { Plus, LoaderCircle, Pencil, Clock } from "lucide-vue-next";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/toast/use-toast";
import type { Interment } from "~/db/schema";
import { CloudUpload } from "lucide-vue-next";
import { useFileDialog } from "@vueuse/core";

const { interment } = defineProps<{ interment: Interment }>();

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
    dig: z.number().default(interment.dig || 0),
    type: z
      .enum(["Flesh", "Bone", "Perpetual Care"], {
        message: "Please select a type",
      })
      .optional()
      .nullable(),
    deceasedName: z
      .string()
      .default(interment.deceasedName || "")
      .optional()
      .nullable(),
    deceasedBorn: z.array(z.string().optional().nullable()),
    deceasedDied: z.array(z.string().optional().nullable()),
    remainsName: z
      .string()
      .default(interment.remainsName || "")
      .optional()
      .nullable(),
    remainsBorn: z.array(z.string().optional().nullable()),
    remainsDied: z.array(z.string().optional().nullable()),
    intermentDate: z.array(z.string().optional().nullable()),
    intermentTime: z.string().optional().nullable(),
    contractorName: z.string().optional().nullable(),
    contractorMobileNumber: z.string().optional().nullable(),
  })
);

async function handleUpdateInterment(values: any) {
  loading.value = true;
  try {
    const { user } = useUserSession();
    const sessionData = { id: null, ...user.value };
    let body = {
      ...values,
      deceasedBorn: values.deceasedBorn[0],
      deceasedDied: values.deceasedDied[0],
      remainsBorn: values.remainsBorn[0],
      remainsDied: values.remainsDied[0],
      intermentDate: values.intermentDate[0],
      lastModifiedBy: `${sessionData.firstName} ${sessionData.lastName}`,
    };
    const response: any = await $fetch(`/api/interments/${interment.id}`, {
      method: "PUT",
      body,
    });
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

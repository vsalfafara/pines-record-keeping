<template>
  <Form
    v-slot="{ handleSubmit, values, setFieldValue }"
    as=""
    :validation-schema="formSchema"
  >
    <Dialog :open="dialogState" @update:open="(state) => (dialogState = state)">
      <DialogTrigger as-child>
        <Button> <Plus /> Add Client </Button>
      </DialogTrigger>
      <DialogScrollContent class="sm:max-w-[620px]">
        <DialogHeader>
          <DialogTitle
            ><Plus class="h-8 w-8 rounded-md bg-blue-50 p-2 text-blue-600"
          /></DialogTitle>
          <DialogDescription>
            <h3 class="mb-2 text-xl font-semibold text-slate-900">
              Add Client
            </h3>
            <p>Fill out the form</p>
          </DialogDescription>
        </DialogHeader>
        <form
          id="clientForm"
          class="grid grid-cols-2 gap-2"
          @submit="handleSubmit($event, handleCreateClient)"
        >
          <p class="col-span-2 font-semibold text-blue-600">
            Client Information
          </p>
          <FormField v-slot="{ componentField }" name="firstName">
            <FormItem>
              <FormLabel>First Name *</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Input first name"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="lastName">
            <FormItem>
              <FormLabel>Last Name *</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Input last name"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="fullAddress">
            <FormItem class="col-span-2">
              <FormLabel>Full Address *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Input full address (unit/lot no, barangay, city, country)"
                  class="col-span-2"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="birthDate">
            <FormItem>
              <FormLabel>Birth Date *</FormLabel>
              <FormControl>
                <VueTailwindDatepicker
                  v-bind="componentField"
                  placeholder="Select Date"
                  :formatter="{
                    date: 'YYYY-MM-DD',
                    month: 'MMMM',
                  }"
                  as-single
                  overlay
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="sample@gmail.com"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="mobileNumber">
            <FormItem>
              <FormLabel>Mobile Number *</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="+63 000 000 0000"
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
                  placeholder="272 000 0000"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <p class="col-span-2 font-semibold text-blue-600">
            Property Information
          </p>
          <FormField v-slot="{ componentField }" name="propertyId">
            <FormItem class="col-span-2">
              <FormLabel>Property Name *</FormLabel>
              <Select
                v-bind="componentField"
                @update:model-value="
                  (value) => handleGetBlocks(parseInt(value))
                "
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a property" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="(property, index) in properties"
                      :key="index"
                      :value="property.id.toString()"
                    >
                      {{ property.name }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="blockId">
            <FormItem>
              <FormLabel>Block *</FormLabel>
              <Select
                v-bind="componentField"
                @update:model-value="(value) => handleGetLots(parseInt(value))"
                :disabled="!blocks.length"
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a block" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="(block, index) in blocks"
                      :key="index"
                      :value="block.id.toString()"
                    >
                      {{ block.name }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="lotId">
            <FormItem>
              <FormLabel>Lot No. *</FormLabel>
              <Select
                v-bind="componentField"
                :disabled="!lots.length"
                @update:model-value="
                  (value) => {
                    const lot = lots.find((lot) => lot.id === parseInt(value));
                    if (lot) setFieldValue('lotPrice', lot.price);
                  }
                "
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a lot" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="(lot, index) in lots"
                      :key="index"
                      :value="lot.id.toString()"
                    >
                      {{ lot.name }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="paymentType">
            <FormItem class="col-span-2">
              <FormLabel>Select Payment Type *</FormLabel>
              <FormControl>
                <RadioGroup
                  class="flex flex-col space-y-1"
                  v-bind="componentField"
                >
                  <FormItem
                    v-for="paymentType in paymentTypes"
                    :key="paymentType"
                    class="flex items-center gap-x-3 space-y-0"
                  >
                    <FormControl>
                      <RadioGroupItem :value="paymentType" />
                    </FormControl>
                    <FormLabel class="font-normal">
                      {{ paymentType }}
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <template v-if="values.paymentType === 'Reservation'">
            <FormField v-slot="{ componentField }" name="reservation">
              <FormItem>
                <FormLabel>Reservation Fee</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Input reservation fee"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="lotPrice">
              <FormItem>
                <FormLabel>Lot Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    :placeholder="values.lotPrice"
                    v-bind="componentField"
                    disabled
                  />
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
                    overlay
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
                            setFieldValue('receipt', file[0].name);
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
                        <span class="text-blue-500">Click to upload</span> (5mb)
                      </p>
                      <p class="text-xs">PNG, JPG, JPEG files only</p>
                    </template>
                    <template v-else>
                      <p class="text-xs">
                        <span class="text-blue-500">To upload:</span>
                        {{ values.receipt }}
                      </p>
                    </template>
                  </Card>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </template>
        </form>
        <DialogFooter>
          <DialogClose as-child>
            <Button type="button" variant="outline"> Cancel </Button>
          </DialogClose>
          <Button type="submit" form="clientForm" :disabled="loading">
            <LoaderCircle v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
            {{ loading ? "Creating client..." : "Confirm" }}
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
import type { Block, Lot, Property } from "~/db/schema";
import { CloudUpload } from "lucide-vue-next";
import { useFileDialog } from "@vueuse/core";

const { open, onChange } = useFileDialog({
  accept: "image/*",
});

const emit = defineEmits(["refresh"]);
const { toast } = useToast();
const loading = ref<boolean>(false);
const dialogState = ref<boolean>(false);
const properties = ref<Property[]>([]);
const blocks = ref<any>([]);
const lots = ref<Lot[]>([]);

const paymentTypes = ref<string[]>([
  "Reservation",
  "Monthly Terms",
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

const formSchema = toTypedSchema(
  z
    .object({
      firstName: z.string().min(1, { message: "Please enter a first name" }),
      lastName: z.string().min(1, { message: "Please enter a last name" }),
      fullAddress: z.string().min(1, { message: "Please enter an address" }),
      birthDate: z.array(z.string(), { message: "Please enter a birth date" }),
      email: z.string().min(1, { message: "Please enter an email address" }),
      mobileNumber: z
        .string()
        .min(1, { message: "Please enter a mobile number" }),
      landlineNumber: z
        .string()
        .min(1, { message: "Please enter a landline number" }),
      propertyId: z.string().min(1, { message: "Please select a property" }),
      blockId: z.string().min(1, { message: "Please select a block" }),
      lotId: z.string().min(1, { message: "Please select a lot" }),
      paymentType: z.enum(["Reservation", "Monthly Terms", "Full Payment"], {
        message: "Please select a payment type",
      }),
      paymentPlan: z
        .enum(
          [
            "Downpayment and Installment (with interest)",
            "Downpayment and Installment (without interest)",
            "Installment only (with interest)",
          ],
          { message: "Please select a payment plan" }
        )
        .optional(),
      reservation: z
        .number({ message: "Please enter a reservation fee" })
        .multipleOf(0.01, {
          message: "Reservation fee must be with decimal points of max 2",
        })
        .min(0, {
          message: "Please enter a reservation fee that is higher than 0",
        }),
      lotPrice: z.number().multipleOf(0.01),
      modeOfPayment: z.enum(
        ["Bank Transfer", "Cash Payment", "Check Payment"],
        { message: "Please select a mode of payment" }
      ),
      dateOfPayment: z.array(z.string(), {
        message: "Please enter a birth date",
      }),
      receipt: z.any({ message: "Please upload a receipt" }),
    })
    .refine((value) => {
      if (
        value.paymentType === "Reservation" &&
        value.reservation &&
        value.lotPrice &&
        value.modeOfPayment &&
        value.dateOfPayment &&
        value.receipt
      ) {
        return true;
      }
      return false;
    })
);

onMounted(async () => handleGetProperties());

async function handleGetProperties() {
  loading.value = true;
  try {
    const data = await $fetch(`/api/properties/all`);
    properties.value = data as any;
    blocks.value = [];
    lots.value = [];
  } catch (error) {
    console.log(error);
  }
  loading.value = false;
}

async function handleGetBlocks(propertyId: number) {
  const property = properties.value.find(
    (property) => property.id === propertyId
  );
  blocks.value = property?.blocks || [];
  lots.value = [];
}

async function handleGetLots(blockId: number) {
  const block = blocks.value.find((block: any) => block.id === blockId);
  lots.value = block?.lots || [];
}

function getClientInfo(values: any) {
  const {
    propertyId,
    blockId,
    lotId,
    paymentType,
    reservation,
    lotPrice,
    modeOfPayment,
    dateOfPayment,
    receipt,
    ...client
  } = values;
  return client;
}

function getLotInfo(values: any) {
  const {
    firstName,
    lastName,
    fullAddress,
    birthDate,
    email,
    mobileNumber,
    landlineNumber,
    ...lot
  } = values;

  return lot;
}

async function handleCreateClient(values: any) {
  console.log(getClientInfo(values));
  console.log(getLotInfo(values));
  loading.value = true;
  try {
    values.birthDate = new Date(values.birthDate[0]).toISOString();
    values.dateOfPayment = values.dateOfPayment[0];
    const { user } = useUserSession();
    const sessionData = { id: null, ...user.value };
    let body = {
      ...getClientInfo(values),
      createdBy: `${sessionData.firstName} ${sessionData.lastName}`,
    };
    let response: any = await $fetch("/api/clients/create", {
      method: "POST",
      body,
    });
    body = {
      ...getLotInfo(values),
      clientId: response.client.id,
      createdBy: `${sessionData.firstName} ${sessionData.lastName}`,
    };
    console.log(body);
    response = await $fetch("/api/client-lots/create", {
      method: "POST",
      body,
    });
    console.log(response);
    toast({
      title: "Success",
      description: response.message,
      variant: "success",
    });
    emit("refresh");
    dialogState.value = false;
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

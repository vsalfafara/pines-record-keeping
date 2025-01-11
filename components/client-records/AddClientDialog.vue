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
          handleGetProperties();
        }
      "
    >
      <DialogTrigger as-child>
        <Button> <Plus /> Add Client </Button>
      </DialogTrigger>
      <DialogScrollContent>
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
                  (value) => {
                    if (values.blockId) setFieldValue('blockId', undefined);
                    if (values.lotId) setFieldValue('lotId', undefined);
                    handleGetBlocks(parseInt(value));
                  }
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
                @update:model-value="
                  (value) => {
                    if (values.lotId) setFieldValue('lotId', undefined);
                    handleGetLots(parseInt(value));
                  }
                "
                :disabled="!blocks.length"
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      :placeholder="
                        blocks.length ? 'Select a block' : 'No blocks available'
                      "
                    />
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
                    if (lot) {
                      setFieldValue('lotPrice', lot.price);
                      setFieldValue('actualPrice', lot.price);
                    }
                  }
                "
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      :placeholder="
                        lots.length ? 'Select a lot' : 'No lots available'
                      "
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="(lot, index) in lots.filter((lot) => !lot.taken)"
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
          <FormField
            v-if="values.lotId"
            v-slot="{ componentField }"
            name="paymentType"
          >
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
          <template v-if="values.paymentType === 'Full Payment'">
            <FormField v-slot="{ componentField }" name="inNeed">
              <FormItem class="col-span-2">
                <FormLabel>In need? *</FormLabel>
                <FormControl>
                  <RadioGroup
                    class="flex flex-col space-y-1"
                    v-bind="componentField"
                    @update:model-value="
                      (v) => {
                        if (v === 'No') {
                          setFieldValue('inNeedPrice', undefined);
                          let actualPrice = values.lotPrice;
                          actualPrice -= values.discount | 0;
                          setFieldValue('actualPrice', actualPrice);
                        }
                      }
                    "
                  >
                    <FormItem class="flex items-center gap-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Yes" />
                      </FormControl>
                      <FormLabel class="font-normal"> Yes </FormLabel>
                    </FormItem>
                    <FormItem class="flex items-center gap-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="No" />
                      </FormControl>
                      <FormLabel class="font-normal"> No </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <template v-if="values.inNeed === 'Yes'">
              <FormField v-slot="{ componentField }" name="inNeedPrice">
                <FormItem>
                  <FormLabel>In need price *</FormLabel>
                  <Select
                    v-bind="componentField"
                    @update:model-value="
                      (v) => {
                        let actualPrice = values.lotPrice;
                        actualPrice = actualPrice + actualPrice * parseFloat(v);
                        actualPrice -= parseInt(values.discount || 0);
                        setFieldValue('actualPrice', actualPrice);
                      }
                    "
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a percentage" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="0.1"> 10% </SelectItem>
                        <SelectItem value="0.2"> 20% </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              </FormField>
            </template>
            <template v-if="values.inNeed">
              <FormField v-slot="{ componentField }" name="discount">
                <FormItem :class="{ 'col-span-2': values.inNeed === 'No' }">
                  <FormLabel>Discount</FormLabel>
                  <FormControl>
                    <div class="relative flex items-center">
                      <Input
                        class="pl-6"
                        type="number"
                        placeholder="0.00"
                        default-value="0"
                        v-bind="componentField"
                        @update:model-value="
                          (v: any) => {
                            let actualPrice = values.lotPrice;
                            if (values.inNeed === 'Yes') {
                              if (values.inNeedPrice)
                                actualPrice =
                                  actualPrice +
                                  actualPrice * parseFloat(values.inNeedPrice);
                            }
                            actualPrice -= v;
                            setFieldValue('actualPrice', actualPrice);
                          }
                        "
                      />
                      <span class="absolute pl-3"> ₱ </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="lotPrice">
                <FormItem>
                  <FormLabel>Lot Price</FormLabel>
                  <FormControl>
                    <div class="relative flex items-center">
                      <Input
                        class="pl-6"
                        type="number"
                        :placeholder="values.lotPrice"
                        v-bind="componentField"
                        disabled
                      />
                      <span class="absolute pl-3"> ₱ </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="actualPrice">
                <FormItem>
                  <FormLabel>Actual Price</FormLabel>
                  <FormControl>
                    <div class="relative flex items-center">
                      <Input
                        class="pl-6"
                        type="number"
                        :placeholder="values.actualPrice"
                        v-bind="componentField"
                        disabled
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
                        date: 'YYYY-MM-DD',
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
            </template>
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

let baseSchema = z.object({
  firstName: z.string().min(1, { message: "Please enter a first name" }),
  lastName: z.string().min(1, { message: "Please enter a last name" }),
  fullAddress: z.string().min(1, { message: "Please enter an address" }),
  birthDate: z.array(z.string(), { message: "Please enter a birth date" }),
  email: z.string().min(1, { message: "Please enter an email address" }),
  mobileNumber: z.string().min(1, { message: "Please enter a mobile number" }),
  landlineNumber: z.string().optional(),
  propertyId: z.string().min(1, { message: "Please select a property" }),
  blockId: z.string().min(1, { message: "Please select a block" }),
  lotId: z.string().min(1, { message: "Please select a lot" }),
  paymentType: z.enum(["Reservation", "Monthly Terms", "Full Payment"], {
    message: "Please select a payment type",
  }),
  lotPrice: z.number().multipleOf(0.01),
  modeOfPayment: z.enum(["Bank Transfer", "Cash Payment", "Check Payment"], {
    message: "Please select a mode of payment",
  }),
  dateOfPayment: z.array(z.string(), {
    message: "Please enter a birth date",
  }),
  receipt: z.instanceof(File, { message: "Please upload a receipt" }),
  discount: z
    .number({ message: "Please enter an amount" })
    .min(0)
    .multipleOf(0.01)
    .optional()
    .or(z.literal(0)),
  actualPrice: z.number().multipleOf(0.01),
  remarks: z.string().optional(),
});

let inNeedSchema = z.object({
  inNeed: z.literal("Yes"),
  inNeedPrice: z.string({ message: "Please select an option" }),
});

let notInNeedSchema = z.object({
  inNeed: z.literal("No"),
  inNeedPrice: z.string({ message: "Please select an option" }).optional(),
});

let formSchema = toTypedSchema(
  z
    .discriminatedUnion("inNeed", [inNeedSchema, notInNeedSchema])
    .and(baseSchema)
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
  lots.value = block?.lots.filter((lot: Lot) => !lot.taken) || [];
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
    dateOfPayment,
    receipt,
    ...lot
  } = values;
  return lot;
}

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

async function handleCreateClient(values: any) {
  loading.value = true;
  try {
    values.birthDate = values.birthDate[0];
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
      perpetualCarePrice: values.lotPrice * 0.1,
      totalInterest:
        values.inNeed === "Yes" ? values.lotPrice * values.inNeedPrice : 0,
      clientId: response.client.id,
      createdBy: `${sessionData.firstName} ${sessionData.lastName}`,
    };
    response = await $fetch("/api/client-lots/create", {
      method: "POST",
      body,
    });

    await $fetch(`/api/lots/${body.lotId}`, {
      method: "PUT",
      body: { taken: true },
    });

    const receipt = await handleUploadReceipt(values.receipt);
    body = {
      clientLotId: response.clientLot.id,
      purpose: "Full Payment",
      payment: values.actualPrice,
      dateOfPayment: values.dateOfPayment,
      receipt,
      remarks: values.remarks,
      createdBy: `${sessionData.firstName} ${sessionData.lastName}`,
    };
    await $fetch("/api/invoices/create", {
      method: "POST",
      body,
    });
    handleGetProperties();
    toast({
      title: "Success",
      description: "Client has been created",
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

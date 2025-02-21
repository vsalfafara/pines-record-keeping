<template>
  <Form
    v-slot="{ values, handleSubmit }"
    keepValues
    :validation-schema="formSchema"
    :initial-values="{
      discount: paymentPlan.discount,
      penalty: paymentPlan.penalty,
    }"
  >
    <Dialog :open="dialogState" @update:open="(state) => (dialogState = state)">
      <DialogTrigger as-child>
        <Button variant="outline" size="icon"> <Pencil /></Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[620px]">
        <DialogHeader>
          <DialogTitle
            ><Pencil class="h-8 w-8 rounded-md bg-blue-50 p-2 text-blue-600"
          /></DialogTitle>
          <DialogDescription>
            <h3 class="mb-2 text-xl font-semibold text-slate-900">
              Edit Payment Plan
            </h3>
            <p>Fill out the form</p>
          </DialogDescription>
        </DialogHeader>
        <form
          id="lotForm"
          class="grid grid-cols-2 gap-2"
          @submit="handleSubmit($event, handleUpdateLot)"
        >
          <FormField v-slot="{ componentField }" name="discount">
            <FormItem>
              <FormLabel>Discount</FormLabel>
              <FormControl>
                <div class="relative flex items-center">
                  <Input
                    class="pl-6"
                    type="number"
                    step="0.01"
                    :placeholder="values.discount"
                    v-bind="componentField"
                  />
                  <span class="absolute pl-3"> ₱ </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="penalty">
            <FormItem>
              <FormLabel>Penalty</FormLabel>
              <FormControl>
                <div class="relative flex items-center">
                  <Input
                    class="pl-6"
                    type="number"
                    step="0.01"
                    :placeholder="values.penalty"
                    v-bind="componentField"
                  />
                  <span class="absolute pl-3"> ₱ </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </form>
        <DialogFooter>
          <DialogClose as-child>
            <Button type="button" variant="outline"> Cancel </Button>
          </DialogClose>
          <Button type="submit" form="lotForm" :disabled="loading">
            <LoaderCircle v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
            {{ loading ? "Updating record..." : "Confirm" }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Form>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, LoaderCircle } from "lucide-vue-next";
import { useToast } from "@/components/ui/toast/use-toast";
import type { PaymentPlan } from "~/db/schema";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

const { paymentPlan } = defineProps<{
  paymentPlan: PaymentPlan;
}>();

const emit = defineEmits(["refresh"]);

const { toast } = useToast();
const loading = ref<boolean>(false);
const dialogState = ref<boolean>(false);

const formSchema = toTypedSchema(
  z.object({
    discount: z
      .number({ message: "Please enter an amount" })
      .min(0, { message: "Please enter an amount equal or more than 0" })
      .multipleOf(0.01),
    penalty: z
      .number({ message: "Please enter an amount" })
      .min(0, { message: "Please enter an amount equal or more than 0" })
      .multipleOf(0.01),
  })
);

async function handleUpdateLot(values: any) {
  loading.value = true;
  try {
    const body = {
      ...values,
      paymentDue: paymentPlan.paymentDue - values.discount + values.penalty,
    };
    const response: any = await $fetch(`/api/payment-plans/${paymentPlan.id}`, {
      method: "PUT",
      body: body,
    });
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

<template>
  <Form
    v-slot="{ handleSubmit }"
    keepValues
    :validation-schema="formSchema"
    :initial-values="lot"
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
            <h3 class="mb-2 text-xl font-semibold text-slate-900">Edit Lot</h3>
            <p>Fill out the form</p>
          </DialogDescription>
        </DialogHeader>
        <form
          id="lotForm"
          class="grid grid-cols-2 gap-2"
          @submit="handleSubmit($event, handleUpdateLot)"
        >
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Lot Name *</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Input lot name"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="lotType">
            <FormItem>
              <FormLabel>Lot Type *</FormLabel>
              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select lot type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem class="cursor-pointer" value="Corner">
                      Corner
                    </SelectItem>
                    <SelectItem class="cursor-pointer" value="Family Estate">
                      Family Estate
                    </SelectItem>
                    <SelectItem class="cursor-pointer" value="Inner">
                      Inner
                    </SelectItem>
                    <SelectItem class="cursor-pointer" value="Pathway">
                      Pathway
                    </SelectItem>
                    <SelectItem class="cursor-pointer" value="Roadside">
                      Roadside
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem> </FormField
          ><FormField v-slot="{ componentField }" name="price">
            <FormItem>
              <FormLabel>Price *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step=".01"
                  placeholder="Input price"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="remarks">
            <FormItem>
              <FormLabel>Remarks</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Input remark"
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
          <Button type="submit" form="lotForm" :disabled="loading">
            <LoaderCircle v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
            {{ loading ? "Creating lot..." : "Confirm" }}
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
import type { Lot } from "~/db/schema";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

const { lot } = defineProps<{
  lot: Lot;
}>();

const emit = defineEmits(["refresh"]);

const { toast } = useToast();
const loading = ref<boolean>(false);
const dialogState = ref<boolean>(false);

const formSchema = toTypedSchema(
  z.object({
    name: z
      .string()
      .min(1, { message: "Please enter a lot name" })
      .default(lot.id.toString()),
    lotType: z
      .enum(["Corner", "Family Estate", "Inner", "Pathway", "Roadside"])
      .default(lot.lotType),
    price: z
      .number()
      .min(0.01, { message: "Please enter a price that is more than 0" })
      .multipleOf(0.01, {
        message: "Please enter a price with a decimal point of at most 2",
      })
      .default(parseFloat(lot.price)),
    remarks: z
      .string()
      .optional()
      .default(lot.remarks ? lot.remarks : ""),
  })
);

async function handleUpdateLot(values: any) {
  loading.value = true;
  try {
    const response: any = await $fetch(`/api/lots/${lot.id}`, {
      method: "PUT",
      body: values,
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

<template>
  <Form v-slot="{ handleSubmit }" as="" :validation-schema="formSchema">
    <Dialog :open="dialogState" @update:open="(state) => (dialogState = state)">
      <DialogTrigger as-child>
        <Button> <Plus /> Add Property </Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[620px]">
        <DialogHeader>
          <DialogTitle
            ><Plus class="h-8 w-8 rounded-md bg-blue-50 p-2 text-blue-600"
          /></DialogTitle>
          <DialogDescription>
            <h3 class="mb-2 text-xl font-semibold text-slate-900">
              Add Property
            </h3>
            <p>Fill out the form</p>
          </DialogDescription>
        </DialogHeader>
        <form
          id="propertyForm"
          class="grid gap-2"
          @submit="handleSubmit($event, handleCreateProperty)"
        >
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Name *</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Input property name"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="fullAddress">
            <FormItem>
              <FormLabel>Full Address *</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Input full address (unit/lot no, barangay, city, country)"
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
          <Button type="submit" form="propertyForm" :disabled="loading">
            <LoaderCircle v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
            {{ loading ? "Creating property..." : "Confirm" }}
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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, LoaderCircle } from "lucide-vue-next";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/toast/use-toast";
import { useDateFormat } from "@vueuse/core";

const emit = defineEmits(["refresh"]);
const { toast } = useToast();
const loading = ref<boolean>(false);
const dialogState = ref<boolean>(false);

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, { message: "Please enter a property name" }),
    fullAddress: z.string().min(1, { message: "Please enter an address" }),
  })
);

async function handleCreateProperty(values: any) {
  loading.value = true;
  try {
    const { user } = useUserSession();
    const sessionData = { id: null, ...user.value };
    const body = {
      ...values,
      createdBy: `${sessionData.firstName} ${sessionData.lastName}`,
      createdOn: useDateFormat(new Date(), "MM-DD-YYYY").value,
    };
    const response: any = await $fetch("/api/properties/create", {
      method: "POST",
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

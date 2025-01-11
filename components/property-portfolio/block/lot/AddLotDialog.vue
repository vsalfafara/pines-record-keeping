<template>
  <Form v-slot="{ handleSubmit }" :validation-schema="formSchema">
    <Dialog :open="dialogState" @update:open="(state) => (dialogState = state)">
      <DialogTrigger as-child>
        <Button> <Plus /> Add Lot </Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[620px]">
        <DialogHeader>
          <DialogTitle
            ><Plus class="h-8 w-8 rounded-md bg-blue-50 p-2 text-blue-600"
          /></DialogTitle>
          <DialogDescription>
            <h3 class="mb-2 text-xl font-semibold text-slate-900">Add Lot</h3>
            <p>Fill out the form</p>
          </DialogDescription>
        </DialogHeader>
        <form
          id="lotForm"
          class="grid grid-cols-2 gap-2"
          @submit="handleSubmit($event, handleCreateLot)"
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
import { Plus, LoaderCircle } from "lucide-vue-next";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/toast/use-toast";
import { useDateFormat } from "@vueuse/core";

const emit = defineEmits(["refresh"]);
const { toast } = useToast();
const loading = ref<boolean>(false);
const dialogState = ref<boolean>(false);

const { blockId } = defineProps<{ blockId: number }>();

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, { message: "Please enter a lot name" }),
    lotType: z.enum([
      "Corner",
      "Family Estate",
      "Inner",
      "Pathway",
      "Roadside",
    ]),
    price: z
      .number()
      .min(0.01, { message: "Please enter a price that is more than 0" })
      .multipleOf(0.01, {
        message: "Please enter a price with a decimal point of at most 2",
      }),
    remarks: z.string().optional(),
  })
);

async function handleCreateLot(values: any) {
  loading.value = true;
  try {
    const { user } = useUserSession();
    const sessionData = { id: null, ...user.value };
    const body = {
      ...values,
      blockId,
      createdBy: `${sessionData.firstName} ${sessionData.lastName}`,
      createdOn: useDateFormat(new Date(), "YYYY-MM-DD").value,
    };
    const response: any = await $fetch("/api/lots/create", {
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

<template>
  <Form v-slot="{ handleSubmit }" as="" :validation-schema="formSchema">
    <Dialog :open="dialogState" @update:open="(state) => (dialogState = state)">
      <DialogTrigger as-child>
        <Button> <Plus /> Add Block </Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[620px]">
        <DialogHeader>
          <DialogTitle
            ><Plus class="h-8 w-8 rounded-md bg-blue-50 p-2 text-blue-600"
          /></DialogTitle>
          <DialogDescription>
            <h3 class="mb-2 text-xl font-semibold text-slate-900">Add Block</h3>
            <p>Fill out the form</p>
          </DialogDescription>
        </DialogHeader>
        <form
          id="blockForm"
          class="grid gap-2"
          @submit="handleSubmit($event, handleCreateBlock)"
        >
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Name *</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Input block name"
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
          <Button type="submit" form="blockForm" :disabled="loading">
            <LoaderCircle v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
            {{ loading ? "Creating block..." : "Confirm" }}
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

const emit = defineEmits(["refresh"]);
const { toast } = useToast();
const loading = ref<boolean>(false);
const dialogState = ref<boolean>(false);

const { propertyId } = defineProps<{ propertyId: number }>();
const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, { message: "Please enter a property name" }),
  })
);

async function handleCreateBlock(values: any) {
  loading.value = true;
  try {
    const { user } = useUserSession();
    const sessionData = { id: null, ...user.value };
    const body = {
      ...values,
      propertyId,
      createdBy: `${sessionData.firstName} ${sessionData.lastName}`,
    };
    const response: any = await $fetch("/api/blocks/create", {
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

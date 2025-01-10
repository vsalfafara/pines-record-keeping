<template>
  <Dialog :open="dialogState" @update:open="(state) => (dialogState = state)">
    <DialogTrigger as-child>
      <Button variant="outline" size="icon">
        <Trash />
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle
          ><Trash class="h-8 w-8 rounded-md bg-red-50 p-2 text-red-600"
        /></DialogTitle>
        <DialogDescription>
          <h3 class="mb-2 text-xl font-semibold text-slate-900">
            Are you sure you want to remove {{ lot.name }}?
          </h3>
          <p>
            Once removed, it wil no longer be available as an option to be
            bought by clients.
          </p>
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose as-child>
          <Button variant="outline"> Cancel </Button>
        </DialogClose>
        <Button
          variant="destructive"
          :disabled="loading"
          @click="handleDeleteUser"
        >
          <LoaderCircle v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
          {{ loading ? "Deleting property..." : "Delete" }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
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
import { Trash, LoaderCircle } from "lucide-vue-next";
import { useToast } from "@/components/ui/toast/use-toast";
import type { Lot } from "~/db/schema";

const { lot } = defineProps<{
  lot: Lot;
}>();

const emit = defineEmits(["refresh"]);

const { toast } = useToast();
const loading = ref<boolean>(false);
const dialogState = ref<boolean>(false);

async function handleDeleteUser() {
  loading.value = true;
  try {
    const response: any = await $fetch(`/api/lots/${lot.id}`, {
      method: "DELETE",
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

<template>
  <Form v-slot="{ handleSubmit }" as="" :validation-schema="formSchema">
    <Dialog :open="dialogState" @update:open="(state) => (dialogState = state)">
      <DialogTrigger as-child>
        <Button> <Plus /> Add User </Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[620px]">
        <DialogHeader>
          <DialogTitle
            ><Plus class="h-8 w-8 rounded-md bg-blue-50 p-2 text-blue-600"
          /></DialogTitle>
          <DialogDescription>
            <h3 class="mb-2 text-xl font-semibold text-slate-900">Add User</h3>
            <p>Fill out the form</p>
          </DialogDescription>
        </DialogHeader>
        <form
          id="userForm"
          class="grid grid-cols-2 gap-2"
          @submit="handleSubmit($event, handleCreateUser)"
        >
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
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email Address *</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="sample@gmail.com"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>Password *</FormLabel>
              <FormControl>
                <div class="relative w-full items-center">
                  <Input :type="passwordFieldType" v-bind="componentField" />
                  <span
                    class="absolute inset-y-0 end-0 flex items-center justify-center px-2"
                  >
                    <EyeClosed
                      type="button"
                      class="h-6 w-6 cursor-pointer p-1"
                      :class="{ hidden: passwordFieldType === 'text' }"
                      @click="passwordFieldType = 'text'"
                    />
                    <Eye
                      type="button"
                      class="h-6 w-6 cursor-pointer p-1"
                      :class="{ hidden: passwordFieldType === 'password' }"
                      @click="passwordFieldType = 'password'"
                    />
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="role">
            <FormItem>
              <FormLabel>Role *</FormLabel>
              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem class="cursor-pointer" value="ADMIN">
                      Admin
                    </SelectItem>
                    <SelectItem class="cursor-pointer" value="ACCOUNTS_CLERK">
                      Account Clerk
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>
        </form>
        <DialogFooter>
          <DialogClose as-child>
            <Button type="button" variant="outline"> Cancel </Button>
          </DialogClose>
          <Button type="submit" form="userForm" :disabled="loading">
            <LoaderCircle v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
            {{ loading ? "Creating user..." : "Confirm" }}
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Eye, EyeClosed, LoaderCircle } from "lucide-vue-next";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/toast/use-toast";
import { useDateFormat } from "@vueuse/core";

const emit = defineEmits(["refresh"]);
const { toast } = useToast();
const passwordFieldType = ref<string>("password");
const loading = ref<boolean>(false);
const dialogState = ref<boolean>(false);

const formSchema = toTypedSchema(
  z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["ADMIN", "ACCOUNTS_CLERK"]),
  })
);

async function handleCreateUser(values: any) {
  loading.value = true;
  try {
    const { user } = useUserSession();
    const sessionData = { id: null, ...user.value };
    const body = {
      ...values,
      createdBy: `${sessionData.firstName} ${sessionData.lastName}`,
      createdOn: useDateFormat(new Date(), "MM-DD-YYYY").value,
    };
    const response: any = await $fetch("/api/users/create", {
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

<template>
  <NuxtLayout name="auth">
    <div class="grid h-screen lg:grid-cols-2">
      <div class="flex flex-col items-center px-4 py-8">
        <div class="flex gap-2 self-start">Logo here...</div>
        <div
          class="flex w-full max-w-[400px] flex-1 items-center justify-center"
        >
          <form @submit="onSubmit" class="grid flex-1 gap-2">
            <h1 class="text-3xl font-bold">Log In</h1>
            <p class="mb-2 text-muted-foreground">
              Only authorized users may access this system
            </p>
            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="johndoe@example.com"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="password">
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <Button type="submit" :disabled="loading">
              <template v-if="loading">
                <LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </template>
              <template v-else> Login </template>
            </Button>
          </form>
        </div>
        <p class="text-sm text-muted-foreground">@2024 Developed by AlfaTeam</p>
      </div>
      <div class="md:100vw p-4">
        <img
          src="/images/login-bg.jpg"
          class="hidden h-full rounded-xl object-cover lg:block"
          alt="login background image"
        />
      </div>
    </div>
    <Toaster />
  </NuxtLayout>
</template>

<script setup lang="ts">
import Toaster from "@/components/ui/toast/Toaster.vue";
import { useToast } from "@/components/ui/toast/use-toast";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "lucide-vue-next";

definePageMeta({
  middleware: () => {
    const { loggedIn } = useUserSession();
    if (loggedIn.value) {
      return navigateTo("/access-management");
    }
  },
});

useHead({
  title: "Pines Memorial - Login",
});

const { toast } = useToast();
const loading = ref<boolean>(false);

const formSchema = toTypedSchema(
  z.object({
    email: z.string().email(),
    password: z.string(),
  })
);

const { handleSubmit } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  try {
    await $fetch("/api/auth/login", {
      method: "POST",
      body: { ...values },
    });
    const { fetch } = useUserSession();
    await fetch();
    await navigateTo("/access-management");
  } catch (error: any) {
    toast({
      title: error.response._data.message,
      description: "Please try again",
      variant: "destructive",
    });
  }
  loading.value = false;
});
</script>

<style scoped></style>

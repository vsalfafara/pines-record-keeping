<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="outline"> View Receipt </Button>
    </DialogTrigger>
    <DialogContent>
      <VisuallyHidden>
        <DialogTitle></DialogTitle>
      </VisuallyHidden>
      <NuxtImg :src="image" class="h-full w-auto" />
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { VisuallyHidden } from "radix-vue";
const { receipt } = defineProps<{ receipt: string }>();
const config = useRuntimeConfig();
const image = ref<string>(
  `https://res.cloudinary.com/${config.public.cloudinary.cloudName}/image/upload/v1736597556/${receipt}`
);
</script>

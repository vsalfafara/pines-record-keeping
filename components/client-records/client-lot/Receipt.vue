<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="ghost"> View Receipt </Button>
    </DialogTrigger>
    <DialogContent>
      <VisuallyHidden>
        <DialogTitle></DialogTitle>
      </VisuallyHidden>
      <!-- <CldImage :src="receipt" width="1200" height="1500" alt="receipt" /> -->
      <img
        :src="`https://res.cloudinary.com/dreznpjkt/image/upload/v1736597556/${receipt}`"
        class="h-full w-auto"
      />
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { VisuallyHidden } from "radix-vue";
const { receipt } = defineProps<{ receipt: string }>();
</script>

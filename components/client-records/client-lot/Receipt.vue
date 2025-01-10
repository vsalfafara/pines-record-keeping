<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="ghost"> View Receipt </Button>
    </DialogTrigger>
    <DialogContent>
      <VisuallyHidden>
        <DialogTitle></DialogTitle>
      </VisuallyHidden>
      <CldImage
        :src="receipt"
        width="1200"
        height="1500"
        alt="receipt"
        fill-background
      />
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { VisuallyHidden } from "radix-vue";
const { receipt } = defineProps<{ receipt: string }>();
</script>

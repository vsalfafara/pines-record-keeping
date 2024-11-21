<script setup lang="ts">
import { DialogTrigger, type DialogTriggerProps } from "radix-vue";

const props = defineProps<DialogTriggerProps>();

function click() {
  // Need this blank
}

defineExpose({
  click,
});
</script>

<template>
  <DialogTrigger v-bind="props">
    <slot />
  </DialogTrigger>
</template>

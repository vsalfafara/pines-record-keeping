<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger
        class="max-w-32 overflow-hidden text-ellipsis px-4 text-start"
        >{{ remarks }}</TooltipTrigger
      >
      <TooltipContent class="bg-slate-500 text-muted">
        <p class="max-w-96">{{ remarks }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>

<script setup lang="ts">
const { remarks } = defineProps<{ remarks: string | null }>();
</script>

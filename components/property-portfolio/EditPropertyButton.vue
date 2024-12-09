<template>
  <Button
    variant="outline"
    size="icon"
    @click="navigateTo({ name: 'Property', params: { id: property.id } })"
  >
    <Pencil />
  </Button>
</template>

<script setup lang="ts">
import { Pencil } from "lucide-vue-next";
import type { Property } from "~/db/schema";

const { property } = defineProps<{
  property: Property;
}>();
</script>

<template>
  <Button
    variant="outline"
    size="icon"
    @click="navigateTo({ name: 'Client', params: { id: client.id } })"
  >
    <Pencil />
  </Button>
</template>

<script setup lang="ts">
import { Pencil } from "lucide-vue-next";
import type { Client } from "~/db/schema";

const { client } = defineProps<{
  client: Client;
}>();
</script>

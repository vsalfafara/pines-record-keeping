<template>
  <Form v-slot="{ handleSubmit }" :validation-schema="formSchema">
    <Sheet :open="dialogState" @update:open="handleOpenDialog">
      <SheetTrigger as-child>
        <Button variant="outline" size="icon"> <Pencil /> </Button>
      </SheetTrigger>
      <SheetContent class="sm:max-w-[920px]">
        <SheetHeader class="mb-4">
          <SheetTitle
            ><Pencil class="h-8 w-8 rounded-md bg-blue-50 p-2 text-blue-600"
          /></SheetTitle>
          <SheetDescription>
            <h3 class="mb-2 text-xl font-semibold text-slate-900">
              {{ property.name }}
            </h3>
            <p>Fill out the form</p>
          </SheetDescription>
        </SheetHeader>
        <form
          id="dialogForm"
          class="mb-4 grid grid-cols-2 gap-x-2 gap-y-4"
          @submit="handleSubmit($event, handleUpdateUser)"
        >
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Name *</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Input name"
                  :default-value="property.name"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="fullAddress">
            <FormItem>
              <FormLabel>Full Address *</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Input full address"
                  :default-value="property.fullAddress"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FieldArray
            name="blocks"
            v-slot="{ fields: blocks, push: pushBlock, remove: removeBlock }"
          >
            <Card class="col-span-2">
              <CardHeader>
                <div class="flex items-center justify-between">
                  <div>
                    <CardTitle class="text-md mb-1"
                      >List the price per lot</CardTitle
                    >
                    <CardDescription
                      >The price of the lots that are already taken cannot be
                      updated or removed</CardDescription
                    >
                  </div>
                  <Button
                    type="button"
                    @click="pushBlock({ name: '', lots: [] })"
                    ><Plus />Add Block</Button
                  >
                </div>
              </CardHeader>
              <CardContent v-if="blocks.length">
                <div v-for="(block, blockId) in blocks" :key="block.key">
                  <Separator v-if="blockId !== 0" class="my-4" />
                  <FormField
                    v-slot="{ componentField }"
                    :name="`blocks[${blockId}].name`"
                  >
                    <FormItem>
                      <div class="mb-2 flex items-center gap-2">
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Input block name"
                            v-bind="componentField"
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          @click="removeBlock(blockId)"
                          ><Trash
                        /></Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FieldArray
                    :name="`blocks[${blockId}].lots`"
                    v-slot="{ fields: lots, push: pushLot, remove: removeLot }"
                  >
                    <Button
                      type="button"
                      @click="pushLot({ name: '', lotType: '', price: 0 })"
                      ><Plus /> Add Lot</Button
                    >
                    <div
                      v-for="(_, lotId) in lots"
                      :key="lotId"
                      class="mt-2 flex gap-2"
                    >
                      <div class="flex-1">
                        <FormField
                          v-slot="{ componentField }"
                          :name="`blocks[${blockId}].lots[${lotId}].name`"
                        >
                          <FormItem>
                            <FormLabel>Name *</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Input lot name"
                                :default-value="`Lot ${lotId + 1}`"
                                v-bind="componentField"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        </FormField>
                      </div>
                      <div class="flex-1">
                        <FormField
                          v-slot="{ componentField }"
                          :name="`blocks[${blockId}].lots[${lotId}].lotType`"
                        >
                          <FormItem>
                            <FormLabel>Lot Type *</FormLabel>
                            <Select v-bind="componentField">
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select lot type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem
                                    class="cursor-pointer"
                                    value="Corner"
                                  >
                                    Corner
                                  </SelectItem>
                                  <SelectItem
                                    class="cursor-pointer"
                                    value="Inner"
                                  >
                                    Inner
                                  </SelectItem>
                                  <SelectItem
                                    class="cursor-pointer"
                                    value="Pathway"
                                  >
                                    Pathway
                                  </SelectItem>
                                  <SelectItem
                                    class="cursor-pointer"
                                    value="Roadside"
                                  >
                                    Roadside
                                  </SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        </FormField>
                      </div>
                      <div class="flex-1">
                        <FormField
                          v-slot="{ componentField }"
                          :name="`blocks[${blockId}].lots[${lotId}].price`"
                        >
                          <FormItem>
                            <FormLabel>Price *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step=".01"
                                placeholder="Input Price"
                                v-bind="componentField"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        </FormField>
                      </div>
                      <div class="w-[36px]">
                        <Button
                          v-if="lots.length - 1 === lotId"
                          type="button"
                          variant="outline"
                          size="icon"
                          class="mt-[34px]"
                          @click="removeLot(lotId)"
                        >
                          <Trash />
                        </Button>
                      </div>
                    </div>
                  </FieldArray>
                </div>
              </CardContent>
            </Card>
          </FieldArray>
        </form>
        <SheetFooter>
          <SheetClose as-child>
            <Button type="button" variant="outline"> Cancel </Button>
          </SheetClose>
          <Button type="submit" form="dialogForm" :disabled="loading">
            <LoaderCircle v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
            {{ loading ? "Saving changes..." : "Save Changes" }}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  </Form>
</template>

<script setup lang="ts">
import { Input } from "@/components/ui/input";
import { Pencil, Plus, LoaderCircle, Trash } from "lucide-vue-next";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/toast/use-toast";
import type { Property } from "~/db/schema";
import { FieldArray } from "vee-validate";

const emit = defineEmits(["refresh"]);
const { toast } = useToast();
const loading = ref<boolean>(false);
const dialogState = ref<boolean>(false);

const { property } = defineProps<{
  property: Property;
}>();

let formSchema = generateTypedSchema();

function handleOpenDialog(state: boolean) {
  dialogState.value = state;
  if (state) {
    formSchema = generateTypedSchema();
    console.log(formSchema);
  }
}

function generateTypedSchema() {
  return toTypedSchema(
    z.object({
      name: z
        .string()
        .min(1, { message: "Please enter a property name" })
        .default(property.name),
      fullAddress: z
        .string()
        .min(1, { message: "Please enter an address" })
        .default(property.fullAddress),
      blocks: z
        .array(
          z.object({
            name: z.string().min(1, { message: "Please enter a block name" }),
            lots: z.array(
              z.object({
                name: z.string().min(1, { message: "Please enter a lot name" }),
                lotType: z.enum(["Corner", "Inner", "Pathway", "Roadside"], {
                  message: "Please select a lot type",
                }),
                price: z.number().multipleOf(0.01, {
                  message:
                    "Please enter a price with a decimal point of at most 2",
                }),
              })
            ),
          })
        )
        .optional(),
    })
  );
}

async function handleUpdateUser(values: any) {
  console.log("Edit Property Values: ", values);
  toast({
    title: "Under Construction",
    description: "Hint: check console",
  });
  // loading.value = true;
  // try {
  //   const response: any = await $fetch(`/api/properties/${property.id}`, {
  //     method: "PUT",
  //     body: { ...values },
  //   });
  //   toast({
  //     title: "Success",
  //     description: response.message,
  //     variant: "success",
  //   });
  //   emit("refresh");
  //   dialogState.value = false;
  // } catch (error: any) {
  //   console.log(error.response);
  //   toast({
  //     title: "Error",
  //     description: "Something went wrong.",
  //     variant: "destructive",
  //   });
  // }
  // loading.value = false;
}
</script>

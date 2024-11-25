import { db } from "~/db";
import { properties } from "~/db/schema";
import type { NewProperty } from "~/db/schema";

export default defineEventHandler(async (event) => {
  const body: NewProperty = await readBody(event);

  try {
    const property = await db
      .insert(properties)
      .values({ ...body })
      .returning();
    return {
      message: `Property ${property[0].name} has been created`,
    };
  } catch (error) {
    return {
      error,
    };
  }
});

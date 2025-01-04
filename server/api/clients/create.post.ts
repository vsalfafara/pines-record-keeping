import { db } from "~/db";
import { clients } from "~/db/schema";
import type { NewClient } from "~/db/schema";

export default defineEventHandler(async (event) => {
  const body: NewClient = await readBody(event);
  try {
    const [client] = await db
      .insert(clients)
      .values({ ...body })
      .returning();
    return {
      client,
    };
  } catch (error) {
    console.log(error);
    return {
      error,
    };
  }
});

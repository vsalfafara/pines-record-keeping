import { db } from "~/db";
import { lots } from "~/db/schema";
import type { NewLot } from "~/db/schema";

export default defineEventHandler(async (event) => {
  const body: NewLot = await readBody(event);

  try {
    const [lot] = await db
      .insert(lots)
      .values({ ...body })
      .returning();
    return {
      message: `Lot ${lot.name} has been created`,
    };
  } catch (error) {
    return {
      error,
    };
  }
});

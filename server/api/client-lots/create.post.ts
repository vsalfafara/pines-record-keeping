import { db } from "~/db";
import { clientLots } from "~/db/schema";
import type { NewClientLot } from "~/db/schema";

export default defineEventHandler(async (event) => {
  const body: NewClientLot = await readBody(event);
  try {
    const [clientLot] = await db
      .insert(clientLots)
      .values({ ...body })
      .returning();
    return {
      message: `Lot No. ${clientLot.lotId} has been assigned to the client`,
    };
  } catch (error) {
    console.log(error);
    return {
      error,
    };
  }
});

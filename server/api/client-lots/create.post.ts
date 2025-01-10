import { eq } from "drizzle-orm";
import { db } from "~/db";
import { clientLots, lots } from "~/db/schema";
import type { NewClientLot } from "~/db/schema";

export default defineEventHandler(async (event) => {
  const body: NewClientLot = await readBody(event);
  try {
    const [clientLot] = await db
      .insert(clientLots)
      .values({ ...body })
      .returning();
    const lot = await db.query.lots.findFirst({
      where: eq(lots.id, clientLot.lotId),
    });

    return {
      message: `${lot?.name} has been assigned to the client`,
      clientLot,
    };
  } catch (error) {
    console.log(error);
    return {
      error,
    };
  }
});

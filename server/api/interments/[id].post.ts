import { eq } from "drizzle-orm";
import { db } from "~/db";
import { interments } from "~/db/schema";

export default defineEventHandler(async (event) => {
  const id: any = getRouterParam(event, "id");
  try {
    const rows: any = db.query.interments.findMany({
      where: eq(interments.clientLotId, id),
    });

    await db.insert(interments).values({
      clientLotId: id,
      dig: (rows.length || 0) + 1,
    });
  } catch (error) {
    console.log(error);
    return { error };
  }
});

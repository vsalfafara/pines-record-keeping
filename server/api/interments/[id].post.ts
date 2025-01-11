import { count, eq } from "drizzle-orm";
import { db } from "~/db";
import { interments } from "~/db/schema";

export default defineEventHandler(async (event) => {
  const id: any = getRouterParam(event, "id");
  const body = await readBody(event);
  try {
    const rows: any = await db
      .select({ count: count() })
      .from(interments)
      .where(eq(interments.clientLotId, parseInt(id)));

    await db.insert(interments).values({
      clientLotId: id,
      dig: rows[0].count + 1,
      lastModifiedAt: body.lastModifiedAt,
    });
  } catch (error) {
    console.log(error);
    return { error };
  }
});

import { eq } from "drizzle-orm";
import { db } from "~/db";
import { interments } from "~/db/schema";

export default defineEventHandler(async (event) => {
  const id: any = getRouterParam(event, "id");
  try {
    return db.query.interments.findMany({
      where: eq(interments.clientLotId, id),
      orderBy: interments.dig,
    });
  } catch (error) {
    return { error };
  }
});

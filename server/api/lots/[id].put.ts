import { eq } from "drizzle-orm";
import { db } from "~/db";
import { lots } from "~/db/schema";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    let lot: any = null;

    if (id) {
      lot = await db.query.lots.findFirst({
        where: eq(lots.id, parseInt(id)),
      });

      if (!lot) {
        setResponseStatus(event, 404);
        return {
          message: "Lot not found",
        };
      }

      [lot] = await db
        .update(lots)
        .set(body)
        .where(eq(lots.id, parseInt(id)))
        .returning();

      return {
        message: `Lot ${lot.name} has been updated`,
      };
    } else {
      setResponseStatus(event, 403);
      return {
        message: "Something went wrong",
      };
    }
  } catch (error) {
    return {
      error,
    };
  }
});

import { eq } from "drizzle-orm";
import { db } from "~/db";
import { clientLots } from "~/db/schema";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (id) {
      return await db.query.clientLots.findFirst({
        where: eq(clientLots.id, parseInt(id)),
      });
    }
    return {
      message: "Lot not found",
    };
  } catch (error) {
    console.log(error);
    return {
      error,
    };
  }
});

import { eq } from "drizzle-orm";
import { db } from "~/db";
import { expenses } from "~/db/schema";

export default defineEventHandler(async (event) => {
  const clientLotId: any = getRouterParam(event, "id");
  if (clientLotId) {
    return db.query.expenses.findMany({
      where: eq(expenses.clientLotId, clientLotId),
    });
  }
});

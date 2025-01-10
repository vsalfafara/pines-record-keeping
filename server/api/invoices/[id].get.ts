import { eq } from "drizzle-orm";
import { db } from "~/db";
import { invoices } from "~/db/schema";

export default defineEventHandler(async (event) => {
  const clientLotId: any = getRouterParam(event, "id");
  if (clientLotId) {
    return db.query.invoices.findMany({
      where: eq(invoices.clientLotId, clientLotId),
    });
  }
});

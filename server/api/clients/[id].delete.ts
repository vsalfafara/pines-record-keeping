import { eq, inArray } from "drizzle-orm";
import { db } from "~/db";
import { clientLots, clients, invoices, lots } from "~/db/schema";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (id) {
      const [client] = await db
        .delete(clients)
        .where(eq(clients.id, Number(id)))
        .returning();

      if (!client) {
        return {
          message: "Client does not exist",
        };
      }

      let lotsToUpdate: { lotId: number }[] | number[] = await db
        .delete(clientLots)
        .where(eq(clientLots.clientId, Number(id)))
        .returning({ lotId: clientLots.lotId });

      lotsToUpdate = lotsToUpdate.map((lot: { lotId: number }) => lot.lotId);

      await db
        .update(lots)
        .set({ taken: false })
        .where(inArray(lots.id, lotsToUpdate));

      return {
        message: "Client deleted",
      };
    }
    return {
      message: "Client not found",
    };
  } catch (error) {
    console.log(error);
    return {
      error,
    };
  }
});

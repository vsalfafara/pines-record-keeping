import { eq } from "drizzle-orm";
import { db } from "~/db";
import { clients } from "~/db/schema";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (id) {
      return await db.query.clients.findFirst({
        where: eq(clients.id, parseInt(id)),
        with: {
          clientLots: {
            with: {
              lot: true,
              block: true,
              property: true,
            },
          },
        },
      });
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

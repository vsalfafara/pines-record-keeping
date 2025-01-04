import { eq } from "drizzle-orm";
import { db } from "~/db";
import { clients } from "~/db/schema";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    let client: any = null;

    if (id) {
      client = await db.query.clients.findFirst({
        where: eq(clients.id, parseInt(id)),
      });
      if (!client) {
        setResponseStatus(event, 404);
        return {
          message: "Client not found",
        };
      }

      [client] = await db
        .update(clients)
        .set({ ...body })
        .where(eq(clients.id, parseInt(id)))
        .returning();

      return {
        message: `Client ${client.firstName} ${client.lastName} has been updated`,
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

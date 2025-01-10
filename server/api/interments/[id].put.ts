import { eq } from "drizzle-orm";
import { db } from "~/db";
import { interments } from "~/db/schema";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    let interment: any = null;

    if (id) {
      interment = await db.query.interments.findFirst({
        where: eq(interments.id, parseInt(id)),
      });

      if (!interment) {
        setResponseStatus(event, 404);
        return {
          message: "Interment not found",
        };
      }

      [interment] = await db
        .update(interments)
        .set(body)
        .where(eq(interments.id, parseInt(id)))
        .returning();

      return {
        message: `Dig #${interment.dig} has been updated`,
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

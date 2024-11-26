import { eq } from "drizzle-orm";
import { db } from "~/db";
import { properties } from "~/db/schema";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    let property: any = null;

    if (id) {
      property = await db.query.properties.findFirst({
        where: eq(properties.id, parseInt(id)),
      });
      if (!property) {
        setResponseStatus(event, 404);
        return {
          message: "User not found",
        };
      }
      property = await db
        .delete(properties)
        .where(eq(properties.id, parseInt(id)))
        .returning();
      return {
        message: `Property ${property[0].name} has been deleted`,
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

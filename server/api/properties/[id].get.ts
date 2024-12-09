import { eq } from "drizzle-orm";
import { db } from "~/db";
import { properties } from "~/db/schema";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (id) {
      return await db.query.properties.findFirst({
        where: eq(properties.id, parseInt(id)),
        with: {
          blocks: {
            with: {
              lots: true,
            },
          },
        },
      });
    }
    return {
      message: "Property not found",
    };
  } catch (error) {
    return {
      error,
    };
  }
});

import { eq } from "drizzle-orm";
import { db } from "~/db";
import { blocks } from "~/db/schema";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    let block: any = null;

    if (id) {
      block = await db.query.blocks.findFirst({
        where: eq(blocks.id, parseInt(id)),
        with: {
          lots: true,
        },
      });
      if (!block) {
        setResponseStatus(event, 404);
        return {
          message: "Block not found",
        };
      }
      return { data: block };
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

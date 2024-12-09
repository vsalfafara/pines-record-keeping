import { eq } from "drizzle-orm";
import { db } from "~/db";
import { blocks } from "~/db/schema";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    let block: any = null;

    if (id) {
      block = await db.query.blocks.findFirst({
        where: eq(blocks.id, parseInt(id)),
      });
      if (!block) {
        setResponseStatus(event, 404);
        return {
          message: "Block not found",
        };
      }

      [block] = await db
        .update(blocks)
        .set({ ...body })
        .where(eq(blocks.id, parseInt(id)))
        .returning();

      return {
        message: `Property ${block.name} has been updated`,
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

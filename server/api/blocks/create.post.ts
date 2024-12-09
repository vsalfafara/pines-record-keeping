import { db } from "~/db";
import { blocks } from "~/db/schema";
import type { NewBlock } from "~/db/schema";

export default defineEventHandler(async (event) => {
  const body: NewBlock = await readBody(event);

  try {
    const [block] = await db
      .insert(blocks)
      .values({ ...body })
      .returning();
    return {
      message: `Block ${block.name} has been created`,
    };
  } catch (error) {
    return {
      error,
    };
  }
});

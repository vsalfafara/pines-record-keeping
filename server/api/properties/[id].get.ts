import { eq } from "drizzle-orm";
import { db } from "~/db";
import { Block, properties } from "~/db/schema";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (id) {
      const property = await db.query.properties.findFirst({
        where: eq(properties.id, parseInt(id)),
        with: {
          blocks: {
            with: {
              lots: true,
            },
          },
        },
      });
      if (property) {
        const { blocks, ...otherPropertyInfo } = property;

        const data = blocks.map((block) => {
          const noOfLots = block.lots.length;
          const takenLots = block.lots.filter((lot) => lot.taken).length;
          const availableLots = block.lots.filter((lot) => !lot.taken).length;
          return {
            noOfLots,
            takenLots,
            availableLots,
            ...block,
          };
        });
        return {
          ...otherPropertyInfo,
          blocks: data,
        };
      } else {
        return {
          message: "Property not found",
        };
      }
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

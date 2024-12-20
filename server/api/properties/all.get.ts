import { db } from "~/db";

export default defineEventHandler(async () => {
  return await db.query.properties.findMany({
    with: {
      blocks: {
        with: {
          lots: true,
        },
      },
    },
  });
});

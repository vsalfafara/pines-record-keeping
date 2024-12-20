import { db } from "~/db";

export default defineEventHandler(async () => {
  return await db.query.clients.findMany();
});

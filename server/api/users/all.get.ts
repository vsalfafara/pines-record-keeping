import { getTableColumns } from "drizzle-orm";
import { db } from "~/db";
import { users } from "~/db/schema";

const { password, ...rest } = getTableColumns(users);

export default defineEventHandler(async () => {
  return await db.select({ ...rest }).from(users);
});

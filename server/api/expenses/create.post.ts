import { db } from "~/db";
import { expenses } from "~/db/schema";
import type { NewExpense } from "~/db/schema";

export default defineEventHandler(async (event) => {
  const body: NewExpense = await readBody(event);
  try {
    await db
      .insert(expenses)
      .values({ ...body })
      .returning();
    return {
      message: `Expense has been created`,
    };
  } catch (error) {
    return {
      error,
    };
  }
});

import { db } from "~/db";
import { invoices } from "~/db/schema";
import type { NewInvoice } from "~/db/schema";

export default defineEventHandler(async (event) => {
  const body: NewInvoice = await readBody(event);
  try {
    await db
      .insert(invoices)
      .values({ ...body })
      .returning();
    return {
      message: `Invoice has been created`,
    };
  } catch (error) {
    return {
      error,
    };
  }
});

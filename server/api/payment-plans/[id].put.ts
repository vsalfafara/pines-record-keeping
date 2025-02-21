import { eq } from "drizzle-orm";
import { db } from "~/db";
import { paymentPlans } from "~/db/schema";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    let paymentPlan: any = null;

    if (id) {
      paymentPlan = await db.query.paymentPlans.findFirst({
        where: eq(paymentPlans.id, parseInt(id)),
      });
      if (!paymentPlan) {
        setResponseStatus(event, 404);
        return {
          message: "Payment Plan record not found",
        };
      }

      [paymentPlan] = await db
        .update(paymentPlans)
        .set({ ...body })
        .where(eq(paymentPlans.id, parseInt(id)))
        .returning();

      return {
        message: `Payment Plan has been updated`,
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

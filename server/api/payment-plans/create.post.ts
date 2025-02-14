import { useDateFormat } from "@vueuse/core";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { paymentPlans } from "~/db/schema";

export default defineEventHandler(async (event) => {
  try {
    const body: any = await readBody(event);
    const { paymentDue, clientLotId, dateOfPayment, terms } = body;
    const values = [];
    const date = new Date(dateOfPayment);

    const hasRows = await db.query.paymentPlans.findFirst({
      where: eq(paymentPlans.clientLotId, parseInt(clientLotId)),
    });

    if (hasRows) return;

    for (let x = 0; x < terms; x++) {
      const installmentMonths = new Date(
        date.getFullYear(),
        date.getMonth() + x + 1,
        0
      );
      values.push({
        clientLotId,
        installmentMonths: `${x + 1}/${terms}`,
        dueDate: useDateFormat(installmentMonths, "YYYY-MM-DD").value,
        paymentDue,
      });
    }
    return await db.insert(paymentPlans).values(values).returning();
  } catch (error) {
    return {
      error,
    };
  }
});

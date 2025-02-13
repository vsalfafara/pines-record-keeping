import { useDateFormat } from "@vueuse/core";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { paymentPlans } from "~/db/schema";

export default defineEventHandler(async (event) => {
  try {
    const body: any = await readBody(event);
    const {
      downpayment,
      price,
      paymentDue,
      clientLotId,
      dateOfPayment,
      terms,
    } = body;
    const values = [];
    const date = new Date(dateOfPayment);

    const hasRows = await db.query.paymentPlans.findFirst({
      where: eq(paymentPlans.clientLotId, parseInt(clientLotId)),
    });

    if (hasRows) return;

    const totalTerms = terms * 12;

    const factors = {
      1: 0.091684,
      2: 0.049934,
      3: 0.036152,
      4: 0.029375,
      5: 0.025393,
    };

    const downpaymentPrice = price - price * downpayment;

    const actualPrice = Number(
      (downpaymentPrice * factors[terms as keyof typeof factors]).toFixed(2)
    );

    for (let x = 0; x < totalTerms; x++) {
      const installmentMonths = new Date(
        date.getFullYear(),
        date.getMonth() + x + 1,
        0
      );
      values.push({
        clientLotId,
        installmentMonths: `${x + 1}/${totalTerms}`,
        dueDate: useDateFormat(installmentMonths, "YYYY-MM-DD").value,
        paymentDue: actualPrice,
      });
    }
    return await db.insert(paymentPlans).values(values).returning();
  } catch (error) {
    return {
      error,
    };
  }
});

import { useDateFormat } from "@vueuse/core";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { perpetualCares } from "~/db/schema";

export default defineEventHandler(async (event) => {
  try {
    const body: any = await readBody(event);
    const { paymentDue, clientLotId, dateOfPayment } = body;
    const values = [];
    const date = new Date(dateOfPayment);

    const hasRows = await db.query.perpetualCares.findFirst({
      where: eq(perpetualCares.clientLotId, parseInt(clientLotId)),
    });

    if (hasRows) return;

    for (let x = 0; x <= 100; x += 10) {
      const installmentYears = new Date(
        date.getFullYear() + x,
        date.getMonth() + 1,
        0
      );
      values.push({
        clientLotId,
        installmentYears: x === 0 ? "1st Year" : `${x}th Year`,
        dueDate: useDateFormat(installmentYears, "YYYY-MM-DD").value,
        paymentDue,
      });
    }
    await db.insert(perpetualCares).values(values).returning();
  } catch (error) {
    return {
      error,
    };
  }
});

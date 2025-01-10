import { useDateFormat } from "@vueuse/core";
import { db } from "~/db";
import { perpetualCares } from "~/db/schema";

export default defineEventHandler(async (event) => {
  const body: any = await readBody(event);

  try {
    const paymentDue = body.lotPrice * 0.1;
    const { clientLotId } = body;
    const perpetualCareRows = [];
    const today = new Date();

    for (let x = 10; x <= 100; x += 10) {
      const installmentMonths = new Date(
        today.getFullYear() + x,
        today.getMonth() + 1,
        0
      );
      perpetualCareRows.push({
        clientLotId,
        paymentDue,
        installmentMonths: useDateFormat(installmentMonths, "YYYY-MM-DD").value,
        paid: 0,
        remainingBalance: paymentDue,
      });
    }
    return perpetualCareRows;

    return {
      body,
    };
  } catch (error) {
    return {
      error,
    };
  }
});

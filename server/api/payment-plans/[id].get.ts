import { eq, and } from "drizzle-orm";
import { db } from "~/db";
import { Invoice, invoices, paymentPlans } from "~/db/schema";

export default defineEventHandler(async (event) => {
  const id: any = getRouterParam(event, "id");

  const paymentPlansData = await db.query.paymentPlans.findMany({
    where: eq(paymentPlans.clientLotId, parseInt(id)),
    orderBy: [paymentPlans.dueDate],
  });

  if (paymentPlansData.length) {
    const invoicesData = await db.query.invoices.findMany({
      where: and(
        eq(invoices.clientLotId, parseInt(id)),
        eq(invoices.purpose, "Payment Plan")
      ),
    });

    let totalPaid = invoicesData.reduce(
      (currentValue, invoice: Invoice) => currentValue + invoice.payment,
      0
    );

    const paymentPlanRows = paymentPlansData.map((data) => {
      let status = "Pending";
      let paid = 0;
      const balance = (totalPaid -= data.paymentDue);

      if (balance >= 0) {
        status = "Paid";
        paid = data.paymentDue;
      }

      return {
        status,
        paid,
        ...data,
      };
    });

    return paymentPlanRows;
  }
  return [];
});

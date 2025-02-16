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
      const balance = (totalPaid -= data.paymentDue);
      const dueDate = new Date(data.dueDate);
      const currentDate = new Date();
      let status = "Pending";
      let paid = 0;

      if (dueDate < currentDate) status = "Overdue";

      if (balance >= 0) {
        status = "Paid";
        paid = data.paymentDue;
      } else {
        paid = balance + data.paymentDue > 0 ? balance + data.paymentDue : 0;
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

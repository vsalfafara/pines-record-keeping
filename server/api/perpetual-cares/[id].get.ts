import { eq, and } from "drizzle-orm";
import { db } from "~/db";
import { Invoice, invoices, perpetualCares } from "~/db/schema";

export default defineEventHandler(async (event) => {
  const id: any = getRouterParam(event, "id");

  const perpetualCaresData = await db.query.perpetualCares.findMany({
    where: eq(perpetualCares.clientLotId, parseInt(id)),
    orderBy: [perpetualCares.dueDate],
  });

  if (perpetualCaresData.length) {
    const invoicesData = await db.query.invoices.findMany({
      where: and(
        eq(invoices.clientLotId, parseInt(id)),
        eq(invoices.purpose, "Perpetual Care")
      ),
    });

    let totalPaid = invoicesData.reduce(
      (currentValue, invoice: Invoice) => currentValue + invoice.payment,
      0
    );

    const perpetualCareRows = perpetualCaresData.map((data) => {
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

    return perpetualCareRows;
  }
  return [];
});

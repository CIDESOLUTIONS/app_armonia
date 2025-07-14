import { prisma } from "@/lib/prisma";

interface BankStatementEntry {
  date: string;
  description: string;
  amount: number;
}

export async function reconcileBankStatement(
  statementEntries: BankStatementEntry[],
) {
  const pendingPayments = await prisma.payment.findMany({
    where: { status: "PENDING" },
  });

  const suggestions = statementEntries.map((entry) => {
    const potentialMatch = pendingPayments.find(
      (payment) =>
        payment.amount === entry.amount &&
        isSimilarDate(new Date(payment.dueDate), new Date(entry.date)),
    );

    if (potentialMatch) {
      return {
        statementEntry: entry,
        payment: potentialMatch,
        status: "SUGGESTED",
      };
    }

    return {
      statementEntry: entry,
      payment: null,
      status: "UNMATCHED",
    };
  });

  return suggestions;
}

function isSimilarDate(date1: Date, date2: Date) {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 5; // Considerar fechas dentro de un rango de 5 días
}

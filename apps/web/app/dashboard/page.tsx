import { prisma } from "@web/lib/db";
import { formatMoney } from "@web/lib/utils";

export default async function Dashboard() {
  // Simple cash flow summary for the last 30 days
  const user = await prisma.user.findFirst(); // demo single-user view
  if (!user) return <div>No user seeded.</div>;
  const since = new Date();
  since.setDate(since.getDate() - 30);
  const tx = await prisma.transaction.findMany({
    where: { userId: user.id, date: { gte: since } },
    select: { type: true, amountMinor: true }
  });
  const income = tx.filter(t => t.type === "income").reduce((a, b) => a + b.amountMinor, 0);
  const expense = tx.filter(t => t.type === "expense").reduce((a, b) => a + b.amountMinor, 0);
  const net = income - expense;
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card title="Income (30d)">{formatMoney(income, user.currency)}</Card>
      <Card title="Expense (30d)">{formatMoney(expense, user.currency)}</Card>
      <Card title="Net (30d)">{formatMoney(net, user.currency)}</Card>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="mb-2 text-sm text-slate-500">{title}</div>
      <div className="text-xl font-semibold">{children}</div>
    </div>
  );
}


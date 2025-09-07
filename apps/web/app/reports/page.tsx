import { prisma } from "@web/lib/db";
import { formatMoney } from "@web/lib/utils";

export default async function ReportsPage() {
  const user = await prisma.user.findFirst();
  if (!user) return <div>No user.</div>;
  const since = new Date();
  since.setDate(1);
  const grouped = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: { userId: user.id, date: { gte: since }, type: "expense" },
    _sum: { amountMinor: true },
  });
  const categories = await prisma.category.findMany({ where: { userId: user.id } });
  const rows = grouped.map((g) => ({
    name: categories.find((c) => c.id === g.categoryId)?.name || "Uncategorized",
    amountMinor: g._sum.amountMinor || 0,
  })).sort((a,b)=>b.amountMinor - a.amountMinor);
  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Reports</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <section className="rounded border p-4">
          <h2 className="mb-2 font-medium">Top Categories (This Month)</h2>
          <ul className="space-y-1 text-sm">
            {rows.map((r) => (
              <li key={r.name} className="flex items-center justify-between">
                <span>{r.name}</span>
                <span>{formatMoney(r.amountMinor, user.currency)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}


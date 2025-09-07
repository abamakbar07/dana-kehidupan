import { prisma } from "@web/lib/db";
import { endOfMonth, formatMoney, startOfMonth } from "@web/lib/utils";
import { Button, Input, Label, Select } from "@dana/ui";
import { upsertBudgetItem } from "./actions";

export default async function BudgetsPage() {
  const user = await prisma.user.findFirst();
  if (!user) return <div>No user.</div>;
  const s = startOfMonth();
  const e = endOfMonth();
  const [budget, categories, actuals] = await Promise.all([
    prisma.budget.findFirst({ where: { userId: user.id, periodStart: s } }),
    prisma.category.findMany({ where: { userId: user.id, type: "expense" } }),
    prisma.transaction.groupBy({ by: ["categoryId"], where: { userId: user.id, date: { gte: s, lte: e }, type: "expense" }, _sum: { amountMinor: true }})
  ]);
  const items = budget ? await prisma.budgetItem.findMany({ where: { budgetId: budget.id } }) : [];
  const actualMap = new Map(actuals.map(a => [a.categoryId ?? "", a._sum.amountMinor || 0]));
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <section>
        <h1 className="mb-2 text-xl font-semibold">Budget</h1>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="px-2 py-2">Category</th>
              <th className="px-2 py-2">Planned</th>
              <th className="px-2 py-2">Actual</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => {
              const planned = items.find(i => i.categoryId === c.id)?.plannedMinor ?? 0;
              const actual = actualMap.get(c.id) ?? 0;
              return (
                <tr key={c.id} className="border-t">
                  <td className="px-2 py-2">{c.name}</td>
                  <td className="px-2 py-2">{formatMoney(planned, user.currency)}</td>
                  <td className="px-2 py-2">{formatMoney(actual, user.currency)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
      <section>
        <h2 className="mb-2 font-medium">Set Planned Amount</h2>
        <form action={upsertBudgetItem} className="space-y-3">
          <div>
            <Label htmlFor="categoryId">Category</Label>
            <Select id="categoryId" name="categoryId">
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </div>
          <div>
            <Label htmlFor="plannedMinor">Planned (minor)</Label>
            <Input id="plannedMinor" name="plannedMinor" type="number" />
          </div>
          <Button type="submit">Save</Button>
        </form>
      </section>
    </div>
  );
}


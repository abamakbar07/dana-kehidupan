import { prisma } from "@web/lib/db";

export default async function DebtsPage() {
  const user = await prisma.user.findFirst();
  if (!user) return <div>No user.</div>;
  const debts = await prisma.debt.findMany({ where: { userId: user.id } });
  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Debts</h1>
      <ul className="divide-y">
        {debts.map((d) => (
          <li key={d.id} className="py-3">
            <div className="font-medium">{d.name}</div>
            <div className="text-sm text-slate-500">Principal: {d.principalMinor / 100} · APR: {d.apr}%</div>
          </li>
        ))}
      </ul>
    </div>
  );
}


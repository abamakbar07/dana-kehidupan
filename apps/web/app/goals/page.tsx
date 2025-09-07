import { prisma } from "@web/lib/db";

export default async function GoalsPage() {
  const user = await prisma.user.findFirst();
  if (!user) return <div>No user.</div>;
  const goals = await prisma.goal.findMany({ where: { userId: user.id } });
  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Goals</h1>
      <ul className="divide-y">
        {goals.map((g) => (
          <li key={g.id} className="py-3">
            <div className="font-medium">{g.name}</div>
            <div className="text-sm text-slate-500">Target: {g.targetMinor / 100} · Current: {g.currentMinor / 100}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}


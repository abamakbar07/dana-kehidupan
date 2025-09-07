"use server";
import { prisma } from "@web/lib/db";
import { budgetItemSchema } from "@web/lib/schemas";
import { startOfMonth, endOfMonth } from "@web/lib/utils";

export async function upsertBudgetItem(form: FormData) {
  const user = await prisma.user.findFirst();
  if (!user) return { ok: false as const, errors: { _form: ["No user"] } };
  const parsed = budgetItemSchema.safeParse({
    categoryId: form.get("categoryId"),
    plannedMinor: form.get("plannedMinor"),
  });
  if (!parsed.success) return { ok: false as const, errors: parsed.error.flatten().fieldErrors };
  const s = startOfMonth();
  const e = endOfMonth();
  const budget = await prisma.budget.upsert({
    where: { id: `${user.id}-${s.toISOString().slice(0,10)}` },
    update: {},
    create: { id: `${user.id}-${s.toISOString().slice(0,10)}`, userId: user.id, periodStart: s, periodEnd: e, currency: user.currency }
  });
  const id = `${budget.id}-${parsed.data.categoryId}`;
  await prisma.budgetItem.upsert({
    where: { id },
    update: { plannedMinor: parsed.data.plannedMinor },
    create: { id, budgetId: budget.id, categoryId: parsed.data.categoryId, plannedMinor: parsed.data.plannedMinor }
  });
  return { ok: true as const };
}


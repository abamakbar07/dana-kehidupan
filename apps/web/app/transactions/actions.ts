"use server";
import { prisma } from "@web/lib/db";
import { transactionCreateSchema } from "@web/lib/schemas";

export async function createTransaction(form: FormData) {
  const parsed = transactionCreateSchema.safeParse({
    accountId: form.get("accountId"),
    type: form.get("type"),
    amountMinor: form.get("amountMinor"),
    currency: form.get("currency"),
    date: form.get("date"),
    payee: form.get("payee"),
    description: form.get("description"),
    categoryId: form.get("categoryId") || undefined,
  });
  if (!parsed.success) return { ok: false as const, errors: parsed.error.flatten().fieldErrors };
  const user = await prisma.user.findFirst();
  if (!user) return { ok: false as const, errors: { _form: ["No user"] } };
  await prisma.transaction.create({ data: { userId: user.id, ...parsed.data } });
  return { ok: true as const };
}


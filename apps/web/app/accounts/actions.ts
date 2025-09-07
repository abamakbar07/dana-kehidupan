"use server";
import { prisma } from "@web/lib/db";
import { accountCreateSchema } from "@web/lib/schemas";

export async function createAccount(form: FormData) {
  const parsed = accountCreateSchema.safeParse({
    name: form.get("name"),
    type: form.get("type"),
    currency: form.get("currency"),
    openingBalance: form.get("openingBalance")
  });
  if (!parsed.success) {
    return { ok: false as const, errors: parsed.error.flatten().fieldErrors };
  }
  const user = await prisma.user.findFirst();
  if (!user) return { ok: false as const, errors: { _form: ["No user"] } };
  await prisma.account.create({ data: { userId: user.id, ...parsed.data } });
  return { ok: true as const };
}


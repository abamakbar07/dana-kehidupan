"use server";
import Papa from "papaparse";
import { prisma } from "@web/lib/db";
import { csvImportSchema } from "@web/lib/schemas";

export async function importCsv(form: FormData) {
  const payload = {
    accountId: String(form.get("accountId")),
    csvText: String(form.get("csvText")),
    mapper: {
      date: String(form.get("map_date")),
      description: String(form.get("map_description")),
      amount: String(form.get("map_amount")),
      type: form.get("map_type") ? String(form.get("map_type")) : undefined,
    },
  } as const;

  const parsed = csvImportSchema.safeParse(payload);
  if (!parsed.success) return { ok: false as const, errors: parsed.error.flatten().fieldErrors };

  const user = await prisma.user.findFirst();
  if (!user) return { ok: false as const, errors: { _form: ["No user"] } };
  const { data, errors } = Papa.parse(parsed.data.csvText, { header: true, skipEmptyLines: true });
  if (errors.length) return { ok: false as const, errors: { csv: errors.map((e) => e.message) } };

  let created = 0;
  for (const row of data as any[]) {
    const dateStr = row[parsed.data.mapper.date];
    const description = row[parsed.data.mapper.description] ?? "";
    const amount = Number(String(row[parsed.data.mapper.amount]).replace(/[^0-9.-]/g, ""));
    if (!dateStr || Number.isNaN(amount)) continue;
    const date = new Date(dateStr);
    const type = amount >= 0 ? "income" : "expense";
    const amountMinor = Math.round(Math.abs(amount) * 100);
    const importHash = `${date.toISOString().slice(0,10)}:${description}:${amountMinor}:${parsed.data.accountId}`;
    await prisma.transaction.upsert({
      where: { importHash },
      update: {},
      create: {
        userId: user.id,
        accountId: parsed.data.accountId,
        type: type as any,
        amountMinor,
        currency: user.currency,
        date,
        payee: description,
        description,
        importHash,
      },
    });
    created++;
  }

  return { ok: true as const, created };
}


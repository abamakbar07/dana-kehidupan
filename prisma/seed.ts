import { PrismaClient, AccountType, CategoryType, DebtType, TransactionType } from "@prisma/client";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.DEMO_EMAIL || "demo@example.com";
  const password = process.env.DEMO_PASSWORD || "demo1234";
  const password_hash = await bcrypt.hash(password, 10);

  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({ data: { email, password_hash, name: "Demo User", locale: "id-ID", currency: "IDR" } });
  }

  const [cash, bank, wallet] = await Promise.all([
    upsertAccount(user.id, "Cash", AccountType.cash),
    upsertAccount(user.id, "Bank", AccountType.bank),
    upsertAccount(user.id, "E-Wallet", AccountType.wallet),
  ]);

  const food = await upsertCategory(user.id, "Food", CategoryType.expense);
  const groceries = await upsertCategory(user.id, "Groceries", CategoryType.expense, food.id);
  const incomeCat = await upsertCategory(user.id, "Salary", CategoryType.income);

  const tags = await Promise.all([
    upsertTag(user.id, "family", "#3b82f6"),
    upsertTag(user.id, "work", "#10b981"),
    upsertTag(user.id, "fun", "#f59e0b"),
  ]);

  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  const currencies = ["IDR"]; // extensible

  // Seed 12 months of transactions
  const accounts = [cash, bank, wallet];
  let count = 0;
  for (let m = 0; m < 12; m++) {
    for (const acc of accounts) {
      // Salary income monthly
      const payday = new Date(start.getFullYear(), start.getMonth() + m, 25);
      await createTransaction(user.id, acc.id, TransactionType.income, 25_000_000, currencies[0], payday, "Employer", "Monthly salary", incomeCat.id);

      // 20 random expenses
      for (let i = 0; i < 20; i++) {
        const day = Math.floor(Math.random() * 27) + 1;
        const date = new Date(start.getFullYear(), start.getMonth() + m, day);
        const amount = Math.floor(Math.random() * 300_000) + 20_000;
        const payee = ["Alfamart", "Indomaret", "Tokopedia", "Grab", "GoFood"][i % 5];
        const categoryId = i % 4 === 0 ? groceries.id : food.id;
        const t = await createTransaction(user.id, acc.id, TransactionType.expense, amount, currencies[0], date, payee, "", categoryId);
        // attach random tags
        const tag = tags[i % tags.length];
        await prisma.transactionTag.create({ data: { transactionId: t.id, tagId: tag.id } });
        count++;
      }
    }
  }

  // Budget current month
  const bStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const bEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const budget = await prisma.budget.upsert({
    where: { id: `${user.id}-${bStart.toISOString().slice(0,10)}` },
    update: {},
    create: { id: `${user.id}-${bStart.toISOString().slice(0,10)}`, userId: user.id, periodStart: bStart, periodEnd: bEnd, currency: "IDR" }
  });
  await prisma.budgetItem.upsert({
    where: { id: `${budget.id}-${groceries.id}` },
    update: {},
    create: { id: `${budget.id}-${groceries.id}`, budgetId: budget.id, categoryId: groceries.id, plannedMinor: 4_000_000, carriedOverMinor: 0 }
  });

  // Envelope
  await prisma.envelope.upsert({
    where: { id: `${user.id}-emergency` },
    update: {},
    create: { id: `${user.id}-emergency`, userId: user.id, name: "Emergency Fund", balanceMinor: 2_500_000 }
  });

  // Goal & Debt
  await prisma.goal.upsert({
    where: { id: `${user.id}-vacation` },
    update: {},
    create: { id: `${user.id}-vacation`, userId: user.id, name: "Vacation Bali", targetMinor: 15_000_000, targetDate: new Date(now.getFullYear(), now.getMonth() + 6, 1), currentMinor: 3_000_000, priority: 1 }
  });

  await prisma.debt.upsert({
    where: { id: `${user.id}-credit-card` },
    update: {},
    create: { id: `${user.id}-credit-card`, userId: user.id, name: "Credit Card", principalMinor: 5_000_000, apr: 24, minimumPaymentMinor: 500_000, dueDayOfMonth: 15, type: DebtType.card, accountId: bank.id }
  });

  console.log("Seed complete.");
  console.log("Demo login:", { email, password });
}

async function upsertAccount(userId: string, name: string, type: any) {
  const id = `${userId}-${name.toLowerCase()}`;
  return prisma.account.upsert({
    where: { id },
    update: {},
    create: { id, userId, name, type, currency: "IDR", openingBalance: 0 },
  });
}

async function upsertCategory(userId: string, name: string, type: any, parentId?: string) {
  const existing = await prisma.category.findFirst({ where: { userId, name, parentId: parentId ?? null } });
  if (existing) return existing;
  return prisma.category.create({ data: { userId, name, type, parentId } });
}

async function upsertTag(userId: string, name: string, color?: string) {
  const existing = await prisma.tag.findFirst({ where: { userId, name } });
  if (existing) return existing;
  return prisma.tag.create({ data: { userId, name, color } });
}

async function createTransaction(
  userId: string,
  accountId: string,
  type: TransactionType,
  amountMinor: number,
  currency: string,
  date: Date,
  payee?: string,
  description?: string,
  categoryId?: string
) {
  const importHash = `${date.toISOString().slice(0,10)}:${payee || ""}:${amountMinor}:${accountId}`;
  return prisma.transaction.upsert({
    where: { importHash },
    update: {},
    create: { userId, accountId, type, amountMinor, currency, date, payee, description, categoryId, importHash, isPending: false },
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => prisma.$disconnect());


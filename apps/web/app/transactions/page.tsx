import { prisma } from "@web/lib/db";
import { Button, Input, Label, Select } from "@dana/ui";
import { createTransaction } from "./actions";
import Link from "next/link";
import { formatMoney } from "@web/lib/utils";

export default async function TransactionsPage() {
  const user = await prisma.user.findFirst();
  if (!user) return <div>No user.</div>;
  const [accounts, categories, transactions] = await Promise.all([
    prisma.account.findMany({ where: { userId: user.id } }),
    prisma.category.findMany({ where: { userId: user.id } }),
    prisma.transaction.findMany({ where: { userId: user.id }, orderBy: { date: "desc" }, take: 100 }),
  ]);
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <section className="lg:col-span-2">
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Transactions</h1>
          <Link className="text-sm underline" href="/transactions/import">Import CSV</Link>
        </div>
        <div className="overflow-auto rounded border">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Account</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Payee</th>
                <th className="px-3 py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="px-3 py-2">{t.date.toISOString().slice(0,10)}</td>
                  <td className="px-3 py-2">{accounts.find(a=>a.id===t.accountId)?.name}</td>
                  <td className="px-3 py-2 capitalize">{t.type}</td>
                  <td className="px-3 py-2">{t.payee}</td>
                  <td className="px-3 py-2">{formatMoney(t.amountMinor, t.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 className="mb-2 font-medium">Add Transaction</h2>
        <form action={createTransaction} className="space-y-3">
          <div>
            <Label htmlFor="accountId">Account</Label>
            <Select id="accountId" name="accountId">
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <Select id="type" name="type" defaultValue="expense">
              <option value="expense">Expense</option>
              <option value="income">Income</option>
              <option value="transfer">Transfer</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="amountMinor">Amount (minor)</Label>
            <Input id="amountMinor" name="amountMinor" type="number" required />
          </div>
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Input id="currency" name="currency" defaultValue={user.currency} />
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input id="date" name="date" type="date" defaultValue={new Date().toISOString().slice(0,10)} />
          </div>
          <div>
            <Label htmlFor="payee">Payee</Label>
            <Input id="payee" name="payee" />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" />
          </div>
          <div>
            <Label htmlFor="categoryId">Category</Label>
            <Select id="categoryId" name="categoryId">
              <option value="">Uncategorized</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </div>
          <Button type="submit">Create</Button>
        </form>
      </section>
    </div>
  );
}


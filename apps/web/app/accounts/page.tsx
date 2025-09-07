import { prisma } from "@web/lib/db";
import { createAccount } from "./actions";
import { Button, Input, Label, Select } from "@dana/ui";

export default async function AccountsPage() {
  const user = await prisma.user.findFirst();
  if (!user) return <div>Seed data not found.</div>;
  const accounts = await prisma.account.findMany({ where: { userId: user.id } });
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <section>
        <h1 className="mb-2 text-xl font-semibold">Accounts</h1>
        <ul className="divide-y">
          {accounts.map((a) => (
            <li key={a.id} className="py-3">
              <div className="font-medium">{a.name}</div>
              <div className="text-sm text-slate-500">{a.type} · {a.currency}</div>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="mb-2 font-medium">Add Account</h2>
        <form action={createAccount} className="space-y-3">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <Select id="type" name="type" defaultValue="cash">
              <option value="cash">Cash</option>
              <option value="bank">Bank</option>
              <option value="wallet">E-Wallet</option>
              <option value="investment">Investment</option>
              <option value="liability">Liability</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Input id="currency" name="currency" defaultValue={user.currency} />
          </div>
          <div>
            <Label htmlFor="openingBalance">Opening Balance (minor)</Label>
            <Input id="openingBalance" name="openingBalance" type="number" defaultValue={0} />
          </div>
          <Button type="submit">Create</Button>
        </form>
      </section>
    </div>
  );
}


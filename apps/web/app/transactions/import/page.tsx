import { prisma } from "@web/lib/db";
import { Button, Input, Label, Select } from "@dana/ui";
import { importCsv } from "./actions";

export default async function ImportPage() {
  const user = await prisma.user.findFirst();
  if (!user) return <div>No user.</div>;
  const accounts = await prisma.account.findMany({ where: { userId: user.id } });
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Import CSV</h1>
      <p className="text-sm text-slate-600">Upload CSV content. Minimal mapping: date, description, amount. Positive=income, negative=expense.</p>
      <form action={importCsv} className="space-y-3">
        <div>
          <Label htmlFor="accountId">Account</Label>
          <Select id="accountId" name="accountId">
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="csvText">CSV Text</Label>
          <textarea id="csvText" name="csvText" className="h-40 w-full rounded border p-2 font-mono text-xs" placeholder="date,description,amount\n2024-01-02,Store,-25000" />
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div>
            <Label htmlFor="map_date">Date column</Label>
            <Input id="map_date" name="map_date" defaultValue="date" />
          </div>
          <div>
            <Label htmlFor="map_description">Description column</Label>
            <Input id="map_description" name="map_description" defaultValue="description" />
          </div>
          <div>
            <Label htmlFor="map_amount">Amount column</Label>
            <Input id="map_amount" name="map_amount" defaultValue="amount" />
          </div>
          <div>
            <Label htmlFor="map_type">Type column (optional)</Label>
            <Input id="map_type" name="map_type" placeholder="type" />
          </div>
        </div>
        <Button type="submit">Import</Button>
      </form>
    </div>
  );
}


export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Settings</h1>
      <section className="rounded border p-4 text-sm">
        <h2 className="mb-2 font-medium">Security</h2>
        <ul className="list-disc pl-5 text-slate-600">
          <li>Secure cookies (SameSite=Strict) enabled</li>
          <li>Content Security Policy via middleware</li>
          <li>Input validation with Zod on server actions</li>
        </ul>
      </section>
    </div>
  );
}


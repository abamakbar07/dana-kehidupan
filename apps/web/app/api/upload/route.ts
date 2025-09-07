import { NextResponse } from "next/server";
import { LocalStorageAdapter } from "@web/lib/storage";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "File too large" }, { status: 413 });
  const allowed = ["image/png", "image/jpeg", "image/webp", "application/pdf"];
  if (!allowed.includes(file.type)) return NextResponse.json({ error: "Invalid type" }, { status: 415 });

  const buf = Buffer.from(await file.arrayBuffer());
  const adapter = new LocalStorageAdapter();
  const key = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-]/g, "_")}`;
  const url = await adapter.put(key, buf, file.type);
  return NextResponse.json({ url });
}


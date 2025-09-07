import { NextResponse } from "next/server";
import { prisma } from "@web/lib/db";
import { accountCreateSchema } from "@web/lib/schemas";

export async function GET() {
  const user = await prisma.user.findFirst();
  if (!user) return NextResponse.json([], { status: 200 });
  const accounts = await prisma.account.findMany({ where: { userId: user.id } });
  return NextResponse.json(accounts);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = accountCreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const user = await prisma.user.findFirst();
  if (!user) return NextResponse.json({ error: "No user" }, { status: 400 });
  const acc = await prisma.account.create({ data: { userId: user.id, ...parsed.data } });
  return NextResponse.json(acc, { status: 201 });
}


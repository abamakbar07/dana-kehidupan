import { NextResponse } from "next/server";
import { prisma } from "@web/lib/db";
import { transactionCreateSchema } from "@web/lib/schemas";

export async function GET() {
  const user = await prisma.user.findFirst();
  if (!user) return NextResponse.json([], { status: 200 });
  const tx = await prisma.transaction.findMany({ where: { userId: user.id }, orderBy: { date: "desc" }, take: 100 });
  return NextResponse.json(tx);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = transactionCreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const user = await prisma.user.findFirst();
  if (!user) return NextResponse.json({ error: "No user" }, { status: 400 });
  const tx = await prisma.transaction.create({ data: { userId: user.id, ...parsed.data } });
  return NextResponse.json(tx, { status: 201 });
}


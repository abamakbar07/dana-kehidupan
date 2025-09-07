import { z } from "zod";

export const accountCreateSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["cash", "bank", "wallet", "investment", "liability"]),
  currency: z.string().min(3).max(3),
  openingBalance: z.coerce.number().int().default(0),
});

export const transactionCreateSchema = z.object({
  accountId: z.string().min(1),
  type: z.enum(["expense", "income", "transfer"]),
  amountMinor: z.coerce.number().int(),
  currency: z.string().min(3).max(3),
  date: z.coerce.date(),
  payee: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string().optional(),
});

export const budgetItemSchema = z.object({
  categoryId: z.string(),
  plannedMinor: z.coerce.number().int(),
});

export const csvImportSchema = z.object({
  accountId: z.string(),
  csvText: z.string().min(1),
  mapper: z.object({
    date: z.string(),
    description: z.string(),
    amount: z.string(),
    type: z.string().optional(),
  })
});

export type AccountCreateInput = z.infer<typeof accountCreateSchema>;
export type TransactionCreateInput = z.infer<typeof transactionCreateSchema>;


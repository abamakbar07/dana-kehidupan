import { Queue, Worker, QueueScheduler, JobsOptions } from "bullmq";
import IORedis from "ioredis";
import { PrismaClient } from "@prisma/client";

const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379");
const prisma = new PrismaClient();

type JobName = "recurring:execute" | "fx:refresh" | "budget:rollover";

const queues = {
  recurring: new Queue("recurring", { connection }),
  fx: new Queue("fx", { connection }),
  budget: new Queue("budget", { connection }),
};

new QueueScheduler("recurring", { connection });
new QueueScheduler("fx", { connection });
new QueueScheduler("budget", { connection });

new Worker("recurring", async () => {
  // TODO: parse cron-like schedules and create transactions per templateJSON
  console.log("Executing recurring rules...");
  const rules = await prisma.recurringRule.findMany({ where: { isActive: true } });
  console.log(`Found ${rules.length} rules.`);
}, { connection });

new Worker("fx", async () => {
  // TODO: replace with real FX provider
  console.log("Refreshing FX rates (mock)...");
  const today = new Date();
  await prisma.fxRate.upsert({
    where: { date_base_quote: { date: today, base: "USD", quote: "IDR" } },
    update: { rate: 16000 },
    create: { date: today, base: "USD", quote: "IDR", rate: 16000 },
  });
}, { connection });

new Worker("budget", async () => {
  // TODO: rollover logic from previous period
  console.log("Running budget rollover...");
}, { connection });

async function enqueueRecurring() {
  await queues.recurring.add("recurring:execute", {}, { repeat: { cron: "0 * * * *" } as any });
}

async function enqueueFx() {
  await queues.fx.add("fx:refresh", {}, { repeat: { cron: "0 2 * * *" } as any });
}

async function enqueueBudget() {
  await queues.budget.add("budget:rollover", {}, { repeat: { cron: "0 0 1 * *" } as any });
}

enqueueRecurring();
enqueueFx();
enqueueBudget();

console.log("Worker started.");


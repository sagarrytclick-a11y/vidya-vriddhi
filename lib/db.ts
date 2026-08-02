import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined;
};

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set in environment variables");
  }

  // Neon (serverless): keep pool tiny. Prefer a pooled connection string
  // (host contains "-pooler") from the Neon dashboard to cut connection churn.
  const pool =
    globalForPrisma.pgPool ??
    new Pool({
      connectionString,
      max: 3,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 10000,
      maxUses: 7500,
    });

  globalForPrisma.pgPool = pool;

  // Type cast required due to @prisma/adapter-pg having different @types/pg version than project's pg package
  const adapter = new PrismaPg(pool as any);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

// Always reuse across hot reloads AND serverless warm isolates
globalForPrisma.prisma = db;

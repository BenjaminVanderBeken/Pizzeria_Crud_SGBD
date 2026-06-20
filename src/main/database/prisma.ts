import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../../prisma/generated/client.js';

const adapter = new PrismaBetterSqlite3({
  url: 'file:./pizzeria.db',
});

export const prisma = new PrismaClient({
  adapter,
});

export async function closePrisma(): Promise<void> {
  await prisma.$disconnect();
}

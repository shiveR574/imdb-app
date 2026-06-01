import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const getPrismaClient = () => {
  // 1. Create a native connection pool using your environment variable
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  // 2. Wrap it inside Prisma's official PG adapter
  const adapter = new PrismaPg(pool);
  
  // 3. Feed the adapter into the client initialization options
  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma || getPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
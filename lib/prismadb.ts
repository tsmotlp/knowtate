import { PrismaClient } from "@prisma/client";
import path from 'path';

declare global {
  var prisma: PrismaClient | undefined;
}

const filePath = path.join(process.cwd(), 'prisma/researcher.db')
const prismadb = globalThis.prisma || new PrismaClient({
  datasources: {
    db: {
      // url: process.env.DATABASE_URL,
      url: 'file:' + filePath,
    },
  },
});
if (process.env.NODE_ENV !== "production") globalThis.prisma = prismadb;

export default prismadb;

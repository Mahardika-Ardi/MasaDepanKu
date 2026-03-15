import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export async function connectionDatabase() {
  try {
    await prisma.$connect();
    console.log("-- Database Connected ✔️  --");
  } catch (error) {
    console.error("-- Database Connection Failed ❌ --");
    throw error;
  }
}

export default prisma;

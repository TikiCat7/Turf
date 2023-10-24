import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

neonConfig.fetchConnectionCache = true;

if (!process.env.DATASBASSE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const sql = neon(process.env.DATASBASSE_URL);

export const db = drizzle(sql);

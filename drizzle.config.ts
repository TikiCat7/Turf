import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

// TODO: smelly
dotenv.config({ path: ".env.local" });

export default {
  driver: "pg",
  schema: "./src/lib/db/schema.ts",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;

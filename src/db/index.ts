import { SQL } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL environment variable is required");
}

export const client = new SQL({ url, tls: true });
export const db = drizzle({ client, schema });

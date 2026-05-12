import { db } from '../src/db';
import { campaigns, docs } from '../src/db/schema';
import { count, eq } from 'drizzle-orm';

const rows = await db.select().from(campaigns);
for (const c of rows) {
  const [dc] = await db.select({ value: count() }).from(docs).where(eq(docs.campaignId, c.id));
  console.log(`${c.id}\t${c.name}\t${c.slug}\tdocs=${dc?.value}`);
}
process.exit(0);

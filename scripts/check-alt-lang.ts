import { db } from '../src/db';
import { campaigns, docs } from '../src/db/schema';
import { eq, asc } from 'drizzle-orm';
const [c]=await db.select().from(campaigns).where(eq(campaigns.slug,'alternative-shot'));
const rows=await db.select({title:docs.title,content:docs.content}).from(docs).where(eq(docs.campaignId,c!.id)).orderBy(asc(docs.createdAt));
for (const d of rows) console.log(`${d.content.includes('<!-- lang:de -->') && d.content.includes('<!-- lang:en -->') ? 'OK' : 'NO'} ${d.title}`);
process.exit(0);

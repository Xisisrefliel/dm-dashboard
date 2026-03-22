import { db } from "../db";
import {
  campaigns,
  categories,
  docs,
  campaignMembers,
} from "../db/schema";
import { eq, and, ne, sql, desc, asc } from "drizzle-orm";
import { getSession } from "./auth";
import { DEFAULT_CATEGORIES } from "../data/sampleCampaign.ts";

function slugify(name: string): string {
  return (
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "campaign"
  );
}

async function uniqueSlug(
  userId: string,
  name: string,
  excludeId?: string,
): Promise<string> {
  const base = slugify(name);
  let slug = base;
  let i = 2;
  while (true) {
    const conditions = excludeId
      ? and(
          eq(campaigns.userId, userId),
          eq(campaigns.slug, slug),
          ne(campaigns.id, excludeId),
        )
      : and(eq(campaigns.userId, userId), eq(campaigns.slug, slug));

    const [existing] = await db
      .select({ id: campaigns.id })
      .from(campaigns)
      .where(conditions);
    if (!existing) return slug;
    slug = `${base}-${i++}`;
  }
}

function formatCampaignSummary(c: any, role: string = "owner") {
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description,
    color: c.color,
    docCount: c.docCount,
    categoryCount: c.categoryCount,
    role,
  };
}

export const campaignRoutes = {
  "/api/campaigns": {
    async GET(req: Request) {
      const user = await getSession(req);
      if (!user)
        return Response.json({ error: "Unauthorized" }, { status: 401 });

      const owned = await db
        .select({
          id: campaigns.id,
          slug: campaigns.slug,
          name: campaigns.name,
          description: campaigns.description,
          color: campaigns.color,
          updatedAt: campaigns.updatedAt,
          docCount: sql<number>`(SELECT COUNT(*)::int FROM docs WHERE campaign_id = ${campaigns.id})`,
          categoryCount: sql<number>`(SELECT COUNT(*)::int FROM categories WHERE campaign_id = ${campaigns.id})`,
        })
        .from(campaigns)
        .where(eq(campaigns.userId, user.id))
        .orderBy(desc(campaigns.updatedAt));

      const joined = await db
        .select({
          id: campaigns.id,
          slug: campaigns.slug,
          name: campaigns.name,
          description: campaigns.description,
          color: campaigns.color,
          updatedAt: campaigns.updatedAt,
          docCount: sql<number>`(SELECT COUNT(*)::int FROM docs WHERE campaign_id = ${campaigns.id} AND shared_with_party = true)`,
          categoryCount: sql<number>`(SELECT COUNT(*)::int FROM categories WHERE campaign_id = ${campaigns.id})`,
        })
        .from(campaigns)
        .innerJoin(campaignMembers, eq(campaignMembers.campaignId, campaigns.id))
        .where(eq(campaignMembers.userId, user.id))
        .orderBy(desc(campaigns.updatedAt));

      return Response.json([
        ...owned.map((c) => formatCampaignSummary(c, "owner")),
        ...joined.map((c) => formatCampaignSummary(c, "member")),
      ]);
    },

    async POST(req: Request) {
      const user = await getSession(req);
      if (!user)
        return Response.json({ error: "Unauthorized" }, { status: 401 });

      const { name, description, color } = await req.json();
      if (!name?.trim()) {
        return Response.json({ error: "Name is required" }, { status: 400 });
      }

      const slug = await uniqueSlug(user.id, name.trim());

      let campaign: any;
      const cats: any[] = [];

      await db.transaction(async (tx) => {
        [campaign] = await tx
          .insert(campaigns)
          .values({
            userId: user.id,
            slug,
            name: name.trim(),
            description: description || "",
            color: color || "#9fd494",
          })
          .returning();

        for (let i = 0; i < DEFAULT_CATEGORIES.length; i++) {
          const cat = DEFAULT_CATEGORIES[i]!;
          const [row] = await tx
            .insert(categories)
            .values({
              campaignId: campaign.id,
              key: cat.key,
              label: cat.label,
              icon: cat.icon,
              sortOrder: i,
            })
            .returning();
          cats.push(row);
        }
      });

      return Response.json(
        {
          id: campaign.id,
          slug: campaign.slug,
          name: campaign.name,
          description: campaign.description,
          color: campaign.color,
          docs: [],
          categories: cats.map((c: any) => ({
            key: c.key,
            label: c.label,
            icon: c.icon,
          })),
        },
        { status: 201 },
      );
    },
  },

  "/api/campaigns/:id": {
    async GET(req: Request) {
      const user = await getSession(req);
      if (!user)
        return Response.json({ error: "Unauthorized" }, { status: 401 });

      const { id } = (req as any).params;

      // Accept both UUID and slug
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-/.test(id);
      const [campaign] = await db
        .select()
        .from(campaigns)
        .where(isUUID ? eq(campaigns.id, id) : eq(campaigns.slug, id));
      if (!campaign) {
        return Response.json({ error: "Not found" }, { status: 404 });
      }

      const isOwner = campaign.userId === user.id;
      if (!isOwner) {
        const [member] = await db
          .select({ id: campaignMembers.id })
          .from(campaignMembers)
          .where(
            and(
              eq(campaignMembers.campaignId, campaign.id),
              eq(campaignMembers.userId, user.id),
            ),
          );
        if (!member) {
          return Response.json({ error: "Not found" }, { status: 404 });
        }
      }

      const cats = await db
        .select({
          key: categories.key,
          label: categories.label,
          icon: categories.icon,
        })
        .from(categories)
        .where(eq(categories.campaignId, campaign.id))
        .orderBy(asc(categories.sortOrder));

      const docsCondition = isOwner
        ? eq(docs.campaignId, campaign.id)
        : and(eq(docs.campaignId, campaign.id), eq(docs.sharedWithParty, true));

      const docRows = await db
        .select({
          id: docs.id,
          category: docs.categoryKey,
          title: docs.title,
          icon: docs.icon,
          content: docs.content,
          parentId: docs.parentId,
          sharedWithParty: docs.sharedWithParty,
        })
        .from(docs)
        .where(docsCondition)
        .orderBy(asc(docs.createdAt));

      return Response.json({
        id: campaign.id,
        slug: campaign.slug,
        name: campaign.name,
        description: campaign.description,
        color: campaign.color,
        role: isOwner ? "owner" : "member",
        categories: cats.map((c) => ({
          key: c.key,
          label: c.label,
          icon: c.icon,
        })),
        docs: docRows.map((d) => ({
          id: d.id,
          title: d.title,
          category: d.category,
          icon: d.icon,
          content: d.content,
          parentId: d.parentId || null,
          shared: d.sharedWithParty || false,
        })),
      });
    },

    async PUT(req: Request) {
      const user = await getSession(req);
      if (!user)
        return Response.json({ error: "Unauthorized" }, { status: 401 });

      const { id } = (req as any).params;
      const { name, description, color } = await req.json();

      const newSlug = name?.trim()
        ? await uniqueSlug(user.id, name.trim(), id)
        : null;

      const [campaign] = await db
        .update(campaigns)
        .set({
          name: sql`COALESCE(${name ?? null}, ${campaigns.name})`,
          slug: sql`COALESCE(${newSlug}, ${campaigns.slug})`,
          description: sql`COALESCE(${description ?? null}, ${campaigns.description})`,
          color: sql`COALESCE(${color ?? null}, ${campaigns.color})`,
          updatedAt: new Date(),
        })
        .where(and(eq(campaigns.id, id), eq(campaigns.userId, user.id)))
        .returning();
      if (!campaign) {
        return Response.json({ error: "Not found" }, { status: 404 });
      }

      return Response.json({
        id: campaign.id,
        slug: campaign.slug,
        name: campaign.name,
        description: campaign.description,
        color: campaign.color,
      });
    },

    async DELETE(req: Request) {
      const user = await getSession(req);
      if (!user)
        return Response.json({ error: "Unauthorized" }, { status: 401 });

      const { id } = (req as any).params;

      const [campaign] = await db
        .delete(campaigns)
        .where(and(eq(campaigns.id, id), eq(campaigns.userId, user.id)))
        .returning({ id: campaigns.id });
      if (!campaign) {
        return Response.json({ error: "Not found" }, { status: 404 });
      }

      return Response.json({ ok: true });
    },
  },
};

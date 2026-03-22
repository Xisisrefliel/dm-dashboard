import { db } from "../db";
import { campaigns, docs } from "../db/schema";
import { eq, and, sql } from "drizzle-orm";
import { getSession } from "./auth";

export const docRoutes = {
  "/api/campaigns/:campaignId/docs": {
    async POST(req: Request) {
      const user = await getSession(req);
      if (!user)
        return Response.json({ error: "Unauthorized" }, { status: 401 });

      const { campaignId } = (req as any).params;

      const [campaign] = await db
        .select({ id: campaigns.id })
        .from(campaigns)
        .where(and(eq(campaigns.id, campaignId), eq(campaigns.userId, user.id)));
      if (!campaign) {
        return Response.json(
          { error: "Campaign not found" },
          { status: 404 },
        );
      }

      const { title, category, icon, content, parentId } = await req.json();
      if (!title?.trim()) {
        return Response.json(
          { error: "Title is required" },
          { status: 400 },
        );
      }

      const [doc] = await db
        .insert(docs)
        .values({
          campaignId,
          categoryKey: category || "locations",
          title: title.trim(),
          icon: icon || "description",
          content: content || "",
          parentId: parentId || null,
        })
        .returning({
          id: docs.id,
          category: docs.categoryKey,
          title: docs.title,
          icon: docs.icon,
          content: docs.content,
          parentId: docs.parentId,
        });

      await db
        .update(campaigns)
        .set({ updatedAt: new Date() })
        .where(eq(campaigns.id, campaignId));

      return Response.json(
        {
          id: doc.id,
          title: doc.title,
          category: doc.category,
          icon: doc.icon,
          content: doc.content,
          parentId: doc.parentId || null,
        },
        { status: 201 },
      );
    },
  },

  "/api/docs/:id": {
    async PUT(req: Request) {
      const user = await getSession(req);
      if (!user)
        return Response.json({ error: "Unauthorized" }, { status: 401 });

      const { id } = (req as any).params;
      const updates = await req.json();

      const [existing] = await db
        .select({ id: docs.id, campaignId: docs.campaignId })
        .from(docs)
        .innerJoin(campaigns, eq(campaigns.id, docs.campaignId))
        .where(and(eq(docs.id, id), eq(campaigns.userId, user.id)));
      if (!existing) {
        return Response.json({ error: "Not found" }, { status: 404 });
      }

      // Only update parent_id if explicitly provided in the payload
      const parentIdVal =
        "parentId" in updates ? updates.parentId || null : undefined;
      const sharedVal =
        "shared" in updates ? !!updates.shared : undefined;

      const setClause: Record<string, any> = {
        title: sql`COALESCE(${updates.title ?? null}, ${docs.title})`,
        icon: sql`COALESCE(${updates.icon ?? null}, ${docs.icon})`,
        content: sql`COALESCE(${updates.content ?? null}, ${docs.content})`,
        categoryKey: sql`COALESCE(${updates.category ?? null}, ${docs.categoryKey})`,
        sharedWithParty: sql`COALESCE(${sharedVal ?? null}, ${docs.sharedWithParty})`,
        updatedAt: new Date(),
      };
      if (parentIdVal !== undefined) {
        setClause.parentId = parentIdVal;
      }

      const [doc] = await db
        .update(docs)
        .set(setClause)
        .where(eq(docs.id, id))
        .returning({
          id: docs.id,
          category: docs.categoryKey,
          title: docs.title,
          icon: docs.icon,
          content: docs.content,
          parentId: docs.parentId,
          sharedWithParty: docs.sharedWithParty,
        });

      await db
        .update(campaigns)
        .set({ updatedAt: new Date() })
        .where(eq(campaigns.id, existing.campaignId));

      return Response.json({
        id: doc.id,
        title: doc.title,
        category: doc.category,
        icon: doc.icon,
        content: doc.content,
        parentId: doc.parentId || null,
        shared: doc.sharedWithParty || false,
      });
    },

    async DELETE(req: Request) {
      const user = await getSession(req);
      if (!user)
        return Response.json({ error: "Unauthorized" }, { status: 401 });

      const { id } = (req as any).params;

      const [doc] = await db
        .select({ id: docs.id, campaignId: docs.campaignId })
        .from(docs)
        .innerJoin(campaigns, eq(campaigns.id, docs.campaignId))
        .where(and(eq(docs.id, id), eq(campaigns.userId, user.id)));
      if (!doc) {
        return Response.json({ error: "Not found" }, { status: 404 });
      }

      await db.delete(docs).where(eq(docs.id, id));
      await db
        .update(campaigns)
        .set({ updatedAt: new Date() })
        .where(eq(campaigns.id, doc.campaignId));

      return Response.json({ ok: true });
    },
  },
};

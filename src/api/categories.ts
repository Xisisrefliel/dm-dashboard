import { db } from "../db";
import { campaigns, categories } from "../db/schema";
import { eq, and, sql } from "drizzle-orm";
import { getSession } from "./auth";

export const categoryRoutes = {
  "/api/campaigns/:campaignId/categories": {
    async PUT(req: Request) {
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

      const { categories: catList } = await req.json();
      if (!Array.isArray(catList)) {
        return Response.json(
          { error: "categories must be an array" },
          { status: 400 },
        );
      }

      await db.transaction(async (tx) => {
        await tx
          .delete(categories)
          .where(eq(categories.campaignId, campaignId));
        for (let i = 0; i < catList.length; i++) {
          const cat = catList[i];
          await tx.insert(categories).values({
            campaignId,
            key: cat.key,
            label: cat.label,
            icon: cat.icon || "folder",
            sortOrder: i,
          });
        }
      });

      await db
        .update(campaigns)
        .set({ updatedAt: new Date() })
        .where(eq(campaigns.id, campaignId));

      return Response.json({ ok: true });
    },

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

      const { key, label, icon } = await req.json();
      if (!key || !label) {
        return Response.json(
          { error: "key and label are required" },
          { status: 400 },
        );
      }

      const [maxOrder] = await db
        .select({
          nextOrder: sql<number>`COALESCE(MAX(${categories.sortOrder}), -1) + 1`,
        })
        .from(categories)
        .where(eq(categories.campaignId, campaignId));

      const [category] = await db
        .insert(categories)
        .values({
          campaignId,
          key,
          label,
          icon: icon || "folder",
          sortOrder: maxOrder!.nextOrder,
        })
        .returning({
          key: categories.key,
          label: categories.label,
          icon: categories.icon,
        });

      return Response.json(
        { key: category!.key, label: category!.label, icon: category!.icon },
        { status: 201 },
      );
    },
  },
};

import { sql } from "../db";
import { getSession } from "./auth";

export const categoryRoutes = {
  "/api/campaigns/:campaignId/categories": {
    async PUT(req: Request) {
      const user = await getSession(req);
      if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

      const { campaignId } = (req as any).params;

      const [campaign] = await sql`
        SELECT id FROM campaigns WHERE id = ${campaignId} AND user_id = ${user.id}
      `;
      if (!campaign) {
        return Response.json({ error: "Campaign not found" }, { status: 404 });
      }

      const { categories } = await req.json();
      if (!Array.isArray(categories)) {
        return Response.json(
          { error: "categories must be an array" },
          { status: 400 },
        );
      }

      await sql.begin(async (tx: any) => {
        await tx`DELETE FROM categories WHERE campaign_id = ${campaignId}`;
        for (let i = 0; i < categories.length; i++) {
          const cat = categories[i];
          await tx`
            INSERT INTO categories (campaign_id, key, label, icon, sort_order)
            VALUES (${campaignId}, ${cat.key}, ${cat.label}, ${cat.icon || "folder"}, ${i})
          `;
        }
      });

      await sql`UPDATE campaigns SET updated_at = NOW() WHERE id = ${campaignId}`;

      return Response.json({ ok: true });
    },

    async POST(req: Request) {
      const user = await getSession(req);
      if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

      const { campaignId } = (req as any).params;

      const [campaign] = await sql`
        SELECT id FROM campaigns WHERE id = ${campaignId} AND user_id = ${user.id}
      `;
      if (!campaign) {
        return Response.json({ error: "Campaign not found" }, { status: 404 });
      }

      const { key, label, icon } = await req.json();
      if (!key || !label) {
        return Response.json(
          { error: "key and label are required" },
          { status: 400 },
        );
      }

      const [maxOrder] = await sql`
        SELECT COALESCE(MAX(sort_order), -1) + 1 AS next_order
        FROM categories WHERE campaign_id = ${campaignId}
      `;

      const [category] = await sql`
        INSERT INTO categories (campaign_id, key, label, icon, sort_order)
        VALUES (${campaignId}, ${key}, ${label}, ${icon || "folder"}, ${maxOrder.next_order})
        RETURNING key, label, icon
      `;

      return Response.json(
        { key: category.key, label: category.label, icon: category.icon },
        { status: 201 },
      );
    },
  },
};

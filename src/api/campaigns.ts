import { sql } from "../db";
import { getSession } from "./auth";
import { DEFAULT_CATEGORIES } from "../data/sampleCampaign.js";

export const campaignRoutes = {
  "/api/campaigns": {
    async GET(req: Request) {
      const user = await getSession(req);
      if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

      const campaigns = await sql`
        SELECT c.*,
          (SELECT COUNT(*)::int FROM docs WHERE campaign_id = c.id) AS doc_count,
          (SELECT COUNT(*)::int FROM categories WHERE campaign_id = c.id) AS category_count
        FROM campaigns c
        WHERE c.user_id = ${user.id}
        ORDER BY c.updated_at DESC
      `;

      return Response.json(
        campaigns.map((c: any) => ({
          id: c.id,
          name: c.name,
          description: c.description,
          color: c.color,
          docCount: c.doc_count,
          categoryCount: c.category_count,
        })),
      );
    },

    async POST(req: Request) {
      const user = await getSession(req);
      if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

      const { name, description, color } = await req.json();
      if (!name?.trim()) {
        return Response.json({ error: "Name is required" }, { status: 400 });
      }

      let campaign: any;
      const categories: any[] = [];

      await sql.begin(async (tx: any) => {
        [campaign] = await tx`
          INSERT INTO campaigns (user_id, name, description, color)
          VALUES (${user.id}, ${name.trim()}, ${description || ""}, ${color || "#9fd494"})
          RETURNING *
        `;

        for (let i = 0; i < DEFAULT_CATEGORIES.length; i++) {
          const cat = DEFAULT_CATEGORIES[i];
          const [row] = await tx`
            INSERT INTO categories (campaign_id, key, label, icon, sort_order)
            VALUES (${campaign.id}, ${cat.key}, ${cat.label}, ${cat.icon}, ${i})
            RETURNING *
          `;
          categories.push(row);
        }
      });

      return Response.json(
        {
          id: campaign.id,
          name: campaign.name,
          description: campaign.description,
          color: campaign.color,
          docs: [],
          categories: categories.map((c: any) => ({
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
      if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

      const { id } = (req as any).params;

      const [campaign] = await sql`
        SELECT * FROM campaigns WHERE id = ${id} AND user_id = ${user.id}
      `;
      if (!campaign) {
        return Response.json({ error: "Not found" }, { status: 404 });
      }

      const categories = await sql`
        SELECT key, label, icon FROM categories
        WHERE campaign_id = ${id}
        ORDER BY sort_order
      `;

      const docs = await sql`
        SELECT id, category_key AS category, title, icon, content
        FROM docs
        WHERE campaign_id = ${id}
        ORDER BY created_at
      `;

      return Response.json({
        id: campaign.id,
        name: campaign.name,
        description: campaign.description,
        color: campaign.color,
        categories: categories.map((c: any) => ({
          key: c.key,
          label: c.label,
          icon: c.icon,
        })),
        docs: docs.map((d: any) => ({
          id: d.id,
          title: d.title,
          category: d.category,
          icon: d.icon,
          content: d.content,
        })),
      });
    },

    async PUT(req: Request) {
      const user = await getSession(req);
      if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

      const { id } = (req as any).params;
      const { name, description, color } = await req.json();

      const [campaign] = await sql`
        UPDATE campaigns
        SET name = COALESCE(${name ?? null}, name),
            description = COALESCE(${description ?? null}, description),
            color = COALESCE(${color ?? null}, color),
            updated_at = NOW()
        WHERE id = ${id} AND user_id = ${user.id}
        RETURNING *
      `;
      if (!campaign) {
        return Response.json({ error: "Not found" }, { status: 404 });
      }

      return Response.json({
        id: campaign.id,
        name: campaign.name,
        description: campaign.description,
        color: campaign.color,
      });
    },

    async DELETE(req: Request) {
      const user = await getSession(req);
      if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

      const { id } = (req as any).params;

      const [campaign] = await sql`
        DELETE FROM campaigns WHERE id = ${id} AND user_id = ${user.id} RETURNING id
      `;
      if (!campaign) {
        return Response.json({ error: "Not found" }, { status: 404 });
      }

      return Response.json({ ok: true });
    },
  },
};

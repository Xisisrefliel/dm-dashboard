import { sql } from "../db";
import { getSession } from "./auth";

export const docRoutes = {
  "/api/campaigns/:campaignId/docs": {
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

      const { title, category, icon, content, parentId } = await req.json();
      if (!title?.trim()) {
        return Response.json({ error: "Title is required" }, { status: 400 });
      }

      const [doc] = await sql`
        INSERT INTO docs (campaign_id, category_key, title, icon, content, parent_id)
        VALUES (${campaignId}, ${category || "locations"}, ${title.trim()}, ${icon || "description"}, ${content || ""}, ${parentId || null})
        RETURNING id, category_key AS category, title, icon, content, parent_id
      `;

      await sql`UPDATE campaigns SET updated_at = NOW() WHERE id = ${campaignId}`;

      return Response.json(
        {
          id: doc.id,
          title: doc.title,
          category: doc.category,
          icon: doc.icon,
          content: doc.content,
          parentId: doc.parent_id || null,
        },
        { status: 201 },
      );
    },
  },

  "/api/docs/:id": {
    async PUT(req: Request) {
      const user = await getSession(req);
      if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

      const { id } = (req as any).params;
      const updates = await req.json();

      const [existing] = await sql`
        SELECT d.id, d.campaign_id FROM docs d
        JOIN campaigns c ON c.id = d.campaign_id
        WHERE d.id = ${id} AND c.user_id = ${user.id}
      `;
      if (!existing) {
        return Response.json({ error: "Not found" }, { status: 404 });
      }

      // Only update parent_id if explicitly provided in the payload
      const parentIdVal = "parentId" in updates ? (updates.parentId || null) : undefined;
      const sharedVal = "shared" in updates ? !!updates.shared : undefined;

      const [doc] = parentIdVal !== undefined
        ? await sql`
          UPDATE docs SET
            title = COALESCE(${updates.title ?? null}, title),
            icon = COALESCE(${updates.icon ?? null}, icon),
            content = COALESCE(${updates.content ?? null}, content),
            category_key = COALESCE(${updates.category ?? null}, category_key),
            parent_id = ${parentIdVal},
            shared_with_party = COALESCE(${sharedVal ?? null}, shared_with_party),
            updated_at = NOW()
          WHERE id = ${id}
          RETURNING id, category_key AS category, title, icon, content, parent_id, shared_with_party
        `
        : await sql`
          UPDATE docs SET
            title = COALESCE(${updates.title ?? null}, title),
            icon = COALESCE(${updates.icon ?? null}, icon),
            content = COALESCE(${updates.content ?? null}, content),
            category_key = COALESCE(${updates.category ?? null}, category_key),
            shared_with_party = COALESCE(${sharedVal ?? null}, shared_with_party),
            updated_at = NOW()
          WHERE id = ${id}
          RETURNING id, category_key AS category, title, icon, content, parent_id, shared_with_party
        `;

      await sql`UPDATE campaigns SET updated_at = NOW() WHERE id = ${existing.campaign_id}`;

      return Response.json({
        id: doc.id,
        title: doc.title,
        category: doc.category,
        icon: doc.icon,
        content: doc.content,
        parentId: doc.parent_id || null,
        shared: doc.shared_with_party || false,
      });
    },

    async DELETE(req: Request) {
      const user = await getSession(req);
      if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

      const { id } = (req as any).params;

      const [doc] = await sql`
        SELECT d.id, d.campaign_id FROM docs d
        JOIN campaigns c ON c.id = d.campaign_id
        WHERE d.id = ${id} AND c.user_id = ${user.id}
      `;
      if (!doc) {
        return Response.json({ error: "Not found" }, { status: 404 });
      }

      await sql`DELETE FROM docs WHERE id = ${id}`;
      await sql`UPDATE campaigns SET updated_at = NOW() WHERE id = ${doc.campaign_id}`;

      return Response.json({ ok: true });
    },
  },
};

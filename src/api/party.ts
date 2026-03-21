import { sql } from "../db";
import { getSession } from "./auth";

export const partyRoutes = {
  // DM creates an invite link
  "/api/campaigns/:campaignId/invites": {
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

      const token = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
      const { expiresInHours, maxUses } = await req.json().catch(() => ({}));
      const expiresAt = expiresInHours
        ? new Date(Date.now() + expiresInHours * 60 * 60 * 1000)
        : null;

      const [invite] = await sql`
        INSERT INTO invite_tokens (campaign_id, token, created_by, expires_at, max_uses)
        VALUES (${campaignId}, ${token}, ${user.id}, ${expiresAt}, ${maxUses ?? null})
        RETURNING id, token, expires_at, max_uses, use_count, created_at
      `;

      return Response.json(
        { id: invite.id, token: invite.token, expiresAt: invite.expires_at },
        { status: 201 },
      );
    },

    async GET(req: Request) {
      const user = await getSession(req);
      if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

      const { campaignId } = (req as any).params;

      const [campaign] = await sql`
        SELECT id FROM campaigns WHERE id = ${campaignId} AND user_id = ${user.id}
      `;
      if (!campaign) {
        return Response.json({ error: "Campaign not found" }, { status: 404 });
      }

      const invites = await sql`
        SELECT id, token, expires_at, max_uses, use_count, created_at
        FROM invite_tokens
        WHERE campaign_id = ${campaignId}
          AND (expires_at IS NULL OR expires_at > NOW())
          AND (max_uses IS NULL OR use_count < max_uses)
        ORDER BY created_at DESC
      `;

      return Response.json(invites);
    },
  },

  // Validate invite & get campaign info
  "/api/invites/:token": {
    async GET(req: Request) {
      const user = await getSession(req);
      if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

      const { token } = (req as any).params;

      const [invite] = await sql`
        SELECT i.*, c.name AS campaign_name, c.color AS campaign_color, c.description AS campaign_description, c.user_id AS owner_id
        FROM invite_tokens i
        JOIN campaigns c ON c.id = i.campaign_id
        WHERE i.token = ${token}
          AND (i.expires_at IS NULL OR i.expires_at > NOW())
          AND (i.max_uses IS NULL OR i.use_count < i.max_uses)
      `;
      if (!invite) {
        return Response.json({ error: "Invalid or expired invite" }, { status: 404 });
      }

      const [existing] = await sql`
        SELECT id FROM campaign_members
        WHERE campaign_id = ${invite.campaign_id} AND user_id = ${user.id}
      `;

      return Response.json({
        campaign: {
          id: invite.campaign_id,
          name: invite.campaign_name,
          color: invite.campaign_color,
          description: invite.campaign_description,
        },
        isOwner: invite.owner_id === user.id,
        alreadyJoined: !!existing,
      });
    },

    async DELETE(req: Request) {
      const user = await getSession(req);
      if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

      const { token } = (req as any).params;

      const [invite] = await sql`
        DELETE FROM invite_tokens WHERE token = ${token} AND created_by = ${user.id} RETURNING id
      `;
      if (!invite) {
        return Response.json({ error: "Not found" }, { status: 404 });
      }

      return Response.json({ ok: true });
    },
  },

  // Player joins campaign with character
  "/api/invites/:token/join": {
    async POST(req: Request) {
      const user = await getSession(req);
      if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

      const { token } = (req as any).params;

      const [invite] = await sql`
        SELECT i.*, c.user_id AS owner_id
        FROM invite_tokens i
        JOIN campaigns c ON c.id = i.campaign_id
        WHERE i.token = ${token}
          AND (i.expires_at IS NULL OR i.expires_at > NOW())
          AND (i.max_uses IS NULL OR i.use_count < i.max_uses)
      `;
      if (!invite) {
        return Response.json({ error: "Invalid or expired invite" }, { status: 404 });
      }

      if (invite.owner_id === user.id) {
        return Response.json({ error: "Cannot join your own campaign" }, { status: 400 });
      }

      const { character } = await req.json();
      if (!character?.name) {
        return Response.json({ error: "Character data is required" }, { status: 400 });
      }

      // Upsert: if player already joined, update their character
      const [member] = await sql`
        INSERT INTO campaign_members (campaign_id, user_id, character_data)
        VALUES (${invite.campaign_id}, ${user.id}, ${sql.json(character)})
        ON CONFLICT (campaign_id, user_id)
        DO UPDATE SET character_data = ${sql.json(character)}, joined_at = NOW()
        RETURNING id
      `;

      // Increment use count
      await sql`
        UPDATE invite_tokens SET use_count = use_count + 1 WHERE id = ${invite.id}
      `;

      return Response.json({ ok: true, memberId: member.id });
    },
  },

  // DM fetches party members
  "/api/campaigns/:campaignId/party": {
    async GET(req: Request) {
      const user = await getSession(req);
      if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

      const { campaignId } = (req as any).params;

      const [campaign] = await sql`
        SELECT id FROM campaigns WHERE id = ${campaignId} AND user_id = ${user.id}
      `;
      if (!campaign) {
        return Response.json({ error: "Campaign not found" }, { status: 404 });
      }

      const members = await sql`
        SELECT cm.id, cm.user_id, u.display_name, cm.character_data, cm.joined_at
        FROM campaign_members cm
        JOIN users u ON u.id = cm.user_id
        WHERE cm.campaign_id = ${campaignId}
        ORDER BY cm.joined_at
      `;

      return Response.json(
        members.map((m: any) => ({
          id: m.id,
          userId: m.user_id,
          playerName: m.display_name,
          character: m.character_data,
          joinedAt: m.joined_at,
        })),
      );
    },
  },

  // DM removes a member
  "/api/campaigns/:campaignId/party/:memberId": {
    async DELETE(req: Request) {
      const user = await getSession(req);
      if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

      const { campaignId, memberId } = (req as any).params;

      const [campaign] = await sql`
        SELECT id FROM campaigns WHERE id = ${campaignId} AND user_id = ${user.id}
      `;
      if (!campaign) {
        return Response.json({ error: "Campaign not found" }, { status: 404 });
      }

      const [member] = await sql`
        DELETE FROM campaign_members WHERE id = ${memberId} AND campaign_id = ${campaignId} RETURNING id
      `;
      if (!member) {
        return Response.json({ error: "Not found" }, { status: 404 });
      }

      return Response.json({ ok: true });
    },
  },

  // Player syncs their character data across all campaigns they've joined
  "/api/party/sync": {
    async POST(req: Request) {
      const user = await getSession(req);
      if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

      const { character } = await req.json();
      if (!character?.localId) {
        return Response.json({ error: "character with localId is required" }, { status: 400 });
      }

      const updated = await sql`
        UPDATE campaign_members
        SET character_data = ${sql.json(character)}, joined_at = NOW()
        WHERE user_id = ${user.id}
          AND character_data->>'localId' = ${character.localId}
        RETURNING id
      `;

      return Response.json({ ok: true, updated: updated.length });
    },
  },
};

import { db } from "../db";
import {
  campaigns,
  inviteTokens,
  campaignMembers,
  users,
} from "../db/schema";
import { eq, and, or, isNull, gt, lt, sql } from "drizzle-orm";
import { getSession } from "./auth";

export const partyRoutes = {
  // DM creates an invite link
  "/api/campaigns/:campaignId/invites": {
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

      const token = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
      const { expiresInHours, maxUses } = await req.json().catch(() => ({}));
      const expiresAt = expiresInHours
        ? new Date(Date.now() + expiresInHours * 60 * 60 * 1000)
        : null;

      const [invite] = await db
        .insert(inviteTokens)
        .values({
          campaignId,
          token,
          createdBy: user.id,
          expiresAt,
          maxUses: maxUses ?? null,
        })
        .returning({
          id: inviteTokens.id,
          token: inviteTokens.token,
          expiresAt: inviteTokens.expiresAt,
          maxUses: inviteTokens.maxUses,
          useCount: inviteTokens.useCount,
          createdAt: inviteTokens.createdAt,
        });

      return Response.json(
        { id: invite!.id, token: invite!.token, expiresAt: invite!.expiresAt },
        { status: 201 },
      );
    },

    async GET(req: Request) {
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

      const invites = await db
        .select({
          id: inviteTokens.id,
          token: inviteTokens.token,
          expiresAt: inviteTokens.expiresAt,
          maxUses: inviteTokens.maxUses,
          useCount: inviteTokens.useCount,
          createdAt: inviteTokens.createdAt,
        })
        .from(inviteTokens)
        .where(
          and(
            eq(inviteTokens.campaignId, campaignId),
            or(
              isNull(inviteTokens.expiresAt),
              gt(inviteTokens.expiresAt, new Date()),
            ),
            or(
              isNull(inviteTokens.maxUses),
              lt(inviteTokens.useCount, sql`${inviteTokens.maxUses}`),
            ),
          ),
        )
        .orderBy(sql`${inviteTokens.createdAt} DESC`);

      return Response.json(invites);
    },
  },

  // Validate invite & get campaign info
  "/api/invites/:token": {
    async GET(req: Request) {
      const user = await getSession(req);
      if (!user)
        return Response.json({ error: "Unauthorized" }, { status: 401 });

      const { token } = (req as any).params;

      const [invite] = await db
        .select({
          id: inviteTokens.id,
          campaignId: inviteTokens.campaignId,
          token: inviteTokens.token,
          expiresAt: inviteTokens.expiresAt,
          maxUses: inviteTokens.maxUses,
          useCount: inviteTokens.useCount,
          campaignName: campaigns.name,
          campaignColor: campaigns.color,
          campaignDescription: campaigns.description,
          ownerId: campaigns.userId,
        })
        .from(inviteTokens)
        .innerJoin(campaigns, eq(campaigns.id, inviteTokens.campaignId))
        .where(
          and(
            eq(inviteTokens.token, token),
            or(
              isNull(inviteTokens.expiresAt),
              gt(inviteTokens.expiresAt, new Date()),
            ),
            or(
              isNull(inviteTokens.maxUses),
              lt(inviteTokens.useCount, sql`${inviteTokens.maxUses}`),
            ),
          ),
        );
      if (!invite) {
        return Response.json(
          { error: "Invalid or expired invite" },
          { status: 404 },
        );
      }

      const [existing] = await db
        .select({ id: campaignMembers.id })
        .from(campaignMembers)
        .where(
          and(
            eq(campaignMembers.campaignId, invite.campaignId),
            eq(campaignMembers.userId, user.id),
          ),
        );

      return Response.json({
        campaign: {
          id: invite.campaignId,
          name: invite.campaignName,
          color: invite.campaignColor,
          description: invite.campaignDescription,
        },
        isOwner: invite.ownerId === user.id,
        alreadyJoined: !!existing,
      });
    },

    async DELETE(req: Request) {
      const user = await getSession(req);
      if (!user)
        return Response.json({ error: "Unauthorized" }, { status: 401 });

      const { token } = (req as any).params;

      const [invite] = await db
        .delete(inviteTokens)
        .where(
          and(
            eq(inviteTokens.token, token),
            eq(inviteTokens.createdBy, user.id),
          ),
        )
        .returning({ id: inviteTokens.id });
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
      if (!user)
        return Response.json({ error: "Unauthorized" }, { status: 401 });

      const { token } = (req as any).params;

      const [invite] = await db
        .select({
          id: inviteTokens.id,
          campaignId: inviteTokens.campaignId,
          expiresAt: inviteTokens.expiresAt,
          maxUses: inviteTokens.maxUses,
          useCount: inviteTokens.useCount,
          ownerId: campaigns.userId,
        })
        .from(inviteTokens)
        .innerJoin(campaigns, eq(campaigns.id, inviteTokens.campaignId))
        .where(
          and(
            eq(inviteTokens.token, token),
            or(
              isNull(inviteTokens.expiresAt),
              gt(inviteTokens.expiresAt, new Date()),
            ),
            or(
              isNull(inviteTokens.maxUses),
              lt(inviteTokens.useCount, sql`${inviteTokens.maxUses}`),
            ),
          ),
        );
      if (!invite) {
        return Response.json(
          { error: "Invalid or expired invite" },
          { status: 404 },
        );
      }

      if (invite.ownerId === user.id) {
        return Response.json(
          { error: "Cannot join your own campaign" },
          { status: 400 },
        );
      }

      const { character } = await req.json();
      if (!character?.name) {
        return Response.json(
          { error: "Character data is required" },
          { status: 400 },
        );
      }

      // Upsert: if player already joined, update their character
      const [member] = await db
        .insert(campaignMembers)
        .values({
          campaignId: invite.campaignId,
          userId: user.id,
          characterData: character,
        })
        .onConflictDoUpdate({
          target: [campaignMembers.campaignId, campaignMembers.userId],
          set: {
            characterData: character,
            joinedAt: new Date(),
          },
        })
        .returning({ id: campaignMembers.id });

      // Increment use count
      await db
        .update(inviteTokens)
        .set({ useCount: sql`${inviteTokens.useCount} + 1` })
        .where(eq(inviteTokens.id, invite.id));

      return Response.json({ ok: true, memberId: member!.id });
    },
  },

  // DM fetches party members
  "/api/campaigns/:campaignId/party": {
    async GET(req: Request) {
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

      const members = await db
        .select({
          id: campaignMembers.id,
          userId: campaignMembers.userId,
          displayName: users.displayName,
          characterData: campaignMembers.characterData,
          joinedAt: campaignMembers.joinedAt,
        })
        .from(campaignMembers)
        .innerJoin(users, eq(users.id, campaignMembers.userId))
        .where(eq(campaignMembers.campaignId, campaignId))
        .orderBy(campaignMembers.joinedAt);

      return Response.json(
        members.map((m) => ({
          id: m.id,
          userId: m.userId,
          playerName: m.displayName,
          character: m.characterData,
          joinedAt: m.joinedAt,
        })),
      );
    },
  },

  // DM removes a member
  "/api/campaigns/:campaignId/party/:memberId": {
    async DELETE(req: Request) {
      const user = await getSession(req);
      if (!user)
        return Response.json({ error: "Unauthorized" }, { status: 401 });

      const { campaignId, memberId } = (req as any).params;

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

      const [member] = await db
        .delete(campaignMembers)
        .where(
          and(
            eq(campaignMembers.id, memberId),
            eq(campaignMembers.campaignId, campaignId),
          ),
        )
        .returning({ id: campaignMembers.id });
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
      if (!user)
        return Response.json({ error: "Unauthorized" }, { status: 401 });

      const { character } = await req.json();
      if (!character?.localId) {
        return Response.json(
          { error: "character with localId is required" },
          { status: 400 },
        );
      }

      const updated = await db
        .update(campaignMembers)
        .set({
          characterData: character,
          joinedAt: new Date(),
        })
        .where(
          and(
            eq(campaignMembers.userId, user.id),
            sql`${campaignMembers.characterData}->>'localId' = ${character.localId}`,
          ),
        )
        .returning({ id: campaignMembers.id });

      return Response.json({ ok: true, updated: updated.length });
    },
  },
};

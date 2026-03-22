import { db } from "../db";
import { users, sessions } from "../db/schema";
import { eq, and, gt } from "drizzle-orm";

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const SESSION_TTL_S = SESSION_TTL_MS / 1000;

function parseCookies(req: Request): Record<string, string> {
  const header = req.headers.get("cookie") || "";
  return Object.fromEntries(
    header
      .split(";")
      .filter(Boolean)
      .map((c) => {
        const [key, ...rest] = c.trim().split("=");
        return [key, rest.join("=")];
      }),
  );
}

export async function getSession(req: Request) {
  const cookies = parseCookies(req);
  const token = cookies.session;
  if (!token) return null;

  const [row] = await db
    .select({
      id: users.id,
      email: users.email,
      displayName: users.displayName,
    })
    .from(users)
    .innerJoin(sessions, eq(sessions.userId, users.id))
    .where(and(eq(sessions.token, token), gt(sessions.expiresAt, new Date())));

  return row || null;
}

function sessionCookie(token: string, maxAge: number): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${secure}`;
}

export const authRoutes = {
  "/api/auth/register": {
    async POST(req: Request) {
      const { email, password, displayName } = await req.json();

      if (!email || !password || !displayName) {
        return Response.json(
          { error: "Email, password, and display name are required" },
          { status: 400 },
        );
      }

      const [existing] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email));
      if (existing) {
        return Response.json(
          { error: "Email already registered" },
          { status: 409 },
        );
      }

      const passwordHash = await Bun.password.hash(password);
      const [user] = await db
        .insert(users)
        .values({ email, passwordHash, displayName })
        .returning({
          id: users.id,
          email: users.email,
          displayName: users.displayName,
        });

      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
      await db
        .insert(sessions)
        .values({ userId: user!.id, token, expiresAt });

      return Response.json(
        { id: user!.id, email: user!.email, displayName: user!.displayName },
        {
          status: 201,
          headers: { "Set-Cookie": sessionCookie(token, SESSION_TTL_S) },
        },
      );
    },
  },

  "/api/auth/login": {
    async POST(req: Request) {
      const { email, password } = await req.json();

      if (!email || !password) {
        return Response.json(
          { error: "Email and password are required" },
          { status: 400 },
        );
      }

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
      if (!user || !(await Bun.password.verify(password, user.passwordHash))) {
        return Response.json(
          { error: "Invalid email or password" },
          { status: 401 },
        );
      }

      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
      await db
        .insert(sessions)
        .values({ userId: user.id, token, expiresAt });

      return Response.json(
        { id: user.id, email: user.email, displayName: user.displayName },
        {
          headers: { "Set-Cookie": sessionCookie(token, SESSION_TTL_S) },
        },
      );
    },
  },

  "/api/auth/logout": {
    async POST(req: Request) {
      const cookies = parseCookies(req);
      const token = cookies.session;
      if (token) {
        await db.delete(sessions).where(eq(sessions.token, token));
      }
      return Response.json(
        { ok: true },
        { headers: { "Set-Cookie": sessionCookie("", 0) } },
      );
    },
  },

  "/api/auth/me": {
    async GET(req: Request) {
      const user = await getSession(req);
      if (!user) {
        return Response.json(
          { error: "Not authenticated" },
          { status: 401 },
        );
      }
      return Response.json({
        id: user.id,
        email: user.email,
        displayName: user.displayName,
      });
    },
  },
};

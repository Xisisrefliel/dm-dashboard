import { sql } from "../db";

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

  const [user] = await sql`
    SELECT u.id, u.email, u.display_name
    FROM users u
    JOIN sessions s ON s.user_id = u.id
    WHERE s.token = ${token} AND s.expires_at > NOW()
  `;

  return user || null;
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

      const [existing] = await sql`SELECT id FROM users WHERE email = ${email}`;
      if (existing) {
        return Response.json(
          { error: "Email already registered" },
          { status: 409 },
        );
      }

      const passwordHash = await Bun.password.hash(password);
      const [user] = await sql`
        INSERT INTO users (email, password_hash, display_name)
        VALUES (${email}, ${passwordHash}, ${displayName})
        RETURNING id, email, display_name
      `;

      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
      await sql`
        INSERT INTO sessions (user_id, token, expires_at)
        VALUES (${user.id}, ${token}, ${expiresAt})
      `;

      return Response.json(
        { id: user.id, email: user.email, displayName: user.display_name },
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

      const [user] =
        await sql`SELECT * FROM users WHERE email = ${email}`;
      if (!user || !(await Bun.password.verify(password, user.password_hash))) {
        return Response.json(
          { error: "Invalid email or password" },
          { status: 401 },
        );
      }

      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
      await sql`
        INSERT INTO sessions (user_id, token, expires_at)
        VALUES (${user.id}, ${token}, ${expiresAt})
      `;

      return Response.json(
        { id: user.id, email: user.email, displayName: user.display_name },
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
        await sql`DELETE FROM sessions WHERE token = ${token}`;
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
        displayName: user.display_name,
      });
    },
  },
};

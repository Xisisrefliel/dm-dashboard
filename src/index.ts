import { serve } from "bun";
import index from "./index.html";
import { migrate } from "./db/migrate";
import { authRoutes } from "./api/auth";
import { campaignRoutes } from "./api/campaigns";
import { docRoutes } from "./api/docs";
import { categoryRoutes } from "./api/categories";
import { partyRoutes } from "./api/party";

// Run migrations on startup
await migrate();

const DEFAULT_PORT = 3000;
const MAX_PORT_ATTEMPTS = 10;

function isPortInUse(port: number): boolean {
  try {
    const testServer = Bun.serve({ port, fetch: () => new Response() });
    testServer.stop(true);
    return false;
  } catch {
    return true;
  }
}

function findAvailablePort(startPort: number): number {
  for (let port = startPort; port < startPort + MAX_PORT_ATTEMPTS; port++) {
    if (!isPortInUse(port)) return port;
  }
  throw new Error(
    `No available port found in range ${startPort}-${startPort + MAX_PORT_ATTEMPTS - 1}`
  );
}

const port = findAvailablePort(Number(process.env.PORT) || DEFAULT_PORT);

const server = serve({
  port,
  routes: {
    ...authRoutes,
    ...campaignRoutes,
    ...docRoutes,
    ...categoryRoutes,
    ...partyRoutes,

    // SPA fallback — must be last
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);

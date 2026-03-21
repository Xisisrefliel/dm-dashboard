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

const server = serve({
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

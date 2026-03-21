import { sql } from "./index";

export async function migrate() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      display_name TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token TEXT UNIQUE NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS campaigns (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      slug TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      color TEXT DEFAULT '#9fd494',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, slug)
    )
  `;

  // Add slug to existing campaigns tables that lack it
  await sql`ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS slug TEXT`;

  // Backfill slugs for campaigns that don't have one
  const missing = await sql`SELECT id, user_id, name FROM campaigns WHERE slug IS NULL`;
  for (const c of missing) {
    const base = c.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "campaign";
    let slug = base;
    let i = 2;
    while (true) {
      const [dup] = await sql`SELECT id FROM campaigns WHERE user_id = ${c.user_id} AND slug = ${slug} AND id != ${c.id}`;
      if (!dup) break;
      slug = `${base}-${i++}`;
    }
    await sql`UPDATE campaigns SET slug = ${slug} WHERE id = ${c.id}`;
  }

  // Now safe to add the constraint
  await sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'campaigns_user_id_slug_key'
      ) THEN
        ALTER TABLE campaigns ADD CONSTRAINT campaigns_user_id_slug_key UNIQUE (user_id, slug);
      END IF;
    END $$
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
      key TEXT NOT NULL,
      label TEXT NOT NULL,
      icon TEXT DEFAULT 'folder',
      sort_order INTEGER DEFAULT 0,
      UNIQUE(campaign_id, key)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS docs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
      category_key TEXT NOT NULL,
      parent_id UUID REFERENCES docs(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      icon TEXT DEFAULT 'description',
      content TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // Add parent_id to existing docs tables that lack it
  await sql`
    ALTER TABLE docs ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES docs(id) ON DELETE CASCADE
  `;

  // Add shared_with_party flag to docs
  await sql`
    ALTER TABLE docs ADD COLUMN IF NOT EXISTS shared_with_party BOOLEAN DEFAULT FALSE
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS invite_tokens (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
      token TEXT UNIQUE NOT NULL,
      created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TIMESTAMPTZ,
      max_uses INTEGER DEFAULT NULL,
      use_count INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS campaign_members (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      character_data JSONB NOT NULL,
      joined_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(campaign_id, user_id)
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_campaigns_user ON campaigns(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_docs_campaign ON docs(campaign_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_docs_category ON docs(campaign_id, category_key)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_invite_tokens_token ON invite_tokens(token)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_campaign_members_campaign ON campaign_members(campaign_id)`;

  console.log("✅ Database migrated");
}

// Run directly: bun src/db/migrate.ts
if (import.meta.main) {
  await migrate();
  process.exit(0);
}

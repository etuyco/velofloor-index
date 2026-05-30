import { createPool, type VercelPool } from "@vercel/postgres";
import { normalizeEmail } from "@/lib/unsubscribe";

/**
 * Postgres-backed subscriber store (Vercel Postgres / Neon). Persists waitlist
 * signups and unsubscribe state so opt-outs can be honored (CAN-SPAM / CASL).
 *
 * Serverless-safe: a single pooled connection is reused per warm instance, and
 * the schema is created lazily and idempotently on first use.
 */

let pool: VercelPool | null = null;

function getPool(): VercelPool {
  if (pool) return pool;
  const connectionString =
    process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "Missing database connection string (set POSTGRES_URL or DATABASE_URL).",
    );
  }
  pool = createPool({ connectionString });
  return pool;
}

let schemaReady: Promise<void> | null = null;

function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = getPool()
      .sql`
        CREATE TABLE IF NOT EXISTS subscribers (
          id              BIGSERIAL PRIMARY KEY,
          email           TEXT NOT NULL UNIQUE,
          status          TEXT NOT NULL DEFAULT 'subscribed',
          created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
          unsubscribed_at TIMESTAMPTZ
        );
      `
      .then(() => undefined)
      .catch((err) => {
        // Allow a retry on the next call if schema creation failed.
        schemaReady = null;
        throw err;
      });
  }
  return schemaReady;
}

/** Record a waitlist signup. Re-signing up after an opt-out re-subscribes
 * (the form submission is fresh express consent). */
export async function recordSignup(email: string): Promise<void> {
  await ensureSchema();
  const e = normalizeEmail(email);
  await getPool().sql`
    INSERT INTO subscribers (email, status)
    VALUES (${e}, 'subscribed')
    ON CONFLICT (email) DO UPDATE SET status = 'subscribed', unsubscribed_at = NULL
  `;
}

/** Mark an address as unsubscribed. Inserts a row if we've never seen it, so
 * the opt-out is always durably recorded. */
export async function unsubscribe(email: string): Promise<void> {
  await ensureSchema();
  const e = normalizeEmail(email);
  await getPool().sql`
    INSERT INTO subscribers (email, status, unsubscribed_at)
    VALUES (${e}, 'unsubscribed', now())
    ON CONFLICT (email) DO UPDATE SET status = 'unsubscribed', unsubscribed_at = now()
  `;
}

export async function isUnsubscribed(email: string): Promise<boolean> {
  await ensureSchema();
  const { rows } = await getPool().sql<{ status: string }>`
    SELECT status FROM subscribers WHERE email = ${normalizeEmail(email)}
  `;
  return rows[0]?.status === "unsubscribed";
}

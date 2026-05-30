import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { normalizeEmail } from "@/lib/unsubscribe";

/**
 * SQLite-backed subscriber store. Persists waitlist signups and unsubscribe
 * state so opt-outs can be honored (CAN-SPAM / CASL). The DB file lives in
 * ./data (gitignored).
 */

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (db) return db;
  const dir = join(process.cwd(), "data");
  mkdirSync(dir, { recursive: true });
  db = new Database(join(dir, "velofloor.db"));
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS subscribers (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      email           TEXT NOT NULL UNIQUE,
      status          TEXT NOT NULL DEFAULT 'subscribed',
      created_at      TEXT NOT NULL,
      unsubscribed_at TEXT
    );
  `);
  return db;
}

/** Record a waitlist signup. Re-signing up after an opt-out re-subscribes
 * (the form submission is fresh express consent). */
export function recordSignup(email: string): void {
  const now = new Date().toISOString();
  getDb()
    .prepare(
      `INSERT INTO subscribers (email, status, created_at)
       VALUES (?, 'subscribed', ?)
       ON CONFLICT(email) DO UPDATE SET status = 'subscribed', unsubscribed_at = NULL`,
    )
    .run(normalizeEmail(email), now);
}

/** Mark an address as unsubscribed. Inserts a row if we've never seen it, so
 * the opt-out is always durably recorded. */
export function unsubscribe(email: string): void {
  const now = new Date().toISOString();
  getDb()
    .prepare(
      `INSERT INTO subscribers (email, status, created_at, unsubscribed_at)
       VALUES (?, 'unsubscribed', ?, ?)
       ON CONFLICT(email) DO UPDATE SET status = 'unsubscribed', unsubscribed_at = excluded.unsubscribed_at`,
    )
    .run(normalizeEmail(email), now, now);
}

export function isUnsubscribed(email: string): boolean {
  const row = getDb()
    .prepare(`SELECT status FROM subscribers WHERE email = ?`)
    .get(normalizeEmail(email)) as { status: string } | undefined;
  return row?.status === "unsubscribed";
}

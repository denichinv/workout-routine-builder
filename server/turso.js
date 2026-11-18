import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  throw new Error(
    "TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be configured.",
  );
}

const database = createClient({
  url,
  authToken,
});

await database.execute(`
  CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL CHECK (length(trim(name)) > 0)
  )
`);
await database.execute(`
  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY NOT NULL,
    google_user_id TEXT NOT NULL,
    expires_at INTEGER NOT NULL
  )
`);

await database.execute(`
  CREATE TABLE IF NOT EXISTS google_login_challenges (
    nonce TEXT PRIMARY KEY NOT NULL,
    expires_at INTEGER NOT NULL
  )
`);
export default database;

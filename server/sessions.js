import { createHash, randomBytes } from "node:crypto";
import database from "./turso.js";

export const SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

function hashSessionToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(googleUserId, connection = database) {
  const token = randomBytes(32).toString("base64url");
  const now = Date.now();

  await connection.batch([
    {
      sql: "DELETE FROM sessions WHERE expires_at <= ?",
      args: [now],
    },
    {
      sql: `INSERT INTO sessions (token_hash, google_user_id, expires_at)
            VALUES (?, ?, ?)`,
      args: [hashSessionToken(token), googleUserId, now + SESSION_MAX_AGE],
    },
  ]);

  return token;
}

export async function getSessionUserId(token) {
  if (typeof token !== "string" || !token) return null;

  const result = await database.execute({
    sql: "SELECT google_user_id FROM sessions WHERE token_hash = ? AND expires_at > ?",
    args: [hashSessionToken(token), Date.now()],
  });

  return result.rows[0]?.google_user_id ?? null;
}

export async function deleteSession(token) {
  if (typeof token !== "string" || !token) return;

  await database.execute({
    sql: "DELETE FROM sessions WHERE token_hash = ?",
    args: [hashSessionToken(token)],
  });
}

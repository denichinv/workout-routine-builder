import process from "node:process";
import { OAuth2Client } from "google-auth-library";

const clientId = process.env.GOOGLE_CLIENT_ID?.trim();

if (!clientId) {
  throw new Error("GOOGLE_CLIENT_ID must be configured.");
}

const googleClient = new OAuth2Client();

export async function verifyGoogleIdToken(credential) {
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: clientId,
  });

  const googleUserId = ticket.getPayload()?.sub;

  if (!googleUserId) {
    throw new Error("Google ID token is missing a user ID.");
  }

  return googleUserId;
}

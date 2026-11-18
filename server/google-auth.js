import process from "node:process";
import { OAuth2Client } from "google-auth-library";

const clientId = process.env.GOOGLE_CLIENT_ID?.trim();

if (!clientId) {
  throw new Error("GOOGLE_CLIENT_ID must be configured.");
}

const googleClient = new OAuth2Client();

export async function verifyGoogleIdToken(credential, expectedNonce) {
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: clientId,
  });

  const payload = ticket.getPayload();

  if (!payload?.sub || !expectedNonce || payload.nonce !== expectedNonce) {
    throw new Error("Google ID token does not match this sign-in attempt.");
  }

  return payload.sub;
}

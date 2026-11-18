import { useCallback, useEffect, useState } from "react";
import GoogleSignIn from "./GoogleSignIn";

export default function AccountControls({ clientId }) {
  const [signedIn, setSignedIn] = useState(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function checkSession() {
      try {
        const response = await fetch("/api/auth/session", {
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("Session check failed.");

        const session = await response.json();
        if (typeof session.signedIn !== "boolean") {
          throw new Error("Invalid session response.");
        }

        if (!controller.signal.aborted) setSignedIn(session.signedIn);
      } catch {
        if (!controller.signal.aborted) {
          setError("Could not check your session. Refresh to try again.");
        }
      }
    }

    checkSession();
    return () => controller.abort();
  }, []);

  const handleSignedIn = useCallback(() => setSignedIn(true), []);

  async function handleSignOut() {
    setIsSigningOut(true);
    setError("");

    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });

      if (response.status !== 204) throw new Error("Sign-out failed.");

      setSignedIn(false);
    } catch {
      setError("Could not sign out. Try again.");
    } finally {
      setIsSigningOut(false);
    }
  }

  if (signedIn === null) {
    return <small role="status">{error || "Checking session…"}</small>;
  }

  if (!signedIn) {
    return <GoogleSignIn clientId={clientId} onSignedIn={handleSignedIn} />;
  }

  return (
    <div className="account-controls">
      <span role="status">
        {error || (isSigningOut ? "Signing out…" : "Signed in with Google")}
      </span>
      <button
        type="button"
        className="primary-button"
        onClick={handleSignOut}
        disabled={isSigningOut}
      >
        Sign out
      </button>
    </div>
  );
}

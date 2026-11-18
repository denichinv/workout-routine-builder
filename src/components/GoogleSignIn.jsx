import { useEffect, useRef, useState } from "react";

let googleScript;

function loadGoogleSignIn() {
  googleScript ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => resolve(window.google?.accounts?.id);
    script.onerror = reject;
    document.head.append(script);
  });

  return googleScript;
}

export default function GoogleSignIn({ clientId, onSignedIn }) {
  const buttonRef = useRef(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const buttonContainer = buttonRef.current;
    let active = true;

    async function verifyIdentity({ credential }) {
      if (!active) return;
      setStatus("Verifying Google identity…");

      try {
        const response = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credential }),
        });

        if (response.status !== 204) {
          throw new Error("Google verification failed.");
        }

        if (active) onSignedIn();
      } catch {
        if (active)
          setStatus("Could not verify your Google account. Try again.");
      }
    }

    loadGoogleSignIn()
      .then(async (googleSignIn) => {
        if (!active) return;
        if (!googleSignIn) throw new Error("Google Sign-In is unavailable.");

        const response = await fetch("/api/auth/google/challenge", {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Could not start Google Sign-In.");
        }

        const { nonce } = await response.json();

        if (!active) return;
        if (typeof nonce !== "string" || !nonce) {
          throw new Error("Missing Google Sign-In nonce.");
        }

        googleSignIn.initialize({
          client_id: clientId,
          callback: verifyIdentity,
          nonce,
        });
        googleSignIn.renderButton(buttonContainer, {
          theme: "outline",
          size: "large",
        });
      })
      .catch(() => {
        if (active)
          setStatus("Could not load Google Sign-In. Refresh to try again.");
      });

    return () => {
      active = false;
      buttonContainer.replaceChildren();
    };
  }, [clientId, onSignedIn]);

  return (
    <div>
      <div ref={buttonRef} />
      <small role="status">{status}</small>
    </div>
  );
}

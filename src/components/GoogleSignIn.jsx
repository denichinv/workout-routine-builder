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

export default function GoogleSignIn({ clientId }) {
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

        if (active) setStatus("Google identity verified.");
      } catch {
        if (active)
          setStatus("Could not verify your Google account. Try again.");
      }
    }

    loadGoogleSignIn()
      .then((googleSignIn) => {
        if (!active) return;
        if (!googleSignIn) throw new Error("Google Sign-In is unavailable.");

        googleSignIn.initialize({
          client_id: clientId,
          callback: verifyIdentity,
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
  }, [clientId]);

  return (
    <div>
      <div ref={buttonRef} />
      <small role="status">{status}</small>
    </div>
  );
}

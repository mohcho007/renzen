"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    track({
      name: "runtime_error",
      boundary: "global",
      digest: error.digest,
    });
  }, [error]);

  return (
    <html lang="da">
      <body>
        <main
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            padding: "24px",
            fontFamily: "system-ui, sans-serif",
            textAlign: "center",
          }}
        >
          <div>
            <title>Teknisk fejl | Renzen</title>
            <h1>Renzen kunne ikke indlæses</h1>
            <p>Prøv at indlæse siden igen.</p>
            <button
              type="button"
              onClick={() => unstable_retry()}
              style={{
                marginTop: "16px",
                border: 0,
                borderRadius: "999px",
                padding: "12px 22px",
                background: "#3b7965",
                color: "white",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Prøv igen
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}


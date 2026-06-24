"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { track } from "@/lib/analytics";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    track({
      name: "runtime_error",
      boundary: "route",
      digest: error.digest,
    });
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6 py-20">
      <div className="max-w-lg text-center">
        <AlertTriangle
          className="mx-auto text-amber-500"
          size={42}
          aria-hidden="true"
        />
        <h1 className="mt-5 font-display text-3xl font-extrabold text-brand-blue">
          Noget gik galt
        </h1>
        <p className="mt-3 text-zinc-600">
          Prøv igen. Hvis fejlen fortsætter, kan du gå tilbage til forsiden.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="rounded-full bg-brand-green px-6 py-3 font-bold text-white hover:bg-emerald-800"
          >
            Prøv igen
          </button>
          <Link
            href="/"
            className="rounded-full border border-zinc-300 px-6 py-3 font-bold text-brand-blue"
          >
            Gå til forsiden
          </Link>
        </div>
      </div>
    </main>
  );
}


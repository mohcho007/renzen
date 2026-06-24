import { sendKontaktEmails } from "@/lib/email/sendKontaktEmails";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

type KontaktBody = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
};

function validatePayload(body: unknown):
  | { ok: true; data: { name: string; email: string; subject: string; message: string } }
  | { ok: false; message: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, message: "Ugyldig henvendelse." };
  }

  const payload = body as KontaktBody;
  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const subject =
    typeof payload.subject === "string" && payload.subject.trim()
      ? payload.subject.trim()
      : "Henvendelse fra renzen.dk";
  const message =
    typeof payload.message === "string" ? payload.message.trim() : "";

  if (!name) {
    return { ok: false, message: "Angiv dit navn." };
  }
  if (!email || !isValidEmail(email)) {
    return { ok: false, message: "Angiv en gyldig e-mail." };
  }
  if (!message) {
    return { ok: false, message: "Skriv en besked." };
  }
  if (message.length > 5000) {
    return { ok: false, message: "Beskeden er for lang." };
  }

  return { ok: true, data: { name, email, subject, message } };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = validatePayload(body);

    if (!validation.ok) {
      return NextResponse.json(
        { success: false, message: validation.message },
        { status: 400 },
      );
    }

    console.info("[kontakt]", JSON.stringify(validation.data, null, 2));

    await sendKontaktEmails(validation.data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[kontakt] error:", error);
    return NextResponse.json(
      { success: false, message: "Serverfejl. Prøv igen senere." },
      { status: 500 },
    );
  }
}

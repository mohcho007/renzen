/** Label/placeholder copy from inquiry wizards — not real user input. */
const OPTIONAL_NOTE_UI_STRINGS = new Set([
  "Bemærkninger om adgang (valgfrit)",
  "Særlige ønsker (valgfrit)",
  "Bemærkninger (valgfrit)",
  "Ønsket periode (valgfrit)",
  "F.eks. sprosser, ovenlys, svært tilgængelige ruder...",
  "F.eks. ovn, skabe bag hvidevarer, paneler...",
  "F.eks. linnedskift, kalendersynkronisering, nøgleboks...",
  "F.eks. hæk på begge sider, skråning, adgang via bagport...",
  "F.eks. uge 12–14, start april, fleksibel i oktober...",
  "F.eks. store bede, frugttræer, komposthjørne...",
  "F.eks. drivhus, krukker på terrassen, nøgle hos nabo...",
  "F.eks. parkering, trapper, særlige forhold...",
  "F.eks. skabe der skal pakkes, særlige genstande...",
  "F.eks. hvornår det startede, fejlbeskeder...",
  "Beskriv hvordan vi får adgang",
]);

export function sanitizeOptionalNote(value: unknown): string {
  if (value == null) return "";
  const raw = String(value).trim();
  if (!raw) return "";

  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !OPTIONAL_NOTE_UI_STRINGS.has(line));

  return lines.join("\n").trim();
}

export function hasOptionalNote(value: unknown): boolean {
  return sanitizeOptionalNote(value).length > 0;
}

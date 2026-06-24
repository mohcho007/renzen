/** Strip legacy brand suffixes; live-style titles use ⇒ without appending | Renzen. */
export function formatPageTitle(title: string): string {
  return title
    .trim()
    .replace(/\s*\|\s*Renzen\.dk\s*$/i, "")
    .replace(/\s*\|\s*Renzen\s*$/i, "")
    .replace(/\s*—\s*Renzen\s*$/i, "")
    .trim();
}

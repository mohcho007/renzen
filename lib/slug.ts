/**
 * Converts a Danish string into a URL-safe, clean slug.
 * æ -> ae, ø -> oe, å -> aa
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'oe')
    .replace(/å/g, 'aa')
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

/**
 * Checks if a slug is equal to another by standardizing formatting.
 */
export function compareSlugs(slugA: string, slugB: string): boolean {
  return slugify(slugA) === slugify(slugB);
}

/**
 * Generate a clean, SEO-friendly slug from a string.
 * Removes special characters, collapses whitespace/dashes, and lowercases.
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')   // remove special chars
    .replace(/\s+/g, '-')            // spaces to dashes
    .replace(/-+/g, '-')             // collapse multiple dashes
    .replace(/^-|-$/g, '');          // trim leading/trailing dashes
}

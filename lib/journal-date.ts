// Sanity stores a post's date as an exact moment (in UTC), and the Studio shows
// it in the editor's own time. The website is built on servers that run on UTC,
// so without a fixed zone a post published on a Pacific evening would show
// tomorrow's date. Showing every date in the author's zone keeps the site in
// step with what the Studio shows.
export const AUTHOR_TIME_ZONE = "America/Vancouver";

export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: AUTHOR_TIME_ZONE,
  });
}

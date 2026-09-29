// Public identifiers (they're visible in every request the site makes), so
// they have defaults: a deploy where the env vars were never set still builds
// and reads the right project.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "tp816f5v";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2024-01-01";

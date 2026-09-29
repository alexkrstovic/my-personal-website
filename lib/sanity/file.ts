import { getFileAsset } from "@sanity/asset-utils";
import { projectId, dataset } from "@/lib/sanity/env";

// Uploaded files (videos) are stored as references; this turns one into a
// playable URL without another round trip to Sanity.
export function fileUrl(source: unknown): string | null {
  try {
    return getFileAsset(source as never, { projectId, dataset }).url;
  } catch {
    return null;
  }
}

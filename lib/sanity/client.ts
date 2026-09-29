import { createClient } from "next-sanity";
import { projectId, dataset, apiVersion } from "@/lib/sanity/env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // The published site reads through Sanity's CDN (fast, cached). While
  // developing locally, skip it so a freshly published post shows up at once.
  useCdn: process.env.NODE_ENV !== "development",
});

import { getJournalFeedPosts } from "@/lib/journal";
import { buildFeed } from "@/lib/journal-feed";

// Posts are published without a redeploy, so the feed refreshes on its own.
export const revalidate = 60;

export async function GET() {
  return new Response(buildFeed(await getJournalFeedPosts()), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}

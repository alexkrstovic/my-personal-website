import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import JournalArticle from "@/app/components/journal/JournalArticle";
import type { JournalPost } from "@/lib/journal";

// A whole post page: nav, article, footer. Used for the public page and for
// the Studio's preview frame, so what you preview is what visitors get.
export default function JournalPostView({
  post,
  priorityCover = false,
}: {
  post: JournalPost;
  priorityCover?: boolean;
}) {
  return (
    <div className="bg-bg min-h-screen">
      <Navbar />

      {/* pt must match the fixed Navbar's actual rendered height (currently 95px) */}
      <main className="pt-[95px]">
        <JournalArticle post={post} priorityCover={priorityCover} />
      </main>

      <Footer />
    </div>
  );
}

import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/posts";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export const metadata = {
  title: "Journal — Alex Krstovic",
  description: "Thoughts on UX design, research, and the craft of building digital products.",
};

export default function JournalPage() {
  const posts = getAllPosts();

  return (
    <div className="bg-[#f7efed] min-h-screen">
      <Navbar />

      <main className="pt-[68px]">
        {/* Header */}
        <div className="px-5 md:px-10 pt-24 pb-16">
          <h1 className="font-[family-name:var(--font-heading)] font-bold text-[42px] md:text-[60px] lg:text-[80px] text-[#131112] leading-[1.05]">
            Journal
          </h1>
          <p className="mt-4 font-[family-name:var(--font-body)] font-light text-[18px] md:text-[22px] lg:text-[25px] text-[#131112] leading-normal max-w-[555px]">
            Thoughts on design, research, and building digital products.
          </p>
        </div>

        {/* Divider */}
        <div className="px-5 md:px-10">
          <div className="h-px bg-[#131112] opacity-10" />
        </div>

        {/* Post list */}
        <ul className="px-5 md:px-10">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/journal/${post.slug}`}
                className="group flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 py-10 hover:opacity-70 transition-opacity"
              >
                <div className="flex-1 max-w-2xl">
                  <h2 className="font-[family-name:var(--font-heading)] font-bold text-[20px] md:text-[26px] lg:text-[30px] text-[#131112] leading-snug group-hover:opacity-100">
                    {post.title}
                  </h2>
                  <p className="mt-2 font-[family-name:var(--font-body)] font-light text-[15px] md:text-[17px] lg:text-[18px] text-[#131112] leading-relaxed opacity-70">
                    {post.excerpt}
                  </p>
                  {post.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center bg-[#e6e7e6] rounded-[5px] px-[10px] py-[10px] font-[family-name:var(--font-body)] font-light text-[12px] leading-none text-[#131112]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="font-[family-name:var(--font-body)] font-light text-[14px] text-[#131112] opacity-50 shrink-0 md:ml-12">
                  {formatDate(post.date)}
                </span>
              </Link>
              <div className="h-px bg-[#131112] opacity-10" />
            </li>
          ))}
        </ul>
      </main>

      <Footer />
    </div>
  );
}

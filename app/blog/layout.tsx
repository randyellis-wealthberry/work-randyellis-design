"use client";
import { TextMorph } from "@/components/ui/text-morph";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { RelatedContent } from "@/components/seo/related-content";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

function CopyButton() {
  const [text, setText] = useState("Copy URL");
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  useEffect(() => {
    if (text === "Copied!") {
      const timer = setTimeout(() => {
        setText("Copy URL");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [text]);

  return (
    <button
      onClick={() => {
        setText("Copied!");
        navigator.clipboard.writeText(currentUrl);
      }}
      className="font-base flex items-center text-center text-sm text-zinc-500 transition-colors dark:text-zinc-400"
      type="button"
    >
      <TextMorph>{text}</TextMorph>
    </button>
  );
}

export default function LayoutBlogPost({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Generate breadcrumb for blog posts
  const generateBlogBreadcrumbs = () => {
    if (pathname === "/blog") {
      return [{ label: "Blog", current: true }];
    }

    // Extract blog post slug from pathname
    const slug = pathname.split("/blog/")[1];
    if (slug) {
      // Get blog post title from the slug (basic formatting)
      const title = slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      return [
        { label: "Blog", href: "/blog" },
        { label: title, current: true },
      ];
    }

    return [{ label: "Blog", current: true }];
  };

  return (
    <>
      <div className="pointer-events-none fixed top-0 left-0 z-10 h-12 w-full bg-gray-100 to-transparent backdrop-blur-xl [-webkit-mask-image:linear-gradient(to_bottom,black,transparent)] dark:bg-zinc-950" />
      <ScrollProgress
        className="fixed top-0 z-20 h-0.5 bg-gray-300 dark:bg-zinc-600"
        springOptions={{
          bounce: 0,
        }}
      />
      <div className="mt-16">
        <BreadcrumbNav items={generateBlogBreadcrumbs()} />
      </div>
      <main className="prose prose-gray prose-h4:prose-base dark:prose-invert prose-h1:text-xl prose-h1:font-medium prose-h2:mt-12 prose-h2:scroll-m-20 prose-h2:text-lg prose-h2:font-medium prose-h3:text-base prose-h3:font-medium prose-h4:font-medium prose-h5:text-base prose-h5:font-medium prose-h6:text-base prose-h6:font-medium prose-strong:font-medium pb-8">
        <CopyButton />
        {children}
      </main>

      {/* Related Content Section */}
      {pathname !== "/blog" && (
        <div className="not-prose mt-12 border-t pt-12">
          <RelatedContent
            currentUrl={pathname}
            contentType="blog"
            maxItems={3}
            className="mb-20"
          />
        </div>
      )}
    </>
  );
}

import type { MDXComponents } from "mdx/types";
import { ComponentPropsWithoutRef } from "react";
import { CodeBlock, InlineCode } from "@/components/ui/code-block";

/**
 * The Media Band Figure frame (DESIGN.md), applied to anything an MDX body
 * puts on the page: a 1px Hairline on a Wash ground at `rounded-xl` with 12px
 * of padding (16px above `sm`), holding the asset at `rounded-lg`. What was
 * here was a bare `<img className="rounded-xl">` — an unframed asset that
 * changed the page's ground colour wherever the image had a light background.
 */
const FIGURE_FRAME =
  "not-prose my-8 rounded-xl border border-zinc-200 bg-zinc-100 p-3 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900";

/** The Uncropped Screen Rule: contained on a tinted ground, never cropped. */
const FIGURE_ASSET = "w-full rounded-lg object-contain";

/** Captions are Quiet at Footnote size, capped at the reading measure. */
const FIGURE_CAPTION =
  "mt-3 max-w-[62ch] text-xs leading-relaxed text-zinc-500 dark:text-zinc-400";

/**
 * A framed figure with an optional caption. Defined once — this component and
 * the `Cover` entry in `useMDXComponents` below were two byte-identical copies
 * of the same markup, so a change to one silently left the other behind.
 */
export function Cover({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className={FIGURE_FRAME}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className={FIGURE_ASSET} />
      {caption && <figcaption className={FIGURE_CAPTION}>{caption}</figcaption>}
    </figure>
  );
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    Cover,
    // A markdown image gets the same frame as an authored one, so a body does
    // not alternate between framed and bare evidence.
    img: ({ src, alt, ...props }: ComponentPropsWithoutRef<"img">) => (
      <figure className={FIGURE_FRAME}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt ?? ""} className={FIGURE_ASSET} {...props} />
        {alt && <figcaption className={FIGURE_CAPTION}>{alt}</figcaption>}
      </figure>
    ),
    // The Quote Panel (DESIGN.md): someone else's words in a hairline-bounded
    // panel, in Ink at Lead size capped at 68ch. Typography's default is a 4px
    // left bar and an italic voice — the system has no italic voice, and a
    // single heavy bar is a third rule weight (The Two-Weight Rule).
    blockquote: ({
      children,
      ...props
    }: ComponentPropsWithoutRef<"blockquote">) => (
      <blockquote
        className="not-prose my-8 max-w-[68ch] rounded-xl border border-zinc-200 px-5 py-4 text-lg leading-relaxed font-normal text-zinc-900 not-italic dark:border-zinc-800 dark:text-white [&>p+p]:mt-4"
        {...props}
      >
        {children}
      </blockquote>
    ),
    // Handle fenced code blocks
    pre: ({ children, ...props }: ComponentPropsWithoutRef<"pre">) => {
      // Extract the code element and its props
      if (children && typeof children === "object" && "props" in children) {
        const codeElement = children as React.ReactElement<{
          children?: string;
          className?: string;
        }>;
        if (codeElement.props?.children) {
          const code = codeElement.props.children;
          const className = codeElement.props.className || "";
          // Extract language from className (e.g., "language-javascript")
          const language = className.replace(/language-/, "");

          return <CodeBlock language={language}>{code}</CodeBlock>;
        }
      }
      // Fallback for non-standard code blocks
      return <pre {...props}>{children}</pre>;
    },
    // Handle inline code
    code: ({ children, ...props }: ComponentPropsWithoutRef<"code">) => {
      // Check if this is an inline code (not inside a pre tag)
      const isInline = !props.className?.includes("language-");
      if (isInline && typeof children === "string") {
        return <InlineCode>{children}</InlineCode>;
      }
      // This is part of a code block, just return the code element
      return <code {...props}>{children}</code>;
    },
  };
}

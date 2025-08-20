import type { MDXComponents } from "mdx/types";
import { ComponentPropsWithoutRef } from "react";
import { CodeBlock, InlineCode } from "@/components/ui/code-block";

export function Cover({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) {
  return (
    <figure>
      <img src={src} alt={alt} className="rounded-xl" />
      <figcaption className="text-center">{caption}</figcaption>
    </figure>
  );
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    Cover: ({
      src,
      alt,
      caption,
    }: {
      src: string;
      alt: string;
      caption: string;
    }) => {
      return (
        <figure>
          <img src={src} alt={alt} className="rounded-xl" />
          <figcaption className="text-center">{caption}</figcaption>
        </figure>
      );
    },
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

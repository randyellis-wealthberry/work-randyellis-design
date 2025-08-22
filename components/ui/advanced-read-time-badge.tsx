import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { type ArticleMetadata } from "@/lib/utils/read-time";

const advancedBadgeVariants = cva("", {
  variants: {
    size: {
      sm: "px-2 py-0.5 text-xs",
      md: "px-2.5 py-0.5 text-xs",
      lg: "px-3 py-1 text-sm",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface AdvancedReadTimeBadgeProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof badgeVariants>,
    VariantProps<typeof advancedBadgeVariants> {
  readTime: number;
  metadata?: ArticleMetadata;
  showMetadata?: boolean;
}

function formatNumber(num: number): string {
  return num.toLocaleString();
}

function formatMetadataItem(
  count: number,
  singular: string,
  plural: string,
): string | null {
  if (count === 0) return null;
  return `${formatNumber(count)} ${count === 1 ? singular : plural}`;
}

export function AdvancedReadTimeBadge({
  readTime,
  metadata,
  showMetadata = false,
  variant = "default",
  size = "md",
  className,
  ...props
}: AdvancedReadTimeBadgeProps) {
  const metadataItems = React.useMemo(() => {
    if (!metadata || !showMetadata) return [];

    const items = [
      formatMetadataItem(metadata.wordCount, "word", "words"),
      formatMetadataItem(metadata.imageCount, "image", "images"),
      formatMetadataItem(metadata.codeBlockCount, "code block", "code blocks"),
    ].filter(Boolean);

    return items;
  }, [metadata, showMetadata]);

  const hasMetadata = metadataItems.length > 0;

  return (
    <div className={cn("flex flex-col gap-1", className)} {...props}>
      <Badge variant={variant} className={cn(advancedBadgeVariants({ size }))}>
        {readTime} min read
      </Badge>

      {hasMetadata && (
        <div className="flex flex-wrap gap-1">
          {metadataItems.map((item, index) => (
            <Badge
              key={index}
              variant="outline"
              className={cn(advancedBadgeVariants({ size: "sm" }))}
            >
              {item}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

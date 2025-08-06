import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CaseStudySectionProps {
  title: string;
  id: string;
  children: ReactNode;
  className?: string;
}

export function CaseStudySection({
  title,
  id,
  children,
  className,
}: CaseStudySectionProps) {
  return (
    <section
      id={id}
      role="region"
      aria-labelledby={`${id}-heading`}
      className={cn("space-y-8", className)}
    >
      <div className="text-center">
        <h2
          id={`${id}-heading`}
          className="text-3xl md:text-4xl font-bold tracking-tight"
        >
          {title}
        </h2>
      </div>
      <div className="space-y-8">{children}</div>
    </section>
  );
}

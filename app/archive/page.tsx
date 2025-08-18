import { Metadata } from "next";
import { AccordionIcons } from "@/components/accordion-icons";
import { ScrambleSectionTitle } from "@/components/ui/scramble-section-title";

export const metadata: Metadata = {
  title: "Archive",
  description: "A collection of old articles and career footage",
};

export default function ArchivePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ScrambleSectionTitle as="h1" className="mb-8 text-3xl font-bold">
        Archive
      </ScrambleSectionTitle>
      <p className="mb-8 text-zinc-600 dark:text-zinc-400">
        A collection of old articles and career footage will be displayed here.
      </p>
      <AccordionIcons />
    </div>
  );
}

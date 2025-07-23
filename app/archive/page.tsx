import { Metadata } from "next";
import { AccordionIcons } from "@/components/accordion-icons";

export const metadata: Metadata = {
  title: "Archive",
  description: "A collection of old articles and career footage",
};

export default function ArchivePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Archive</h1>
      <p className="text-zinc-600 dark:text-zinc-400 mb-8">
        A collection of old articles and career footage will be displayed here.
      </p>
      <AccordionIcons />
    </div>
  );
}

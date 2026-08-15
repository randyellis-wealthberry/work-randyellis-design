import { createPageMetadata } from "@/lib/metadata";
import WaffleClientPage from "./waffle-client";

export const metadata = createPageMetadata({
  title: "Waffle | AI Interview Scorecard Generator",
  description:
    "AI-powered interview scorecard generator — paste a job description, get weighted competencies, behavioral questions, and scoring rubrics in 2–4 minutes.",
  path: "/projects/waffle",
  image: "/projects/waffle/opengraph.png",
  keywords: [
    "AI interview scorecard",
    "Waffle",
    "hiring AI tool",
    "Randy Ellis AI SaaS",
  ],
});

export default function WaffleProductPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-16">
      <WaffleClientPage />
    </div>
  );
}

import { CometCard } from "@/components/ui/comet-card";

export function CometCardDemo() {
  return (
    <CometCard className="[&>div>div:last-child]:hidden">
      <div className="relative aspect-[3/4] w-96 cursor-pointer rounded-2xl overflow-hidden">
        <img
          loading="lazy"
          className="h-full w-full object-cover"
          alt="METIS Player Card"
          src="/images/projects/metis/playercard-metis.png"
        />
      </div>
    </CometCard>
  );
}

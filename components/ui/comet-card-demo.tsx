import { CometCard } from "@/components/ui/comet-card";
import Image from "next/image";

export function CometCardDemo() {
  return (
    <CometCard className="[&>div>div:last-child]:hidden">
      <div className="relative aspect-[3/4] w-96 cursor-pointer rounded-2xl overflow-hidden">
        <Image
          loading="lazy"
          className="h-full w-full object-cover"
          alt="METIS Player Card"
          src="/images/projects/metis/playercard-metis.png"
          width={384}
          height={512}
        />
      </div>
    </CometCard>
  );
}

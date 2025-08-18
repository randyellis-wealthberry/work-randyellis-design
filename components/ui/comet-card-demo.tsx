import { CometCard } from "@/components/ui/comet-card";
import Image from "next/image";

export function CometCardDemo() {
  return (
    <CometCard className="[&>div>div:last-child]:hidden">
      <div className="relative mx-auto aspect-[3/4] w-full max-w-sm cursor-pointer overflow-hidden rounded-2xl md:max-w-md lg:max-w-lg">
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

import Image from "next/image";

export default function Component() {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-full shadow-sm">
      <Image
        className="rounded-full"
        src="/images/randyellis-official-avatar.png"
        alt="Randy Ellis"
        width={20}
        height={20}
      />
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        @iamrandyellis
      </span>
    </div>
  );
}

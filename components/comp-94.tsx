import Image from "next/image";

export default function Component() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
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

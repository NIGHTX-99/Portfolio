import Image from "next/image";

type LanyardBadgeProps = {
  imageSrc: string;
  name: string;
};

export function LanyardBadge({ imageSrc, name }: LanyardBadgeProps) {
  return (
    <div className="relative mx-auto flex w-full max-w-[220px] flex-col items-center pt-4 sm:max-w-none sm:pt-0">
      <div className="relative h-28 w-3 rounded-full bg-gradient-to-b from-zinc-300 via-zinc-200 to-zinc-300 shadow-inner" />
      <div className="relative -mt-1 h-8 w-24 rounded-md border border-zinc-300 bg-zinc-100 shadow-sm" />
      <div className="relative -mt-0.5 w-[min(100%,200px)] overflow-hidden rounded-lg border border-zinc-200 bg-white p-3 shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-zinc-100">
          <Image
            src={imageSrc}
            alt={name}
            fill
            className="object-cover object-top"
            sizes="200px"
          />
        </div>
        <p className="mt-2 text-center text-[10px] font-medium uppercase tracking-widest text-zinc-500">
          {name}
        </p>
      </div>
    </div>
  );
}

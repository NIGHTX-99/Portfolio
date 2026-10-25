import Link from "next/link";

import { CopyButton } from "@/components/CopyButton";
import { HeroTypography } from "@/components/HeroTypography";
import { RevealCanvas } from "@/components/RevealCanvas";
import type { SiteConfig } from "@/lib/site-types";

type SiteFrameProps = {
  config: SiteConfig;
};

export function SiteFrame({ config }: SiteFrameProps) {
  const { hero, contact, social } = config;

  return (
    <div className="min-h-dvh bg-[#ececec] p-3 sm:p-5 md:p-6">
      <div className="relative mx-auto flex min-h-[calc(100dvh-1.5rem)] flex-col overflow-hidden rounded-[2.5rem] bg-white shadow-[0_8px_40px_rgba(0,0,0,0.06)] sm:min-h-[calc(100dvh-2.5rem)] md:min-h-[calc(100dvh-3rem)]">
        <header className="relative z-30 flex flex-wrap items-center justify-between gap-4 px-6 py-5 sm:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${contact.email}`}
              className="text-sm text-zinc-600 transition-colors hover:text-zinc-900"
            >
              {contact.email}
            </a>
            <CopyButton text={contact.email} />
            <Link
              href={contact.cvUrl}
              target="_blank"
              className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-zinc-800 shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
            >
              CV
            </Link>
          </div>
          <Link
            href="/admin"
            className="text-xs text-zinc-400 transition-colors hover:text-zinc-600"
          >
            Admin
          </Link>
        </header>

        <main className="relative flex flex-1 flex-col">
          <RevealCanvas
            key={`${hero.backgroundImage}-${hero.revealSeed}`}
            imageSrc={hero.backgroundImage}
            revealSeed={hero.revealSeed}
          />
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <HeroTypography
              greeting={hero.greeting}
              nameLine1={hero.nameLine1}
              nameLine2={hero.nameLine2}
              social={social}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

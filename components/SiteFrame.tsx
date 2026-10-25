import Link from "next/link";

import { AboutSection } from "@/components/AboutSection";
import { CopyButton } from "@/components/CopyButton";
import { HeroTypography } from "@/components/HeroTypography";
import { RevealCanvas } from "@/components/RevealCanvas";
import type { SiteConfig } from "@/lib/site-types";

type SiteFrameProps = {
  config: SiteConfig;
};

export function SiteFrame({ config }: SiteFrameProps) {
  const { hero, contact, social, about } = config;

  return (
    <div className="bg-white">
      <section className="relative flex min-h-dvh flex-col">
        <header className="relative z-30 flex flex-wrap items-center justify-between gap-4 px-6 py-6 sm:px-10">
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${contact.email}`}
              className="text-sm text-zinc-700/90 transition-colors hover:text-zinc-900"
            >
              {contact.email}
            </a>
            <CopyButton text={contact.email} />
            <Link
              href={contact.cvUrl}
              target="_blank"
              className="text-sm font-medium text-zinc-800 underline-offset-4 hover:underline"
            >
              CV
            </Link>
          </div>
          <Link
            href="/admin"
            className="text-xs text-zinc-500/80 transition-colors hover:text-zinc-700"
          >
            Admin
          </Link>
        </header>

        <main className="relative min-h-dvh flex-1">
          <RevealCanvas
            key={`${hero.backgroundImage}-${hero.revealSeed}`}
            imageSrc={hero.backgroundImage}
            revealSeed={hero.revealSeed}
          />
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
            <HeroTypography
              greeting={hero.greeting}
              nameLine1={hero.nameLine1}
              nameLine2={hero.nameLine2}
              social={social}
            />
          </div>
        </main>
      </section>

      <AboutSection about={about} contact={contact} social={social} />
    </div>
  );
}

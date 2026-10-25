import type { ReactNode } from "react";
import {
  Figma,
  GitHubLight,
  Gmail,
  Instagram,
  LinkedIn,
  Nextjs,
  Photoshop,
  ReactLight,
  TypeScript,
} from "@ridemountainpig/svgl-react";

import { LanyardBadge } from "@/components/LanyardBadge";
import type { SiteConfig, TimelineEntry } from "@/lib/site-types";

type AboutSectionProps = {
  about: SiteConfig["about"];
  contact: SiteConfig["contact"];
  social: SiteConfig["social"];
};

function TimelineColumn({ title, entries }: { title: string; entries: TimelineEntry[] }) {
  return (
    <div>
      <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
        {title}
      </h3>
      <ul className="space-y-6">
        {entries.map((entry) => (
          <li key={`${entry.role}-${entry.period}`}>
            <p className="text-sm font-semibold text-zinc-900">{entry.role}</p>
            <p className="mt-0.5 text-sm text-zinc-500">{entry.organization}</p>
            <p className="mt-0.5 text-xs text-zinc-400">{entry.period}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactRow({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-2 text-sm text-zinc-600 transition-colors hover:text-zinc-900"
    >
      <span className="opacity-80 transition-opacity group-hover:opacity-100">{children}</span>
      <span>{label}</span>
    </a>
  );
}

const toolIconClass = "h-7 w-7";

export function AboutSection({ about, contact, social }: AboutSectionProps) {
  const githubHandle = social.github.replace(/^https?:\/\/(www\.)?github\.com\/?/i, "@") || social.github;
  const instagramHandle =
    social.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\/?/i, "@") || social.instagram;
  const linkedinHandle =
    social.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\/?/i, "") || social.linkedin;

  return (
    <section className="bg-white px-6 py-16 sm:px-10 md:px-16 lg:px-24 lg:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(180px,220px)_1fr] lg:gap-16">
        <LanyardBadge imageSrc={about.badgeImage} name={about.highlightName} />

        <div>
          <h2 className="font-sans text-3xl font-light tracking-tight text-zinc-800 sm:text-4xl md:text-[2.75rem] md:leading-tight">
            {about.greeting}{" "}
            <span className="font-semibold text-[#a67c52]">{about.highlightName}</span>
          </h2>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-zinc-600 sm:text-base">
            {about.bio}
          </p>

          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            <TimelineColumn title="Experience" entries={about.experienceLeft} />
            <TimelineColumn title="Experience" entries={about.experienceRight} />

            <div>
              <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Contact
              </h3>
              <div className="flex flex-col gap-3">
                <ContactRow href={social.github} label={githubHandle}>
                  <GitHubLight className={toolIconClass} />
                </ContactRow>
                <ContactRow href={social.linkedin} label={linkedinHandle}>
                  <LinkedIn className={toolIconClass} />
                </ContactRow>
                <ContactRow href={social.instagram} label={instagramHandle}>
                  <Instagram className={toolIconClass} />
                </ContactRow>
                <ContactRow href={`mailto:${contact.email}`} label={contact.email}>
                  <Gmail className={toolIconClass} />
                </ContactRow>
              </div>
            </div>

            <div>
              <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Softwares
              </h3>
              <div className="flex flex-wrap gap-3" aria-label="Software tools">
                <Figma className={toolIconClass} aria-label="Figma" />
                <Photoshop className={toolIconClass} aria-label="Photoshop" />
                <TypeScript className={toolIconClass} aria-label="TypeScript" />
                <ReactLight className={toolIconClass} aria-label="React" />
                <Nextjs className={toolIconClass} aria-label="Next.js" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

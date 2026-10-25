import fs from "fs/promises";
import path from "path";
import { unstable_noStore as noStore } from "next/cache";

import type { SiteConfig, TimelineEntry } from "@/lib/site-types";

const sitePath = () => path.join(process.cwd(), "data", "site.json");

function isTimelineEntry(value: unknown): value is TimelineEntry {
  if (!value || typeof value !== "object") return false;
  const e = value as TimelineEntry;
  return (
    typeof e.role === "string" &&
    typeof e.organization === "string" &&
    typeof e.period === "string"
  );
}

function isTimelineArray(value: unknown): value is TimelineEntry[] {
  return Array.isArray(value) && value.every(isTimelineEntry);
}

export async function getSiteConfig(): Promise<SiteConfig> {
  noStore();
  const raw = await fs.readFile(sitePath(), "utf-8");
  return JSON.parse(raw) as SiteConfig;
}

export async function saveSiteConfig(config: SiteConfig): Promise<void> {
  await fs.writeFile(sitePath(), `${JSON.stringify(config, null, 2)}\n`, "utf-8");
}

export function isSiteConfig(value: unknown): value is SiteConfig {
  if (!value || typeof value !== "object") return false;
  const v = value as SiteConfig;
  return (
    typeof v.hero?.greeting === "string" &&
    typeof v.hero?.nameLine1 === "string" &&
    typeof v.hero?.nameLine2 === "string" &&
    typeof v.hero?.backgroundImage === "string" &&
    typeof v.hero?.revealSeed === "number" &&
    typeof v.contact?.email === "string" &&
    typeof v.contact?.cvUrl === "string" &&
    typeof v.social?.github === "string" &&
    typeof v.social?.instagram === "string" &&
    typeof v.social?.linkedin === "string" &&
    typeof v.about?.greeting === "string" &&
    typeof v.about?.highlightName === "string" &&
    typeof v.about?.bio === "string" &&
    typeof v.about?.badgeImage === "string" &&
    isTimelineArray(v.about?.experienceLeft) &&
    isTimelineArray(v.about?.experienceRight)
  );
}

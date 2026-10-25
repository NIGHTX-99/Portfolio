import { Suspense } from "react";

import { SiteFrame } from "@/components/SiteFrame";
import { getSiteConfig } from "@/lib/site";

async function HomeContent() {
  const config = await getSiteConfig();
  return <SiteFrame config={config} />;
}

function HomeFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#ececec] text-zinc-500">
      Loading…
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomeFallback />}>
      <HomeContent />
    </Suspense>
  );
}

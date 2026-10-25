"use client";

import type { ReactNode } from "react";
import { GitHubLight, Instagram, LinkedIn } from "@ridemountainpig/svgl-react";
import { motion } from "motion/react";

type SocialLinksProps = {
  github: string;
  instagram: string;
  linkedin: string;
};

const iconClass = "h-7 w-7 text-zinc-900 drop-shadow-sm";

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      whileHover={{ scale: 1.12, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="rounded-full bg-white/80 p-3 shadow-[0_2px_16px_rgba(0,0,0,0.1)] backdrop-blur-sm transition-colors hover:bg-white"
    >
      {children}
    </motion.a>
  );
}

export function SocialLinks({ github, instagram, linkedin }: SocialLinksProps) {
  return (
    <div className="pointer-events-auto flex items-center gap-4">
      <SocialIcon href={github} label="GitHub">
        <GitHubLight className={iconClass} />
      </SocialIcon>
      <SocialIcon href={instagram} label="Instagram">
        <Instagram className={iconClass} />
      </SocialIcon>
      <SocialIcon href={linkedin} label="LinkedIn">
        <LinkedIn className={iconClass} />
      </SocialIcon>
    </div>
  );
}

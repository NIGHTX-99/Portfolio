"use client";

import { motion } from "motion/react";

import { SocialLinks } from "@/components/SocialLinks";

type HeroTypographyProps = {
  greeting: string;
  nameLine1: string;
  nameLine2: string;
  social: {
    github: string;
    instagram: string;
    linkedin: string;
  };
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.15 + i * 0.12,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

export function HeroTypography({
  greeting,
  nameLine1,
  nameLine2,
  social,
}: HeroTypographyProps) {
  return (
    <div className="pointer-events-none relative z-20 flex flex-col items-center justify-center px-6 text-center">
      <motion.p
        custom={0}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="font-script mb-2 text-3xl text-zinc-500 sm:text-4xl md:text-5xl"
      >
        {greeting}
      </motion.p>
      <motion.h1
        custom={1}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="font-display text-[clamp(3.5rem,14vw,9rem)] leading-[0.88] tracking-tight text-zinc-900 uppercase [text-shadow:0_1px_2px_rgba(255,255,255,0.9),0_0_32px_rgba(255,255,255,0.95)]"
      >
        {nameLine1}
      </motion.h1>
      <motion.h1
        custom={2}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="font-display text-[clamp(3.5rem,14vw,9rem)] leading-[0.88] tracking-tight text-zinc-900 uppercase [text-shadow:0_1px_2px_rgba(255,255,255,0.9),0_0_32px_rgba(255,255,255,0.95)]"
      >
        {nameLine2}
      </motion.h1>
      <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp} className="mt-10">
        <SocialLinks {...social} />
      </motion.div>
    </div>
  );
}

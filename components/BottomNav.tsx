"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdApps,
  MdCalendarToday,
  MdHome,
  MdPeople,
  MdRocket,
} from "react-icons/md";

// Matches the reference design: a floating white pill with the active tab
// highlighted as a wider lavender pill (icon + label) and the rest as plain
// grey glyphs. The numbered badge and "Active text" label above the card are
// part of the reference format and are kept so the section looks identical.
const navItems = [
  { href: "/", label: "Home", icon: MdHome },
  { href: "/about", label: "About", icon: MdPeople },
  { href: "/projects", label: "Projects", icon: MdRocket },
  { href: "/blog", label: "Blog", icon: MdCalendarToday },
  { href: "/contact", label: "Contact", icon: MdApps },
] as const;

const ACTIVE_FILL = "#e8eaf6";
const ACTIVE_FG = "#5a5fc4";
const INACTIVE_FG = "#9aa0a6";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center" aria-label="Primary">
      {/* Floating pill card */}
      <div className="flex items-center rounded-[22px] bg-white px-3 py-2 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.55)]">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className="flex items-center"
            >
              <span
                className={`flex items-center gap-1.5 rounded-xl px-2 py-1 transition-colors ${
                  active ? "bg-[#e8eaf6]" : "bg-transparent"
                }`}
              >
                <Icon
                  className={`h-6 w-6 shrink-0 ${
                    active ? "text-[#5a5fc4]" : "text-[#9aa0a6]"
                  }`}
                  aria-hidden
                />
                {active && (
                  <span className="text-xs font-medium text-[#5a5fc4]">
                    {label}
                  </span>
                )}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
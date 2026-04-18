'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Coffee, Activity, Pill, BookOpen, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface NavLink {
  href: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  color: string;
  activeColor: string;
  mobileActiveColor: string;
}

const links: NavLink[] = [
  {
    href: '/',
    label: 'Sleep Calculator',
    shortLabel: 'Sleep',
    icon: Moon,
    color: 'text-blue-400',
    activeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    mobileActiveColor: 'text-blue-400',
  },
  {
    href: '/coffee',
    label: 'Brew Calculator',
    shortLabel: 'Brew',
    icon: Coffee,
    color: 'text-amber-500',
    activeColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    mobileActiveColor: 'text-amber-500',
  },
  {
    href: '/tolerance',
    label: 'Tolerance',
    shortLabel: 'Tolerance',
    icon: Activity,
    color: 'text-emerald-500',
    activeColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    mobileActiveColor: 'text-emerald-500',
  },
  {
    href: '/melatonin',
    label: 'Melatonin',
    shortLabel: 'Melatonin',
    icon: Pill,
    color: 'text-indigo-400',
    activeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    mobileActiveColor: 'text-indigo-400',
  },
  {
    href: '/references',
    label: 'References',
    shortLabel: 'Refs',
    icon: BookOpen,
    color: 'text-purple-400',
    activeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    mobileActiveColor: 'text-purple-400',
  },
];

export function Header() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop/tablet: floating pill at top */}
      <div className="hidden sm:flex w-full justify-center pt-6 pb-2">
        <nav className="glass-panel border-white/10 rounded-full p-1 flex items-center gap-1 shadow-2xl relative z-50">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3 sm:px-4 py-1.5 sm:py-2 rounded-full overflow-hidden"
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-pill"
                    className={cn('absolute inset-0 rounded-full border', link.activeColor)}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <div
                  className={cn(
                    'relative flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium z-10 transition-colors duration-300',
                    isActive ? link.color : 'text-white/60 hover:text-white'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile: fixed bottom tab bar */}
      <nav
        className="sm:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-white/10 pb-[env(safe-area-inset-bottom)]"
        aria-label="Primary"
      >
        <ul className="flex items-stretch justify-around">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <li key={link.href} className="flex-1">
                <Link
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={link.label}
                  className={cn(
                    'relative flex flex-col items-center justify-center gap-0.5 py-2 px-1 transition-colors duration-300',
                    isActive ? link.mobileActiveColor : 'text-white/60 active:text-white'
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="active-nav-indicator-mobile"
                      className={cn('absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full', link.mobileActiveColor.replace('text-', 'bg-'))}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium leading-none">{link.shortLabel}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

    </>
  );
}

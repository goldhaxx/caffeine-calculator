'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Coffee, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function Header() {
  const pathname = usePathname();

  const links = [
    {
      href: '/',
      label: 'Sleep Calculator',
      icon: Moon,
      color: 'text-blue-400',
      activeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    },
    {
      href: '/coffee',
      label: 'Brew Calculator',
      icon: Coffee,
      color: 'text-amber-500',
      activeColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    },
    {
      href: '/tolerance',
      label: 'Tolerance',
      icon: Activity,
      color: 'text-emerald-500',
      activeColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    }
  ];

  return (
    <div className="w-full flex justify-center pt-6 pb-2">
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
              {/* Background pill selector */}
              {isActive && (
                <motion.div
                  layoutId="active-nav-pill"
                  className={cn("absolute inset-0 rounded-full border", link.activeColor)}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <div className={cn(
                "relative flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium z-10 transition-colors duration-300",
                isActive ? link.color : "text-white/60 hover:text-white"
              )}>
                <Icon className="w-4 h-4" />
                {link.label}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

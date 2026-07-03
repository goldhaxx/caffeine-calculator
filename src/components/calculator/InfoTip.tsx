'use client';

import { ReactNode } from 'react';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface InfoTipProps {
  label: string; // accessible name for the trigger
  children: ReactNode;
}

// Info-icon tooltip in the app's established idiom (metabolism tooltip in
// CalculatorForm) — used to surface the under-the-hood math without
// cluttering the cards.
export function InfoTip({ label, children }: InfoTipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" aria-label={label} className="inline-flex align-middle text-muted-foreground hover:text-foreground cursor-help">
          <Info className="h-4 w-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="w-80 p-4 border-white/20 glass-panel">
        {children}
      </TooltipContent>
    </Tooltip>
  );
}

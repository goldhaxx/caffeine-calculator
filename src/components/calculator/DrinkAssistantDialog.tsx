'use client';

import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BEVERAGE_DATABASE, COMMON_SIZES, ICE_MODIFIERS, Beverage } from '@/lib/beverage-data';
import { Check, ChevronsUpDown, Coffee, Droplets, Info, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

interface DrinkAssistantDialogProps {
  onAdd: (mg: number) => void;
}

export function DrinkAssistantDialog({ onAdd }: DrinkAssistantDialogProps) {
  const [open, setOpen] = useState(false);
  const [comboOpen, setComboOpen] = useState(false);
  
  const [selectedDrink, setSelectedDrink] = useState<Beverage | null>(null);
  const [volume, setVolume] = useState<number | ''>('');
  const [iceModifier, setIceModifier] = useState<number>(1.0);

  const calculatedMg = useMemo(() => {
    if (!selectedDrink || !volume) return 0;
    const actualVolume = Number(volume) * iceModifier;
    return Math.round(actualVolume * selectedDrink.caffeinePerOz);
  }, [selectedDrink, volume, iceModifier]);

  const handleAdd = () => {
    if (calculatedMg > 0) {
      onAdd(calculatedMg);
      setOpen(false);
      reset();
    }
  };

  const reset = () => {
    setSelectedDrink(null);
    setVolume('');
    setIceModifier(1.0);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) reset();
    }}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/20 shadow-[0_0_15px_rgba(236,72,153,0.15)] transition-all font-medium py-1 px-3 h-8"
        >
          <Wand2 className="w-3.5 h-3.5 mr-1.5" />
          Find My Drink
        </Button>
      </DialogTrigger>
      
      <DialogContent className="glass-panel border-white/20 sm:max-w-[425px]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-pink-400 to-violet-500"></div>
        <DialogHeader>
          <DialogTitle className="font-outfit text-2xl font-bold flex items-center gap-2">
            Drink Assistant
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Let us do the math. Select your drink, cup size, and ice level.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-2 flex flex-col">
            <label className="text-sm font-medium text-white flex items-center gap-2">
              <Coffee className="w-4 h-4 text-pink-400" />
              1. What are you drinking?
            </label>
            <Popover open={comboOpen} onOpenChange={setComboOpen} modal={true}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={comboOpen}
                  className="w-full justify-between bg-white/5 border-white/20 hover:bg-white/10"
                >
                  {selectedDrink ? (
                    <span className="truncate">{selectedDrink.brand} - {selectedDrink.name}</span>
                  ) : (
                    <span className="text-muted-foreground">Search drinks...</span>
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[375px] max-w-[90vw] p-0 border-white/20 glass-panel">
                <Command className="bg-transparent">
                  <CommandInput placeholder="Search drinks (e.g., La Colombe...)" className="border-none focus:ring-0" />
                  <CommandList>
                    <CommandEmpty>No drink found.</CommandEmpty>
                    {['coffee', 'tea', 'energy', 'soda'].map((category) => {
                      const categoryDrinks = BEVERAGE_DATABASE.filter(d => d.category === category);
                      if (categoryDrinks.length === 0) return null;
                      return (
                        <CommandGroup key={category} heading={<span className="capitalize text-pink-300">{category}</span>}>
                          {categoryDrinks.map((drink) => (
                            <CommandItem
                              key={drink.id}
                              value={`${drink.brand} ${drink.name}`}
                              onSelect={() => {
                                setSelectedDrink(drink);
                                setComboOpen(false);
                              }}
                              className="text-white hover:bg-white/10 cursor-pointer"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedDrink?.id === drink.id ? "opacity-100 text-pink-400" : "opacity-0"
                                )}
                              />
                              {drink.brand} - {drink.name}
                              <span className="ml-auto text-xs text-white/50">{drink.caffeinePerOz}mg/oz</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )
                    })}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <TooltipProvider>
            <div className="space-y-3">
              <label className="text-sm font-medium text-white flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-400" />
                2. Container Size (oz)
              </label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  placeholder="24"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value ? Number(e.target.value) : '')}
                  className="bg-white/5 border-white/20 w-24 text-center"
                />
                <span className="text-sm text-white/70">oz</span>
                
                <Select
                  onValueChange={(val) => setVolume(Number(val))}
                  value={volume ? volume.toString() : ""}
                >
                  <SelectTrigger className="w-full bg-white/5 border-white/20 ml-2">
                    <SelectValue placeholder="Presets..." />
                  </SelectTrigger>
                  <SelectContent className="border-white/20 glass-panel">
                    {COMMON_SIZES.map((size) => (
                      <SelectItem key={size.value} value={size.value.toString()}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border border-blue-200/50 flex items-center justify-center text-[10px] text-blue-200 bg-blue-500/20">🧊</span>
                  3. Ice Level
                </div>
                
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-white/50 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="glass-panel border-white/20 max-w-xs text-sm text-white/90">
                    Ice takes up space! Selecting "Extra Ice" will roughly cut the actual liquid volume of your drink in half.
                  </TooltipContent>
                </Tooltip>
              </label>
              <Select
                value={iceModifier.toString()}
                onValueChange={(val) => setIceModifier(Number(val))}
              >
                <SelectTrigger className="w-full bg-white/5 border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-white/20 glass-panel">
                  {ICE_MODIFIERS.map((mod) => (
                    <SelectItem key={mod.value} value={mod.value.toString()}>
                      <div className="flex justify-between items-center w-full pr-4 gap-4">
                        <span>{mod.label}</span>
                        <span className="text-xs text-white/50">{mod.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TooltipProvider>

          {selectedDrink && volume && (
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/20 text-center animate-in fade-in slide-in-from-bottom-2">
              <div className="text-sm text-white/70 mb-1">Estimated Caffeine</div>
              <div className="text-4xl font-outfit font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-violet-300">
                {calculatedMg} <span className="text-lg text-white/50">mg</span>
              </div>
              <div className="text-xs text-white/50 mt-2">
                ({volume}oz cup &times; {iceModifier * 100}% liquid &times; {selectedDrink.caffeinePerOz}mg/oz)
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t border-white/10">
          <Button 
            onClick={handleAdd}
            disabled={calculatedMg <= 0}
            className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white border-0 shadow-lg shadow-pink-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Intake
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

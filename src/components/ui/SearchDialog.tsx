import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Search } from 'lucide-react';

const searchData = [
  { title: 'Home', path: '/', category: 'Pages' },
  { title: 'About', path: '/about', category: 'Pages' },
  { title: 'Portfolio', path: '/portfolio', category: 'Pages' },
  { title: 'Articles', path: '/articles', category: 'Pages' },
  { title: 'Blog', path: '/blog', category: 'Pages' },
  { title: 'CV', path: '/cv', category: 'Pages' },
  { title: 'Media', path: '/media', category: 'Pages' },
  { title: 'Contact', path: '/contact', category: 'Pages' },
  { title: 'GIS & Geospatial Analysis', path: '/portfolio#gis', category: 'Portfolio' },
  { title: 'GeoAI & Automation', path: '/portfolio#geoai', category: 'Portfolio' },
  { title: 'Data Analytics', path: '/portfolio#analytics', category: 'Portfolio' },
  { title: 'AI Training', path: '/portfolio#training', category: 'Portfolio' },
];

type SearchDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [, setLocation] = useLocation();

  const handleSelect = (path: string) => {
    onOpenChange(false);
    setLocation(path);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search pages..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          {searchData
            .filter((item) => item.category === 'Pages')
            .map((item) => (
              <CommandItem key={item.path} onSelect={() => handleSelect(item.path)}>
                <Search className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </CommandItem>
            ))}
        </CommandGroup>
        <CommandGroup heading="Portfolio">
          {searchData
            .filter((item) => item.category === 'Portfolio')
            .map((item) => (
              <CommandItem key={item.path} onSelect={() => handleSelect(item.path)}>
                <Search className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </CommandItem>
            ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

type SearchTriggerProps = {
  onClick: () => void;
};

export function SearchTrigger({ onClick }: SearchTriggerProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground border border-border rounded-md hover:bg-muted transition-colors"
    >
      <Search className="h-4 w-4" />
      <span className="hidden sm:inline">Search</span>
      <kbd className="hidden sm:inline-flex items-center gap-1 pointer-events-none h-5 select-none rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
        <span className="text-xs">⌘</span>K
      </kbd>
    </button>
  );
}

export function useSearchShortcut(onOpen: () => void) {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpen();
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [onOpen]);
}

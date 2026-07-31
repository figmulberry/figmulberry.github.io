import React from 'react';
import { Link } from 'wouter';
import { X, Github, Linkedin, Youtube } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Logo } from '@/components/ui/Logo';

type NavLink = {
  label: string;
  href: string;
};

type MobileMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  navLinks: NavLink[];
};

export function MobileMenu({ open, onOpenChange, navLinks }: MobileMenuProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader className="border-b border-border pb-4 mb-6">
          <SheetTitle>
            <Logo linkTo="/" />
          </SheetTitle>
        </SheetHeader>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => onOpenChange(false)}
              className="px-4 py-3 text-base font-medium text-foreground hover:bg-muted rounded-md transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Social Links */}
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-sm font-medium text-muted-foreground mb-4">Connect</p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/mosesthiongo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-muted transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5 text-muted-foreground" />
            </a>
            <a
              href="https://linkedin.com/in/mosesthiongo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-muted transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5 text-muted-foreground" />
            </a>
            <a
              href="https://youtube.com/@thekalabash"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-muted transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="h-5 w-5 text-muted-foreground" />
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

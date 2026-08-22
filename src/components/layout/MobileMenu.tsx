import React from 'react';

import {
  FaLinkedinIn,
} from 'react-icons/fa';

import {
  SiGithub,
  SiInstagram,
  SiYoutube,
} from 'react-icons/si';

import {
  Link,
} from 'wouter';

import {
  Logo,
} from '@/components/ui/Logo';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

type NavLink = {
  label: string;
  href: string;
};

type MobileMenuProps = {
  open: boolean;
  onOpenChange: (
    open: boolean,
  ) => void;
  navLinks: NavLink[];
};

const socialLinks = [
  {
    icon: SiGithub,
    href: 'https://github.com/figmulberry',
    label: 'GitHub',
    hoverClass:
      'hover:text-foreground',
  },
  {
    icon: FaLinkedinIn,
    href: 'https://www.linkedin.com/in/mkthiongo/',
    label: 'LinkedIn',
    hoverClass:
      'hover:text-[#0A66C2]',
  },
  {
    icon: SiInstagram,
    href: 'https://www.instagram.com/musathiongo',
    label: 'Instagram',
    hoverClass:
      'hover:text-[#E4405F]',
  },
  {
    icon: SiYoutube,
    href: 'https://www.youtube.com/@thekalabashmosaics/',
    label: 'YouTube',
    hoverClass:
      'hover:text-[#FF0000]',
  },
];

export function MobileMenu({
  open,
  onOpenChange,
  navLinks,
}: MobileMenuProps) {
  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
    >
      <SheetContent
        side="right"
        className="w-full sm:max-w-md"
      >
        <SheetHeader className="mb-6 border-b border-border pb-4">
          <SheetTitle>
            <Logo linkTo="/" />
          </SheetTitle>
        </SheetHeader>

        <nav
          className="flex flex-col gap-1"
          aria-label="Mobile navigation"
        >
          {navLinks.map(
            (link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={
                  () =>
                    onOpenChange(
                      false,
                    )
                }
                className={[
                  'rounded-md',
                  'px-4',
                  'py-3',
                  'text-base',
                  'font-medium',
                  'text-foreground',
                  'transition-colors',
                  'duration-150',
                  'hover:bg-muted',
                  'focus-visible:outline-none',
                  'focus-visible:ring-2',
                  'focus-visible:ring-ring',
                  'focus-visible:ring-offset-2',
                  'focus-visible:ring-offset-background',
                ].join(' ')}
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>

        <div className="mt-8 border-t border-border pt-6">
          <p className="mb-4 text-sm font-medium text-muted-foreground">
            Connect
          </p>

          <div className="flex items-center gap-1">
            {socialLinks.map(
              ({
                icon: Icon,
                href,
                label,
                hoverClass,
              }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className={[
                    'inline-flex',
                    'h-9',
                    'w-9',
                    'items-center',
                    'justify-center',
                    'rounded-md',
                    'text-muted-foreground',
                    'transition-[color,background-color,transform]',
                    'duration-150',
                    'hover:-translate-y-0.5',
                    'hover:bg-muted',
                    hoverClass,
                    'focus-visible:outline-none',
                    'focus-visible:ring-2',
                    'focus-visible:ring-ring',
                    'focus-visible:ring-offset-2',
                    'focus-visible:ring-offset-background',
                  ].join(' ')}
                >
                  <Icon
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                </a>
              ),
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
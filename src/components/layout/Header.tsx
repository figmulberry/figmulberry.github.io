import React, {
  useState,
} from 'react';

import {
  Menu,
  Moon,
  Sun,
} from 'lucide-react';

import {
  FaLinkedinIn,
} from 'react-icons/fa';

import {
  SiGithub,
} from 'react-icons/si';

import {
  Link,
} from 'wouter';

import {
  MobileMenu,
} from './MobileMenu';

import {
  Logo,
} from '@/components/ui/Logo';

import {
  SearchDialog,
  SearchTrigger,
  useSearchShortcut,
} from '@/components/ui/SearchDialog';

import {
  useTheme,
} from '@/components/ui/ThemeProvider';

const navLinks = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'About',
    href: '/about',
  },
  {
    label: 'Portfolio',
    href: '/portfolio',
  },
  {
    label: 'Articles',
    href: '/articles',
  },
  {
    label: 'Blog',
    href: '/blog',
  },
  {
    label: 'CV',
    href: '/cv',
  },
  {
    label: 'Media',
    href: '/media',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
];

export function Header() {
  const {
    theme,
    toggleTheme,
  } = useTheme();

  const [
    searchOpen,
    setSearchOpen,
  ] = useState(false);

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  useSearchShortcut(
    () => setSearchOpen(true),
  );

  return (
    <>
      <header
        className={[
          'sticky',
          'top-0',
          'z-50',
          'w-full',
          'border-b',
          'border-border',
          'bg-background',
          'text-foreground',
          'shadow-[0_1px_0_rgba(0,0,0,0.02)]',
          'transition-colors',
          'duration-200',
          'dark:shadow-[0_1px_0_rgba(255,255,255,0.02)]',
        ].join(' ')}
      >
        <div
          className={[
            'container',
            'mx-auto',
            'max-w-7xl',
            'px-4',
            'sm:px-6',
            'lg:px-8',
          ].join(' ')}
        >
          <div
            className={[
              'flex',
              'h-14',
              'items-center',
              'justify-between',
            ].join(' ')}
          >
            <div className="flex items-center">
              <Logo />
            </div>

            <nav
              className={[
                'hidden',
                'items-center',
                'gap-1',
                'lg:flex',
              ].join(' ')}
              aria-label="Primary navigation"
            >
              {navLinks.map(
                (link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={[
                      'rounded-md',
                      'px-3',
                      'py-2',
                      'text-sm',
                      'font-medium',
                      'text-muted-foreground',
                      'transition-colors',
                      'duration-150',
                      'hover:bg-muted/70',
                      'hover:text-foreground',
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

            <div
              className={[
                'flex',
                'items-center',
                'gap-2',
              ].join(' ')}
            >
              <div className="hidden sm:block">
                <SearchTrigger
                  onClick={
                    () =>
                      setSearchOpen(
                        true,
                      )
                  }
                />
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                className={[
                  'flex',
                  'h-9',
                  'w-9',
                  'items-center',
                  'justify-center',
                  'rounded-md',
                  'transition-colors',
                  'duration-150',
                  'hover:bg-muted/70',
                  'focus-visible:outline-none',
                  'focus-visible:ring-2',
                  'focus-visible:ring-ring',
                  'focus-visible:ring-offset-2',
                  'focus-visible:ring-offset-background',
                ].join(' ')}
                aria-label={
                  theme === 'dark'
                    ? 'Switch to light mode'
                    : 'Switch to dark mode'
                }
              >
                {theme === 'dark' ? (
                  <Sun
                    className="h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                ) : (
                  <Moon
                    className="h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                )}
              </button>

              <div
                className={[
                  'ml-2',
                  'hidden',
                  'items-center',
                  'gap-1',
                  'border-l',
                  'border-border',
                  'pl-2',
                  'md:flex',
                ].join(' ')}
              >
                <a
                  href="https://github.com/figmulberry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={[
                    'group',
                    'flex',
                    'h-9',
                    'w-9',
                    'items-center',
                    'justify-center',
                    'rounded-md',
                    'transition-colors',
                    'duration-150',
                    'hover:bg-muted/70',
                    'focus-visible:outline-none',
                    'focus-visible:ring-2',
                    'focus-visible:ring-ring',
                    'focus-visible:ring-offset-2',
                    'focus-visible:ring-offset-background',
                  ].join(' ')}
                  aria-label="GitHub"
                  title="GitHub"
                >
                  <SiGithub
                    className={[
                      'h-4',
                      'w-4',
                      'text-muted-foreground',
                      'transition-colors',
                      'group-hover:text-foreground',
                    ].join(' ')}
                    aria-hidden="true"
                  />
                </a>

                <a
                  href="https://www.linkedin.com/in/mkthiongo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={[
                    'group',
                    'flex',
                    'h-9',
                    'w-9',
                    'items-center',
                    'justify-center',
                    'rounded-md',
                    'transition-colors',
                    'duration-150',
                    'hover:bg-muted/70',
                    'focus-visible:outline-none',
                    'focus-visible:ring-2',
                    'focus-visible:ring-ring',
                    'focus-visible:ring-offset-2',
                    'focus-visible:ring-offset-background',
                  ].join(' ')}
                  aria-label="LinkedIn"
                  title="LinkedIn"
                >
                  <FaLinkedinIn
                    className={[
                      'h-4',
                      'w-4',
                      'text-muted-foreground',
                      'transition-colors',
                      'group-hover:text-[#0A66C2]',
                    ].join(' ')}
                    aria-hidden="true"
                  />
                </a>
              </div>

              <button
                type="button"
                onClick={
                  () =>
                    setMobileMenuOpen(
                      true,
                    )
                }
                className={[
                  'flex',
                  'h-9',
                  'w-9',
                  'items-center',
                  'justify-center',
                  'rounded-md',
                  'transition-colors',
                  'duration-150',
                  'hover:bg-muted/70',
                  'focus-visible:outline-none',
                  'focus-visible:ring-2',
                  'focus-visible:ring-ring',
                  'focus-visible:ring-offset-2',
                  'focus-visible:ring-offset-background',
                  'lg:hidden',
                ].join(' ')}
                aria-label="Open menu"
              >
                <Menu
                  className="h-5 w-5 text-muted-foreground"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      <SearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
      />

      <MobileMenu
        open={mobileMenuOpen}
        onOpenChange={
          setMobileMenuOpen
        }
        navLinks={navLinks}
      />
    </>
  );
}
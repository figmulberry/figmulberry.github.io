import React, { useState } from 'react';
import { Link } from 'wouter';
import { Moon, Sun, Menu, Github, Linkedin } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { SearchTrigger, SearchDialog, useSearchShortcut } from '@/components/ui/SearchDialog';
import { useTheme } from '@/components/ui/ThemeProvider';
import { MobileMenu } from './MobileMenu';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Articles', href: '/articles' },
  { label: 'Blog', href: '/blog' },
  { label: 'CV', href: '/cv' },
  { label: 'Media', href: '/media' },
  { label: 'Contact', href: '/contact' },
];

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useSearchShortcut(() => setSearchOpen(true));

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Logo />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="hidden sm:block">
                <SearchTrigger onClick={() => setSearchOpen(true)} />
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-muted transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Moon className="h-4 w-4 text-muted-foreground" />
                )}
              </button>

              {/* Social Links - Desktop */}
              <div className="hidden md:flex items-center gap-2 ml-2 pl-2 border-l border-border">
                <a
                  href="https://github.com/mosesthiongo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-muted transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="h-4 w-4 text-muted-foreground" />
                </a>
                <a
                  href="https://linkedin.com/in/mosesthiongo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-muted transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4 text-muted-foreground" />
                </a>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-md hover:bg-muted transition-colors"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Dialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />

      {/* Mobile Menu */}
      <MobileMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} navLinks={navLinks} />
    </>
  );
}

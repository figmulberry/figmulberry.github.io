import React from 'react';
import { Link } from 'wouter';
import { Github, Linkedin, Youtube, Mail, RefreshCw } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

const footerLinks = {
  column1: [
    { label: 'About', href: '/about' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'CV', href: '/cv' },
    { label: 'Articles', href: '/articles' },
  ],
  column2: [
    { label: 'Blog', href: '/blog' },
    { label: 'Media', href: '/media' },
    { label: 'Resources', href: '#' },
    { label: 'Contact', href: '/contact' },
  ],
};

const socialLinks = [
  { icon: Github, href: 'https://github.com/mosesthiongo', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com/in/mosesthiongo', label: 'LinkedIn' },
  { icon: Youtube, href: 'https://youtube.com/@thekalabash', label: 'YouTube' },
  { icon: Mail, href: 'mailto:hello@mosesthiongo.com', label: 'Email' },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background">
      {/* Upper Footer - Dark Navy Zone */}
      <div className="w-full bg-[#141b2d] dark:bg-[#141b2d]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Logo & Tagline */}
            <div className="lg:col-span-1">
              <Logo className="text-white" linkTo="/" />
              <p className="mt-4 text-sm text-gray-300 leading-relaxed max-w-sm">
                Turning complex geospatial and data problems into clear, reproducible solutions,
                part of The Kalabash Mosaics
              </p>
              {/* Social Icons */}
              <div className="flex items-center gap-3 mt-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-8 h-8 rounded hover:bg-white/10 transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4 text-gray-300" />
                  </a>
                ))}
              </div>
            </div>

            {/* Right Side - Two Navigation Columns */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-8 lg:gap-12 lg:ml-auto">
              {/* Column 1 */}
              <div>
                <nav className="flex flex-col gap-3">
                  {footerLinks.column1.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm text-gray-300 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Column 2 */}
              <div>
                <nav className="flex flex-col gap-3">
                  {footerLinks.column2.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm text-gray-300 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Footer Strip - Darker Zone */}
      <div className="w-full bg-[#0d1421] dark:bg-[#0d1421]">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
            {/* Left - Brand Icon */}
            <div className="flex items-center gap-2">
              <RefreshCw className="h-3.5 w-3.5" />
              <span>The Kalabash Mosaics</span>
            </div>

            {/* Center - Links */}
            <div className="flex items-center gap-4">
              <Link href="#" className="hover:text-gray-300 transition-colors">
                Accessibility
              </Link>
              <span>·</span>
              <Link href="#" className="hover:text-gray-300 transition-colors">
                Privacy
              </Link>
              <span>·</span>
              <Link href="#" className="hover:text-gray-300 transition-colors">
                Site Map
              </Link>
            </div>

            {/* Right - Copyright */}
            <div>
              <span>© 2026 Moses Thiongo</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

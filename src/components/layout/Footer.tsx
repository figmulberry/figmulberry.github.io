import React, {
  useState,
} from 'react';

import {
  ArrowUp,
  ArrowUpRight,
  ChevronDown,
} from 'lucide-react';

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

const exploreLinks = [
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
    label: 'Media',
    href: '/media',
  },
];

const moreLinks = [
  {
    label: 'Blog',
    href: '/blog',
  },
  {
    label: 'CV',
    href: '/cv',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
];

const socialLinks = [
  {
    icon: SiGithub,
    href: 'https://github.com/figmulberry',
    label: 'GitHub',
    hoverClass: 'hover:text-white',
  },
  {
    icon: FaLinkedinIn,
    href: 'https://www.linkedin.com/in/mkthiongo/',
    label: 'LinkedIn',
    hoverClass: 'hover:text-[#0A66C2]',
  },
  {
    icon: SiInstagram,
    href: 'https://www.instagram.com/musathiongo',
    label: 'Instagram',
    hoverClass: 'hover:text-[#E4405F]',
  },
  {
    icon: SiYoutube,
    href: 'https://www.youtube.com/@thekalabashmosaics/',
    label: 'YouTube',
    hoverClass: 'hover:text-[#FF0000]',
  },
];

type MobileSection =
  | 'explore'
  | 'more'
  | 'connect';

function scrollToTop() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
}

export function Footer() {
  const year =
    new Date().getFullYear();

  const [
    openSection,
    setOpenSection,
  ] = useState<MobileSection | null>(
    null,
  );

  const toggleSection = (
    section: MobileSection,
  ) => {
    setOpenSection(
      (current) =>
        current === section
          ? null
          : section,
    );
  };

  return (
    <footer className="w-full bg-[#0b1422] text-white">
      <div className="mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-6 sm:pb-10 sm:pt-12 lg:px-8 lg:pb-11 lg:pt-13">
        <div className="md:grid md:grid-cols-2 md:gap-x-10 md:gap-y-10 lg:grid-cols-[minmax(18rem,1.32fr)_minmax(7rem,0.52fr)_minmax(6rem,0.46fr)_minmax(14rem,0.84fr)] lg:gap-x-7 xl:gap-x-8">
          <div className="max-w-[22rem]">
            <Link
              href="/"
              aria-label="The Kalabash Mosaics home"
              className="inline-block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-[#0b1422]"
            >
              <img
                src="/brand/tkm-footer-logo-white.png"
                alt="The Kalabash Mosaics — Spatial is special"
                className="h-auto w-[13.5rem] object-contain sm:w-[14.5rem] lg:w-[15rem]"
              />
            </Link>

            <p className="mt-4 max-w-[20rem] text-[0.84rem] font-normal leading-6 text-white/64">
              Geospatial, GeoAI, data, and technical
              work by Moses Thiongo.
            </p>

            <div className="mt-4 flex items-center gap-1">
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
                      'h-8',
                      'w-8',
                      'items-center',
                      'justify-center',
                      'rounded-md',
                      'text-white/62',
                      'transition-[color,background-color,transform]',
                      'duration-200',
                      'hover:-translate-y-0.5',
                      'hover:bg-white/[0.06]',
                      hoverClass,
                      'focus-visible:outline-none',
                      'focus-visible:ring-2',
                      'focus-visible:ring-accent',
                      'focus-visible:ring-offset-2',
                      'focus-visible:ring-offset-[#0b1422]',
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

          <div className="hidden md:block">
            <h2 className="text-[0.73rem] font-semibold uppercase tracking-[0.1em] text-white/94">
              Explore
            </h2>

            <nav
              className="mt-5 flex flex-col items-start gap-3"
              aria-label="Footer explore navigation"
            >
              {exploreLinks.map(
                (link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-[0.84rem] font-medium leading-5 text-white/70 transition-colors duration-150 hover:text-accent focus-visible:outline-none focus-visible:text-accent"
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </nav>
          </div>

          <div className="hidden md:block">
            <h2 className="text-[0.73rem] font-semibold uppercase tracking-[0.1em] text-white/94">
              More
            </h2>

            <nav
              className="mt-5 flex flex-col items-start gap-3"
              aria-label="Footer secondary navigation"
            >
              {moreLinks.map(
                (link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-[0.84rem] font-medium leading-5 text-white/70 transition-colors duration-150 hover:text-accent focus-visible:outline-none focus-visible:text-accent"
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </nav>
          </div>

          <div className="hidden max-w-[15rem] md:block">
            <h2 className="text-[0.73rem] font-semibold uppercase tracking-[0.1em] text-white/94">
              Let&apos;s Connect
            </h2>

            <p className="mt-5 text-[0.84rem] font-normal leading-6 text-white/64">
              I&apos;m open to collaborations,
              opportunities, and conversations
              that can create meaningful impact.
            </p>

            <Link
              href="/contact"
              className="group mt-5 inline-flex items-center gap-1.5 text-[0.86rem] font-semibold text-white underline decoration-accent decoration-1 underline-offset-4 transition-colors duration-150 hover:text-accent focus-visible:outline-none focus-visible:text-accent"
            >
              Get in touch

              <ArrowUpRight
                className="h-4 w-4 text-accent transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-white/[0.08] md:hidden">
          <div className="border-b border-white/[0.08]">
            <button
              type="button"
              onClick={() =>
                toggleSection(
                  'explore',
                )
              }
              aria-expanded={
                openSection ===
                'explore'
              }
              aria-controls="footer-mobile-explore"
              className="flex w-full items-center justify-between py-4 text-left text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-white/92 focus-visible:outline-none focus-visible:text-accent"
            >
              Explore

              <ChevronDown
                className={[
                  'h-4',
                  'w-4',
                  'text-accent',
                  'transition-transform',
                  'duration-200',
                  openSection ===
                  'explore'
                    ? 'rotate-180'
                    : '',
                ].join(' ')}
                aria-hidden="true"
              />
            </button>

            {openSection ===
              'explore' && (
              <nav
                id="footer-mobile-explore"
                className="flex flex-col items-start gap-3 pb-5"
                aria-label="Mobile footer explore navigation"
              >
                {exploreLinks.map(
                  (link) => (
                    <Link
                      key={
                        link.href
                      }
                      href={
                        link.href
                      }
                      className="text-[0.84rem] font-medium text-white/70 transition-colors hover:text-accent focus-visible:outline-none focus-visible:text-accent"
                    >
                      {
                        link.label
                      }
                    </Link>
                  ),
                )}
              </nav>
            )}
          </div>

          <div className="border-b border-white/[0.08]">
            <button
              type="button"
              onClick={() =>
                toggleSection(
                  'more',
                )
              }
              aria-expanded={
                openSection ===
                'more'
              }
              aria-controls="footer-mobile-more"
              className="flex w-full items-center justify-between py-4 text-left text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-white/92 focus-visible:outline-none focus-visible:text-accent"
            >
              More

              <ChevronDown
                className={[
                  'h-4',
                  'w-4',
                  'text-accent',
                  'transition-transform',
                  'duration-200',
                  openSection ===
                  'more'
                    ? 'rotate-180'
                    : '',
                ].join(' ')}
                aria-hidden="true"
              />
            </button>

            {openSection ===
              'more' && (
              <nav
                id="footer-mobile-more"
                className="flex flex-col items-start gap-3 pb-5"
                aria-label="Mobile footer secondary navigation"
              >
                {moreLinks.map(
                  (link) => (
                    <Link
                      key={
                        link.href
                      }
                      href={
                        link.href
                      }
                      className="text-[0.84rem] font-medium text-white/70 transition-colors hover:text-accent focus-visible:outline-none focus-visible:text-accent"
                    >
                      {
                        link.label
                      }
                    </Link>
                  ),
                )}
              </nav>
            )}
          </div>

          <div className="border-b border-white/[0.08]">
            <button
              type="button"
              onClick={() =>
                toggleSection(
                  'connect',
                )
              }
              aria-expanded={
                openSection ===
                'connect'
              }
              aria-controls="footer-mobile-connect"
              className="flex w-full items-center justify-between py-4 text-left text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-white/92 focus-visible:outline-none focus-visible:text-accent"
            >
              Let&apos;s Connect

              <ChevronDown
                className={[
                  'h-4',
                  'w-4',
                  'text-accent',
                  'transition-transform',
                  'duration-200',
                  openSection ===
                  'connect'
                    ? 'rotate-180'
                    : '',
                ].join(' ')}
                aria-hidden="true"
              />
            </button>

            {openSection ===
              'connect' && (
              <div
                id="footer-mobile-connect"
                className="pb-5"
              >
                <p className="max-w-[19rem] text-[0.84rem] leading-6 text-white/64">
                  I&apos;m open to
                  collaborations,
                  opportunities, and
                  conversations that can
                  create meaningful impact.
                </p>

                <Link
                  href="/contact"
                  className="group mt-4 inline-flex items-center gap-1.5 text-[0.86rem] font-semibold text-white underline decoration-accent decoration-1 underline-offset-4 transition-colors hover:text-accent focus-visible:outline-none focus-visible:text-accent"
                >
                  Get in touch

                  <ArrowUpRight
                    className="h-4 w-4 text-accent transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.08] bg-[#08111d]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3.5 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p className="text-[0.73rem] font-normal leading-5 text-white/58">
            © {year} Moses Thiongo. All rights
            reserved.
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="group inline-flex w-fit items-center gap-1.5 text-[0.73rem] font-medium text-white/62 transition-colors duration-150 hover:text-accent focus-visible:outline-none focus-visible:text-accent"
          >
            Back to top

            <ArrowUp
              className="h-3.5 w-3.5 text-accent transition-transform duration-200 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </footer>
  );
}
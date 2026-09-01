import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'framer-motion';

import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Files,
  Link,
  MapPin,
  Rows3,
} from 'lucide-react';

import {
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from 'react-icons/fa';

import {
  SiOrcid,
} from 'react-icons/si';

import {
  cvData,
} from '@/cv/cvData';

import type {
  CVLink,
} from '@/cv/types';

type CVViewMode =
  | 'scroll'
  | 'paged';

type SocialKey =
  | 'website'
  | 'linkedin'
  | 'github'
  | 'youtube'
  | 'instagram'
  | 'orcid';

type PageDirection =
  | -1
  | 1;

function formatMonthYear(
  value: string,
): string {
  const [
    year,
    month,
  ] = value.split('-');

  if (!month) {
    return year;
  }

  return new Intl.DateTimeFormat(
    'en',
    {
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    },
  ).format(
    new Date(
      `${year}-${month}-01T00:00:00Z`,
    ),
  );
}

function formatPeriod(
  startDate: string,
  endDate?: string,
  current?: boolean,
): string {
  const start =
    formatMonthYear(
      startDate,
    );

  const end =
    current
      ? 'Present'
      : endDate
        ? formatMonthYear(
            endDate,
          )
        : '';

  return end
    ? `${start} – ${end}`
    : start;
}

function CVSectionTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="shrink-0 font-mono text-[0.68rem] font-bold uppercase tracking-[0.16em] text-accent">
        {children}
      </h2>

      <div
        className="h-px flex-1 bg-border"
        aria-hidden="true"
      />
    </div>
  );
}

function PageFooter({
  page,
  total,
}: {
  page: number;
  total: number;
}) {
  return (
    <footer className="mt-auto flex items-center justify-between border-t border-border pt-3 text-[0.68rem] text-muted-foreground">
      <span>
        Moses Thiongo
      </span>

      <span>
        CV · {page} / {total}
      </span>
    </footer>
  );
}

function SocialIconLink({
  type,
  link,
}: {
  type: SocialKey;
  link: CVLink;
}) {
  const baseClass = [
    'inline-flex',
    'h-5',
    'w-5',
    'items-center',
    'justify-center',
    'text-muted-foreground',
    'transition-[color,transform]',
    'duration-150',
    'hover:-translate-y-px',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-ring',
    'focus-visible:ring-offset-2',
    'focus-visible:ring-offset-background',
  ].join(' ');

  const hoverClass =
    {
      website:
        'hover:text-accent',

      linkedin:
        'hover:text-[#0A66C2]',

      github:
        'hover:text-foreground',

      youtube:
        'hover:text-[#FF0000]',

      instagram:
        'hover:text-[#E4405F]',

      orcid:
        'hover:text-[#A6CE39]',
    }[type];

  const Icon =
    {
      website:
        Link,

      linkedin:
        FaLinkedinIn,

      github:
        FaGithub,

      youtube:
        FaYoutube,

      instagram:
        FaInstagram,

      orcid:
        SiOrcid,
    }[type];

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={link.label}
      title={link.label}
      className={[
        baseClass,
        hoverClass,
      ].join(' ')}
    >
      <Icon
        className="h-[0.82rem] w-[0.82rem]"
        aria-hidden="true"
      />
    </a>
  );
}

function PaperPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section
      className={[
        'flex',
        'min-h-[72rem]',
        'w-full',
        'flex-col',
        'border',
        'border-border',
        'bg-background',
        'px-6',
        'py-7',
        'shadow-sm',
        'sm:px-9',
        'sm:py-9',
        'lg:px-12',
        'lg:py-11',
      ].join(' ')}
    >
      {children}
    </section>
  );
}

function PageOne() {
  const {
    profile,
    experience,
    languages,
  } = cvData;

  const socialLinks =
    (
      [
        'website',
        'linkedin',
        'github',
        'youtube',
        'instagram',
        'orcid',
      ] as SocialKey[]
    )
      .map(
        (type) => ({
          type,
          link:
            profile.links[type],
        }),
      )
      .filter(
        (
          item,
        ): item is {
          type: SocialKey;
          link: CVLink;
        } =>
          Boolean(item.link),
      );

  const languageLine =
    languages
      .map(
        (language) =>
          `${language.name} · ${language.proficiency}`,
      )
      .join('   |   ');

  return (
    <PaperPage>
      <header className="border-b border-border pb-5">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.2em] text-accent">
            Curriculum Vitae
          </p>

          <p className="inline-flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin
              className="h-4 w-4 text-accent"
              aria-hidden="true"
            />

            {profile.location}
          </p>
        </div>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {profile.name}
        </h1>

        <p
          className={[
            'mt-2',
            'text-[0.78rem]',
            'font-medium',
            'leading-5',
            'tracking-[-0.01em]',
            'text-foreground/90',
            'sm:text-[0.84rem]',
            'lg:whitespace-nowrap',
          ].join(' ')}
        >
          {profile.headline}
        </p>

        <p className="mt-0.5 text-[0.62rem] leading-4 tracking-[0.01em] text-muted-foreground/65">
          {languageLine}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          {socialLinks.map(
            ({
              type,
              link,
            }) => (
              <SocialIconLink
                key={type}
                type={type}
                link={link}
              />
            ),
          )}
        </div>
      </header>

      <div className="mt-6">
        <CVSectionTitle>
          Professional Profile
        </CVSectionTitle>

        <p className="text-[0.93rem] leading-6 text-muted-foreground">
          {profile.summary}
        </p>
      </div>

      <div className="mt-6">
        <CVSectionTitle>
          Research Interests
        </CVSectionTitle>

        <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
          {profile.researchInterests.map(
            (interest) => (
              <p
                key={interest}
                className="text-sm leading-5 text-muted-foreground"
              >
                {interest}
              </p>
            ),
          )}
        </div>
      </div>

      <div className="mt-7">
        <CVSectionTitle>
          Professional Experience
        </CVSectionTitle>

        <div className="space-y-6">
          {experience
            .slice(
              0,
              3,
            )
            .map(
              (role) => (
                <article
                  key={role.id}
                  className="grid gap-3 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-5"
                >
                  <div>
                    <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.1em] text-accent">
                      {formatPeriod(
                        role.startDate,
                        role.endDate,
                        role.current,
                      )}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {
                        role.location
                      }
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      {role.title}
                    </h3>

                    <p className="mt-0.5 text-sm font-medium text-muted-foreground">
                      {
                        role.organization
                      }
                    </p>

                    <ul className="mt-3 space-y-1.5">
                      {role.highlights.map(
                          (
                            highlight,
                          ) => (
                            <li
                              key={
                                highlight
                              }
                              className="grid grid-cols-[0.65rem_minmax(0,1fr)] gap-1.5 text-[0.82rem] leading-5 text-muted-foreground"
                            >
                              <span
                                className="text-accent"
                                aria-hidden="true"
                              >
                                •
                              </span>

                              <span>
                                {
                                  highlight
                                }
                              </span>
                            </li>
                          ),
                        )}
                    </ul>
                  </div>
                </article>
              ),
            )}
        </div>
      </div>

      <PageFooter
        page={1}
        total={3}
      />
    </PaperPage>
  );
}

function PageTwo() {
  const {
    experience,
    education,
    researchProjects,
  } = cvData;

  return (
    <PaperPage>
      <div>
        <CVSectionTitle>
          Professional Experience
        </CVSectionTitle>

        <div className="space-y-6">
          {experience
            .slice(
              3,
            )
            .map(
              (role) => (
                <article
                  key={role.id}
                  className="grid gap-3 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-5"
                >
                  <div>
                    <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.1em] text-accent">
                      {formatPeriod(
                        role.startDate,
                        role.endDate,
                        role.current,
                      )}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {
                        role.location
                      }
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      {role.title}
                    </h3>

                    <p className="mt-0.5 text-sm font-medium text-muted-foreground">
                      {
                        role.organization
                      }
                    </p>

                    <ul className="mt-3 space-y-1.5">
                      {role.highlights.map(
                        (
                          highlight,
                        ) => (
                          <li
                            key={
                              highlight
                            }
                            className="grid grid-cols-[0.65rem_minmax(0,1fr)] gap-1.5 text-[0.82rem] leading-5 text-muted-foreground"
                          >
                            <span
                              className="text-accent"
                              aria-hidden="true"
                            >
                              •
                            </span>

                            <span>
                              {
                                highlight
                              }
                            </span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </article>
              ),
            )}
        </div>
      </div>

      <div className="mt-8">
        <CVSectionTitle>
          Education
        </CVSectionTitle>

        <div className="space-y-5">
          {education.map(
            (item) => (
              <article
                key={item.id}
                className="grid gap-3 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-5"
              >
                <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.1em] text-accent">
                  {formatMonthYear(
                    item.completedAt,
                  )}
                </p>

                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    {
                      item.qualification
                    }
                  </h3>

                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {
                      item.institution
                    }
                    {' · '}
                    {
                      item.location
                    }
                  </p>

                  {item.thesisOrProject && (
                    <p className="mt-2 text-[0.82rem] leading-5 text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        {item.thesisOrProjectLabel ??
                          'Research'}
                        :
                      </span>{' '}

                      {item.thesisOrProject.url ? (
                        <a
                          href={
                            item.thesisOrProject
                              .url
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="italic transition-colors hover:text-accent"
                        >
                          {
                            item
                              .thesisOrProject
                              .label
                          }
                        </a>
                      ) : (
                        <span className="italic">
                          {
                            item
                              .thesisOrProject
                              .label
                          }
                        </span>
                      )}
                    </p>
                  )}

                  {item.advisors &&
                    item.advisors.length >
                      0 && (
                    <p className="mt-1.5 text-[0.78rem] leading-5 text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {item.advisorLabel ??
                          (item.advisors.length >
                          1
                            ? 'Advisors'
                            : 'Advisor')}
                        :
                      </span>{' '}

                      {item.advisors.map(
                        (
                          advisor,
                          index,
                        ) => (
                          <span
                            key={
                              advisor.label
                            }
                          >
                            {index > 0 &&
                              ' · '}

                            <a
                              href={
                                advisor.url
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="transition-colors hover:text-accent"
                            >
                              {
                                advisor.label
                              }
                            </a>
                          </span>
                        ),
                      )}
                    </p>
                  )}

                  {item.award && (
                    <p className="mt-2 text-[0.82rem] italic text-accent">
                      {item.award}
                    </p>
                  )}
                </div>
              </article>
            ),
          )}
        </div>
      </div>

      <div className="mt-8">
        <CVSectionTitle>
          Research Experience & Projects
        </CVSectionTitle>

        <div className="grid gap-x-7 gap-y-5 sm:grid-cols-2">
          {researchProjects.map(
            (project) => (
              <article
                key={project.id}
              >
                <h3 className="text-sm font-semibold text-foreground">
                  {project.url ? (
                    <a
                      href={
                        project.url
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 transition-colors hover:text-accent"
                    >
                      {
                        project.title
                      }

                      <ExternalLink
                        className="h-3 w-3"
                        aria-hidden="true"
                      />
                    </a>
                  ) : (
                    project.title
                  )}
                </h3>

                <p className="mt-1 text-xs font-medium text-accent">
                  {
                    project.organization
                  }
                </p>

                <p className="mt-2 text-[0.8rem] leading-5 text-muted-foreground">
                  {
                    project.description
                  }
                </p>
              </article>
            ),
          )}
        </div>
      </div>

      <PageFooter
        page={2}
        total={3}
      />
    </PaperPage>
  );
}

function PageThree({
  showAllCredentials,
  onToggleCredentials,
}: {
  showAllCredentials: boolean;
  onToggleCredentials: () => void;
}) {
  const {
    publications,
    presentations,
    teaching,
    leadership,
    credentials,
    skillGroups,
  } = cvData;

  const featuredCredentials =
    credentials.filter(
      (credential) =>
        credential.featured,
    );

  const visibleCredentials =
    showAllCredentials
      ? credentials
      : featuredCredentials;

  return (
    <PaperPage>
      <div>
        <CVSectionTitle>
          Core Competencies
        </CVSectionTitle>

        <div className="grid gap-x-7 gap-y-5 sm:grid-cols-2">
          {skillGroups.map(
            (group) => (
              <div
                key={group.id}
              >
                <h3 className="text-sm font-semibold text-foreground">
                  {
                    group.title
                  }
                </h3>

                <p className="mt-2 text-[0.8rem] leading-5 text-muted-foreground">
                  {group.skills.join(
                    ' · ',
                  )}
                </p>
              </div>
            ),
          )}
        </div>
      </div>

      <div className="mt-8">
        <CVSectionTitle>
          Publications
        </CVSectionTitle>

        <div className="space-y-4">
          {publications.map(
            (publication) => (
              <article
                key={
                  publication.id
                }
              >
                {publication.url ? (
                  <a
                    href={
                      publication.url
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-start gap-1.5 text-[0.82rem] leading-5 text-muted-foreground transition-colors hover:text-accent"
                  >
                    <span>
                      {
                        publication.citation
                      }
                    </span>

                    <ExternalLink
                      className="mt-1 h-3 w-3 shrink-0"
                      aria-hidden="true"
                    />
                  </a>
                ) : (
                  <p className="text-[0.82rem] leading-5 text-muted-foreground">
                    {
                      publication.citation
                    }
                  </p>
                )}
              </article>
            ),
          )}
        </div>
      </div>

      <div className="mt-8">
        <CVSectionTitle>
          Presentations & Posters
        </CVSectionTitle>

        <div className="space-y-4">
          {presentations.map(
            (
              presentation,
            ) => (
              <article
                key={
                  presentation.id
                }
                className="grid gap-2 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-4"
              >
                <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.1em] text-accent">
                  {formatMonthYear(
                    presentation.date,
                  )}
                </p>

                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {
                      presentation.event
                    }
                  </h3>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {
                      presentation.organization
                    }

                    {presentation.location
                      ? ` · ${presentation.location}`
                      : ''}
                  </p>

                  {presentation.description && (
                    <p className="mt-2 text-[0.8rem] leading-5 text-muted-foreground">
                      {
                        presentation.description
                      }
                    </p>
                  )}
                </div>
              </article>
            ),
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-7 sm:grid-cols-2">
        <div>
          <CVSectionTitle>
            Teaching
          </CVSectionTitle>

          <div className="space-y-4">
            {teaching.map(
              (item) => (
                <article
                  key={item.id}
                >
                  <h3 className="text-sm font-semibold text-foreground">
                    {item.role}
                  </h3>

                  <p className="mt-0.5 text-xs font-medium text-accent">
                    {
                      item.organization
                    }
                  </p>

                  <p className="mt-2 text-[0.8rem] leading-5 text-muted-foreground">
                    {
                      item.description
                    }
                  </p>
                </article>
              ),
            )}
          </div>
        </div>

        <div>
          <CVSectionTitle>
            Leadership & Service
          </CVSectionTitle>

          <div className="space-y-4">
            {leadership.map(
              (item) => (
                <article
                  key={item.id}
                >
                  <h3 className="text-sm font-semibold text-foreground">
                    {item.role}
                  </h3>

                  <p className="mt-0.5 text-xs font-medium text-accent">
                    {
                      item.organization
                    }
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.period}
                  </p>

                  {item.description && (
                    <p className="mt-2 text-[0.8rem] leading-5 text-muted-foreground">
                      {
                        item.description
                      }
                    </p>
                  )}
                </article>
              ),
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <CVSectionTitle>
          Selected Certifications & Professional Development
        </CVSectionTitle>

        <div className="grid gap-x-7 gap-y-4 sm:grid-cols-2">
          {visibleCredentials.map(
            (
              credential,
            ) => (
              <article
                key={
                  credential.id
                }
              >
                <h3 className="text-sm font-semibold text-foreground">
                  {credential.url ? (
                    <a
                      href={
                        credential.url
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-start gap-1.5 transition-colors hover:text-accent"
                    >
                      <span>
                        {
                          credential.title
                        }
                      </span>

                      <ExternalLink
                        className="mt-0.5 h-3 w-3 shrink-0"
                        aria-hidden="true"
                      />
                    </a>
                  ) : (
                    credential.title
                  )}
                </h3>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  {
                    credential.issuer
                  }

                  {credential.completedAt
                    ? ` · ${formatMonthYear(
                        credential.completedAt,
                      )}`
                    : ''}
                </p>
              </article>
            ),
          )}
        </div>

        {credentials.length >
          featuredCredentials.length && (
          <button
            type="button"
            onClick={
              onToggleCredentials
            }
            className="mt-5 text-xs font-semibold text-accent underline-offset-4 hover:underline"
          >
            {showAllCredentials
              ? 'Show selected credentials'
              : `View all credentials (${credentials.length})`}
          </button>
        )}
      </div>

      <PageFooter
        page={3}
        total={3}
      />
    </PaperPage>
  );
}

const pageVariants = {
  enter: (
    direction: PageDirection,
  ) => ({
    x:
      direction > 0
        ? '4%'
        : '-4%',

    rotateY:
      direction > 0
        ? -42
        : 42,

    opacity: 0,

    scale: 0.992,

    filter:
      'brightness(0.96)',
  }),

  center: {
    x: 0,
    rotateY: 0,
    opacity: 1,
    scale: 1,
    filter:
      'brightness(1)',
  },

  exit: (
    direction: PageDirection,
  ) => ({
    x:
      direction > 0
        ? '-4%'
        : '4%',

    rotateY:
      direction > 0
        ? 42
        : -42,

    opacity: 0,

    scale: 0.992,

    filter:
      'brightness(0.96)',
  }),
};

export default function CV() {
  const prefersReducedMotion =
    useReducedMotion();

  const [
    viewMode,
    setViewMode,
  ] =
    useState<CVViewMode>(
      'scroll',
    );

  const [
    currentPage,
    setCurrentPage,
  ] =
    useState(0);

  const [
    direction,
    setDirection,
  ] =
    useState<PageDirection>(
      1,
    );

  const [
    showAllCredentials,
    setShowAllCredentials,
  ] =
    useState(false);

  const [
    isDownloadingPdf,
    setIsDownloadingPdf,
  ] =
    useState(false);

  const wheelLockRef =
    useRef(false);

  const pages = useMemo(
    () => [
      <PageOne
        key="page-1"
      />,

      <PageTwo
        key="page-2"
      />,

      <PageThree
        key="page-3"
        showAllCredentials={
          showAllCredentials
        }
        onToggleCredentials={() =>
          setShowAllCredentials(
            (current) =>
              !current,
          )
        }
      />,
    ],
    [
      showAllCredentials,
    ],
  );

  const pageCount =
    pages.length;

  const downloadPdf = async () => {
    if (isDownloadingPdf) {
      return;
    }

    setIsDownloadingPdf(
      true,
    );

    try {
      const baseUrl =
        import.meta.env.BASE_URL;

      const pdfUrl =
        `${baseUrl}downloads/Moses-Thiongo-CV.pdf`;

      const response =
        await fetch(
          pdfUrl,
        );

      if (!response.ok) {
        throw new Error(
          `PDF request failed with status ${response.status}.`,
        );
      }

      const pdfBlob =
        await response.blob();

      const objectUrl =
        URL.createObjectURL(
          pdfBlob,
        );

      const now =
        new Date();

      const year =
        now.getFullYear();

      const month =
        String(
          now.getMonth() + 1,
        ).padStart(
          2,
          '0',
        );

      const day =
        String(
          now.getDate(),
        ).padStart(
          2,
          '0',
        );

      const filename =
        `Moses-Thiongo-CV-${year}-${month}-${day}.pdf`;

      const anchor =
        document.createElement(
          'a',
        );

      anchor.href =
        objectUrl;

      anchor.download =
        filename;

      document.body.appendChild(
        anchor,
      );

      anchor.click();

      anchor.remove();

      window.setTimeout(
        () => {
          URL.revokeObjectURL(
            objectUrl,
          );
        },
        1000,
      );
    } catch (error) {
      console.error(
        'Unable to download CV PDF.',
        error,
      );

      const baseUrl =
        import.meta.env.BASE_URL;

      window.open(
        `${baseUrl}downloads/Moses-Thiongo-CV.pdf`,
        '_blank',
        'noopener,noreferrer',
      );
    } finally {
      setIsDownloadingPdf(
        false,
      );
    }
  };

  const goToPage = (
    nextPage: number,
    nextDirection?: PageDirection,
  ) => {
    const boundedPage =
      Math.min(
        Math.max(
          nextPage,
          0,
        ),
        pageCount - 1,
      );

    if (
      boundedPage ===
      currentPage
    ) {
      return;
    }

    const resolvedDirection =
      nextDirection ??
      (
        boundedPage >
        currentPage
          ? 1
          : -1
      );

    setDirection(
      resolvedDirection,
    );

    setCurrentPage(
      boundedPage,
    );
  };

  const goPrevious = () => {
    goToPage(
      currentPage - 1,
      -1,
    );
  };

  const goNext = () => {
    goToPage(
      currentPage + 1,
      1,
    );
  };

  const handleDragEnd = (
    _event: MouseEvent
      | TouchEvent
      | PointerEvent,
    info: {
      offset: {
        x: number;
      };
      velocity: {
        x: number;
      };
    },
  ) => {
    const distance =
      info.offset.x;

    const velocity =
      info.velocity.x;

    const shouldGoNext =
      distance < -110 ||
      velocity < -500;

    const shouldGoPrevious =
      distance > 110 ||
      velocity > 500;

    if (shouldGoNext) {
      goNext();
      return;
    }

    if (
      shouldGoPrevious
    ) {
      goPrevious();
    }
  };

  const handleWheel = (
    event:
      React.WheelEvent<HTMLDivElement>,
  ) => {
    if (
      wheelLockRef.current
    ) {
      return;
    }

    const horizontalIntent =
      Math.abs(
        event.deltaX,
      ) >
      Math.abs(
        event.deltaY,
      );

    if (
      !horizontalIntent ||
      Math.abs(
        event.deltaX,
      ) < 35
    ) {
      return;
    }

    wheelLockRef.current =
      true;

    if (
      event.deltaX > 0
    ) {
      goNext();
    } else {
      goPrevious();
    }

    window.setTimeout(
      () => {
        wheelLockRef.current =
          false;
      },
      450,
    );
  };

  useEffect(
    () => {
      if (
        viewMode !==
        'paged'
      ) {
        return;
      }

      const handleKeyDown = (
        event: KeyboardEvent,
      ) => {
        const target =
          event.target;

        if (
          target instanceof
            HTMLInputElement ||
          target instanceof
            HTMLTextAreaElement ||
          target instanceof
            HTMLSelectElement ||
          (
            target instanceof
              HTMLElement &&
            target.isContentEditable
          )
        ) {
          return;
        }

        if (
          event.key ===
          'ArrowRight'
        ) {
          event.preventDefault();
          goNext();
        }

        if (
          event.key ===
          'ArrowLeft'
        ) {
          event.preventDefault();
          goPrevious();
        }
      };

      window.addEventListener(
        'keydown',
        handleKeyDown,
      );

      return () => {
        window.removeEventListener(
          'keydown',
          handleKeyDown,
        );
      };
    },
    [
      viewMode,
      currentPage,
      pageCount,
    ],
  );

  return (
    <main className="min-h-screen bg-muted/35 py-7 sm:py-9 lg:py-10">
      <div className="mx-auto max-w-[58rem] px-3 sm:px-5">
        <div className="mb-5 flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={
              downloadPdf
            }
            disabled={
              isDownloadingPdf
            }
            className={[
              'inline-flex',
              'items-center',
              'gap-1.5',
              'border',
              'border-border',
              'bg-background',
              'px-3',
              'py-2',
              'text-xs',
              'font-medium',
              'text-muted-foreground',
              'transition-colors',
              'hover:border-accent/50',
              'hover:text-foreground',
              'focus-visible:outline-none',
              'focus-visible:ring-2',
              'focus-visible:ring-ring',
              'disabled:cursor-wait',
              'disabled:opacity-60',
            ].join(' ')}
          >
            <Download
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />

            {isDownloadingPdf
              ? 'Preparing PDF...'
              : 'Download PDF'}
          </button>

          <div className="flex border border-border bg-background">
            <button
              type="button"
              onClick={() => {
                setViewMode(
                  'scroll',
                );

                setCurrentPage(
                  0,
                );
              }}
              aria-pressed={
                viewMode ===
                'scroll'
              }
              className={[
                'inline-flex',
                'items-center',
                'gap-1.5',
                'px-3',
                'py-2',
                'text-xs',
                'font-medium',
                'transition-colors',
                viewMode ===
                'scroll'
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              ].join(' ')}
            >
              <Rows3
                className="h-3.5 w-3.5"
                aria-hidden="true"
              />

              Scroll
            </button>

            <button
              type="button"
              onClick={() => {
                setViewMode(
                  'paged',
                );

                setCurrentPage(
                  0,
                );

                setDirection(
                  1,
                );
              }}
              aria-pressed={
                viewMode ===
                'paged'
              }
              className={[
                'inline-flex',
                'items-center',
                'gap-1.5',
                'border-l',
                'border-border',
                'px-3',
                'py-2',
                'text-xs',
                'font-medium',
                'transition-colors',
                viewMode ===
                'paged'
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              ].join(' ')}
            >
              <Files
                className="h-3.5 w-3.5"
                aria-hidden="true"
              />

              Paged
            </button>
          </div>
        </div>

        {viewMode ===
        'scroll' ? (
          <div className="flex flex-col gap-8">
            {pages}
          </div>
        ) : (
          <div
            className="relative"
            onWheel={
              handleWheel
            }
          >
            <div
              className={[
                'relative',
                'mx-auto',
                'isolate',
                '[perspective:2200px]',
              ].join(' ')}
            >
              <button
                type="button"
                onClick={
                  goPrevious
                }
                disabled={
                  currentPage ===
                  0
                }
                aria-label="Previous CV page"
                className={[
                  'absolute',
                  'left-2',
                  'top-1/2',
                  'z-20',
                  '-translate-y-1/2',
                  'items-center',
                  'justify-center',
                  'text-muted-foreground',
                  'transition-[color,opacity,transform]',
                  'hover:text-accent',
                  'focus-visible:outline-none',
                  'focus-visible:ring-2',
                  'focus-visible:ring-ring',
                  'disabled:pointer-events-none',
                  'disabled:opacity-20',
                  'sm:left-[-2.5rem]',
                  'flex',
                ].join(' ')}
              >
                <ChevronLeft
                  className="h-7 w-7"
                  aria-hidden="true"
                />
              </button>

              <button
                type="button"
                onClick={
                  goNext
                }
                disabled={
                  currentPage ===
                  pageCount -
                    1
                }
                aria-label="Next CV page"
                className={[
                  'absolute',
                  'right-2',
                  'top-1/2',
                  'z-20',
                  '-translate-y-1/2',
                  'items-center',
                  'justify-center',
                  'text-muted-foreground',
                  'transition-[color,opacity,transform]',
                  'hover:text-accent',
                  'focus-visible:outline-none',
                  'focus-visible:ring-2',
                  'focus-visible:ring-ring',
                  'disabled:pointer-events-none',
                  'disabled:opacity-20',
                  'sm:right-[-2.5rem]',
                  'flex',
                ].join(' ')}
              >
                <ChevronRight
                  className="h-7 w-7"
                  aria-hidden="true"
                />
              </button>

              <AnimatePresence
                initial={false}
                mode="wait"
                custom={
                  direction
                }
              >
                <motion.div
                  key={
                    currentPage
                  }
                  custom={
                    direction
                  }
                  variants={
                    prefersReducedMotion
                      ? undefined
                      : pageVariants
                  }
                  initial={
                    prefersReducedMotion
                      ? {
                          opacity:
                            0,
                        }
                      : 'enter'
                  }
                  animate={
                    prefersReducedMotion
                      ? {
                          opacity:
                            1,
                        }
                      : 'center'
                  }
                  exit={
                    prefersReducedMotion
                      ? {
                          opacity:
                            0,
                        }
                      : 'exit'
                  }
                  transition={
                    prefersReducedMotion
                      ? {
                          duration:
                            0.12,
                        }
                      : {
                          duration:
                            0.48,
                          ease: [
                            0.22,
                            0.8,
                            0.24,
                            1,
                          ],
                        }
                  }
                  drag={
                    prefersReducedMotion
                      ? false
                      : 'x'
                  }
                  dragConstraints={{
                    left:
                      0,
                    right:
                      0,
                  }}
                  dragElastic={
                    0.28
                  }
                  onDragEnd={
                    handleDragEnd
                  }
                  whileDrag={
                    prefersReducedMotion
                      ? undefined
                      : {
                          scale:
                            0.994,
                          rotateY:
                            direction > 0
                              ? 3
                              : -3,
                          filter:
                            'brightness(0.985)',
                          cursor:
                            'grabbing',
                        }
                  }
                  className={[
                    'touch-pan-y',
                    'cursor-grab',
                    'select-none',
                    '[transform-style:preserve-3d]',
                    '[backface-visibility:hidden]',
                    'drop-shadow-[0_12px_18px_rgba(0,0,0,0.06)]',
                  ].join(' ')}
                  style={{
                    transformOrigin:
                      direction >
                      0
                        ? 'right center'
                        : 'left center',
                  }}
                >
                  {
                    pages[
                      currentPage
                    ]
                  }
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2.5">
              {pages.map(
                (
                  _,
                  index,
                ) => (
                  <button
                    key={
                      index
                    }
                    type="button"
                    onClick={() =>
                      goToPage(
                        index,
                      )
                    }
                    aria-label={`Go to CV page ${
                      index +
                      1
                    }`}
                    aria-current={
                      currentPage ===
                      index
                        ? 'page'
                        : undefined
                    }
                    className={[
                      'h-2',
                      'w-2',
                      'transition-[background-color,transform]',
                      currentPage ===
                      index
                        ? 'scale-110 bg-accent'
                        : 'bg-border hover:bg-muted-foreground/60',
                    ].join(' ')}
                  />
                ),
              )}
            </div>

            <p className="mt-3 text-center text-[0.68rem] text-muted-foreground">
              Drag or swipe the page,
              use ← →, or select a page.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
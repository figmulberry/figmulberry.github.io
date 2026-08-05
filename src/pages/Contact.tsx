import React, {
  useMemo,
  useState,
} from 'react';

import { Link } from 'wouter';

import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Youtube,
} from 'lucide-react';

const contactDetails = {
  email: 'kamusaley@gmail.com',
  location: 'Nairobi, Kenya',
  github: 'https://github.com/figmulberry',
  linkedin: 'https://www.linkedin.com/in/mkthiongo/',
  youtube:
    'https://www.youtube.com/@thekalabashmosaics',
  discord: '#',
  brand: 'The Kalabash Mosaics',
};

function shortenArticleTitle(
  title: string,
  wordLimit = 5,
): string {
  const words = title
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length <= wordLimit) {
    return words.join(' ');
  }

  return `${words
    .slice(0, wordLimit)
    .join(' ')}...`;
}

export default function Contact() {
  const [sent, setSent] = useState(false);

  const articleFeedback = useMemo(() => {
    const parameters =
      new URLSearchParams(
        window.location.search,
      );

    const topic =
      parameters.get('topic');

    const articleSlug =
      parameters.get('article') ?? '';

    const articleTitle =
      parameters.get('title') ?? '';

    const isArticleFeedback =
      topic === 'article-feedback' &&
      articleTitle.length > 0;

    return {
      isArticleFeedback,
      articleSlug,
      articleTitle,
      subject:
        isArticleFeedback
          ? `Suggestion for: ${articleTitle}`
          : '',
    };
  }, []);

  return (
    <div className="w-full">
      {/* Page Header */}
      <section className="border-b border-border bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-16 lg:px-8">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-accent">
            Contact
          </p>

          <h1 className="max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">
            Start a conversation
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Available for geospatial analysis,
            automation, analytics, AI evaluation,
            and documentation engagements.
          </p>
        </div>
      </section>

      {/* Contact Form and Details */}
      <section className="w-full">
        <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <form
              className="rounded-lg border border-border bg-card p-6 shadow-sm"
              onSubmit={(event) => {
                event.preventDefault();
                setSent(true);
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="font-medium">
                    Name
                  </span>

                  <input
                    required
                    name="name"
                    className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
                  />
                </label>

                <label className="block text-sm">
                  <span className="font-medium">
                    Email
                  </span>

                  <input
                    required
                    type="email"
                    name="email"
                    className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
                  />
                </label>
              </div>

              <label className="mt-4 block text-sm">
                <span className="font-medium">
                  Subject
                </span>

                <input
                  name="subject"
                  defaultValue={
                    articleFeedback.subject
                  }
                  className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
                />
              </label>

              {articleFeedback.isArticleFeedback && (
                <div className="mt-4 border-l-2 border-accent bg-muted/40 px-4 py-3 text-sm">
                  <p className="font-medium text-foreground">
                    Related article
                  </p>

                  <Link
                    href={`/preview/articles/${articleFeedback.articleSlug}`}
                    title={
                      articleFeedback.articleTitle
                    }
                    className={[
                      'mt-1 inline-block',
                      'max-w-full',
                      'text-muted-foreground',
                      'transition-colors',
                      'hover:text-accent',
                      'hover:underline',
                      'underline-offset-4',
                    ].join(' ')}
                  >
                    {shortenArticleTitle(
                      articleFeedback.articleTitle,
                    )}
                  </Link>
                </div>
              )}

              <label className="mt-4 block text-sm">
                <span className="font-medium">
                  Message
                </span>

                <textarea
                  required
                  name="message"
                  rows={6}
                  className="mt-1.5 w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
                />
              </label>

              <button
                type="submit"
                className="mt-5 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Send message
              </button>

              {sent && (
                <p
                  role="status"
                  className="mt-3 text-sm text-primary"
                >
                  Thanks — this form is not
                  connected to mail delivery yet.
                  Email{' '}
                  <a
                    href={`mailto:${contactDetails.email}`}
                    className="font-medium hover:underline"
                  >
                    {contactDetails.email}
                  </a>{' '}
                  directly in the meantime.
                </p>
              )}
            </form>

            <aside className="space-y-4">
              <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
                <h2 className="text-sm font-bold uppercase tracking-wide text-accent">
                  Direct
                </h2>

                <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Mail
                      className="h-4 w-4"
                      aria-hidden="true"
                    />

                    <a
                      href={`mailto:${contactDetails.email}`}
                      className="hover:text-primary"
                    >
                      {contactDetails.email}
                    </a>
                  </li>

                  <li className="flex items-center gap-2">
                    <MapPin
                      className="h-4 w-4"
                      aria-hidden="true"
                    />

                    <span>
                      {contactDetails.location}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
                <h2 className="text-sm font-bold uppercase tracking-wide text-accent">
                  Elsewhere
                </h2>

                <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Github
                      className="h-4 w-4"
                      aria-hidden="true"
                    />

                    <a
                      href={
                        contactDetails.github
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary"
                    >
                      GitHub
                    </a>
                  </li>

                  <li className="flex items-center gap-2">
                    <Linkedin
                      className="h-4 w-4"
                      aria-hidden="true"
                    />

                    <a
                      href={
                        contactDetails.linkedin
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary"
                    >
                      LinkedIn
                    </a>
                  </li>

                  <li className="flex items-center gap-2">
                    <Youtube
                      className="h-4 w-4"
                      aria-hidden="true"
                    />

                    <a
                      href={
                        contactDetails.youtube
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary"
                    >
                      {contactDetails.brand}
                    </a>
                  </li>

                  <li className="flex items-center gap-2">
                    <MessageCircle
                      className="h-4 w-4"
                      aria-hidden="true"
                    />

                    <a
                      href={
                        contactDetails.discord
                      }
                      aria-disabled="true"
                      className="cursor-not-allowed text-muted-foreground/70"
                      onClick={(event) => {
                        event.preventDefault();
                      }}
                    >
                      Discord — coming soon
                    </a>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Explore My Work */}
      <section className="border-y border-border bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 md:py-16 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Explore My Work
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Dive into my portfolio of geospatial
            projects, read technical articles, or
            review my professional background.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/portfolio"
              className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Portfolio
            </Link>

            <Link
              href="/articles"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              Articles
            </Link>

            <Link
              href="/cv"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              CV
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
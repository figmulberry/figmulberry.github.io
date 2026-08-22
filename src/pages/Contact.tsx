import React, {
  type FormEvent,
  useMemo,
  useState,
} from 'react';

import {
  Mail,
  MapPin,
} from 'lucide-react';

import {
  Link,
} from 'wouter';

const FORM_ENDPOINT =
  'https://formspree.io/f/xwlezzdr';

const contactDetails = {
  email: 'kamusaley@gmail.com',
  location: 'Nairobi, Kenya',
};

type SubmissionState =
  | 'idle'
  | 'sending'
  | 'success'
  | 'error';

function shortenArticleTitle(
  title: string,
  wordLimit = 7,
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
  const [
    submissionState,
    setSubmissionState,
  ] = useState<SubmissionState>(
    'idle',
  );

  const articleFeedback = useMemo(
    () => {
      const parameters =
        new URLSearchParams(
          window.location.search,
        );

      const topic =
        parameters.get('topic');

      const articleSlug =
        parameters.get('article') ??
        '';

      const articleTitle =
        parameters.get('title') ??
        '';

      const isArticleFeedback =
        topic ===
          'article-feedback' &&
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
    },
    [],
  );

  const handleSubmit = async (
    event:
      FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (
      submissionState ===
      'sending'
    ) {
      return;
    }

    setSubmissionState(
      'sending',
    );

    const form =
      event.currentTarget;

    const formData =
      new FormData(form);

    if (
      articleFeedback.isArticleFeedback
    ) {
      formData.set(
        'article',
        articleFeedback.articleTitle,
      );

      formData.set(
        'article_slug',
        articleFeedback.articleSlug,
      );
    }

    try {
      const response =
        await fetch(
          FORM_ENDPOINT,
          {
            method: 'POST',
            body: formData,
            headers: {
              Accept:
                'application/json',
            },
          },
        );

      if (!response.ok) {
        throw new Error(
          'Message submission failed.',
        );
      }

      form.reset();

      setSubmissionState(
        'success',
      );
    } catch {
      setSubmissionState(
        'error',
      );
    }
  };

  return (
    <div className="w-full">
      <section className="border-b border-border bg-muted/30">
        <div className="container mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-16 lg:px-8 lg:py-20">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent">
            Contact
          </p>

          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Start a conversation.
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Maps misbehaving? Data being
            difficult? Workflow taking the
            scenic route? Some problems just
            need someone willing to get
            delightfully lost in the details.
            Got one? Let&apos;s figure it out.
          </p>
        </div>
      </section>

      <section className="w-full">
        <div className="container mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-16 lg:px-8 lg:py-20">
          <div className="grid gap-14 lg:grid-cols-[minmax(14rem,0.66fr)_minmax(0,1.45fr)] lg:gap-16 xl:gap-20">
            <aside className="max-w-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                Get in touch
              </p>

              <p className="mt-5 max-w-xs text-sm leading-6 text-muted-foreground">
                Projects, collaborations,
                questions, ideas, corrections,
                or something worth talking
                through. I&apos;d be glad to
                hear from you.
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-3">
                  <MapPin
                    className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                    aria-hidden="true"
                  />

                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
                      Based in
                    </p>

                    <p className="mt-1 text-sm font-medium text-foreground">
                      {contactDetails.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail
                    className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                    aria-hidden="true"
                  />

                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
                      Email
                    </p>

                    <a
                      href={`mailto:${contactDetails.email}`}
                      className="mt-1 block break-all text-sm font-medium text-foreground transition-colors duration-150 hover:text-accent focus-visible:outline-none focus-visible:text-accent"
                    >
                      {contactDetails.email}
                    </a>
                  </div>
                </div>
              </div>
            </aside>

            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                Send a message
              </p>

              <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                What would you like to discuss?
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                Share as much context as
                useful. I&apos;ll take it from
                there.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-8"
              >
                <input
                  type="text"
                  name="_gotcha"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-medium text-foreground">
                      Name
                    </span>

                    <input
                      required
                      name="name"
                      autoComplete="name"
                      disabled={
                        submissionState ===
                        'sending'
                      }
                      className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3.5 text-sm text-foreground outline-none transition-[border-color,box-shadow] focus:border-accent focus:ring-2 focus:ring-accent/15 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-foreground">
                      Email
                    </span>

                    <input
                      required
                      type="email"
                      name="email"
                      autoComplete="email"
                      disabled={
                        submissionState ===
                        'sending'
                      }
                      className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3.5 text-sm text-foreground outline-none transition-[border-color,box-shadow] focus:border-accent focus:ring-2 focus:ring-accent/15 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </label>
                </div>

                <label className="mt-5 block">
                  <span className="text-sm font-medium text-foreground">
                    Subject
                  </span>

                  <input
                    name="subject"
                    defaultValue={
                      articleFeedback.subject
                    }
                    disabled={
                      submissionState ===
                      'sending'
                    }
                    className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3.5 text-sm text-foreground outline-none transition-[border-color,box-shadow] focus:border-accent focus:ring-2 focus:ring-accent/15 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </label>

                {articleFeedback.isArticleFeedback && (
                  <div className="mt-5 border-l-2 border-accent bg-muted/40 px-4 py-3 text-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-accent">
                      Related article
                    </p>

                    <Link
                      href={`/articles/${articleFeedback.articleSlug}`}
                      title={
                        articleFeedback.articleTitle
                      }
                      className="mt-1.5 inline-block max-w-full font-medium text-foreground transition-colors duration-150 hover:text-accent hover:underline focus-visible:outline-none focus-visible:text-accent underline-offset-4"
                    >
                      {shortenArticleTitle(
                        articleFeedback.articleTitle,
                      )}
                    </Link>
                  </div>
                )}

                <label className="mt-5 block">
                  <span className="text-sm font-medium text-foreground">
                    Message
                  </span>

                  <textarea
                    required
                    name="message"
                    rows={7}
                    disabled={
                      submissionState ===
                      'sending'
                    }
                    className="mt-2 w-full resize-y rounded-md border border-input bg-background px-3.5 py-3 text-sm leading-6 text-foreground outline-none transition-[border-color,box-shadow] focus:border-accent focus:ring-2 focus:ring-accent/15 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </label>

                <button
                  type="submit"
                  disabled={
                    submissionState ===
                    'sending'
                  }
                  className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-semibold text-foreground transition-colors duration-150 hover:border-accent hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submissionState ===
                  'sending'
                    ? 'Submitting...'
                    : 'Submit'}
                </button>

                {submissionState ===
                  'success' && (
                  <p
                    role="status"
                    className="mt-5 max-w-lg text-sm font-medium leading-6 text-foreground"
                  >
                    Message sent. Thanks.
                    I&apos;ll get back to you
                    as soon as I can.
                  </p>
                )}

                {submissionState ===
                  'error' && (
                  <p
                    role="alert"
                    className="mt-5 max-w-lg text-sm leading-6 text-destructive"
                  >
                    Your message could not
                    be sent. Please try again
                    or email me directly at{' '}
                    <a
                      href={`mailto:${contactDetails.email}`}
                      className="font-medium underline underline-offset-4"
                    >
                      {contactDetails.email}
                    </a>
                    .
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
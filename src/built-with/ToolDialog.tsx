import {
  useEffect,
  useRef,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'wouter';
import {
  ArrowRight,
  Box,
  CalendarDays,
  Check,
  ExternalLink,
  FolderKanban,
  Globe2,
  Layers3,
  X,
} from 'lucide-react';

import {
  contentRegistry,
} from '@/content/engine/registry';

import {
  getRelatedArticlesForTool,
} from '@/lib/content/getRelatedArticlesForTool';

import { toolDialogData } from './toolDialogData';
import type { Tool } from './types';

interface ToolDialogProps {
  tool: Tool | null;
  open: boolean;
  onClose: () => void;
}

export default function ToolDialog({
  tool,
  open,
  onClose,
}: ToolDialogProps) {
  const relatedArticleResult =
    tool
      ? getRelatedArticlesForTool(
          contentRegistry,
          tool.name,
          3,
        )
      : {
          articles: [],
          total: 0,
        };

  const relatedArticles =
    relatedArticleResult.articles;

  const relatedArticleCount =
    relatedArticleResult.total;

  const dialogRef = useRef<HTMLDivElement>(null);

  const closeButtonRef =
    useRef<HTMLButtonElement>(null);

  const previouslyFocusedElement =
    useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    previouslyFocusedElement.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    const focusFrame =
      window.requestAnimationFrame(() => {
        closeButtonRef.current?.focus();
      });

    return () => {
      window.cancelAnimationFrame(focusFrame);

      document.body.style.overflow =
        previousOverflow;

      const previousElement =
        previouslyFocusedElement.current;

      if (!previousElement) {
        return;
      }

      /*
       * Restore logical focus to the card without leaving
       * a visible focus ring after closing the dialog.
       */
      previousElement.setAttribute(
        'data-dialog-focus-return',
        'true',
      );

      previousElement.focus({
        preventScroll: true,
      });

      /*
       * Keep the ring suppressed until the user's next
       * intentional pointer or keyboard interaction.
       */
      const removeFocusSuppression = () => {
        previousElement.removeAttribute(
          'data-dialog-focus-return',
        );

        window.removeEventListener(
          'pointerdown',
          removeFocusSuppression,
          true,
        );

        window.removeEventListener(
          'keydown',
          removeFocusSuppression,
          true,
        );
      };

      window.addEventListener(
        'pointerdown',
        removeFocusSuppression,
        true,
      );

      window.addEventListener(
        'keydown',
        removeFocusSuppression,
        true,
      );
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleEscape = (
      event: globalThis.KeyboardEvent,
    ) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener(
      'keydown',
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        'keydown',
        handleEscape,
      );
    };
  }, [open, onClose]);

  if (!open || !tool) {
    return null;
  }

  const metadata = toolDialogData[tool.id];

  const Icon = tool.icon;

  const dialogStyle = {
    '--dialog-accent': tool.accentColor,
    '--dialog-accent-soft': `${tool.accentColor}12`,
    '--dialog-accent-medium': `${tool.accentColor}22`,
  } as CSSProperties;

  const type =
    metadata?.type ?? `${tool.category} Tool`;

  const websiteLabel =
    metadata?.websiteLabel ?? tool.name;

  const websiteHref =
    metadata?.websiteHref ?? tool.relatedHref;

  const valueTags =
    metadata?.valueTags ??
    tool.whereUsed.slice(0, 4);

  const projectDescriptions =
    metadata?.projectDescriptions ?? [];

  const handleOverlayClick = (
    event: MouseEvent<HTMLDivElement>,
  ) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleDialogKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
  ) => {
    if (event.key !== 'Tab') {
      return;
    }

    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    const focusableElements = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        [
          'a[href]',
          'button:not([disabled])',
          '[tabindex]:not([tabindex="-1"])',
        ].join(','),
      ),
    ).filter(
      (element) =>
        !element.hasAttribute('disabled') &&
        element.getAttribute('aria-hidden') !==
          'true',
    );

    if (focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];

    const lastElement =
      focusableElements[
        focusableElements.length - 1
      ];

    if (
      event.shiftKey &&
      document.activeElement === firstElement
    ) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (
      !event.shiftKey &&
      document.activeElement === lastElement
    ) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  const dialog = (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/65
        px-4
        py-5
        backdrop-blur-[2px]
        sm:px-6
      "
      onMouseDown={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tool-dialog-title"
        aria-describedby="tool-dialog-overview"
        onKeyDown={handleDialogKeyDown}
        style={dialogStyle}
        className="
          relative
          grid
          h-[min(820px,92vh)]
          w-full
          max-w-6xl
          overflow-hidden
          rounded-xl
          border
          border-border
          bg-background
          shadow-2xl
          outline-none
          animate-in
          fade-in-0
          zoom-in-95
          duration-200
          lg:grid-cols-[270px_minmax(0,1fr)]
        "
      >
        {/* Close button */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="
            absolute
            right-4
            top-4
            z-30
            inline-flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            border
            border-border
            bg-background/90
            text-muted-foreground
            shadow-sm
            backdrop-blur
            transition-colors
            hover:border-[var(--dialog-accent)]
            hover:text-[var(--dialog-accent)]
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[var(--dialog-accent)]
          "
          aria-label={`Close ${tool.name} details`}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Brand identity panel */}
        <aside
          className="
            relative
            min-h-0
            overflow-y-auto
            border-b
            border-border
            px-7
            py-8
            lg:h-full
            lg:border-b-0
            lg:border-r
          "
          style={{
            background:
              'linear-gradient(180deg, var(--dialog-accent-soft), transparent)',
          }}
        >
          <div
            className="
              pointer-events-none
              absolute
              -bottom-20
              -left-16
              h-56
              w-56
              rounded-full
              opacity-30
              blur-3xl
            "
            style={{
              backgroundColor:
                'var(--dialog-accent-medium)',
            }}
          />

          <div className="relative z-10">
            <div className="text-center">
              <Icon
                className="
                  mx-auto
                  h-16
                  w-16
                  text-[var(--dialog-accent)]
                "
              />

              <h2
                id="tool-dialog-title"
                className="
                  mt-5
                  text-3xl
                  font-bold
                  tracking-tight
                  text-[var(--dialog-accent)]
                "
              >
                {tool.name}
              </h2>

              <p
                className="
                  mt-3
                  text-sm
                  leading-6
                  text-[var(--dialog-accent)]
                "
              >
                {tool.tagline}
              </p>

              <div
                className="
                  mx-auto
                  my-7
                  h-px
                  w-14
                  bg-[var(--dialog-accent)]
                "
              />
            </div>

            <div className="space-y-5">
              <div className="flex gap-3">
                <Layers3 className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />

                <div>
                  <p className="text-sm font-semibold">
                    Category
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {tool.category}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Box className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />

                <div>
                  <p className="text-sm font-semibold">
                    Type
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {type}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />

                <div>
                  <p className="text-sm font-semibold">
                    Years Using
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Since {tool.since}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Globe2 className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />

                <div className="min-w-0">
                  <p className="text-sm font-semibold">
                    Website
                  </p>

                  <a
                    href={websiteHref}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      mt-1
                      inline-flex
                      max-w-full
                      items-center
                      gap-1.5
                      break-all
                      text-sm
                      text-muted-foreground
                      transition-colors
                      hover:text-[var(--dialog-accent)]
                    "
                  >
                    {websiteLabel}

                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Scrollable main content */}
        <main
          className="
            h-full
            min-h-0
            overflow-y-auto
            overscroll-contain
            px-6
            pb-8
            pt-16
            sm:px-8
            lg:px-9
            lg:pt-8
          "
        >
          {/* Overview */}
          <section>
            <h3 className="text-xl font-bold">
              Overview
            </h3>

            <p
              id="tool-dialog-overview"
              className="
                mt-3
                max-w-3xl
                text-sm
                leading-7
                text-muted-foreground
                sm:text-base
              "
            >
              {tool.summary}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {valueTags.map((tag) => (
                <span
                  key={tag}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    px-3
                    py-1.5
                    text-xs
                    font-medium
                  "
                  style={{
                    borderColor:
                      'var(--dialog-accent-medium)',
                    backgroundColor:
                      'var(--dialog-accent-soft)',
                    color:
                      'var(--dialog-accent)',
                  }}
                >
                  <Check className="h-3.5 w-3.5" />

                  {tag}
                </span>
              ))}
            </div>
          </section>

          <div className="my-7 h-px bg-border" />

          {/* How I use it */}
          <section>
            <h3 className="text-xl font-bold">
              How I Use It
            </h3>

            <div
              className="
                mt-4
                grid
                gap-x-8
                gap-y-3
                sm:grid-cols-2
              "
            >
              {tool.whereUsed.map((item) => (
                <div
                  key={item}
                  className="
                    flex
                    items-start
                    gap-3
                    text-sm
                  "
                >
                  <span
                    className="
                      mt-0.5
                      inline-flex
                      h-5
                      w-5
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                    "
                    style={{
                      backgroundColor:
                        'var(--dialog-accent-soft)',
                      color:
                        'var(--dialog-accent)',
                    }}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </span>

                  <span className="leading-6">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <div className="my-7 h-px bg-border" />

          {/* Representative projects */}
          <section>
            <div className="flex items-center gap-3">
              <FolderKanban className="h-5 w-5 text-[var(--dialog-accent)]" />

              <h3 className="text-xl font-bold">
                Representative Projects
              </h3>
            </div>

            <div
              className="
                mt-5
                grid
                gap-4
                md:grid-cols-2
                xl:grid-cols-3
              "
            >
              {tool.projects
                .slice(0, 3)
                .map((project, index) => (
                  <Link
                    key={project}
                    href={tool.relatedHref}
                    onClick={onClose}
                    className="
                      group
                      flex
                      min-h-[285px]
                      flex-col
                      overflow-hidden
                      rounded-lg
                      border
                      border-border
                      bg-card
                      transition-all
                      hover:-translate-y-0.5
                      hover:border-[var(--dialog-accent)]
                      hover:shadow-md
                    "
                  >
                    <div
                      className="
                        h-32
                        shrink-0
                        overflow-hidden
                        bg-muted
                      "
                    >
                      <img
                        src="/project-thumbnails/placeholder.webp"
                        alt={`${project} project preview`}
                        width={800}
                        height={450}
                        loading="lazy"
                        className="
                          h-full
                          w-full
                          object-cover
                          transition-transform
                          duration-300
                          group-hover:scale-[1.03]
                        "
                      />
                    </div>

                    <div
                      className="
                        flex
                        flex-1
                        flex-col
                        p-4
                      "
                    >
                      <h4
                        className="
                          overflow-hidden
                          text-sm
                          font-semibold
                          leading-5
                          transition-colors
                          group-hover:text-[var(--dialog-accent)]
                          [display:-webkit-box]
                          [-webkit-box-orient:vertical]
                          [-webkit-line-clamp:2]
                        "
                      >
                        {project}
                      </h4>

                      <p
                        className="
                          mt-2
                          overflow-hidden
                          text-xs
                          leading-5
                          text-muted-foreground
                          [display:-webkit-box]
                          [-webkit-box-orient:vertical]
                          [-webkit-line-clamp:2]
                        "
                      >
                        {projectDescriptions[index] ??
                          `Representative ${tool.category.toLowerCase()} work using ${tool.name}.`}
                      </p>

                      <span
                        className="
                          mt-auto
                          inline-flex
                          items-center
                          gap-1
                          pt-4
                          text-xs
                          font-medium
                          text-muted-foreground
                          transition-colors
                          group-hover:text-[var(--dialog-accent)]
                        "
                      >
                        View project

                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Link>
                ))}
            </div>
          </section>

          <div className="my-7 h-px bg-border" />

          {/* Footer */}
          <footer
            className="
              flex
              flex-col
              gap-5
              pb-1
              sm:flex-row
              sm:items-end
              sm:justify-between
            "
          >
            {relatedArticles.length > 0 && (
              <div>
                <p className="text-sm font-semibold">
                  Related Articles
                </p>

                <div className="mt-2 flex flex-col gap-2">
                  {relatedArticles.map(
                    (article) => (
                      <Link
                        key={article.id}
                        href={`/articles/${article.slug}`}
                        onClick={onClose}
                        className={[
                          'group/article',
                          'inline-flex',
                          'items-start',
                          'gap-1.5',
                          'text-xs',
                          'text-muted-foreground',
                          'transition-colors',
                          'hover:text-[var(--dialog-accent)]',
                          'focus-visible:outline-none',
                          'focus-visible:ring-2',
                          'focus-visible:ring-ring',
                          'focus-visible:ring-offset-2',
                        ].join(' ')}
                      >
                        <span>
                          {article.title}
                        </span>

                        <ArrowRight
                          className={[
                            'mt-0.5 h-3.5 w-3.5',
                            'shrink-0',
                            'transition-transform',
                            'group-hover/article:translate-x-0.5',
                          ].join(' ')}
                          aria-hidden="true"
                        />
                      </Link>
                    ),
                  )}

                  {relatedArticleCount > 3 && (
                    <Link
                      href={
                        `/articles?tag=${encodeURIComponent(
                          tool.name,
                        )}`
                      }
                      onClick={onClose}
                      className={[
                        'mt-1 inline-flex',
                        'items-center gap-1.5',
                        'text-xs font-medium',
                        'text-[var(--dialog-accent)]',
                        'hover:underline',
                        'underline-offset-4',
                        'focus-visible:outline-none',
                        'focus-visible:ring-2',
                        'focus-visible:ring-ring',
                      ].join(' ')}
                    >
                      View all {tool.name} articles

                      <ArrowRight
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                      />
                    </Link>
                  )}
                </div>
              </div>
            )}

            <Link
              href={tool.relatedHref}
              onClick={onClose}
              className="
                inline-flex
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-md
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition-[transform,filter]
                hover:-translate-y-0.5
                hover:brightness-105
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[var(--dialog-accent)]
                focus-visible:ring-offset-2
              "
              style={{
                backgroundColor:
                  'var(--dialog-accent)',
              }}
            >
              View in Portfolio

              <ArrowRight className="h-4 w-4" />
            </Link>
          </footer>
        </main>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}
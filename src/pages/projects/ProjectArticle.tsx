import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';

const FigureCounterContext =
  createContext<{
    next: () => number;
  } | null>(null);

export function ProjectArticleBody({
  id,
  children,
}: {
  id?: string;
  children: ReactNode;
}) {
  const counter =
    useRef(0);

  const value =
    useMemo(
      () => ({
        next: () => {
          counter.current += 1;
          return counter.current;
        },
      }),
      [],
    );

  return (
    <FigureCounterContext.Provider
      value={value}
    >
      <div
        id={id}
        className="scroll-mt-8 px-6 pt-12 md:px-10 md:pt-16 xl:px-16"
      >
        {children}
      </div>
    </FigureCounterContext.Provider>
  );
}

function useFigureNumber() {
  const context =
    useContext(
      FigureCounterContext,
    );

  const assigned =
    useRef<number | null>(
      null,
    );

  if (
    assigned.current ===
      null
  ) {
    assigned.current =
      context
        ? context.next()
        : 0;
  }

  return assigned.current;
}

export function ProjectSection({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="mt-10 scroll-mt-24 first:mt-0 md:mt-12"
    >
      <div className="mx-auto w-full max-w-[44rem] text-left">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
          {title}
        </h2>
      </div>

      <div className="mt-3">
        {children}
      </div>
    </section>
  );
}

export function ProjectP({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-[44rem] text-left [&+&]:mt-4">
      <p className="article-reading-font text-[1.1875rem] leading-[1.75] text-foreground/90">
        {children}
      </p>
    </div>
  );
}

export function ProjectPull({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-[44rem] text-left">
      <blockquote className="my-8 border-l border-accent pl-6">
        <p className="article-display-font text-[1.35rem] leading-snug text-foreground">
          {children}
        </p>
      </blockquote>
    </div>
  );
}

type ProjectFigureWidth =
  | 'normal'
  | 'wide'
  | 'full';

export function ProjectFigure({
  src,
  alt,
  caption,
  width = 'normal',
  ratio = '16 / 10',
}: {
  src: string;
  alt: string;
  caption: string;
  width?: ProjectFigureWidth;
  ratio?: string;
}) {
  const figureNumber =
    useFigureNumber();

  const wrapper =
    width === 'normal'
      ? 'mx-auto w-full max-w-[44rem]'
      : width === 'wide'
        ? 'mx-auto w-full max-w-5xl'
        : 'w-full';

  return (
    <figure
      className={[
        'mb-8',
        'mt-8',
        wrapper,
      ].join(' ')}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-auto w-full object-contain"
      />

      <figcaption
        className={[
          'mt-2',
          'font-mono',
          'text-xs',
          'leading-[1.6]',
          'text-muted-foreground',
          width === 'normal'
            ? ''
            : 'mx-auto w-full max-w-[44rem]',
        ].join(' ')}
      >
        <span className="font-semibold text-foreground">
          Figure {figureNumber}:
        </span>{' '}
        {caption}
      </figcaption>
    </figure>
  );
}

function PairedFigure({
  src,
  alt,
  caption,
  label,
}: {
  src: string;
  alt: string;
  caption: string;
  label?: string;
}) {
  const figureNumber =
    useFigureNumber();

  return (
    <figure>
      {label ? (
        <p className="mb-2 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-foreground">
          {label}
        </p>
      ) : null}

      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-auto w-full object-contain"
      />

      <figcaption className="mt-2 font-mono text-xs leading-[1.6] text-muted-foreground">
        <span className="font-semibold text-foreground">
          Figure {figureNumber}:
        </span>{' '}
        {caption}
      </figcaption>
    </figure>
  );
}

export function ProjectGallery({
  items,
}: {
  items: {
    src: string;
    alt: string;
    caption: string;
  }[];
}) {
  return (
    <div className="mx-auto my-8 grid w-full max-w-[44rem] grid-cols-1 gap-6 sm:grid-cols-2">
      {items.map(
        (
          item,
          index,
        ) => (
          <PairedFigure
            key={`${item.src}:${index}`}
            {...item}
          />
        ),
      )}
    </div>
  );
}

export function ProjectBeforeAfter({
  before,
  after,
}: {
  before: {
    src: string;
    alt: string;
    caption: string;
  };
  after: {
    src: string;
    alt: string;
    caption: string;
  };
}) {
  return (
    <div className="mx-auto my-8 grid w-full max-w-[44rem] grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
      <PairedFigure
        {...before}
        label="Before"
      />

      <PairedFigure
        {...after}
        label="After"
      />
    </div>
  );
}

export function ProjectWorkflow({
  steps,
}: {
  steps: {
    title: string;
    body: string;
  }[];
}) {
  return (
    <div className="mx-auto mt-4 w-full max-w-[44rem] text-left">
      {steps.map(
        (
          step,
          index,
        ) => (
          <div
            key={`${step.title}:${index}`}
            className="border-t border-border py-7 last:border-b"
          >
            <div className="flex gap-5">
              <span className="pt-1 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-accent">
                {
                  String(
                    index +
                      1,
                  ).padStart(
                    2,
                    '0',
                  )
                }
              </span>

              <div>
                <h3 className="article-display-font text-[1.25rem] leading-snug text-foreground">
                  {step.title}
                </h3>

                <p className="article-reading-font mt-2 text-[1.0625rem] leading-[1.75] text-foreground/90">
                  {step.body}
                </p>
              </div>
            </div>
          </div>
        ),
      )}
    </div>
  );
}

export function ProjectKeyPoints({
  items,
}: {
  items: string[];
}) {
  return (
    <div className="mx-auto mt-4 w-full max-w-[44rem] text-left">
      {items.map(
        (
          item,
          index,
        ) => (
          <div
            key={`${item}:${index}`}
            className="border-t border-border py-6 last:border-b"
          >
            <div className="flex gap-5">
              <span className="pt-1 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-accent">
                {
                  String(
                    index +
                      1,
                  ).padStart(
                    2,
                    '0',
                  )
                }
              </span>

              <p className="article-reading-font text-[1.0625rem] leading-[1.75] text-foreground/90">
                {item}
              </p>
            </div>
          </div>
        ),
      )}
    </div>
  );
}

export function ProjectOutcomes({
  items,
}: {
  items: {
    title: string;
    description: string;
    metric?: string;
  }[];
}) {
  return (
    <div className="mx-auto mt-4 w-full max-w-[44rem] text-left">
      {items.map(
        (
          item,
          index,
        ) => (
          <div
            key={`${item.title}:${index}`}
            className="border-t border-border py-7 last:border-b"
          >
            {item.metric ? (
              <p className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-accent">
                {item.metric}
              </p>
            ) : null}

            <h3
              className={[
                'article-display-font',
                'text-[1.25rem]',
                'leading-snug',
                'text-foreground',
                item.metric
                  ? 'mt-2'
                  : '',
              ].join(' ')}
            >
              {item.title}
            </h3>

            <p className="article-reading-font mt-2 text-[1.0625rem] leading-[1.75] text-foreground/90">
              {item.description}
            </p>
          </div>
        ),
      )}
    </div>
  );
}

export function ProjectEmbed({
  title,
  description,
  url,
  embedUrl,
  aspectRatio,
}: {
  title: string;
  description?: string;
  url: string;
  embedUrl?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1';
}) {
  const aspectClass =
    aspectRatio ===
      '4:3'
      ? 'aspect-[4/3]'
      : aspectRatio ===
          '1:1'
        ? 'aspect-square'
        : 'aspect-video';

  return (
    <>
      {description ? (
        <ProjectP>
          {description}
        </ProjectP>
      ) : null}

      {embedUrl ? (
        <div
          className={[
            'mx-auto',
            'my-8',
            'w-full',
            'max-w-[44rem]',
            'overflow-hidden',
            'border',
            'border-border',
            aspectClass,
          ].join(' ')}
        >
          <iframe
            src={embedUrl}
            title={title}
            loading="lazy"
            allowFullScreen
            className="h-full w-full border-0"
          />
        </div>
      ) : null}

      <div className="mx-auto w-full max-w-[44rem] text-left">
        <a
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-accent hover:underline"
        >
          Open interactive project {'\u2197'}
        </a>
      </div>
    </>
  );
}

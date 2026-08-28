import React from 'react';

export type ProjectIntroMode =
  | 'image-left'
  | 'image-right'
  | 'overlay'
  | 'wide';

export type ProjectIntroData = {
  meta: {
    category: string;
    projectType?: string;
    date?: string;
    readingTime?: string;
  };
  title: string;
  intro: string;
  tools: string[];
  image: string;
  imageAlt: string;
};

type ProjectIntroProps = {
  mode?: ProjectIntroMode;
  data: ProjectIntroData;
  targetId?: string;
  compact?: boolean;
};

function MetadataLine({
  meta,
  className = '',
}: {
  meta: ProjectIntroData['meta'];
  className?: string;
}) {
  const items = [
    meta.category,
    meta.projectType,
    meta.date,
    meta.readingTime,
  ].filter(Boolean);

  return (
    <p
      className={[
        'font-mono',
        'text-[0.6875rem]',
        'leading-[1.6]',
        'uppercase',
        'tracking-[0.14em]',
        'text-muted-foreground',
        className,
      ].join(' ')}
    >
      {items.map((item, index) => (
        <React.Fragment key={`${item}:${index}`}>
          {index > 0 ? (
            <span aria-hidden="true">
              {' \u00B7 '}
            </span>
          ) : null}

          <span className={index === 0 ? 'text-accent' : ''}>
            {item}
          </span>
        </React.Fragment>
      ))}
    </p>
  );
}

function ToolsLine({
  tools,
  compact,
  onOverlay = false,
}: {
  tools: string[];
  compact?: boolean;
  onOverlay?: boolean;
}) {
  if (tools.length === 0) {
    return null;
  }

  return (
    <p
      className={[
        'article-reading-font',
        onOverlay
          ? 'text-white/80'
          : 'text-muted-foreground',
        compact
          ? 'text-[0.7rem]'
          : 'text-[0.8125rem]',
      ].join(' ')}
    >
      <span
        className={[
          'font-semibold',
          onOverlay
            ? 'text-white'
            : 'text-foreground',
        ].join(' ')}
      >
        Tools:
      </span>{' '}
      {tools.join(', ')}
    </p>
  );
}

function ExploreAction({
  targetId,
  onOverlay = false,
}: {
  targetId?: string;
  onOverlay?: boolean;
}) {
  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    if (!targetId) {
      return;
    }

    const target =
      document.getElementById(targetId);

    if (!target) {
      return;
    }

    event.preventDefault();

    const reduceMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;

    target.scrollIntoView({
      behavior:
        reduceMotion
          ? 'auto'
          : 'smooth',
      block: 'start',
    });
  };

  return (
    <a
      href={
        targetId
          ? `#${targetId}`
          : '#'
      }
      onClick={handleClick}
      className={[
        'inline-flex',
        'items-center',
        'gap-2',
        'border-b',
        'border-current',
        'pb-[0.35rem]',
        'font-mono',
        'text-xs',
        'font-semibold',
        'uppercase',
        'tracking-[0.2em]',
        'transition-colors',
        'hover:text-accent',
        onOverlay
          ? 'text-inherit'
          : 'text-foreground',
      ].join(' ')}
    >
      Explore project

      <span
        className="project-chevron-nudge inline-block"
        aria-hidden="true"
      >
        &#8595;
      </span>
    </a>
  );
}

function EditorialColumn({
  data,
  targetId,
  compact,
  onOverlay,
  wideCompact = false,
}: {
  data: ProjectIntroData;
  targetId?: string;
  compact?: boolean;
  onOverlay?: boolean;
  wideCompact?: boolean;
}) {
  return (
    <div
      className={
        compact
          ? 'space-y-4'
          : wideCompact
            ? 'space-y-4 md:space-y-5'
            : 'space-y-6 md:space-y-7'
      }
    >
      <h1
        className={[
          'article-display-font',
          'max-w-[19ch]',
          'font-normal',
          'leading-[1.08]',
          'tracking-[-0.02em]',
          '[text-wrap:balance]',
          onOverlay
            ? 'text-white'
            : 'text-foreground',
          compact
            ? 'text-[1.5rem] leading-[1.12]'
            : 'text-[2rem] sm:text-[2.4rem] lg:text-[2.9rem]',
        ].join(' ')}
      >
        {data.title}
      </h1>

      <p
        className={[
          'article-reading-font',
          'max-w-[46ch]',
          onOverlay
            ? 'text-white/90'
            : '',
          compact
            ? onOverlay
              ? 'text-[0.9rem] leading-relaxed'
              : 'text-[0.9rem] leading-relaxed text-muted-foreground'
            : onOverlay
              ? 'text-[1.0625rem] leading-[1.75] sm:text-[1.125rem]'
              : 'text-[1.0625rem] leading-[1.75] text-foreground/90 sm:text-[1.125rem]',
        ].join(' ')}
      >
        {data.intro}
      </p>

      <div className="pt-1">
        <ExploreAction
          targetId={targetId}
          onOverlay={onOverlay}
        />
      </div>


      <ToolsLine
        tools={data.tools}
        compact={compact}
        onOverlay={onOverlay}
      />
    </div>
  );
}

export default function ProjectIntro({
  mode = 'image-left',
  data,
  targetId,
  compact = false,
}: ProjectIntroProps) {
  if (mode === 'overlay') {
    return (
      <section className="relative w-full overflow-hidden">
        <img
          src={data.image}
          alt={data.imageAlt}
          width={1600}
          height={1000}
          className={[
            'w-full',
            'object-cover',
            compact
              ? 'h-[300px]'
              : 'h-[420px] md:h-[540px] lg:h-[600px]',
          ].join(' ')}
        />

        <div
          className={[
            'absolute',
            'inset-0',
            'bg-gradient-to-t',
            'from-black/90',
            'via-black/55',
            'to-black/10',
            'md:bg-gradient-to-r',
            'md:from-black/88',
            'md:via-black/58',
            'md:to-black/5',
          ].join(' ')}
        />

        <div className="absolute inset-0 flex items-end md:items-center">
          <div className="w-full px-6 pb-8 md:px-10 md:pb-0 xl:px-16">
            <div
              className={[
                'max-w-xl',
                'text-white',
                compact
                  ? ''
                  : 'py-8',
              ].join(' ')}
            >
              <MetadataLine
                meta={data.meta}
                className="mb-5 !text-white/80"
              />

              <EditorialColumn
                data={data}
                targetId={targetId}
                compact={compact}
                onOverlay
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (mode === 'wide') {
    return (
      <section className="w-full">
        <img
          src={data.image}
          alt={data.imageAlt}
          width={1920}
          height={900}
          className={[
            'block',
            'h-[130px]',
            'w-full',
            'object-cover',
            'sm:h-[140px]',
            'md:h-[150px]',
            'lg:h-[165px]',
          ].join(' ')}
        />


        <div
          className={[
            'px-6',
            'md:px-10',
            'xl:px-16',
            compact
              ? 'mt-4'
              : 'mt-4',
          ].join(' ')}
        >
          <div className="mx-auto w-full max-w-[44rem] text-left">
            <MetadataLine
              meta={data.meta}
              className="mb-3"
            />

            <EditorialColumn
              data={data}
              targetId={targetId}
              compact={compact}
              wideCompact
            />
          </div>
        </div>
      </section>
    );
  }


  const imageFirst =
    mode === 'image-left';

  return (
    <section className="min-h-[calc(100svh-5rem)] px-6 pb-10 md:px-10 md:pb-12 xl:px-16">
      <MetadataLine
        meta={data.meta}
        className={
          compact
            ? 'mb-4'
            : 'mb-4 md:mb-6'
        }
      />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] md:gap-6 lg:gap-8">
        <div
          className={
            imageFirst
              ? 'md:order-1'
              : 'md:order-2'
          }
        >
          <img
            src={data.image}
            alt={data.imageAlt}
            width={1280}
            height={1024}
            className={[
              'block',
              'h-[300px]',
              'w-full',
              'object-cover',
              'sm:h-[360px]',
              'md:h-[420px]',
              'lg:h-[480px]',
            ].join(' ')}
          />
        </div>

        <div
          className={[
            'flex',
            'items-center',
            imageFirst
              ? 'md:order-2 md:pl-10 lg:pl-14'
              : 'md:order-1 md:pr-10 lg:pr-14',
          ].join(' ')}
        >
          <EditorialColumn
            data={data}
            targetId={targetId}
            compact={compact}
          />
        </div>
      </div>
    </section>
  );
}

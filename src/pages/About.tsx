import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
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
} from 'lucide-react';

import {
  aboutData,
} from '@/about/aboutData';

import type {
  Recommendation,
} from '@/about/types';


const WORDS_PER_MINUTE =
  225;

const MIN_RECOMMENDATION_DURATION =
  10000;

const MAX_RECOMMENDATION_DURATION =
  28000;


function escapeRegExp(
  value: string,
): string {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&',
  );
}


function getReadingDuration(
  recommendation: Recommendation,
): number {
  const wordCount =
    recommendation.recommendation
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .length;

  const estimatedDuration =
    (
      wordCount /
      WORDS_PER_MINUTE
    ) *
    60 *
    1000;

  return Math.min(
    MAX_RECOMMENDATION_DURATION,
    Math.max(
      MIN_RECOMMENDATION_DURATION,
      estimatedDuration,
    ),
  );
}


function RichText({
  text,
  boldPhrases,
  italicPhrases,
}: {
  text: string;
  boldPhrases: string[];
  italicPhrases: string[];
}) {
  const phrases =
    useMemo(
      () =>
        [
          ...boldPhrases.map(
            (
              phrase,
            ) => ({
              phrase,
              type:
                'bold' as const,
            }),
          ),

          ...italicPhrases.map(
            (
              phrase,
            ) => ({
              phrase,
              type:
                'italic' as const,
            }),
          ),
        ]
          .filter(
            (
              item,
            ) =>
              item.phrase.length >
              0,
          )
          .sort(
            (
              a,
              b,
            ) =>
              b.phrase.length -
              a.phrase.length,
          ),
      [
        boldPhrases,
        italicPhrases,
      ],
    );

  if (
    phrases.length ===
    0
  ) {
    return <>{text}</>;
  }

  const matcher =
    new RegExp(
      `(${phrases
        .map(
          (
            item,
          ) =>
            escapeRegExp(
              item.phrase,
            ),
        )
        .join('|')})`,
      'gi',
    );

  const boldSet =
    new Set(
      boldPhrases.map(
        (
          phrase,
        ) =>
          phrase.toLowerCase(),
      ),
    );

  const italicSet =
    new Set(
      italicPhrases.map(
        (
          phrase,
        ) =>
          phrase.toLowerCase(),
      ),
    );

  return (
    <>
      {text
        .split(
          matcher,
        )
        .map(
          (
            part,
            index,
          ) => {
            const normalized =
              part.toLowerCase();

            if (
              boldSet.has(
                normalized,
              )
            ) {
              return (
                <strong
                  key={`${index}-${part}`}
                  className="font-semibold text-foreground"
                >
                  {part}
                </strong>
              );
            }

            if (
              italicSet.has(
                normalized,
              )
            ) {
              return (
                <em
                  key={`${index}-${part}`}
                  className="font-medium italic text-foreground"
                >
                  {part}
                </em>
              );
            }

            return (
              <Fragment
                key={`${index}-${part}`}
              >
                {part}
              </Fragment>
            );
          },
        )}
    </>
  );
}


function getRecommendationParagraphs(
  recommendation: string,
): string[] {
  const sentences =
    recommendation
      .match(
        /[^.!?]+[.!?]+|[^.!?]+$/g,
      )
      ?.map(
        (
          sentence,
        ) =>
          sentence.trim(),
      )
      .filter(Boolean) ??
    [
      recommendation,
    ];

  if (
    sentences.length <=
    2
  ) {
    return sentences;
  }

  const paragraphs:
    string[] =
    [];

  for (
    let index = 0;
    index <
    sentences.length;
    index += 2
  ) {
    paragraphs.push(
      sentences
        .slice(
          index,
          index + 2,
        )
        .join(' '),
    );
  }

  return paragraphs;
}


function HighlightedRecommendation({
  recommendation,
  text,
}: {
  recommendation: Recommendation;
  text?: string;
}) {
  const renderedText =
    text ??
    recommendation.recommendation;

  const phrases =
    useMemo(
      () =>
        [...recommendation.emphasis]
          .filter(Boolean)
          .sort(
            (
              a,
              b,
            ) =>
              b.length -
              a.length,
          ),
      [
        recommendation.emphasis,
      ],
    );

  if (
    phrases.length ===
    0
  ) {
    return (
      <>
        {
          renderedText
        }
      </>
    );
  }

  const matcher =
    new RegExp(
      `(${phrases
        .map(
          escapeRegExp,
        )
        .join('|')})`,
      'gi',
    );

  const phraseSet =
    new Set(
      phrases.map(
        (
          phrase,
        ) =>
          phrase.toLowerCase(),
      ),
    );

  return (
    <>
      {renderedText
        .split(
          matcher,
        )
        .map(
          (
            part,
            index,
          ) => (
            <Fragment
              key={`${index}-${part}`}
            >
              {phraseSet.has(
                part.toLowerCase(),
              ) ? (
                <strong className="font-semibold text-foreground">
                  {part}
                </strong>
              ) : (
                part
              )}
            </Fragment>
          ),
        )}
    </>
  );
}


function PrincipleDiagram() {
  const principleMap =
    Object.fromEntries(
      aboutData.principles.map(
        (
          principle,
        ) => [
          principle.id,
          principle,
        ],
      ),
    );

  const geography =
    principleMap.geography;

  const data =
    principleMap.data;

  const technology =
    principleMap.technology;

  const impact =
    principleMap.impact;

  if (
    !geography ||
    !data ||
    !technology ||
    !impact
  ) {
    return null;
  }

  return (
    <div
      aria-label="Geography, data, technology, and impact in my work"
      className="mx-auto w-full max-w-[31rem]"
    >
      <div className="grid min-h-[27rem] grid-cols-[1fr_2.5rem_auto_2.5rem_1fr] grid-rows-[1fr_2.5rem_auto_2.5rem_1fr] items-center">
        <div className="col-start-3 row-start-1 self-end pb-3 text-center">
          <p className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-foreground">
            {geography.label}
          </p>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {
              geography.description
            }
          </p>
        </div>

        <div
          aria-hidden="true"
          className="col-start-3 row-start-2 mx-auto h-full w-px bg-border"
        />

        <div className="col-start-1 row-start-3 pr-3 text-right">
          <p className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-foreground">
            {data.label}
          </p>

          <p className="ml-auto mt-2 max-w-[9.5rem] text-sm leading-6 text-muted-foreground">
            {
              data.description
            }
          </p>
        </div>

        <div
          aria-hidden="true"
          className="col-start-2 row-start-3 h-px w-full bg-border"
        />

        <div className="relative col-start-3 row-start-3 flex h-36 w-36 items-center justify-center rounded-full border border-accent/45 bg-background sm:h-40 sm:w-40">
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-[-5px] h-2.5 w-px -translate-x-1/2 bg-accent/55"
          />

          <span
            aria-hidden="true"
            className="absolute bottom-[-5px] left-1/2 h-2.5 w-px -translate-x-1/2 bg-accent/55"
          />

          <span
            aria-hidden="true"
            className="absolute left-[-5px] top-1/2 h-px w-2.5 -translate-y-1/2 bg-accent/55"
          />

          <span
            aria-hidden="true"
            className="absolute right-[-5px] top-1/2 h-px w-2.5 -translate-y-1/2 bg-accent/55"
          />

          <span
            aria-hidden="true"
            className="absolute left-[20%] top-[10%] h-1.5 w-px rotate-[-28deg] bg-border"
          />

          <span
            aria-hidden="true"
            className="absolute right-[20%] top-[10%] h-1.5 w-px rotate-[28deg] bg-border"
          />

          <span
            aria-hidden="true"
            className="absolute bottom-[10%] left-[20%] h-1.5 w-px rotate-[28deg] bg-border"
          />

          <span
            aria-hidden="true"
            className="absolute bottom-[10%] right-[20%] h-1.5 w-px rotate-[-28deg] bg-border"
          />

          <div
            aria-hidden="true"
            className="absolute left-1/2 top-3 h-[calc(100%-1.5rem)] w-px -translate-x-1/2 bg-border/30"
          />

          <div
            aria-hidden="true"
            className="absolute left-3 top-1/2 h-px w-[calc(100%-1.5rem)] -translate-y-1/2 bg-border/30"
          />

          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/35"
          />

          <div className="relative z-10 rounded-full bg-background/92 px-4 py-3 text-center backdrop-blur-[1px]">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.19em] text-accent">
              Moses
            </p>

            <p className="font-mono text-xs font-semibold uppercase tracking-[0.19em] text-accent">
              Thiong&apos;o
            </p>

            <p className="mx-auto mt-2 max-w-[6.6rem] text-[0.7rem] leading-5 text-muted-foreground">
              At the intersection
              of place and data
            </p>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="col-start-4 row-start-3 h-px w-full bg-border"
        />

        <div className="col-start-5 row-start-3 pl-3 text-left">
          <p className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-foreground">
            {
              technology.label
            }
          </p>

          <p className="mt-2 max-w-[10.5rem] text-sm leading-6 text-muted-foreground">
            {
              technology.description
            }
          </p>
        </div>

        <div
          aria-hidden="true"
          className="col-start-3 row-start-4 mx-auto h-full w-px bg-border"
        />

        <div className="col-start-3 row-start-5 self-start pt-3 text-center">
          <p className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-foreground">
            {impact.label}
          </p>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {
              impact.description
            }
          </p>
        </div>
      </div>
    </div>
  );
}


function RecommendationCarousel() {
  const prefersReducedMotion =
    useReducedMotion();

  const recommendations =
    aboutData.recommendations;

  const [
    activeIndex,
    setActiveIndex,
  ] =
    useState(0);

  const [
    direction,
    setDirection,
  ] =
    useState<
      1 | -1
    >(1);

  const [
    isPaused,
    setIsPaused,
  ] =
    useState(false);

  const [
    touchPause,
    setTouchPause,
  ] =
    useState(false);

  const activeRecommendation =
    recommendations[
      activeIndex
    ];

  const readingDuration =
    useMemo(
      () =>
        activeRecommendation
          ? getReadingDuration(
              activeRecommendation,
            )
          : MIN_RECOMMENDATION_DURATION,
      [
        activeRecommendation,
      ],
    );

  const goToRecommendation =
    useCallback(
      (
        index: number,
        nextDirection:
          | 1
          | -1,
      ) => {
        if (
          recommendations.length ===
          0
        ) {
          return;
        }

        const normalizedIndex =
          (
            index +
            recommendations.length
          ) %
          recommendations.length;

        setDirection(
          nextDirection,
        );

        setActiveIndex(
          normalizedIndex,
        );
      },
      [
        recommendations.length,
      ],
    );

  const goNext =
    useCallback(
      () => {
        goToRecommendation(
          activeIndex + 1,
          1,
        );
      },
      [
        activeIndex,
        goToRecommendation,
      ],
    );

  const goPrevious =
    useCallback(
      () => {
        goToRecommendation(
          activeIndex - 1,
          -1,
        );
      },
      [
        activeIndex,
        goToRecommendation,
      ],
    );

  useEffect(
    () => {
      if (
        recommendations.length <=
          1 ||
        isPaused ||
        touchPause ||
        prefersReducedMotion
      ) {
        return undefined;
      }

      const timeout =
        window.setTimeout(
          () => {
            goNext();
          },
          readingDuration,
        );

      return () => {
        window.clearTimeout(
          timeout,
        );
      };
    },
    [
      goNext,
      isPaused,
      prefersReducedMotion,
      readingDuration,
      recommendations.length,
      touchPause,
    ],
  );

  useEffect(
    () => {
      const handleVisibilityChange =
        () => {
          setIsPaused(
            document.hidden,
          );
        };

      document.addEventListener(
        'visibilitychange',
        handleVisibilityChange,
      );

      return () => {
        document.removeEventListener(
          'visibilitychange',
          handleVisibilityChange,
        );
      };
    },
    [],
  );

  if (
    recommendations.length ===
      0 ||
    !activeRecommendation
  ) {
    return null;
  }

  return (
    <section
      className="pb-5 pt-5 sm:pb-6 sm:pt-6"
      onMouseEnter={() => {
        setIsPaused(
          true,
        );
      }}
      onMouseLeave={() => {
        setIsPaused(
          false,
        );
      }}
      onFocusCapture={() => {
        setIsPaused(
          true,
        );
      }}
      onBlurCapture={(
        event,
      ) => {
        if (
          !event.currentTarget.contains(
            event.relatedTarget,
          )
        ) {
          setIsPaused(
            false,
          );
        }
      }}
      onTouchStart={() => {
        setTouchPause(
          true,
        );
      }}
      onTouchEnd={() => {
        window.setTimeout(
          () => {
            setTouchPause(
              false,
            );
          },
          3000,
        );
      }}
      onTouchCancel={() => {
        setTouchPause(
          false,
        );
      }}
    >
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        What others say
      </p>

      <div className="relative mt-5 min-h-[24rem] sm:min-h-[21rem]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 font-serif text-[8rem] leading-[0.8] text-accent/18 sm:left-6 sm:text-[10rem]"
        >
          “
        </div>

        <button
          type="button"
          onClick={
            goPrevious
          }
          aria-label="Previous recommendation"
          className={[
            'absolute',
            'left-0',
            'top-1/2',
            'z-20',
            'flex',
            'h-10',
            'w-10',
            '-translate-y-1/2',
            'items-center',
            'justify-center',
            'text-muted-foreground/55',
            'transition-colors',
            'hover:text-accent',
            'focus-visible:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-ring',
          ].join(' ')}
        >
          <ChevronLeft
            className="h-6 w-6"
            aria-hidden="true"
          />
        </button>

        <button
          type="button"
          onClick={
            goNext
          }
          aria-label="Next recommendation"
          className={[
            'absolute',
            'right-0',
            'top-1/2',
            'z-20',
            'flex',
            'h-10',
            'w-10',
            '-translate-y-1/2',
            'items-center',
            'justify-center',
            'text-muted-foreground/55',
            'transition-colors',
            'hover:text-accent',
            'focus-visible:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-ring',
          ].join(' ')}
        >
          <ChevronRight
            className="h-6 w-6"
            aria-hidden="true"
          />
        </button>

        <div className="mx-auto flex min-h-[20rem] max-w-4xl items-center px-10 sm:min-h-[18rem] sm:px-16">
          <AnimatePresence
            mode="wait"
            initial={false}
            custom={
              direction
            }
          >
            <motion.figure
              key={
                activeRecommendation.id
              }
              custom={
                direction
              }
              initial={
                prefersReducedMotion
                  ? {
                      opacity:
                        0,
                    }
                  : {
                      opacity:
                        0,
                      x:
                        direction >
                        0
                          ? 8
                          : -8,
                    }
              }
              animate={{
                opacity:
                  1,
                x:
                  0,
              }}
              exit={
                prefersReducedMotion
                  ? {
                      opacity:
                        0,
                    }
                  : {
                      opacity:
                        0,
                      x:
                        direction >
                        0
                          ? -8
                          : 8,
                    }
              }
              transition={{
                duration:
                  prefersReducedMotion
                    ? 0
                    : 0.24,
                ease:
                  'easeOut',
              }}
              className="w-full"
            >
              <blockquote className="text-[0.9375rem] leading-[1.7] text-foreground sm:text-base sm:leading-[1.7]">
                <div className="space-y-3">
                  {getRecommendationParagraphs(
                    activeRecommendation.recommendation,
                  ).map(
                    (
                      paragraph,
                      index,
                    ) => (
                      <p
                        key={`${activeRecommendation.id}-${index}`}
                      >
                        <HighlightedRecommendation
                          recommendation={
                            activeRecommendation
                          }
                          text={
                            paragraph
                          }
                        />
                      </p>
                    ),
                  )}
                </div>
              </blockquote>

              <figcaption className="mt-5">
                <p className="text-base font-semibold text-accent">
                  {
                    activeRecommendation.name
                  }
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {
                    activeRecommendation.role
                  }
                </p>

                <p className="mt-1 text-xs italic text-muted-foreground/75">
                  {
                    activeRecommendation.relationship
                  }
                </p>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mt-3 flex items-center justify-center gap-2.5">
          {recommendations.map(
            (
              recommendation,
              index,
            ) => (
              <button
                key={
                  recommendation.id
                }
                type="button"
                onClick={() => {
                  goToRecommendation(
                    index,
                    index >=
                      activeIndex
                      ? 1
                      : -1,
                  );
                }}
                aria-label={`Show recommendation ${index + 1} of ${recommendations.length}`}
                aria-current={
                  activeIndex ===
                  index
                    ? 'true'
                    : undefined
                }
                className={[
                  'h-2',
                  'w-2',
                  'rounded-full',
                  'transition-[background-color,transform]',
                  activeIndex ===
                  index
                    ? 'scale-110 bg-accent'
                    : 'bg-border hover:bg-muted-foreground/50',
                ].join(' ')}
              />
            ),
          )}
        </div>
      </div>
    </section>
  );
}


export default function About() {
  const {
    eyebrow,
    headline,
    introduction,
    introductionBold,
    introductionItalic,
    values,
  } =
    aboutData;

  return (
    <main className="w-full">
      <div className="mx-auto max-w-6xl px-4 pb-12 pt-12 sm:px-6 sm:pb-14 sm:pt-14 lg:px-8 lg:pb-16 lg:pt-16">
        <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <header>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              {eyebrow}
            </p>

            <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
              {headline}
            </h1>

            <div className="mt-7 max-w-2xl space-y-5">
              {introduction.map(
                (
                  paragraph,
                  index,
                ) => (
                  <p
                    key={
                      index
                    }
                    className="text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8"
                  >
                    <RichText
                      text={
                        paragraph
                      }
                      boldPhrases={
                        introductionBold
                      }
                      italicPhrases={
                        introductionItalic
                      }
                    />
                  </p>
                ),
              )}
            </div>
          </header>

          <div className="lg:pl-2">
            <PrincipleDiagram />
          </div>
        </section>

        <section className="pb-9 pt-8 sm:pb-10 sm:pt-9">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            My values
          </p>

          <div className="mt-8 grid gap-10 md:grid-cols-3 md:gap-12">
            {values.map(
              (
                value,
              ) => (
                <article
                  key={
                    value.id
                  }
                >
                  <p className="font-serif text-5xl leading-none text-accent/20 sm:text-6xl">
                    {
                      value.number
                    }
                  </p>

                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                    {
                      value.title
                    }
                  </h2>

                  <p className="mt-4 text-sm font-semibold leading-6 text-foreground">
                    {
                      value.lead
                    }
                  </p>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {
                      value.description
                    }
                  </p>
                </article>
              ),
            )}
          </div>
        </section>

        <RecommendationCarousel />
      </div>
    </main>
  );
}

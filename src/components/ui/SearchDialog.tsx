import React, {
  useEffect,
  useMemo,
} from 'react';

import {
  BookOpen,
  FileText,
  FolderKanban,
  Layers3,
  Search,
  Wrench,
} from 'lucide-react';

import {
  useLocation,
} from 'wouter';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

import {
  contentRegistry,
} from '@/content/engine/registry';

import {
  getDiscoverableContent,
} from '@/content/engine/queries';

import type {
  ContentRecord,
} from '@/content/engine/types';

const pageItems = [
  {
    title: 'Home',
    path: '/',
    keywords: 'home start landing',
  },
  {
    title: 'About',
    path: '/about',
    keywords:
      'about Moses Thiongo profile background',
  },
  {
    title: 'Portfolio',
    path: '/portfolio',
    keywords:
      'portfolio projects work geospatial GeoAI data',
  },
  {
    title: 'Articles',
    path: '/articles',
    keywords:
      'articles writing publications technical',
  },
  {
    title: 'Blog',
    path: '/blog',
    keywords:
      'blog posts notes',
  },
  {
    title: 'CV',
    path: '/cv',
    keywords:
      'cv resume experience skills education',
  },
  {
    title: 'Media',
    path: '/media',
    keywords:
      'media videos tutorials youtube',
  },
  {
    title: 'Contact',
    path: '/contact',
    keywords:
      'contact get in touch message',
  },
];

type SearchDialogProps = {
  open: boolean;
  onOpenChange: (
    open: boolean,
  ) => void;
};

type SearchTriggerProps = {
  onClick: () => void;
};

function getContentPath(
  record: ContentRecord,
): string {
  switch (record.contentType) {
    case 'article':
      return `/articles/${record.slug}`;

    case 'blog':
      return '/blog';

    case 'project':
      return '/portfolio';

    case 'tool':
      return '/portfolio';

    case 'series':
      return '/articles';

    default:
      return '/';
  }
}

function getContentLabel(
  record: ContentRecord,
): string {
  switch (record.contentType) {
    case 'article':
      return 'Article';

    case 'blog':
      return 'Blog';

    case 'project':
      return 'Project';

    case 'tool':
      return 'Tool';

    case 'series':
      return 'Series';

    default:
      return 'Content';
  }
}

function getContentIcon(
  record: ContentRecord,
) {
  switch (record.contentType) {
    case 'article':
      return FileText;

    case 'blog':
      return BookOpen;

    case 'project':
      return FolderKanban;

    case 'tool':
      return Wrench;

    case 'series':
      return Layers3;

    default:
      return FileText;
  }
}

function getSearchValue(
  record: ContentRecord,
): string {
  return [
    record.title,
    record.description,
    record.contentType,
    ...record.tags,
    ...record.topicIds,
  ]
    .filter(Boolean)
    .join(' ');
}

export function SearchDialog({
  open,
  onOpenChange,
}: SearchDialogProps) {
  const [
    ,
    setLocation,
  ] = useLocation();

  const discoverableContent =
    useMemo(
      () =>
        getDiscoverableContent(
          contentRegistry,
        ),
      [],
    );

  const handleSelect = (
    path: string,
  ) => {
    onOpenChange(false);
    setLocation(path);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <CommandInput
        placeholder="Search the site..."
        aria-label="Search the site"
      />

      <CommandList className="max-h-[min(26rem,70vh)]">
        <CommandEmpty>
          <div className="px-6 py-8 text-center">
            <Search
              className="mx-auto h-5 w-5 text-muted-foreground/60"
              aria-hidden="true"
            />

            <p className="mt-3 text-sm font-medium text-foreground">
              No results found
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Try another title, topic, tool,
              or keyword.
            </p>
          </div>
        </CommandEmpty>

        <CommandGroup
          heading="Pages"
          className="py-1"
        >
          {pageItems.map(
            (item) => (
              <CommandItem
                key={item.path}
                value={[
                  item.title,
                  item.keywords,
                ].join(' ')}
                onSelect={
                  () =>
                    handleSelect(
                      item.path,
                    )
                }
                className={[
                  'my-0.5',
                  'rounded-md',
                  'border-l-2',
                  'border-l-transparent',
                  'px-3',
                  'py-2.5',
                  'data-[selected=true]:border-l-accent',
                  'data-[selected=true]:bg-accent/10',
                  'data-[selected=true]:text-foreground',
                ].join(' ')}
              >
                <Search
                  className="h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />

                <span className="font-medium">
                  {item.title}
                </span>
              </CommandItem>
            ),
          )}
        </CommandGroup>

        {discoverableContent.length >
          0 && (
          <CommandGroup
            heading="Published content"
            className="py-1"
          >
            {discoverableContent.map(
              (record) => {
                const Icon =
                  getContentIcon(
                    record,
                  );

                return (
                  <CommandItem
                    key={record.id}
                    value={
                      getSearchValue(
                        record,
                      )
                    }
                    onSelect={
                      () =>
                        handleSelect(
                          getContentPath(
                            record,
                          ),
                        )
                    }
                    className={[
                      'my-0.5',
                      'items-start',
                      'rounded-md',
                      'border-l-2',
                      'border-l-transparent',
                      'px-3',
                      'py-3',
                      'data-[selected=true]:border-l-accent',
                      'data-[selected=true]:bg-accent/10',
                      'data-[selected=true]:text-foreground',
                    ].join(' ')}
                  >
                    <Icon
                      className="mt-0.5 h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {record.title}
                      </span>

                      <span className="mt-1 block truncate text-xs text-muted-foreground">
                        {getContentLabel(
                          record,
                        )}
                        {' · '}
                        {record.description}
                      </span>
                    </span>
                  </CommandItem>
                );
              },
            )}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}

export function SearchTrigger({
  onClick,
}: SearchTriggerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Search the site"
      className={[
        'flex',
        'items-center',
        'gap-2',
        'rounded-md',
        'border',
        'border-border',
        'px-3',
        'py-1.5',
        'text-sm',
        'font-medium',
        'text-muted-foreground',
        'transition-colors',
        'duration-150',
        'hover:bg-muted/70',
        'hover:text-foreground',
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-ring',
        'focus-visible:ring-offset-2',
        'focus-visible:ring-offset-background',
      ].join(' ')}
    >
      <Search
        className="h-4 w-4"
        aria-hidden="true"
      />

      <span className="hidden sm:inline">
        Search
      </span>
    </button>
  );
}

export function useSearchShortcut(
  onOpen: () => void,
) {
  useEffect(
    () => {
      const handleKeyDown = (
        event: KeyboardEvent,
      ) => {
        if (
          event.key.toLowerCase() ===
            'k' &&
          (
            event.metaKey ||
            event.ctrlKey
          )
        ) {
          event.preventDefault();
          onOpen();
        }
      };

      document.addEventListener(
        'keydown',
        handleKeyDown,
      );

      return () => {
        document.removeEventListener(
          'keydown',
          handleKeyDown,
        );
      };
    },
    [
      onOpen,
    ],
  );
}
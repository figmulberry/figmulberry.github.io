import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const distDir = fileURLToPath(
  new URL('../dist/', import.meta.url),
);

const indexFile = path.join(
  distDir,
  'index.html',
);

const routes = [
  'about',
  'portfolio',
  'articles',
  'blog',
  'cv',
  'media',
  'contact',
];

for (const route of routes) {
  const routeDir = path.join(
    distDir,
    route,
  );

  await mkdir(
    routeDir,
    {
      recursive: true,
    },
  );

  await copyFile(
    indexFile,
    path.join(
      routeDir,
      'index.html',
    ),
  );
}

await copyFile(
  indexFile,
  path.join(
    distDir,
    '404.html',
  ),
);

await writeFile(
  path.join(
    distDir,
    '.nojekyll',
  ),
  '',
);

console.log(
  'Prepared static routes for GitHub Pages.',
);

import {
  copyFile,
  mkdir,
  readFile,
  readdir,
  writeFile,
} from 'node:fs/promises';

import path from 'node:path';

import {
  fileURLToPath,
} from 'node:url';

import ts from 'typescript';


const repositoryRoot =
  fileURLToPath(
    new URL(
      '../',
      import.meta.url,
    ),
  );


const distDir =
  path.join(
    repositoryRoot,
    'dist',
  );


const indexFile =
  path.join(
    distDir,
    'index.html',
  );


const projectsSourceDir =
  path.join(
    repositoryRoot,
    'src',
    'content',
    'projects',
  );


/*
 * =========================================================
 * STATIC TOP-LEVEL ROUTES
 * =========================================================
 */

const staticRoutes = [
  'about',
  'portfolio',
  'articles',
  'blog',
  'cv',
  'media',
  'contact',
];


/*
 * =========================================================
 * PROJECT SOURCE DISCOVERY
 * =========================================================
 *
 * postbuild.mjs runs directly in Node.
 *
 * Rather than importing Vite-oriented TypeScript modules
 * and their "@/..." aliases, inspect project.ts files using
 * the TypeScript parser already installed by this project.
 *
 * We only need routing metadata here:
 *
 * - slug
 * - aliases
 *
 * The application itself remains responsible for schema,
 * registry and publication validation.
 * =========================================================
 */


async function findProjectSourceFiles(
  directory,
) {
  const entries =
    await readdir(
      directory,
      {
        withFileTypes:
          true,
      },
    );


  const files =
    [];


  for (
    const entry of entries
  ) {
    const absolutePath =
      path.join(
        directory,
        entry.name,
      );


    if (
      entry.isDirectory()
    ) {
      if (
        entry.name ===
          '__portfolio-tests' ||
        entry.name ===
          '__templates'
      ) {
        continue;
      }


      files.push(
        ...await findProjectSourceFiles(
          absolutePath,
        ),
      );

      continue;
    }


    if (
      entry.isFile() &&
      entry.name ===
        'project.ts'
    ) {
      files.push(
        absolutePath,
      );
    }
  }


  return files;
}


function propertyNameText(
  property,
) {
  if (
    ts.isIdentifier(
      property,
    ) ||
    ts.isStringLiteral(
      property,
    )
  ) {
    return property.text;
  }


  return null;
}


function findProperty(
  objectLiteral,
  propertyName,
) {
  return objectLiteral.properties.find(
    (
      property,
    ) =>
      ts.isPropertyAssignment(
        property,
      ) &&
      propertyNameText(
        property.name,
      ) ===
        propertyName,
  );
}


function readStringProperty(
  objectLiteral,
  propertyName,
  sourceFile,
) {
  const property =
    findProperty(
      objectLiteral,
      propertyName,
    );


  if (
    !property ||
    !ts.isPropertyAssignment(
      property,
    )
  ) {
    return null;
  }


  if (
    ts.isStringLiteralLike(
      property.initializer,
    )
  ) {
    return property.initializer.text;
  }


  throw new Error(
    [
      `Static route generation could not read "${propertyName}"`,
      `from ${sourceFile.fileName}.`,
      'Use a direct string literal for project routing metadata.',
    ].join(
      ' ',
    ),
  );
}


function readStringArrayProperty(
  objectLiteral,
  propertyName,
  sourceFile,
) {
  const property =
    findProperty(
      objectLiteral,
      propertyName,
    );


  if (
    !property ||
    !ts.isPropertyAssignment(
      property,
    )
  ) {
    return [];
  }


  if (
    !ts.isArrayLiteralExpression(
      property.initializer,
    )
  ) {
    throw new Error(
      [
        `Static route generation could not read "${propertyName}"`,
        `from ${sourceFile.fileName}.`,
        'Use an array of direct string literals.',
      ].join(
        ' ',
      ),
    );
  }


  return property.initializer.elements.map(
    (
      element,
    ) => {
      if (
        !ts.isStringLiteralLike(
          element,
        )
      ) {
        throw new Error(
          [
            `Static route generation found a non-literal`,
            `"${propertyName}" entry in ${sourceFile.fileName}.`,
          ].join(
            ' ',
          ),
        );
      }


      return element.text;
    },
  );
}


function unwrapExpression(
  expression,
) {
  let current =
    expression;


  while (
    true
  ) {
    if (
      ts.isSatisfiesExpression(
        current,
      ) ||
      ts.isAsExpression(
        current,
      ) ||
      ts.isTypeAssertionExpression(
        current,
      ) ||
      ts.isParenthesizedExpression(
        current,
      )
    ) {
      current =
        current.expression;

      continue;
    }


    return current;
  }
}


function findProjectObjectLiteral(
  sourceFile,
) {
  let result =
    null;


  const visit =
    (
      node,
    ) => {
      if (
        result
      ) {
        return;
      }


      if (
        ts.isVariableDeclaration(
          node,
        ) &&
        node.initializer
      ) {
        const initializer =
          unwrapExpression(
            node.initializer,
          );


        if (
          ts.isObjectLiteralExpression(
            initializer,
          )
        ) {
          const contentType =
            readStringProperty(
              initializer,
              'contentType',
              sourceFile,
            );


          if (
            contentType ===
              'project'
          ) {
            result =
              initializer;

            return;
          }
        }
      }


      ts.forEachChild(
        node,
        visit,
      );
    };


  visit(
    sourceFile,
  );


  return result;
}


async function readProjectRoutes() {
  const sourceFiles =
    await findProjectSourceFiles(
      projectsSourceDir,
    );


  const routes =
    [];


  for (
    const filePath of sourceFiles
  ) {
    const sourceText =
      await readFile(
        filePath,
        'utf8',
      );


    const sourceFile =
      ts.createSourceFile(
        filePath,
        sourceText,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TS,
      );


    const projectObject =
      findProjectObjectLiteral(
        sourceFile,
      );


    if (
      !projectObject
    ) {
      throw new Error(
        `Could not find a project content object in ${filePath}.`,
      );
    }


    const slug =
      readStringProperty(
        projectObject,
        'slug',
        sourceFile,
      );


    if (
      !slug
    ) {
      throw new Error(
        `Project source is missing a literal slug: ${filePath}`,
      );
    }


    const aliases =
      readStringArrayProperty(
        projectObject,
        'aliases',
        sourceFile,
      );


    routes.push({
      slug,
      aliases,
      filePath,
    });
  }


  return routes;
}


/*
 * =========================================================
 * ROUTE WRITER
 * =========================================================
 */


async function prepareStaticRoute(
  route,
) {
  const routeDir =
    path.join(
      distDir,
      ...route.split(
        '/',
      ),
    );


  await mkdir(
    routeDir,
    {
      recursive:
        true,
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


/*
 * =========================================================
 * BUILD ROUTES
 * =========================================================
 */


for (
  const route of staticRoutes
) {
  await prepareStaticRoute(
    route,
  );
}


const projects =
  await readProjectRoutes();


const seenProjectRoutes =
  new Map();


for (
  const project of projects
) {
  const routeNames = [
    project.slug,
    ...project.aliases,
  ];


  for (
    const routeName of routeNames
  ) {
    const existing =
      seenProjectRoutes.get(
        routeName,
      );


    if (
      existing
    ) {
      throw new Error(
        [
          `Duplicate static project route "${routeName}".`,
          `First: ${existing}`,
          `Second: ${project.filePath}`,
        ].join(
          '\n',
        ),
      );
    }


    seenProjectRoutes.set(
      routeName,
      project.filePath,
    );


    await prepareStaticRoute(
      `portfolio/${routeName}`,
    );
  }
}


/*
 * =========================================================
 * GITHUB PAGES FALLBACK
 * =========================================================
 */


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


/*
 * =========================================================
 * REPORT
 * =========================================================
 */


console.log(
  'Prepared static routes for GitHub Pages.',
);


console.log(
  `Prepared ${projects.length} project source record(s).`,
);


for (
  const project of projects
) {
  console.log(
    `  /portfolio/${project.slug}/`,
  );


  for (
    const alias of project.aliases
  ) {
    console.log(
      `  /portfolio/${alias}/ (alias)`,
    );
  }
}

import React from 'react';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import {
  Route,
  Router as WouterRouter,
  Switch,
} from 'wouter';

import {
  Layout,
} from '@/components/layout/Layout';

import {
  ScrollToTop,
} from '@/components/navigation/ScrollToTop';

import {
  ThemeProvider,
} from '@/components/ui/ThemeProvider';

import {
  Toaster,
} from '@/components/ui/toaster';

import {
  TooltipProvider,
} from '@/components/ui/tooltip';

import About from '@/pages/About';
import Articles from '@/pages/Articles';
import Blog from '@/pages/Blog';
import Contact from '@/pages/Contact';
import CV from '@/pages/CV';
import Home from '@/pages/Home';
import Media from '@/pages/Media';
import NotFound from '@/pages/NotFound';
import Portfolio from '@/pages/Portfolio';

import ArticlePage from
  '@/pages/articles/ArticlePage';

import ArticlePreview from
  '@/pages/articles/ArticlePreview';

import BlogDetailPage from
  '@/pages/blogs/BlogDetailPage';

import ProjectPage from
  '@/pages/projects/ProjectPage';


const queryClient =
  new QueryClient();


function Router() {
  return (
    <>
      <ScrollToTop />

      <Layout>
        <Switch>
          <Route
            path="/"
            component={Home}
          />

          <Route
            path="/about"
            component={About}
          />

          <Route
            path="/portfolio/:slug"
            component={ProjectPage}
          />

          <Route
            path="/portfolio"
            component={Portfolio}
          />

          <Route
            path="/articles/:slug"
            component={ArticlePage}
          />

          <Route
            path="/articles"
            component={Articles}
          />

          <Route
            path="/preview/articles/:slug"
            component={ArticlePreview}
          />

          <Route
            path="/blog/:slug"
            component={BlogDetailPage}
          />

          <Route
            path="/blog"
            component={Blog}
          />

          <Route
            path="/cv"
            component={CV}
          />

          <Route
            path="/media"
            component={Media}
          />

          <Route
            path="/contact"
            component={Contact}
          />

          <Route
            component={NotFound}
          />
        </Switch>
      </Layout>
    </>
  );
}


function App() {
  return (
    <QueryClientProvider
      client={queryClient}
    >
      <ThemeProvider>
        <TooltipProvider>
          <WouterRouter>
            <Router />
          </WouterRouter>

          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}


export default App;
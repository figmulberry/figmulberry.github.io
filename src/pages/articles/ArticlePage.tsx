import React from 'react';

import {
  useParams,
} from 'wouter';

import ArticleDetailPage from
  './ArticleDetailPage';

type ArticlePageParams = {
  slug?: string;
};

export default function ArticlePage() {
  const params =
    useParams<ArticlePageParams>();

  return (
    <ArticleDetailPage
      slug={params.slug ?? ''}
    />
  );
}

import React from 'react';
import { useParams } from 'wouter';

import ArticleDetailPage from './ArticleDetailPage';

type ArticlePreviewParams = {
  slug?: string;
};

export default function ArticlePreview() {
  const params =
    useParams<ArticlePreviewParams>();

  return (
    <ArticleDetailPage
      slug={params.slug ?? ''}
      allowDraft
    />
  );
}
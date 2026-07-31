import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Clock, Tag } from 'lucide-react';
import { articles } from '@/data/content';

const categories = ['All', ...Array.from(new Set(articles.map((a) => a.category)))];

export default function Articles() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredArticles =
    selectedCategory === 'All'
      ? articles
      : articles.filter((a) => a.category === selectedCategory);

  return (
    <div className="w-full py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Articles</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Technical guides, tutorials, and deep dives on geospatial analysis, GeoAI, and data workflows
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedCategory === cat
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-muted hover:bg-muted/80 text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles List */}
        <div className="max-w-4xl mx-auto space-y-6">
          {filteredArticles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all hover:border-accent/50"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{article.date}</span>
                  <span>·</span>
                  <Clock className="h-3 w-3" />
                  <span>{article.readingTime}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium bg-accent/10 text-accent rounded w-fit">
                  <Tag className="h-3 w-3" />
                  {article.category}
                </div>
              </div>
              <h2 className="text-2xl font-semibold mb-3 hover:text-accent transition-colors">
                <Link href={`/articles/${article.slug}`}>{article.title}</Link>
              </h2>
              <p className="text-muted-foreground mb-4">{article.excerpt}</p>
              <Link
                href={`/articles/${article.slug}`}
                className="inline-flex items-center text-sm font-medium text-accent hover:underline"
              >
                Read Article →
              </Link>
            </motion.article>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No articles found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

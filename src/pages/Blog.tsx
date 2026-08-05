import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Clock, Tag } from 'lucide-react';
import { blogPosts } from '@/data/content';

export default function Blog() {
  return (
    <div className="w-full py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Updates, reflections, and shorter posts on geospatial work and community building
          </p>
        </motion.div>

        {/* Blog Posts */}
        <div className="grid gap-5 md:grid-cols-2">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all hover:border-accent/50"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{post.date}</span>
                  <span>·</span>
                  <Clock className="h-3 w-3" />
                  <span>{post.readingTime}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium bg-accent/10 text-accent rounded w-fit">
                  <Tag className="h-3 w-3" />
                  {post.category}
                </div>
              </div>
              <h2 className="text-2xl font-semibold mb-3 hover:text-accent transition-colors">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="text-muted-foreground mb-4">{post.excerpt}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center text-sm font-medium text-accent hover:underline"
              >
                Read Post →
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}

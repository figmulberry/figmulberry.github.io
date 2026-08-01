import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, Map, } from 'lucide-react';
import { SiQgis, SiPython, SiJupyter } from 'react-icons/si';
import { Button } from '@/components/ui/button';
import { portfolioProjects, articles } from '@/data/content';
import BuiltWith from '@/built-with/BuiltWith';
import Capabilities from '@/capabilities/Capabilities';

export default function Home() {
  
  const featuredProjects = portfolioProjects.slice(0, 3);
  const featuredArticles = articles.slice(0, 3);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full py-20 sm:py-28 lg:py-32 hero-gradient overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
              <Map className="h-8 w-8 text-accent" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Turning complex geospatial and data problems into clear, reproducible solutions
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
              Geospatial intelligence, data analytics, and AI-enabled technical workflows — from field data to decision-ready insights.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="gap-2">
                <Link href="/portfolio">
                  View Portfolio <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/articles">Read Articles</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Built With Section */}
      <BuiltWith />

      {/* Capabilities Section */}
      <Capabilities />

      {/* Portfolio Preview */}
      <section className="w-full py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Projects</h2>
            <Button asChild variant="ghost">
              <Link href="/portfolio">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <div
                key={project.id}
                className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all hover:border-accent/50"
              >
                <div className="h-48 bg-gradient-to-br from-accent/20 to-muted" />
                <div className="p-6">
                  <div className="inline-block px-2 py-1 text-xs font-medium bg-accent/10 text-accent rounded mb-3">
                    {project.category}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tools.map((tool) => (
                      <span key={tool} className="text-xs px-2 py-1 bg-muted rounded">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Preview */}
      <section className="w-full py-16 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Recent Articles</h2>
            <Button asChild variant="ghost">
              <Link href="/articles">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all hover:border-accent/50"
              >
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <span>{article.date}</span>
                  <span>·</span>
                  <span>{article.readingTime}</span>
                </div>
                <div className="inline-block px-2 py-1 text-xs font-medium bg-accent/10 text-accent rounded mb-3">
                  {article.category}
                </div>
                <h3 className="text-lg font-semibold mb-2 hover:text-accent transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{article.excerpt}</p>
                <Link href={`/articles/${article.slug}`} className="text-sm font-medium text-accent hover:underline">
                  Read Article →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="w-full py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-card border border-border rounded-lg p-8 sm:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">The Kalabash Mosaics</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              A community-driven media initiative creating tutorials, demonstrations, and open-learning resources
              for the geospatial intelligence community. Building bridges between technical workflows and accessible education.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/media">Watch Tutorials</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Explore My Work</h2>
            <p className="text-muted-foreground mb-8">
              Dive into my portfolio of geospatial projects, read technical articles, or review my professional background.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild variant="outline">
                <Link href="/portfolio">Portfolio</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/articles">Articles</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/cv">CV</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

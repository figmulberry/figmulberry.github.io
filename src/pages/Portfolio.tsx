import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { portfolioProjects } from '@/data/content';

const categories = [
  'All',
  'GIS & Geospatial Analysis',
  'GeoAI & Automation',
  'Data Analytics & Microsoft 365',
  'AI Training & Workflow Design',
];

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProjects =
    selectedCategory === 'All'
      ? portfolioProjects
      : portfolioProjects.filter((p) => p.category === selectedCategory);

  return (
    <div className="w-full py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Portfolio</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Selected projects across GIS, GeoAI, data analytics, and AI training workflows
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

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all hover:border-accent/50"
            >
              {/* Thumbnail */}
              <div className="h-48 bg-gradient-to-br from-accent/20 to-muted flex items-center justify-center">
                <span className="text-4xl font-bold text-accent/20">
                  {project.title.charAt(0)}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="inline-block px-2 py-1 text-xs font-medium bg-accent/10 text-accent rounded mb-3">
                  {project.category}
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Tools */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tools.map((tool) => (
                    <span key={tool} className="text-xs px-2 py-1 bg-muted rounded">
                      {tool}
                    </span>
                  ))}
                </div>

                {/* Date */}
                <div className="text-xs text-muted-foreground">
                  {new Date(project.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

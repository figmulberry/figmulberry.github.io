import React from 'react';
import { motion } from 'framer-motion';
import { Play, Calendar, Clock } from 'lucide-react';
import { mediaItems } from '@/data/content';

const typeColors: Record<string, string> = {
  Tutorial: 'bg-blue-500/10 text-blue-500',
  Presentation: 'bg-purple-500/10 text-purple-500',
  Demo: 'bg-green-500/10 text-green-500',
  Discussion: 'bg-orange-500/10 text-orange-500',
};

export default function Media() {
  return (
    <div className="w-full py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Media</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The Kalabash Mosaics — Tutorials, presentations, and demonstrations on GIS, GeoAI, and spatial data workflows
          </p>
        </motion.div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all hover:border-accent/50"
            >
              {/* Video Thumbnail */}
              <div className="relative h-48 bg-gradient-to-br from-accent/20 to-muted flex items-center justify-center">
                <Play className="h-12 w-12 text-accent/60 group-hover:text-accent transition-colors" />
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                  {item.duration}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs px-2 py-1 rounded font-medium ${typeColors[item.type]}`}>
                    {item.type}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{item.description}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{item.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{item.duration}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-card border border-border rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-3">Subscribe for Updates</h2>
          <p className="text-muted-foreground mb-6">
            New tutorials and content posted regularly on YouTube and community platforms
          </p>
          <a
            href="https://youtube.com/@thekalabash"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-md font-medium hover:bg-accent/90 transition-colors"
          >
            Visit YouTube Channel
          </a>
        </div>
      </div>
    </div>
  );
}

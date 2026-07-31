import React from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, Award, Code } from 'lucide-react';
import { skills } from '@/data/content';

const timeline = [
  { year: '2024-Present', title: 'Senior Geospatial Intelligence Analyst', org: 'Independent Consultant' },
  { year: '2022-2024', title: 'GIS & Data Analytics Specialist', org: 'Regional Development Authority' },
  { year: '2020-2022', title: 'Junior GIS Analyst', org: 'Environmental Consulting Firm' },
  { year: '2016-2020', title: 'BSc Geography & GIS', org: 'University of Nairobi' },
];

const values = [
  {
    icon: Code,
    title: 'Reproducibility',
    description: 'Every analysis should be repeatable, documented, and version-controlled.',
  },
  {
    icon: Award,
    title: 'Precision',
    description: 'Spatial data demands accuracy — from coordinate systems to final outputs.',
  },
  {
    icon: User,
    title: 'Accessibility',
    description: 'Complex workflows should be learnable, not gatekept by jargon or proprietary tools.',
  },
  {
    icon: Briefcase,
    title: 'Impact',
    description: 'Technical work serves real-world decisions — agriculture, urban planning, climate adaptation.',
  },
];

export default function About() {
  return (
    <div className="w-full py-16">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">About Moses Thiongo</h1>
          <p className="text-lg text-muted-foreground">
            Geospatial intelligence, data analytics, and AI-enabled technical workflows
          </p>
        </motion.div>

        {/* Portrait Placeholder */}
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent/20 to-muted mx-auto mb-12" />

        {/* Bio */}
        <div className="prose prose-lg dark:prose-invert mx-auto mb-16">
          <p className="text-lg leading-relaxed">
            Moses Thiongo is a geospatial intelligence and data analytics professional with expertise spanning GIS analysis, 
            GeoAI, remote sensing, and AI-enabled technical workflows. With a foundation in geography and GIS, Moses has spent 
            the past several years bridging the gap between spatial data and actionable insights across domains including 
            agriculture, urban planning, environmental monitoring, and infrastructure development.
          </p>
          <p className="text-lg leading-relaxed">
            Through <strong>The Kalabash Mosaics</strong>, Moses creates tutorials, demonstrations, and open-learning resources 
            for the geospatial community. His work emphasizes reproducible workflows, open-source tools like QGIS and Python, 
            and making advanced spatial analysis accessible to a wider audience.
          </p>
          <p className="text-lg leading-relaxed">
            Moses believes that geospatial intelligence should be precise, reproducible, and serve real-world impact — from field 
            data collection to decision-ready dashboards. His approach combines technical rigor with clear communication, ensuring 
            that complex analyses can be understood and replicated by stakeholders and fellow practitioners alike.
          </p>
        </div>

        {/* Skills Grid */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Core Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(skills).map(([category, skillList]) => (
              <div key={category} className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-3">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skillList.map((skill) => (
                    <span key={skill} className="text-sm px-3 py-1 bg-muted rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Professional Timeline</h2>
          <div className="space-y-6">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6 items-start"
              >
                <div className="w-24 flex-shrink-0 text-sm font-medium text-accent">
                  {item.year}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.org}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section>
          <h2 className="text-2xl font-bold mb-8">Values & Approach</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((value) => (
              <div key={value.title} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <value.icon className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

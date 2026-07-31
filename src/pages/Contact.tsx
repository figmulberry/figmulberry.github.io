import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Youtube } from 'lucide-react';

const contactMethods = [
  {
    icon: Github,
    label: 'GitHub',
    value: '@mosesthiongo',
    href: 'https://github.com/mosesthiongo',
    description: 'Open-source projects and code repositories',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'Moses Thiongo',
    href: 'https://linkedin.com/in/mosesthiongo',
    description: 'Professional network and updates',
  },
  {
    icon: Youtube,
    label: 'YouTube',
    value: '@thekalabash',
    href: 'https://youtube.com/@thekalabash',
    description: 'Tutorials and technical demonstrations',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@mosesthiongo.com',
    href: 'mailto:hello@mosesthiongo.com',
    description: 'Direct professional inquiries',
  },
];

export default function Contact() {
  return (
    <div className="w-full py-16">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Contact</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect for collaboration, consulting inquiries, or to discuss geospatial projects
          </p>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {contactMethods.map((method, index) => (
            <motion.a
              key={method.label}
              href={method.href}
              target={method.href.startsWith('http') ? '_blank' : undefined}
              rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all hover:border-accent/50"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <method.icon className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 group-hover:text-accent transition-colors">
                    {method.label}
                  </h3>
                  <p className="text-sm font-mono text-accent mb-2">{method.value}</p>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Additional Info */}
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold mb-3">Collaboration & Consulting</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Available for geospatial analysis projects, GeoAI consulting, training workshops, and technical content creation. 
            Particularly interested in projects involving QGIS, Python automation, remote sensing, and reproducible spatial workflows.
          </p>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { Download, Briefcase, GraduationCap, Award, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { skills } from '@/data/content';

const experience = [
  {
    title: 'Senior Geospatial Intelligence Analyst',
    organization: 'Independent Consultant',
    period: '2024 - Present',
    responsibilities: [
      'Lead GeoAI and spatial analysis projects for agricultural, environmental, and urban planning clients',
      'Design and implement automated geospatial workflows using PyQGIS and Python',
      'Develop Power BI dashboards integrating spatial data from ArcGIS and PostGIS sources',
      'Create training materials and conduct workshops on GIS, remote sensing, and GeoAI',
    ],
  },
  {
    title: 'GIS & Data Analytics Specialist',
    organization: 'Regional Development Authority',
    period: '2022 - 2024',
    responsibilities: [
      'Managed geospatial database infrastructure and automated reporting workflows',
      'Conducted land use change analysis using multi-temporal satellite imagery',
      'Built interactive dashboards for project monitoring and decision support',
      'Collaborated with field teams to ensure data quality and standardized workflows',
    ],
  },
  {
    title: 'Junior GIS Analyst',
    organization: 'Environmental Consulting Firm',
    period: '2020 - 2022',
    responsibilities: [
      'Performed spatial analysis for environmental impact assessments',
      'Created cartographic outputs and technical reports for client deliverables',
      'Supported field data collection campaigns using mobile GIS applications',
    ],
  },
];

const education = [
  {
    degree: 'BSc Geography & Geographic Information Systems',
    institution: 'University of Nairobi',
    period: '2016 - 2020',
    details: 'Focus on spatial analysis, remote sensing, and cartography',
  },
];

const certifications = [
  'ArcGIS Desktop Professional Certification',
  'Microsoft Certified: Power BI Data Analyst Associate',
  'Python for Data Science and Machine Learning (Coursera)',
  'Deep Learning Specialization (deeplearning.ai)',
];

const languages = [
  { name: 'English', level: 'Native' },
  { name: 'Swahili', level: 'Fluent' },
  { name: 'Kikuyu', level: 'Native' },
];

export default function CV() {
  return (
    <div className="w-full py-16">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Curriculum Vitae</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Moses Thiongo — Geospatial Intelligence & Data Analytics
          </p>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </motion.div>

        {/* Summary */}
        <section className="mb-12">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-accent" />
              Professional Summary
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Geospatial intelligence and data analytics professional with expertise in GIS analysis, GeoAI, remote sensing, 
              and business intelligence. Proven track record of designing automated workflows, building decision-support dashboards, 
              and translating complex spatial data into actionable insights. Skilled in QGIS, ArcGIS Pro, Python, Power BI, and 
              machine learning for geospatial applications. Passionate about open-source tools, reproducible workflows, and 
              community education through The Kalabash Mosaics media initiative.
            </p>
          </div>
        </section>

        {/* Experience */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Experience</h2>
          <div className="space-y-6">
            {experience.map((job, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-lg p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <p className="text-muted-foreground">{job.organization}</p>
                  </div>
                  <span className="text-sm text-accent font-medium mt-2 sm:mt-0">{job.period}</span>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {job.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-accent mt-1.5">•</span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-accent" />
            Education
          </h2>
          {education.map((edu, index) => (
            <div key={index} className="bg-card border border-border rounded-lg p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold">{edu.degree}</h3>
                  <p className="text-muted-foreground">{edu.institution}</p>
                </div>
                <span className="text-sm text-accent font-medium mt-2 sm:mt-0">{edu.period}</span>
              </div>
              <p className="text-sm text-muted-foreground">{edu.details}</p>
            </div>
          ))}
        </section>

        {/* Certifications */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Award className="h-5 w-5 text-accent" />
            Certifications
          </h2>
          <div className="bg-card border border-border rounded-lg p-6">
            <ul className="space-y-2">
              {certifications.map((cert, index) => (
                <li key={index} className="flex gap-2 text-sm">
                  <span className="text-accent mt-1">•</span>
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Technical Skills */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Technical Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(skills).map(([category, skillList]) => (
              <div key={category} className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold text-sm mb-3">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skillList.map((skill) => (
                    <span key={skill} className="text-xs px-2 py-1 bg-muted rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Languages */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Languages className="h-5 w-5 text-accent" />
            Languages
          </h2>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {languages.map((lang) => (
                <div key={lang.name} className="flex flex-col">
                  <span className="font-semibold">{lang.name}</span>
                  <span className="text-sm text-muted-foreground">{lang.level}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

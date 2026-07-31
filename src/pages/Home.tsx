import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, Map, Cpu, BarChart3, GraduationCap, FileText, Layers, Code2, Database } from 'lucide-react';
import { SiQgis, SiPython, SiJupyter } from 'react-icons/si';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { portfolioProjects, articles } from '@/data/content';

const capabilities = [
  {
    icon: Map,
    title: 'Geospatial Analysis',
    description: 'Advanced spatial analysis, cartography, and GIS workflows using QGIS, ArcGIS Pro, and PostGIS.',
  },
  {
    icon: Cpu,
    title: 'GeoAI & Automation',
    description: 'Machine learning for satellite imagery, object detection, and automated PyQGIS workflows.',
  },
  {
    icon: BarChart3,
    title: 'Data Analytics',
    description: 'Interactive dashboards, data visualization, and business intelligence with Power BI and Excel.',
  },
  {
    icon: GraduationCap,
    title: 'AI Training Workflows',
    description: 'Training data curation, model evaluation, and technical workflow design for AI systems.',
  },
  {
    icon: FileText,
    title: 'Technical Documentation',
    description: 'Clear, reproducible documentation and instructional design for complex technical workflows.',
  },
  {
    icon: Layers,
    title: 'Dashboard Development',
    description: 'End-to-end dashboard creation from data modeling to visual design and deployment.',
  },
];

const demoTabs = [
  {
    id: 'geoai',
    label: 'GeoAI',
    code: `import geopandas as gpd
import rasterio
from tensorflow import keras

# Load trained model
model = keras.models.load_model('road_detector.h5')

# Process satellite imagery
with rasterio.open('sentinel2.tif') as src:
    image = src.read()
    predictions = model.predict(image)
    
# Extract road network
roads_gdf = extract_features(predictions)
roads_gdf.to_file('detected_roads.gpkg')`,
    result: 'Road Network Detection',
    resultDesc: 'Automated extraction of 47.2 km of road network from Sentinel-2 imagery with 94.3% accuracy',
  },
  {
    id: 'python',
    label: 'Python',
    code: `from qgis.core import QgsProject, QgsVectorLayer
import processing

# Batch processing workflow
layers = QgsProject.instance().mapLayers()
for layer_id, layer in layers.items():
    if layer.geometryType() == QgsWkbTypes.PolygonGeometry:
        result = processing.run("native:buffer", {
            'INPUT': layer,
            'DISTANCE': 100,
            'OUTPUT': f'buffered_{layer.name()}.gpkg'
        })`,
    result: 'Batch Processing Complete',
    resultDesc: '12 polygon layers processed with 100m buffer applied. Total features: 3,847',
  },
  {
    id: 'gis',
    label: 'GIS',
    code: `-- PostGIS spatial query
SELECT 
    parcels.id,
    parcels.land_use,
    ST_Area(parcels.geom) / 10000 as area_ha,
    COUNT(buildings.id) as building_count
FROM parcels
LEFT JOIN buildings 
    ON ST_Within(buildings.geom, parcels.geom)
WHERE ST_Intersects(parcels.geom, 
    ST_MakeEnvelope(36.8, -1.3, 36.9, -1.2, 4326))
GROUP BY parcels.id;`,
    result: 'Spatial Analysis Result',
    resultDesc: 'Query returned 234 parcels with total area of 1,847 hectares. Average buildings per parcel: 3.2',
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('geoai');

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

      {/* Interactive Demo Panel */}
      <section className="w-full py-16 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-card border border-border rounded-lg overflow-hidden shadow-lg">
            {/* Left Side - Code */}
            <div className="bg-[#1e1e1e] dark:bg-[#1e1e1e] p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-sm text-gray-400 ml-2 font-mono">analysis.py</span>
              </div>
              <pre className="text-sm text-gray-200 font-mono leading-relaxed overflow-x-auto">
                <code>{demoTabs.find(t => t.id === activeTab)?.code}</code>
              </pre>
            </div>

            {/* Right Side - Result with Tabs */}
            <div className="p-6 flex flex-col">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-6">
                  {demoTabs.map((tab) => (
                    <TabsTrigger key={tab.id} value={tab.id}>
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {demoTabs.map((tab) => (
                  <TabsContent key={tab.id} value={tab.id} className="flex-1">
                    <div className="border border-border rounded-lg p-6 bg-muted/30">
                      <h3 className="text-lg font-semibold mb-2">{tab.result}</h3>
                      <p className="text-muted-foreground">{tab.resultDesc}</p>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section className="w-full py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-center mb-8">Toolchain & Ecosystem</h2>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            <div className="flex flex-col items-center gap-2">
              <SiQgis className="h-10 w-10 text-foreground" />
              <span className="text-xs text-muted-foreground">QGIS</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <SiPython className="h-10 w-10 text-foreground" />
              <span className="text-xs text-muted-foreground">Python</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <SiJupyter className="h-10 w-10 text-foreground" />
              <span className="text-xs text-muted-foreground">Jupyter</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <BarChart3 className="h-10 w-10 text-foreground" />
              <span className="text-xs text-muted-foreground">Power BI</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Database className="h-10 w-10 text-foreground" />
              <span className="text-xs text-muted-foreground">Microsoft 365</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Code2 className="h-10 w-10 text-foreground" />
              <span className="text-xs text-muted-foreground">VS Code</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Layers className="h-10 w-10 text-foreground" />
              <span className="text-xs text-muted-foreground">Git</span>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="w-full py-16 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((capability, index) => (
              <motion.div
                key={capability.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all hover:border-accent/50"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 mb-4 group-hover:bg-accent/20 transition-colors">
                  <capability.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{capability.title}</h3>
                <p className="text-sm text-muted-foreground">{capability.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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

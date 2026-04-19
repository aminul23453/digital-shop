// src/pages/OurStoryPage.jsx
import React from 'react';
import { Leaf, Zap, HeartHandshake, Recycle, TreePine } from 'lucide-react';

function OurStoryPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-12 md:py-16 text-center">
        <div className="container mx-auto px-4">
          <Leaf className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-3">Our EcoThreads Story</h1>
          <p className="text-lg md:text-xl text-emerald-700 max-w-2xl mx-auto">
            Weaving sustainability into the fabric of fashion, for a healthier planet and a stylish you.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="max-w-3xl mx-auto space-y-10">
          
          {/* Section 1: The Beginning - Centered Title with Icon Above */}
          <section>
            <div className="text-center mb-4"> {/* Wrapper for centered icon and title */}
              <TreePine className="h-10 w-10 text-primary mx-auto mb-3" />
              <h2 className="text-2xl font-semibold text-foreground">Our Roots & Inspiration</h2>
            </div>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4"> {/* Default text-left from prose */}
              <p>
                Welcome to EcoThreads! Our journey began with a simple yet powerful idea: fashion can be beautiful,
                high-quality, and profoundly kind to our planet. We were tired of the fast fashion cycle, its fleeting trends, 
                and its often-hidden environmental and social costs. We envisioned a world where style and sustainability 
                walk hand-in-hand.
              </p>
              <p>
                Founded in 2024 by a collective of passionate environmental advocates, textile enthusiasts, and design innovators, 
                EcoThreads was born from a shared desire to make a tangible difference. We believe that every choice,
                no matter how small, contributes to a larger impact—from the organic cotton seed to the final stitch.
              </p>
            </div>
          </section>

          {/* Section 2: Our Mission - Centered Title with Icon Above */}
          <section>
            <div className="text-center mb-4"> {/* Wrapper for centered icon and title */}
              <HeartHandshake className="h-10 w-10 text-primary mx-auto mb-3" />
              <h2 className="text-2xl font-semibold text-foreground">Our Mission: Conscious Craftsmanship</h2>
            </div>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4"> {/* Default text-left from prose */}
              <p>
                Our mission is to empower you with fashion that feels good, looks good, and *does* good. We are committed to:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Ethical Production:</strong> Ensuring fair wages, safe working conditions, and respect for all individuals in our supply chain.
                </li>
                <li>
                  <strong>Sustainable Materials:</strong> Prioritizing organic, recycled, and innovative low-impact fabrics that minimize harm to ecosystems.
                </li>
                <li>
                  <strong>Timeless Design:</strong> Creating versatile, durable pieces that transcend fleeting trends, encouraging a "buy less, choose well" philosophy.
                </li>
                <li>
                  <strong>Transparency:</strong> Openly sharing our practices, challenges, and progress on our sustainability journey.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3: Our Values/Pillars - KEPT AS ORIGINAL (WAS ALREADY GOOD) */}
          <section>
             <h2 className="text-2xl font-semibold text-foreground text-center mb-8">What We Stand For</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center"> {/* This text-center applies to items within the grid */}
              <div className="flex flex-col items-center p-4">
                <Recycle className="h-10 w-10 text-primary mb-3" />
                <h3 className="text-lg font-medium text-foreground mb-1">Circularity</h3>
                <p className="text-sm text-muted-foreground">Designing for longevity and exploring ways to close the loop on textile waste.</p>
              </div>
              <div className="flex flex-col items-center p-4">
                <Leaf className="h-10 w-10 text-primary mb-3" />
                <h3 className="text-lg font-medium text-foreground mb-1">Planet Positive</h3>
                <p className="text-sm text-muted-foreground">Minimizing our footprint through responsible sourcing and production.</p>
              </div>
              <div className="flex flex-col items-center p-4">
                <Zap className="h-10 w-10 text-primary mb-3" />
                <h3 className="text-lg font-medium text-foreground mb-1">Innovation</h3>
                <p className="text-sm text-muted-foreground">Constantly seeking new eco-friendly materials and sustainable technologies.</p>
              </div>
            </div>
          </section>

          {/* Section 4: Looking Ahead - Centered Title with Icon Above */}
          <section>
            <div className="text-center mb-4"> {/* Wrapper for centered icon and title */}
              <TreePine className="h-10 w-10 text-primary mx-auto mb-3" />
              <h2 className="text-2xl font-semibold text-foreground">Our Journey Forward</h2>
            </div>
            <div className="prose prose-lg max-w-none text-muted-foreground"> {/* Default text-left from prose */}
              <p>
                The path to a truly sustainable fashion industry is an ongoing evolution, and we are humbled to be part of it.
                We are dedicated to continuous learning, improvement, and innovation. Join us as we weave a better future, 
                one conscious garment at a time. Thank you for being part of the EcoThreads movement.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

export default OurStoryPage;
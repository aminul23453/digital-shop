// src/pages/SustainabilityPage.jsx
import React from 'react';
import { Leaf, Sprout, Factory, Globe } from 'lucide-react';
import { Link } from 'react-router-dom'; // Import Link

function SustainabilityPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero Section (already centered) */}
      <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-12 md:py-16 text-center">
        <div className="container mx-auto px-4">
          <Globe className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-3">Our Commitment to Sustainability</h1>
          <p className="text-lg md:text-xl text-emerald-700 max-w-2xl mx-auto">
            Discover how EcoThreads is dedicated to making a positive impact on the planet and its people through responsible practices.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="max-w-3xl mx-auto space-y-12">
          
          <section>
            <div className="text-center mb-6"> {/* Wrapper for centered icon and title */}
              <Leaf className="h-10 w-10 text-primary mx-auto mb-3" />
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground">Eco-Friendly Materials</h2>
            </div>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              <p>
                The foundation of sustainable fashion lies in the materials we choose. At EcoThreads, we meticulously select fabrics that are kind to the Earth. This includes:
              </p>
              <ul>
                <li><strong>Organic Cotton:</strong> Grown without harmful pesticides or synthetic fertilizers, using significantly less water than conventional cotton.</li>
                <li><strong>Tencel™ (Lyocell & Modal):</strong> Derived from sustainably sourced wood pulp, produced in a closed-loop system that recycles water and solvents.</li>
                <li><strong>Recycled Fabrics:</strong> Giving new life to materials like recycled polyester (from plastic bottles) and recycled cotton, reducing landfill waste.</li>
                <li><strong>Hemp & Linen:</strong> Durable, natural fibers that require minimal water and pesticides to grow.</li>
              </ul>
              <p>
                We are constantly researching and exploring innovative materials that push the boundaries of sustainability. Learn more on our <Link to="/materials" className="text-primary hover:underline">Materials page</Link>. {/* Changed to Link */}
              </p>
            </div>
          </section>

          <section>
            <div className="text-center mb-6"> {/* Wrapper for centered icon and title */}
              <Factory className="h-10 w-10 text-primary mx-auto mb-3" />
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground">Ethical & Transparent Production</h2>
            </div>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              <p>
                We believe that sustainable fashion must also be ethical. We partner with factories and artisans who share our commitment to fair labor practices. This means:
              </p>
              <ul>
                <li><strong>Fair Wages & Safe Conditions:</strong> Ensuring all workers in our supply chain receive fair compensation and operate in safe, healthy environments.</li>
                <li><strong>No Child or Forced Labor:</strong> We have a zero-tolerance policy for child or forced labor.</li>
                <li><strong>Supply Chain Transparency:</strong> We work towards increasing transparency in our supply chain, allowing us to trace our materials and understand the impact of our production.</li>
                <li><strong>Supporting Craftsmanship:</strong> Collaborating with skilled artisans and small-scale producers where possible.</li>
              </ul>
              <p>
                Read more about our commitment on the <Link to="/ethical-manufacturing" className="text-primary hover:underline">Ethical Manufacturing page</Link>. {/* Changed to Link */}
              </p>
            </div>
          </section>
          
          <section>
            <div className="text-center mb-6"> {/* Wrapper for centered icon and title */}
              <Sprout className="h-10 w-10 text-primary mx-auto mb-3" />
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground">Reducing Our Footprint</h2>
            </div>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              <p>
                Beyond materials and labor, we actively work to reduce our environmental footprint across all operations:
              </p>
              <ul>
                <li><strong>Minimized Waste:</strong> Implementing practices to reduce textile waste during production and designing for durability.</li>
                <li><strong>Eco-Friendly Packaging:</strong> Using recycled, recyclable, or biodegradable packaging materials.</li>
                <li><strong>Carbon Conscious:</strong> Measuring and working to reduce our carbon emissions, including exploring carbon-neutral shipping options.</li>
                <li><strong>Water Stewardship:</strong> Prioritizing materials and processes that conserve water.</li>
              </ul>
            </div>
          </section>

          <section>
            <div className="text-center mt-12 p-6 bg-emerald-50 rounded-lg"> {/* Changed bg-accent/30 to bg-emerald-50 */}
                <h3 className="text-xl font-semibold text-primary mb-2">Join Us on Our Journey</h3>
                <p className="text-muted-foreground">
                    Sustainability is an ongoing commitment, not a destination. We are always learning and striving to do better. 
                    Thank you for supporting conscious fashion and being part of the EcoThreads community.
                </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

export default SustainabilityPage;
// src/pages/MaterialsPage.jsx
import React from 'react';
import { Leaf, Sprout, Rewind, Droplets, LucideTags } from 'lucide-react'; // Icons for materials

const materialData = [
 {
     icon: <Leaf className="h-12 w-12 text-primary mb-4" />,
     name: "Organic Cotton",
     description: "Grown without synthetic pesticides, herbicides, or GMOs, organic cotton uses significantly less water than conventional cotton. It's softer on your skin and kinder to the planet, promoting biodiversity and healthy ecosystems.",
     benefits: ["Hypoallergenic", "Reduces water pollution", "Supports soil health", "No harmful chemicals"]
 },
 {
     icon: <Sprout className="h-12 w-12 text-primary mb-4" />,
     name: "Hemp",
     description: "A highly sustainable and versatile fiber, hemp requires very little water and no pesticides to grow. It's incredibly durable, naturally UV resistant, and becomes softer with each wash. Hemp also enriches the soil it grows in.",
     benefits: ["Durable & Strong", "Requires minimal water", "Naturally pest-resistant", "Biodegradable"]
 },
 {
     icon: <Rewind className="h-12 w-12 text-primary mb-4" />, // Using Rewind for recycled aspect
     name: "Recycled Polyester (rPET)",
     description: "Made from recycled plastic bottles (PET), rPET diverts plastic waste from landfills and oceans. It reduces our reliance on virgin petroleum and uses less energy in production compared to virgin polyester.",
     benefits: ["Reduces plastic waste", "Lower carbon footprint than virgin polyester", "Durable", "Water-resistant properties"]
 },
 {
     icon: <TreePine className="h-12 w-12 text-primary mb-4" />, // Re-using TreePine for Tencel/Lyocell
     name: "Tencel™ (Lyocell & Modal)",
     description: "Brand names for fibers produced by Lenzing AG, Tencel™ Lyocell and Modal are made from sustainably sourced wood pulp (often eucalyptus) in a closed-loop manufacturing process. This process recycles water and reuses solvents, minimizing environmental impact. These fibers are known for their softness, breathability, and drape.",
     benefits: ["Silky soft & breathable", "Eco-friendly production", "Biodegradable", "Gentle on skin"]
 },
 {
     icon: <Droplets className="h-12 w-12 text-primary mb-4" />,
     name: "Linen",
     description: "Crafted from the flax plant, linen is one of an oldest and most sustainable textiles. Flax requires minimal water and pesticides, and all parts of the plant can be used. Linen is strong, absorbent, and ideal for warm weather.",
     benefits: ["Highly breathable", "Low water usage", "Durable & long-lasting", "Biodegradable"]
 },
 {
     icon: <LucideTags className="h-12 w-12 text-primary mb-4" />,
     name: "Leather",
     description: "Grown without synthetic pesticides, herbicides, or GMOs, organic cotton uses significantly less water than conventional cotton. It's softer on your skin and kinder to the planet, promoting biodiversity and healthy ecosystems.",
     benefits: ["Hypoallergenic", "Reduces water pollution", "Supports soil health", "No harmful chemicals"]
 }
];


function MaterialsPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-12 md:py-16 text-center">
        <div className="container mx-auto px-4">
          <Leaf className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-3">Our Sustainable Materials</h1>
          <p className="text-lg md:text-xl text-emerald-700 max-w-2xl mx-auto">
            Learn about the eco-conscious fabrics that make EcoThreads clothing both beautiful and kind to the Earth.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-foreground mb-3">The Fabric of Our Values</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We believe that what our clothes are made of matters just as much as how they look and feel. That's why we carefully select materials that align with our commitment to sustainability, ethics, and quality.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {materialData.map((material) => (
            <div key={material.name} className="bg-card p-6 rounded-xl shadow-lg flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300">
              {material.icon}
              <h3 className="text-xl font-semibold text-foreground mb-2">{material.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 flex-grow">{material.description}</p>
              <div>
                 <h4 className="text-sm font-medium text-foreground mb-1">Key Benefits:</h4>
                 <ul className="text-xs text-primary space-y-1">
                     {material.benefits.map(benefit => <li key={benefit}>{benefit}</li>)}
                 </ul>
              </div>
            </div>
          ))}
        </div>

        <section className="mt-16 text-center prose prose-lg max-w-3xl mx-auto text-muted-foreground">
             <h2 className="text-2xl md:text-3xl font-semibold text-foreground !mb-4">Our Promise</h2> {/* !mb-4 to override prose margin */}
             <p>
                 We are continuously exploring and embracing new innovations in sustainable textiles. Our commitment is to always choose materials that are better for you, better for the workers who make them, and better for our planet.
             </p>
        </section>

      </div>
    </div>
  );
}
// Add TreePine to imports if not already there
import { TreePine } from 'lucide-react';
export default MaterialsPage;
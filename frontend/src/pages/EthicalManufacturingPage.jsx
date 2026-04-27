// src/pages/EthicalManufacturingPage.jsx
import React from 'react';
import { Factory, Users, HandIcon, ShieldCheck } from 'lucide-react'; // Icons for manufacturing and ethics

function EthicalManufacturingPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-12 md:py-16 text-center">
        <div className="container mx-auto px-4">
          <Factory className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-3">Ethical Manufacturing</h1>
          <p className="text-lg md:text-xl text-emerald-700 max-w-2xl mx-auto">
            Our promise: fashion that's fair for people and the planet, from source to seam.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="max-w-3xl mx-auto space-y-12">
          
          <section>
            <div className="text-center mb-6">
              <Users className="h-10 w-10 text-primary mx-auto mb-3" />
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground">Our Commitment to People</h2>
            </div>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              <p>
                At EcoThreads, we believe that true sustainability encompasses not only environmental responsibility but also social equity. The hands that craft our clothing deserve respect, fair treatment, and safe working conditions. 
              </p>
              <p>
                We are dedicated to upholding the highest ethical standards throughout our supply chain. This isn't just a policy for us; it's a fundamental part of who we are.
              </p>
            </div>
          </section>

          <section>
            <div className="text-center mb-6">
              <HandIcon className="h-10 w-10 text-primary mx-auto mb-3" />
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground">Fair Labor Practices</h2>
            </div>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              <p>We partner exclusively with manufacturers and suppliers who share our commitment to:</p>
              <ul>
                <li><strong>Fair Wages:</strong> Ensuring all workers receive wages that meet or exceed local minimums and cover basic living costs.</li>
                <li><strong>Safe & Healthy Workplaces:</strong> Maintaining facilities that are clean, safe, and equipped to prevent accidents and occupational hazards.</li>
                <li><strong>Reasonable Working Hours:</strong> Adhering to legal limits on working hours and ensuring workers receive adequate rest and time off.</li>
                <li><strong>No Forced or Child Labor:</strong> We have a zero-tolerance policy against any form of forced, bonded, indentured, or child labor.</li>
                <li><strong>Freedom of Association:</strong> Respecting workers' rights to form and join trade unions and to bargain collectively.</li>
                <li><strong>Non-Discrimination:</strong> Ensuring no discrimination in hiring, compensation, access to training, promotion, termination, or retirement based on race, caste, national origin, religion, age, disability, gender, marital status, sexual orientation, union membership, or political affiliation.</li>
              </ul>
            </div>
          </section>
          
          <section>
            <div className="text-center mb-6">
              <ShieldCheck className="h-10 w-10 text-primary mx-auto mb-3" />
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground">Supplier Audits & Transparency</h2>
            </div>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              <p>
                We understand that making claims is easy, but ensuring compliance requires diligence. We are working to implement:
              </p>
              <ul>
                <li><strong>Regular Audits:</strong> Conducting regular assessments of our partner factories to ensure adherence to our ethical code of conduct.</li>
                <li><strong>Building Long-Term Partnerships:</strong> We aim to build strong, lasting relationships with suppliers who are committed to continuous improvement in social and environmental practices.</li>
                <li><strong>Increasing Transparency:</strong> While supply chains can be complex, we are committed to increasing transparency about where and how our products are made. We believe you have the right to know.</li>
              </ul>
              <p>
                Our journey towards complete ethical assurance is ongoing. We are constantly learning and seeking ways to strengthen our processes and make a greater positive impact.
              </p>
            </div>
          </section>

          <section className="text-center mt-12 p-6 bg-emerald-50 rounded-lg">
             <h3 className="text-xl font-semibold text-primary mb-2">Your Choice Matters</h3>
             <p className="text-muted-foreground">
                 By choosing EcoThreads, you're supporting a fashion system that values people and the planet. Thank you for helping us build a more ethical and sustainable future.
             </p>
          </section>

        </div>
      </div>
    </div>
  );
}

export default EthicalManufacturingPage;